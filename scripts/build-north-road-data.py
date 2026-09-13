"""Rebuild selected northern additions from saved public OSM road edges.

Editorial source: scripts/north-roads.json; snapshot: data/north-overpass.json.
Preserves every record outside this builder's explicit ID list.
Then run fetch-elevation.py and build-derived-data.py.
"""
import json
from la_roads import ROOT, build_specs

catalog, features = build_specs(ROOT / 'data/north-overpass.json', ROOT / 'scripts/north-roads.json', 'bay-area', '2026-09-13')
catalog_path = ROOT / 'app/data/roads.json'
archive_path = ROOT / 'data/roads.full.geojson'
managed = {r['id'] for r in catalog}
existing = json.loads(catalog_path.read_text())
archive = json.loads(archive_path.read_text())
catalog = [r for r in existing if r['id'] not in managed] + catalog
features = [f for f in archive['features'] if f['properties']['id'] not in managed] + features
assert len({r['id'] for r in catalog}) == len(catalog), 'Duplicate road ID'
catalog_path.write_text(json.dumps(catalog, indent=2, ensure_ascii=False) + '\n')
archive_path.write_text(json.dumps({'type': 'FeatureCollection', 'features': features}, separators=(',', ':')) + '\n')
print('Northern additions built. Run fetch-elevation.py and build-derived-data.py.')
