"""Derive the served road data from the full-precision Overpass build.

Reads  data/roads.full.geojson        (archival output of build-road-data.py)
       app/data/roads.json            (catalog)
Writes public/data/roads.geojson      (simplified, for the overview map)
       public/data/roads/<id>.geojson (one road each, for its own page)
       app/data/roads.json            (catalog + derived shape stats)

Shape statistics are always measured on the full-precision geometry, so
re-running this script is idempotent. Usage: python3 scripts/build-derived-data.py
"""
import json
from pathlib import Path

from geometry import shape_stats, simplify

ROOT = Path(__file__).resolve().parents[1]
# ~6 m is below the width of the roads themselves, so the drawn line is unchanged
# on screen at every zoom the map allows.
TOLERANCE_M = 6
# ~1.1 m at this latitude. Finer precision than the tolerance above can express.
PRECISION = 5


def round_line(coords):
    return [[round(x, PRECISION), round(y, PRECISION)] for x, y in coords]


def write_json(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, separators=(',', ':')) + '\n')


source = json.loads((ROOT / 'data/roads.full.geojson').read_text())
catalog = json.loads((ROOT / 'app/data/roads.json').read_text())
by_id = {road['id']: road for road in catalog}

overview = []
before = after = 0

for feature in source['features']:
    road_id = feature['properties']['id']
    lines = feature['geometry']['coordinates']
    before += sum(len(line) for line in lines)

    by_id[road_id].update(shape=shape_stats(lines))

    trimmed = [round_line(simplify(line, TOLERANCE_M)) for line in lines]
    after += sum(len(line) for line in trimmed)
    geometry = {'type': 'MultiLineString', 'coordinates': trimmed}

    overview.append({'type': 'Feature', 'properties': feature['properties'], 'geometry': geometry})
    write_json(ROOT / f'public/data/roads/{road_id}.geojson',
               {'type': 'Feature', 'properties': feature['properties'], 'geometry': geometry})

write_json(ROOT / 'public/data/roads.geojson', {'type': 'FeatureCollection', 'features': overview})
(ROOT / 'app/data/roads.json').write_text(json.dumps(catalog, indent=2, ensure_ascii=False) + '\n')

for road in sorted(catalog, key=lambda r: -r['shape']['curvature'])[:5]:
    shape = road['shape']
    print(f"{road['name']:<34} {shape['lengthMi']:>5} mi  {shape['bends']:>3} bends  "
          f"{shape['switchbacks']:>2} switchbacks  {shape['curvature']:>4}°/mi")
print(f'Simplified {before} points to {after} ({round(after / before * 100)}%). Wrote {len(catalog)} roads.')
