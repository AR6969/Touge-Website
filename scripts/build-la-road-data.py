"""Add/rebuild the LA region, preserving the existing Bay Area archive.

Usage: python3 scripts/build-la-road-data.py [snapshot.json]
Then: python3 scripts/build-derived-data.py
"""
import json
import sys

from la_roads import ROOT, build_la

catalog, features = build_la(sys.argv[1] if len(sys.argv) > 1 else None)
catalog_path = ROOT / 'app/data/roads.json'
archive_path = ROOT / 'data/roads.full.geojson'
existing = json.loads(catalog_path.read_text())
archive = json.loads(archive_path.read_text())
old_ids = {road['id'] for road in existing if road.get('mapRegion') == 'los-angeles'}
catalog = [road for road in existing if road['id'] not in old_ids] + catalog
features = [feature for feature in archive['features']
            if feature['properties']['id'] not in old_ids] + features
assert len({road['id'] for road in catalog}) == len(catalog), 'Duplicate road ID'
catalog_path.write_text(json.dumps(catalog, indent=2, ensure_ascii=False) + '\n')
archive_path.write_text(json.dumps({'type': 'FeatureCollection', 'features': features}, separators=(',', ':')) + '\n')
print('LA region built. Run python3 scripts/build-derived-data.py to update served files.')
