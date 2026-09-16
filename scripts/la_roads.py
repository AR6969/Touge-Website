"""Build selected LA road traces using connected, public OSM road edges.

Editorial source: scripts/la-roads.json. Raw source: data/la-overpass.json.
Anchors select existing OSM vertices; no connector coordinates are invented.
These are road centrelines, not turn-by-turn navigation routes.
"""
import heapq
import json
from pathlib import Path

from geometry import haversine, line_length

ROOT = Path(__file__).resolve().parents[1]
# 'trunk' included: SR 1 through Malibu and SR 74 over the Santa Anas are tagged
# trunk in OSM. They are ordinary drivable roads, not motorways.
PUBLIC_HIGHWAYS = {'trunk', 'primary', 'secondary', 'tertiary', 'unclassified', 'residential'}


def public_road(way):
    tags = way.get('tags', {})
    return (
        tags.get('highway') in PUBLIC_HIGHWAYS
        and tags.get('access') not in {'no', 'private'}
        and tags.get('vehicle') not in {'no', 'private'}
        and tags.get('motor_vehicle') not in {'no', 'private'}
        and tags.get('motorcar') not in {'no', 'private'}
        and tags.get('surface') not in {'unpaved', 'gravel', 'dirt', 'ground', 'sand'}
    )


def road_graph(ways, names, refs=()):
    graph, points, edges = {}, {}, {}
    for way in ways:
        tags = way.get('tags', {})
        if not (tags.get('name') in names or set(tags.get('ref', '').split(';')) & set(refs)) or not public_road(way):
            continue
        nodes = way['nodes']
        coords = [(p['lon'], p['lat']) for p in way['geometry']]
        if len(nodes) != len(coords):
            raise ValueError('Incomplete geometry for way ' + str(way['id']))
        points.update(zip(nodes, coords))
        for a, b, pa, pb in zip(nodes, nodes[1:], coords, coords[1:]):
            distance = haversine(pa, pb)
            graph.setdefault(a, {})[b] = distance
            graph.setdefault(b, {})[a] = distance
            edges[(a, b)] = edges[(b, a)] = way['id']
    return graph, points, edges


def shortest_path(graph, start, end):
    queue, distances, previous = [(0, start)], {start: 0}, {}
    while queue:
        distance, node = heapq.heappop(queue)
        if distance != distances[node]:
            continue
        if node == end:
            path = [end]
            while path[-1] != start:
                path.append(previous[path[-1]])
            return path[::-1]
        for other, length in graph[node].items():
            candidate = distance + length
            if candidate < distances.get(other, float('inf')):
                distances[other], previous[other] = candidate, node
                heapq.heappush(queue, (candidate, other))
    raise ValueError('Anchors are disconnected; check names, access and endpoints')


def select_anchor(anchor, points, ways):
    candidates = set(points)
    if anchor.get('junction'):
        other_nodes = {node for way in ways
                       if way.get('tags', {}).get('name') in anchor['junction']
                       for node in way.get('nodes', [])}
        candidates &= other_nodes
    if not candidates:
        raise ValueError('No shared OSM junction: ' + str(anchor))
    node = min(candidates, key=lambda key: haversine(points[key], anchor['near']))
    distance = haversine(points[node], anchor['near'])
    if distance > anchor.get('maxSnapM', 1500):
        raise ValueError(f'Anchor too far from trace: {distance:.0f} m at {anchor}')
    return node


def build_la(snapshot_path=None):
    snapshot_path = Path(snapshot_path) if snapshot_path else ROOT / 'data/la-overpass.json'
    return build_specs(snapshot_path, ROOT / 'scripts/la-roads.json', 'los-angeles', '2026-09-09')


def build_specs(snapshot_path, specs_path, default_region, reviewed):
    """Trace a catalog from saved OSM nodes and explicit editorial endpoints."""
    snapshot_path = Path(snapshot_path)
    snapshot = json.loads(snapshot_path.read_text())
    if snapshot.get('remark'):
        raise ValueError(snapshot['remark'])
    specs = json.loads(Path(specs_path).read_text())
    features, catalog = [], []
    for spec in specs:
        # A focused, independently refreshed snapshot can correct one road
        # without replacing the complete regional OSM archive.
        current_path = ROOT / spec['snapshot'] if spec.get('snapshot') else snapshot_path
        current = json.loads(current_path.read_text()) if spec.get('snapshot') else snapshot
        if current.get('remark'):
            raise ValueError(current['remark'])
        ways = [way for way in current['elements'] if way['type'] == 'way']
        by_way = {way['id']: way for way in ways}
        graph, points, edges = road_graph(ways, spec['names'], spec.get('refs', []))
        try:
            anchors = [select_anchor(anchor, points, ways) for anchor in spec['anchors']]
            path = []
            for start, end in zip(anchors, anchors[1:]):
                part = shortest_path(graph, start, end)
                path.extend(part if not path else part[1:])
        except ValueError as error:
            raise ValueError(spec['id'] + ': ' + str(error)) from error
        if len(path) < 2 or len(set(path)) != len(path):
            raise ValueError(spec['id'] + ': degenerate or retraced selection')
        coords = [list(points[node]) for node in path]
        ids = sorted({edges[(a, b)] for a, b in zip(path, path[1:])})
        bounds = [[min(p[i] for p in coords) for i in (0, 1)],
                  [max(p[i] for p in coords) for i in (0, 1)]]
        total = line_length(coords)
        if total < 300:
            raise ValueError(spec['id'] + ': unexpectedly short selected road')
        cumulative = 0
        center = coords[len(coords) // 2]
        for a, b in zip(coords, coords[1:]):
            cumulative += haversine(a, b)
            if cumulative >= total / 2:
                center = b
                break
        road = {key: value for key, value in spec.items()
                if key not in ('names', 'refs', 'anchors', 'mapRegionOverride', 'snapshot')}
        road.update(
            mapRegion=spec.get('mapRegionOverride', default_region), center=center, bounds=bounds,
            osmWayIds=ids, reviewed=spec.get('reviewed', reviewed),
            # Raw tags remain inspectable in the snapshot, but unverified tags
            # do not become numeric speed summaries on these new roads.
            mappedSpeed='Not verified', taggedPercent=0,
            geometryEvidence={
                'snapshot': str(current_path.relative_to(ROOT)) if current_path.is_relative_to(ROOT) else current_path.name,
                'osmTimestamp': current.get('osm3s', {}).get('timestamp_osm_base'),
                **({'retrieved': current['retrieved']} if current.get('retrieved') else {}),
                'start': coords[0], 'end': coords[-1],
                'wayNames': sorted({by_way[key]['tags'].get('name') or by_way[key]['tags'].get('ref', 'Unnamed road') for key in ids}),
            },
        )
        road.setdefault('speed', {
            'value': 'Not verified', 'kind': 'Unverified',
            'note': 'Limits vary by section. Follow posted signs.', 'source': None,
        })
        props = {key: road[key] for key in ('id', 'name', 'difficulty', 'character')}
        features.append({'type': 'Feature', 'properties': props,
                         'geometry': {'type': 'MultiLineString', 'coordinates': [coords]}})
        catalog.append(road)
        print(f"{road['id']}: {total / 1609.344:.1f} mi, {len(ids)} OSM ways")
    return catalog, features
