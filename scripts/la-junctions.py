"""Report shared OSM junction nodes between named roads in the LA snapshot.

Anchors in scripts/la-roads.json are "the node this road shares with that road,
nearest to point P". This finds those nodes so the coordinates written into the
spec are read out of the data rather than guessed from a map.

Usage: python3 scripts/la-junctions.py "Latigo Canyon Road" "Pacific Coast Highway"
       python3 scripts/la-junctions.py --names        # list every road name present
"""
import json
import sys
from collections import defaultdict
from pathlib import Path

from la_roads import ROOT, public_road


def load():
    path = ROOT / 'data/la-overpass.json'
    if not path.exists():
        raise SystemExit('No data/la-overpass.json — run scripts/fetch-la-overpass.py first.')
    return [w for w in json.loads(path.read_text())['elements'] if w['type'] == 'way']


def main():
    ways = load()
    if '--names' in sys.argv:
        counts = defaultdict(int)
        for way in ways:
            name = way.get('tags', {}).get('name')
            if name:
                counts[name] += 1
        for name, n in sorted(counts.items()):
            usable = sum(1 for w in ways if w.get('tags', {}).get('name') == name and public_road(w))
            print(f'{n:>4} ways ({usable:>3} public)  {name}')
        return

    if len(sys.argv) < 3:
        raise SystemExit(__doc__)
    a_names, b_names = {sys.argv[1]}, set(sys.argv[2:])

    def nodes_of(names, only_public):
        out = defaultdict(list)
        for way in ways:
            if way.get('tags', {}).get('name') not in names:
                continue
            if only_public and not public_road(way):
                continue
            for node, point in zip(way['nodes'], way['geometry']):
                out[node].append((point['lon'], point['lat']))
        return out

    a = nodes_of(a_names, True)
    b = nodes_of(b_names, False)   # the other road only needs to touch, not be drivable
    shared = sorted(set(a) & set(b))
    if not shared:
        print(f'No shared node between {sys.argv[1]} and {", ".join(sys.argv[2:])}')
        return
    print(f'{len(shared)} shared node(s):')
    for node in shared:
        lon, lat = a[node][0]
        print(f'  node {node}  "near": [{lon}, {lat}]')


if __name__ == '__main__':
    main()
