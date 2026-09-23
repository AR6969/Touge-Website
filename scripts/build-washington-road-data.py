"""Build the Washington region from data/washington-overpass.json.

Editorial source: scripts/washington-roads.json. Same anchor-graph tracer as
the LA, northern-additions, Appalachia and Colorado builders (scripts/la_roads.py);
this state's own snapshot never touches any other state's.

Usage: python3 scripts/build-washington-road-data.py
Then:  python3 scripts/build-derived-data.py
"""
import json
from la_roads import ROOT, build_specs

catalog, features = build_specs(
    ROOT / 'data/washington-overpass.json', ROOT / 'scripts/washington-roads.json',
    'washington', '2026-09-23',
)
catalog_path = ROOT / 'app/data/roads.json'
archive_path = ROOT / 'data/roads.full.geojson'
existing = json.loads(catalog_path.read_text())
archive = json.loads(archive_path.read_text())
managed = {road['id'] for road in catalog}
catalog = [road for road in existing if road['id'] not in managed] + catalog
features = [feature for feature in archive['features'] if feature['properties']['id'] not in managed] + features
assert len({road['id'] for road in catalog}) == len(catalog), 'Duplicate road ID'
catalog_path.write_text(json.dumps(catalog, indent=2, ensure_ascii=False) + '\n')
archive_path.write_text(json.dumps({'type': 'FeatureCollection', 'features': features}, separators=(',', ':')) + '\n')
print('Washington region built. Run python3 scripts/build-derived-data.py to update served files.')
