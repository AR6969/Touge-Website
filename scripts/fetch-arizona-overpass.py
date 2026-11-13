"""Fetch the Arizona road snapshot from Overpass, one road at a time.

Same per-road bounding-box approach as fetch-sierra-overpass.py: US 191,
US 60 and SR 89A are each hundreds of miles long, so every road gets its own
tight box and a single filter clause. Refs are matched loosely (e.g. "89A"
rather than "SR 89A") because Arizona OSM tagging mixes "SR" and "AZ".

Re-running only fetches what is missing, so a timeout mid-run costs nothing.
Usage: python3 scripts/fetch-arizona-overpass.py [--force]
"""
import json
import subprocess
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'data/arizona-overpass.json'
PROGRESS = ROOT / 'data/.arizona-overpass-progress.json'

# Same mirror order as the Sierra fetcher; swap if one stops answering.
PRIMARY = 'https://overpass-api.de/api/interpreter'
FALLBACK = 'https://maps.mail.ru/osm/tools/overpass/api/interpreter'
HIGHWAYS = '^(trunk|primary|secondary|tertiary|unclassified|residential)$'
DELAY_S = 4
RETRIES = 5

# (label, bbox "south,west,north,east", Overpass filter clause).
ROADS = [
    ('mount-lemmon', '32.22,-110.80,32.46,-110.68', f'way[highway~"{HIGHWAYS}"][name~"(Catalina Highway|General Hitchcock Highway)"]'),
    ('oak-creek-canyon', '34.85,-111.80,35.03,-111.70', 'way[highway~"^(trunk|primary|secondary)$"][ref~"89A"]'),
    ('mingus-mountain', '34.58,-112.32,34.78,-112.08', 'way[highway~"^(trunk|primary|secondary)$"][ref~"89A"]'),
    ('salt-river-canyon', '33.66,-110.56,33.90,-110.40', 'way[highway~"^(trunk|primary|secondary)$"][ref~"(^|;)US 60"]'),
    ('coronado-trail', '33.03,-109.45,33.88,-109.05', 'way[highway~"^(trunk|primary|secondary)$"][ref~"(^|;)US 191"]'),
]


def run(query, label):
    # curl, not urllib: the macOS system Python's LibreSSL fails the TLS
    # handshake with overpass-api.de, while curl connects fine.
    for attempt in range(RETRIES):
        url = FALLBACK if attempt >= RETRIES - 1 else PRIMARY
        try:
            out = subprocess.run(
                ['curl', '-sS', '--fail', '-m', '150', '-A', 'california-touge/1.0 (road catalogue build script)',
                 '--data-urlencode', 'data=' + query, url],
                capture_output=True, check=True, text=True).stdout
            data = json.loads(out)
            if data.get('remark'):
                raise ValueError(data['remark'])
            return data['elements']
        except Exception as error:  # noqa: BLE001 — best-effort fetch loop, retries regardless of cause
            wait = DELAY_S * (attempt + 1)
            detail = getattr(error, 'stderr', '') or error
            print(f'  {label}: {type(error).__name__}: {str(detail).strip()} — retrying in {wait}s ({attempt + 1}/{RETRIES})')
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
