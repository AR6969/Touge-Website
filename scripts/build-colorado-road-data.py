"""Build the Colorado region from data/colorado-overpass.json.

Editorial source: scripts/colorado-roads.json. Same anchor-graph tracer as
the LA, northern-additions and Appalachia builders (scripts/la_roads.py);
this state's own snapshot never touches any other state's.

Usage: python3 scripts/build-colorado-road-data.py
Then:  python3 scripts/build-derived-data.py
"""
import json
from la_roads import ROOT, build_specs

catalog, features = build_specs(
    ROOT / 'data/colorado-overpass.json', ROOT / 'scripts/colorado-roads.json',
    'colorado', '2026-09-17',
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
print('Colorado region built. Run python3 scripts/build-derived-data.py to update served files.')
