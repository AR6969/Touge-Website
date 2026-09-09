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

from geometry import FEET_PER_METER, METERS_PER_MILE, elevation_stats, shape_stats, simplify
import score as scoring
from score import touge_score

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


# Enough points to show the shape of a climb, few enough to keep the catalog small.
PROFILE_POINTS = 72


def build_profile(entry):
    """Downsample the longest segment's elevation into a drawable profile.

    One road can be several disconnected pieces. Splicing them would draw a
    climb that nobody can drive, so the profile follows the longest piece only
    and reports how much of the road that covers.
    """
    segments = [[v for v in segment if v is not None] for segment in entry['segments']]
    segments = [segment for segment in segments if len(segment) > 1]
    if not segments:
        return None
    longest = max(segments, key=len)
    step = entry['stepM']

    points = []
    for i in range(PROFILE_POINTS):
        position = i * (len(longest) - 1) / (PROFILE_POINTS - 1)
        low = int(position)
        high = min(low + 1, len(longest) - 1)
        value = longest[low] + (longest[high] - longest[low]) * (position - low)
        points.append(round(value * FEET_PER_METER))

    covered = (len(longest) - 1) * step
    total = sum((len(segment) - 1) * step for segment in segments)
    return {
        'points': points,
        'miles': round(covered / METERS_PER_MILE, 1),
        'coverage': round(covered / total * 100) if total else 100,
    }


source = json.loads((ROOT / 'data/roads.full.geojson').read_text())
catalog = json.loads((ROOT / 'app/data/roads.json').read_text())
by_id = {road['id']: road for road in catalog}

elevation_path = ROOT / 'data/elevation.json'
elevations = json.loads(elevation_path.read_text()) if elevation_path.exists() else {}
if not elevations:
    print('No data/elevation.json — run scripts/fetch-elevation.py first. '
          'Scores will be built without the climb component.')

overview = []
before = after = 0

for feature in source['features']:
    road_id = feature['properties']['id']
    lines = feature['geometry']['coordinates']
    before += sum(len(line) for line in lines)

    road = by_id[road_id]
    shape = shape_stats(lines)

    entry = elevations.get(road_id)
    elevation = elevation_stats(entry['segments'], entry['stepM']) if entry else None
    if elevation:
        elevation['climbPerMile'] = round(elevation['climbFt'] / (shape['lengthMi'] or 1))

    road.update(
        shape=shape,
        elevation=elevation,
        profile=build_profile(entry) if entry else None,
        score=touge_score(shape, elevation, road['difficulty']),
    )

    trimmed = [round_line(simplify(line, TOLERANCE_M)) for line in lines]
    after += sum(len(line) for line in trimmed)
    geometry = {'type': 'MultiLineString', 'coordinates': trimmed}

    overview.append({'type': 'Feature', 'properties': feature['properties'], 'geometry': geometry})
    write_json(ROOT / f'public/data/roads/{road_id}.geojson',
               {'type': 'Feature', 'properties': feature['properties'], 'geometry': geometry})

write_json(ROOT / 'public/data/roads.geojson', {'type': 'FeatureCollection', 'features': overview})

# Published so /method quotes the real constants rather than a copy that can drift.
(ROOT / 'app/data/score-config.json').write_text(json.dumps({
    'cornerAnchor': scoring.CORNER_ANCHOR,
    'climbAnchor': scoring.CLIMB_ANCHOR,
    'weights': {
        'corners': scoring.WEIGHT_CORNERS,
        'climb': scoring.WEIGHT_CLIMB,
        'technical': scoring.WEIGHT_TECHNICAL,
    },
}, indent=2) + '\n')
(ROOT / 'app/data/roads.json').write_text(json.dumps(catalog, indent=2, ensure_ascii=False) + '\n')

print(f"{'road':<32}{'score':>6}{'corner':>8}{'climb':>7}{'tech':>6}")
for road in sorted(catalog, key=lambda r: -r['score']['score'])[:10]:
    s = road['score']
    print(f"{road['name']:<32}{s['score']:>6}{s['corners']:>8}{s['climb']:>7}{s['technical']:>6}")
missing = [road['id'] for road in catalog if not road['elevation']]
if missing:
    print(f"No elevation for: {', '.join(missing)}")
print(f'Simplified {before} points to {after} ({round(after / before * 100)}%). Wrote {len(catalog)} roads.')
