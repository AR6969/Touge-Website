"""Build the Sierra region from data/sierra-overpass.json, preserving every
other region's archive entries. Same approach as build-road-data.py (fetch by
name/ref within a bounding box, clip at that box's edge, merge connected
pieces) rather than the LA-style anchor-graph tracer: these are single named
mountain highways with unambiguous endpoints, not an urban grid that needs
disambiguating.

Usage: python3 scripts/build-sierra-road-data.py
Then:  python3 scripts/build-derived-data.py
"""
import json
import math
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ways = {w['id']: w for w in json.loads((ROOT / 'data/sierra-overpass.json').read_text())['elements']}

SOURCES = {
    'nps_tioga': {'title': 'National Park Service · Yosemite, Tioga Road opening & closing', 'url': 'https://www.nps.gov/yose/planyourvisit/tioga.htm'},
    'mono_tioga': {'title': 'Mono Basin Clearinghouse · Tioga Pass opening and closing dates since 1933', 'url': 'https://www.monobasinresearch.org/data/tiogapass.php'},
    'fs_sonora': {'title': 'USDA Forest Service · Stanislaus National Forest, Highway 108 corridor', 'url': 'https://www.fs.usda.gov/r05/stanislaus/recreation/highway-108-corridor'},
    'wiki_sonora': {'title': 'Wikipedia · Sonora Pass', 'url': 'https://en.wikipedia.org/wiki/Sonora_Pass'},
    'jalopnik_108': {'title': 'Jalopnik · Probably the steepest stretch of highway in the US', 'url': 'https://www.jalopnik.com/2250341/probably-steepest-stretch-highway-united-states-california-108-26-percent-grade/'},
    'dangerous_rockcreek': {'title': 'Dangerous Roads · Rock Creek Road', 'url': 'https://www.dangerousroads.org/north-america/usa/3084-rock-creek-road.html'},
    'theridrs_rockcreek': {'title': 'The Ridrs · Rock Creek Road, Tom’s Place to Mosquito Flat', 'url': 'https://theridrs.com/routes/rock-creek-road/'},
    'mono_rockcreek': {'title': 'Visit Mono County · Rock Creek Lake', 'url': 'https://www.monocounty.org/places-to-go/lakes-rivers-creeks/rock-creek-lake/'},
    'wiki_168': {'title': 'Wikipedia · California State Route 168', 'url': 'https://en.wikipedia.org/wiki/California_State_Route_168'},
    'summitpost_sabrina': {'title': 'SummitPost · Lake Sabrina trailhead information', 'url': 'https://www.summitpost.org/lake-sabrina/338390'},
    'bishopvisitor': {'title': 'Visit Bishop · Bishop Creek Canyon', 'url': 'https://bishopvisitor.com/place-to-go/bishop-creek-canyon/'},
    'dangerous_horseshoe': {'title': 'Dangerous Roads · Horseshoe Meadow', 'url': 'https://www.dangerousroads.org/north-america/usa/7019-horseshoe-meadow.html'},
    'pashnit_horseshoe': {'title': 'Pashnit · Horseshoe Meadows Rd, Lone Pine', 'url': 'https://www.pashnit.com/post/horseshoe-meadows-rd-lone-pine-ca'},
    'gribble_horseshoe': {'title': 'Gribblenation · Horseshoe Meadows Road, former SR 190', 'url': 'http://www.gribblenation.org/2020/08/horseshoe-meadows-road-former.html'},
    'theridrs_168west': {'title': 'The Ridrs · CA-168 West, Fresno to Huntington Lake', 'url': 'https://theridrs.com/routes/california-state-route-168-west-to-huntington-lake/'},
    'climber_kaiser': {'title': 'Climber.org · Kaiser Pass, Shaver Lake to Edison and Florence', 'url': 'https://www.climber.org/driving/KaiserPass.html'},
    'gribble_168': {'title': 'Gribblenation · The tale of CA 168 West’s climb to Kaiser', 'url': 'http://www.gribblenation.org/2017/07/tale-of-ca-168-west-climb-to-kaiser-on.html'},
    'sierrapasses_ninemile': {'title': 'Sierra Mountain Passes · The Nine Mile Canyon summit', 'url': 'https://sierramountainpasses.com/listings/unnamed-pass/'},
}

def road(id, name, area, difficulty, character, names, bbox, description, sources, ref=None, access=None):
    entry = dict(id=id, name=name, area=area, mapRegion='sierra', difficulty=difficulty, character=character,
                 names=names, bbox=bbox, description=description,
                 sources=[SOURCES[s] for s in sources], ref=ref)
    if access:
        entry['access'] = access
    return entry

REVIEWED = '2026-09-12'

R = [
road('sonora-pass', 'Sonora Pass · Hwy 108', 'Sierra Nevada', 3, 'Technical', ['Sonora Pass Highway'],
     [-119.75, 38.24, -119.30, 38.46],
     'The steep eastern climb over the Sierra crest, narrow and continuously curving with grades reported as high as 26% near the summit.',
     ['fs_sonora', 'jalopnik_108', 'wiki_sonora'], 'CA 108',
     access={'note': 'Closed by snow every winter, typically November through May. Confirm it is open before planning a crossing.', 'url': 'https://www.fs.usda.gov/r05/stanislaus/recreation/highway-108-corridor', 'checked': REVIEWED}),
road('tioga-pass', 'Tioga Pass · Hwy 120', 'Sierra Nevada', 2, 'Technical', [],
     [-119.30, 37.86, -119.09, 37.98],
     'The east side of the highest highway pass in the Sierra Nevada, switchbacking down from the Yosemite boundary toward Lee Vining and Mono Lake.',
     ['nps_tioga', 'mono_tioga'], 'CA 120',
     access={'note': 'The last Sierra pass to open most years and the first to close — typically shut from November to late May or early June. An entrance fee applies inside Yosemite.', 'url': 'https://www.nps.gov/yose/planyourvisit/tioga.htm', 'checked': REVIEWED}),
road('rock-creek-road', 'Rock Creek Road', 'Sierra Nevada', 2, 'Technical', ['Rock Creek Road'],
     [-118.78, 37.40, -118.64, 37.58],
     'California’s highest paved public road, climbing from Tom’s Place on Highway 395 to the Mosquito Flat trailhead at over 10,200 feet.',
     ['dangerous_rockcreek', 'theridrs_rockcreek', 'mono_rockcreek'],
     access={'note': 'Snow-covered well into spring most years; not reliably open until late May or June.', 'url': 'https://www.monocounty.org/places-to-go/lakes-rivers-creeks/rock-creek-lake/', 'checked': REVIEWED}),
road('bishop-creek-sabrina', 'Bishop Creek Canyon Road · Hwy 168', 'Sierra Nevada', 2, 'Medium speed', ['Bishop Creek Canyon Road', 'South Lake Road'],
     [-118.68, 37.15, -118.38, 37.37],
     'The eastern Highway 168, climbing from Bishop up Bishop Creek Canyon past Aspendell to Lake Sabrina at over 9,100 feet, with South Lake Road forking off the same canyon.',
     ['wiki_168', 'summitpost_sabrina', 'bishopvisitor'], 'CA 168',
     access={'note': 'The section above Aspendell closes to most vehicles in winter for snow removal, typically reopening in mid-to-late April.', 'url': 'https://en.wikipedia.org/wiki/California_State_Route_168', 'checked': REVIEWED}),
road('horseshoe-meadow', 'Horseshoe Meadow Road', 'Sierra Nevada', 3, 'Technical', ['Horseshoe Meadows Road'],
     [-118.25, 36.40, -118.08, 36.62],
     'A steep climb out of Lone Pine up the eastern Sierra escarpment through six switchbacks and exposed shelf sections to over 10,000 feet — the second-highest paved road in California.',
     ['dangerous_horseshoe', 'pashnit_horseshoe', 'gribble_horseshoe'],
     access={'note': 'Snow-covered into late spring most years.', 'url': 'https://www.dangerousroads.org/north-america/usa/7019-horseshoe-meadow.html', 'checked': REVIEWED}),
road('highway-168-west', 'Highway 168 · Shaver Lake to Huntington Lake', 'Sierra Nevada', 2, 'Technical', ['Tollhouse Road', 'Huntington Lake Road', 'Kaiser Pass Road'],
     [-119.42, 37.05, -119.15, 37.28],
     'The western Sierra climb from the San Joaquin Valley foothills through Shaver Lake to Huntington Lake, continuing as Kaiser Pass Road toward Florence Lake.',
     ['theridrs_168west', 'climber_kaiser', 'gribble_168'], 'CA 168'),
road('nine-mile-canyon-road', 'Nine Mile Canyon Road', 'Sierra Nevada', 3, 'High speed', ['Nine Mile Canyon Road'],
     [-118.20, 35.68, -117.85, 35.95],
     'A fast, wide-open descent dropping around 3,000 feet in its last 10 miles from the Kennedy Meadows area down to Highway 395, with long unguarded drops off the canyon edge.',
     ['sierrapasses_ninemile']),
]

def length(coords):
    total = 0
    for (x1, y1), (x2, y2) in zip(coords, coords[1:]):
        dy = math.radians(y2 - y1); dx = math.radians(x2 - x1)
        a = math.sin(dy / 2) ** 2 + math.cos(math.radians(y1)) * math.cos(math.radians(y2)) * math.sin(dx / 2) ** 2
        total += 6371000 * 2 * math.atan2(math.sqrt(a), math.sqrt(max(0, 1 - a)))
    return total

def merge(lines):
    result = []
    pending = [line[:] for line in lines]
    while pending:
        current = pending.pop()
        changed = True
        while changed:
            changed = False
            for i, other in enumerate(pending):
                if current[-1] == other[0]: current += other[1:]
                elif current[-1] == other[-1]: current += other[-2::-1]
                elif current[0] == other[-1]: current = other[:-1] + current
                elif current[0] == other[0]: current = other[:0:-1] + current
                else: continue
                pending.pop(i); changed = True; break
        result.append(current)
    return result

new_catalog = []
new_features = []
new_labels = []
for entry in R:
    west, south, east, north = entry.pop('bbox')
    names = entry.pop('names'); ref = entry.pop('ref', None)
    lines = []; speedways = []; ids = []; tagged_length = 0; total_length = 0
    for way in ways.values():
        tags = way.get('tags', {})
        if not ((ref and ref in tags.get('ref', '').split(';')) or tags.get('name') in names):
            continue
        if tags.get('motor_vehicle') == 'no' or tags.get('access') in ('no', 'private'):
            continue
        raw = way.get('geometry', [])
        chunks = []; chunk = []
        for point in raw:
            if point is None:
                continue
            if west <= point['lon'] <= east and south <= point['lat'] <= north:
                chunk.append([round(point['lon'], 6), round(point['lat'], 6)])
            else:
                if len(chunk) > 1: chunks.append(chunk)
                chunk = []
        if len(chunk) > 1: chunks.append(chunk)
        if not chunks:
            continue
        lines.extend(chunks); ids.append(way['id'])
        distance = sum(length(c) for c in chunks); total_length += distance
        speed = tags.get('maxspeed', '')
        if re.fullmatch(r'\d+ mph', speed):
            speedways.append({'mph': int(speed.split()[0]), 'wayId': way['id']})
            tagged_length += distance
    if not lines:
        raise ValueError('Missing geometry: ' + entry['id'])
    merged = merge(lines)
    allpoints = [p for line in lines for p in line]
    bounds = [[min(p[0] for p in allpoints), min(p[1] for p in allpoints)],
              [max(p[0] for p in allpoints), max(p[1] for p in allpoints)]]
    longest = max(merged, key=length); center = longest[len(longest) // 2]
    vals = sorted(set(s['mph'] for s in speedways))
    mapped = (' / '.join(str(v) for v in vals) + ' mph') if vals else 'Not mapped'
    speed = dict(value='Not verified', kind='Unverified',
                 note='No reliable posted limit was found for this road. Check signs along the route.', source=None)
    if vals:
        speed = dict(value=mapped, kind='Mapped limits',
                     note=f'OpenStreetMap tags cover approximately {round(tagged_length / total_length * 100)}% of this trace. These values have not been checked against current signs.',
                     source=f'https://www.openstreetmap.org/way/{speedways[0]["wayId"]}')
    entry.update(center=center, bounds=bounds, speed=speed, mappedSpeed=mapped,
                 taggedPercent=round(tagged_length / total_length * 100) if total_length else 0,
                 osmWayIds=ids, reviewed=REVIEWED)
    props = {k: entry[k] for k in ['id', 'name', 'difficulty', 'character']}
    new_features.append(dict(type='Feature', properties=props, geometry=dict(type='MultiLineString', coordinates=merged)))
    new_labels.append(dict(type='Feature', properties=props, geometry=dict(type='Point', coordinates=center)))
    new_catalog.append(entry)
    print(entry['id'], len(lines), 'segments', round(total_length / 1609.344, 1), 'mi', speed['kind'], speed['value'])

catalog_path = ROOT / 'app/data/roads.json'
archive_path = ROOT / 'data/roads.full.geojson'
existing = json.loads(catalog_path.read_text())
archive = json.loads(archive_path.read_text())
new_ids = {road['id'] for road in new_catalog}
# The northern-additions builder also publishes Sierra foothill roads. Own
# these explicit specs, not every road that happens to share a map region.
drop_ids = new_ids
catalog = [road for road in existing if road['id'] not in drop_ids] + new_catalog
features = [f for f in archive['features'] if f['properties']['id'] not in drop_ids] + new_features
assert len({road['id'] for road in catalog}) == len(catalog), 'Duplicate road ID'
catalog_path.write_text(json.dumps(catalog, indent=2, ensure_ascii=False) + '\n')
archive_path.write_text(json.dumps({'type': 'FeatureCollection', 'features': features}, separators=(',', ':')) + '\n')
print(f'Sierra region built: {len(new_catalog)} roads. Run python3 scripts/fetch-elevation.py then scripts/build-derived-data.py.')
