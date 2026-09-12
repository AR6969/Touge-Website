"""Fetch the Sierra region's road snapshot from Overpass, one road at a time.

Unlike the Bay Area and LA snapshots (one shared bbox per batch of named
roads), each Sierra road here gets its own tight bounding box: CA 108, CA 120
and CA 168 are each hundreds of miles long, and CA 168 alone has two
physically disconnected mountain segments (Fresno-side and Bishop-side) that
must not be fetched together. A per-road box keeps each request small and
keeps the two CA 168 segments apart without relying on OSM way boundaries.

Re-running only fetches what is missing, so a timeout mid-run costs nothing.
Usage: python3 scripts/fetch-sierra-overpass.py [--force]
"""
import json
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'data/sierra-overpass.json'
PROGRESS = ROOT / 'data/.sierra-overpass-progress.json'

# overpass-api.de is unreachable tonight (connection refused / 504s); kumi is
# answering, so it goes first. Swap back if that reverses.
PRIMARY = 'https://overpass.kumi.systems/api/interpreter'
FALLBACK = 'https://overpass-api.de/api/interpreter'
HIGHWAYS = '^(trunk|primary|secondary|tertiary|unclassified|residential)$'
DELAY_S = 4
RETRIES = 5

# (label, bbox "south,west,north,east", Overpass filter clause). One clause
# per entry, even where a road needed two (a compound query with both a name
# and a ref filter reliably 504'd on the mirror that was answering tonight).
ROADS = [
    ('sonora-pass', '38.24,-119.75,38.46,-119.30', 'way[highway~"^(trunk|primary|secondary)$"][ref~"^CA 108$"]'),
    ('tioga-pass', '37.86,-119.35,37.98,-119.05', 'way[highway~"^(trunk|primary|secondary)$"][ref~"^CA 120$"]'),
    ('rock-creek-road', '37.40,-118.78,37.60,-118.64', f'way[highway~"{HIGHWAYS}"][name="Rock Creek Road"]'),
    ('bishop-creek-sabrina-name', '37.15,-118.68,37.38,-118.35', f'way[highway~"{HIGHWAYS}"][name~"^(Bishop Creek Canyon Road|South Lake Road)$"]'),
    ('bishop-creek-sabrina-ref', '37.15,-118.68,37.38,-118.35', 'way[highway~"^(trunk|primary|secondary)$"][ref~"^CA 168$"]'),
    ('horseshoe-meadow', '36.40,-118.25,36.62,-118.08', f'way[highway~"{HIGHWAYS}"][name="Horseshoe Meadows Road"]'),
    ('highway-168-west-ref', '37.02,-119.45,37.30,-119.10', 'way[highway~"^(trunk|primary|secondary)$"][ref~"^CA 168$"]'),
    ('highway-168-west-name', '37.02,-119.45,37.30,-119.10', f'way[highway~"{HIGHWAYS}"][name~"^(Tollhouse Road|Huntington Lake Road|Kaiser Pass Road)$"]'),
    ('nine-mile-canyon-road', '35.68,-118.20,35.95,-117.85', f'way[highway~"{HIGHWAYS}"][name="Nine Mile Canyon Road"]'),
]


def run(query, label):
    body = urllib.parse.urlencode({'data': query}).encode()
    for attempt in range(RETRIES):
        url = FALLBACK if attempt >= RETRIES - 1 else PRIMARY
        request = urllib.request.Request(
            url, data=body,
            headers={'User-Agent': 'california-touge/1.0 (road catalogue build script)'})
        try:
            with urllib.request.urlopen(request, timeout=150) as response:
                data = json.loads(response.read())
                if data.get('remark'):
                    raise ValueError(data['remark'])
                return data['elements']
        except Exception as error:  # noqa: BLE001 — best-effort fetch loop, retries regardless of cause
            wait = DELAY_S * (attempt + 1)
            print(f'  {label}: {type(error).__name__}: {error} — retrying in {wait}s ({attempt + 1}/{RETRIES})')
            time.sleep(wait)
    raise SystemExit(f'{label}: exhausted retries')


def main():
    force = '--force' in sys.argv
    done = {} if force else (json.loads(PROGRESS.read_text()) if PROGRESS.exists() else {})
    elements = {e['id']: e for e in json.loads(OUT.read_text())['elements']} if OUT.exists() and not force else {}

    for label, bbox, clause in ROADS:
        if done.get(label):
            print(f'  {label}: already fetched, skipping')
            continue
        south, west, north, east = bbox.split(',')
        clauses = '\n'.join(f'{part.strip()}({south},{west},{north},{east});' for part in clause.split(';'))
        query = f'[out:json][timeout:120];\n(\n{clauses}\n);\nout geom;'
        print(f'  {label}: fetching…')
        for element in run(query, label):
            if element['type'] == 'way':
                elements[element['id']] = element
        done[label] = True
        PROGRESS.write_text(json.dumps(done))
        OUT.write_text(json.dumps({'elements': list(elements.values())}))
        time.sleep(DELAY_S)

    print(f'Done. {len(elements)} ways in {OUT}.')


if __name__ == '__main__':
    main()
