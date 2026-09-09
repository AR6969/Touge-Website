"""Fill in the `anchors` of scripts/la-roads.json from junction road names.

Each segment in the research is described as "road A to road B". For every such
pair this finds the OSM node the two roads actually share and writes it in as the
anchor coordinate, so endpoints are read out of the data instead of eyeballed on
a map. Where a segment ends somewhere with no named junction (a city boundary,
say) the plan supplies an approximate coordinate and the anchor snaps to the
nearest point on the road itself.

Reports anything ambiguous rather than picking for you.
Usage: python3 scripts/la-autoanchor.py [--write]
"""
import json
import sys
from collections import defaultdict
from pathlib import Path

from la_roads import ROOT, public_road
from geometry import haversine

PLAN = ROOT / 'scripts/la-anchor-plan.json'
SPECS = ROOT / 'scripts/la-roads.json'


def load_ways():
    path = ROOT / 'data/la-overpass.json'
    return [w for w in json.loads(path.read_text())['elements'] if w['type'] == 'way']


def road_points(ways, names):
    """Every node of the subject road that is actually drivable."""
    points = {}
    for way in ways:
        if way.get('tags', {}).get('name') in names and public_road(way):
            points.update({n: (p['lon'], p['lat']) for n, p in zip(way['nodes'], way['geometry'])})
    return points


def junction_nodes(ways, names):
    """Nodes belonging to the crossing road, drivable or not — it only has to touch."""
    out = set()
    for way in ways:
        if way.get('tags', {}).get('name') in names:
            out.update(way['nodes'])
    return out


def resolve(ways, spec_names, step):
    """One anchor: a shared junction node, or the road point nearest a coordinate."""
    points = road_points(ways, spec_names)
    if not points:
        return None, 'no drivable ways for ' + ', '.join(spec_names)

    if step.get('junction'):
        shared = set(points) & junction_nodes(ways, step['junction'])
        if not shared:
            return None, 'no shared node with ' + ', '.join(step['junction'])
        # Several shared nodes usually means a divided junction: cluster them and
        # take the one closest to the hint, or to their own centre.
        coords = [points[n] for n in shared]
        if step.get('near'):
            target = tuple(step['near'])
        else:
            target = (sum(c[0] for c in coords) / len(coords), sum(c[1] for c in coords) / len(coords))
        best = min(shared, key=lambda n: haversine(points[n], target))
        spread = max(haversine(points[a], points[b]) for a in shared for b in shared) if len(shared) > 1 else 0
        note = f'{len(shared)} shared node(s), spread {spread:.0f} m'
        return {'junction': step['junction'], 'near': list(points[best])}, note

    target = tuple(step['near'])
    best = min(points, key=lambda n: haversine(points[n], target))
    distance = haversine(points[best], target)
    return {'near': list(points[best])}, f'snapped {distance:.0f} m to the road'


def main():
    ways = load_ways()
    plan = json.loads(PLAN.read_text())
    specs = {s['id']: s for s in json.loads(SPECS.read_text())}
    order = [s['id'] for s in json.loads(SPECS.read_text())]

    problems = []
    for road_id, entry in plan.items():
        spec = specs.get(road_id)
        if not spec:
            problems.append(f'{road_id}: not in la-roads.json')
            continue
        spec['names'] = entry['names']
        anchors, notes = [], []
        for step in entry['anchors']:
            anchor, note = resolve(ways, entry['names'], step)
            if anchor is None:
                problems.append(f'{road_id}: {note}')
                notes.append('FAILED ' + note)
                continue
            anchors.append(anchor)
            notes.append(note)
        if len(anchors) == len(entry['anchors']):
            spec['anchors'] = anchors
        print(f"{road_id:<28} {'; '.join(notes)}")

    if problems:
        print('\nUnresolved:')
        for problem in problems:
            print('  ' + problem)
    if '--write' in sys.argv and not problems:
        SPECS.write_text(json.dumps([specs[i] for i in order], indent=2, ensure_ascii=False) + '\n')
        print(f'\nWrote anchors for {len(plan)} roads into {SPECS.relative_to(ROOT)}')
    elif '--write' in sys.argv:
        print('\nNot written: resolve the problems above first.')


if __name__ == '__main__':
    main()
