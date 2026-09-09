"""Fill in the `anchors` of scripts/la-roads.json from junction road names.

Each researched segment reads "road A to road B". For every such pair this finds
the OSM node the two roads actually share, so endpoints come out of the data
rather than off a map by eye.

Two things make that harder than it sounds, and both are handled here:

  * A named road is usually several disconnected pieces in OSM, and a junction
    often has a node on each side of it. Picking each anchor independently can
    land them on different pieces — Latigo's Kanan Dume end has a node on the
    main road and another on a 28-node stub across the junction. So candidates
    are gathered for every anchor and the connected component that can serve
    them all is chosen.
  * Several road names in this region name two unrelated roads (Latigo, Malibu
    Canyon, Carbon Canyon). A per-road `box` in the plan keeps anchors local.

Every result is verified by actually walking the path before it is written.
Usage: python3 scripts/la-autoanchor.py [--write]
"""
import json
import sys
from pathlib import Path

from la_roads import ROOT, public_road, road_graph, shortest_path
from geometry import haversine, line_length

PLAN = ROOT / 'scripts/la-anchor-plan.json'
SPECS = ROOT / 'scripts/la-roads.json'
METERS_PER_MILE = 1609.344


def load_ways():
    return [w for w in json.loads((ROOT / 'data/la-overpass.json').read_text())['elements']
            if w['type'] == 'way']


def in_box(point, box):
    return box is None or (box[0] <= point[0] <= box[2] and box[1] <= point[1] <= box[3])


def road_points(ways, names, box=None):
    points = {}
    for way in ways:
        if way.get('tags', {}).get('name') in names and public_road(way):
            for node, p in zip(way['nodes'], way['geometry']):
                if in_box((p['lon'], p['lat']), box):
                    points[node] = (p['lon'], p['lat'])
    return points


def junction_nodes(ways, names):
    """Nodes of the crossing road. It only has to touch, not be drivable."""
    return {n for w in ways if w.get('tags', {}).get('name') in names for n in w['nodes']}


def components(graph):
    seen, out = set(), []
    for start in graph:
        if start in seen:
            continue
        stack, comp = [start], set()
        while stack:
            node = stack.pop()
            if node in comp:
                continue
            comp.add(node)
            stack.extend(graph[node])
        seen |= comp
        out.append(comp)
    return sorted(out, key=len, reverse=True)


def candidates(ways, points, step):
    """Every node that could serve this anchor, best first."""
    if step.get('end'):
        axis, want_max = {'north': (1, True), 'south': (1, False),
                          'east': (0, True), 'west': (0, False)}[step['end']]
        ranked = sorted(points, key=lambda n: points[n][axis], reverse=want_max)
        return ranked, f"{step['end']} end"
    if step.get('junction'):
        shared = sorted(set(points) & junction_nodes(ways, step['junction']))
        if not shared:
            return [], 'no shared node with ' + ', '.join(step['junction'])
        return shared, f'{len(shared)} junction node(s)'
    target = tuple(step['near'])
    ranked = sorted(points, key=lambda n: haversine(points[n], target))
    return ranked[:40], f'snapped {haversine(points[ranked[0]], target):.0f} m'


def solve(ways, entry):
    """Anchors that are provably connected to one another, plus the traced length."""
    names, box = entry['names'], entry.get('box')
    graph, points, _ = road_graph(ways, names)
    points = {n: p for n, p in points.items() if in_box(p, box)}
    graph = {n: {m: d for m, d in nb.items() if m in points} for n, nb in graph.items() if n in points}

    picked, notes = [], []
    for step in entry['anchors']:
        nodes, note = candidates(ways, points, step)
        notes.append(note)
        picked.append(nodes)
    if any(not nodes for nodes in picked):
        return None, notes, 'no candidates for one anchor'

    for comp in components(graph):
        chosen = [next((n for n in nodes if n in comp), None) for nodes in picked]
        if any(n is None for n in chosen):
            continue
        try:
            path = []
            for a, b in zip(chosen, chosen[1:]):
                part = shortest_path(graph, a, b)
                path.extend(part if not path else part[1:])
        except ValueError:
            continue
        if len(set(path)) != len(path):
            continue
        miles = line_length([points[n] for n in path]) / METERS_PER_MILE
        return [{'near': list(points[n])} | ({'junction': s['junction']} if s.get('junction') else {})
                for n, s in zip(chosen, entry['anchors'])], notes, f'{miles:.1f} mi'
    return None, notes, 'anchors never share a connected component'


def main():
    ways = load_ways()
    plan = json.loads(PLAN.read_text())
    specs = json.loads(SPECS.read_text())
    by_id = {s['id']: s for s in specs}

    failures = []
    for road_id, entry in plan.items():
        spec = by_id.get(road_id)
        if not spec:
            failures.append(f'{road_id}: not in la-roads.json')
            continue
        anchors, notes, result = solve(ways, entry)
        status = 'ok' if anchors else 'FAILED'
        print(f'{road_id:<28} {status:<7} {result:<45} [{"; ".join(notes)}]')
        if anchors:
            spec['names'] = entry['names']
            spec['anchors'] = anchors
        else:
            failures.append(f'{road_id}: {result}')

    if failures:
        print('\nUnresolved:')
        for failure in failures:
            print('  ' + failure)
    if '--write' in sys.argv and not failures:
        SPECS.write_text(json.dumps(specs, indent=2, ensure_ascii=False) + '\n')
        print(f'\nWrote anchors for {len(plan)} roads.')
    elif '--write' in sys.argv:
        print('\nNot written: resolve the problems above first.')


if __name__ == '__main__':
    main()
