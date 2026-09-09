"""Fetch the LA road snapshot from Overpass, in chunks, resumably.

The single combined query in scripts/roads-la.overpass asks for ~44 named roads
across a 1.7 x 1.1 degree box and times out on the public instance. This splits
it into small per-name batches, retries with backoff, falls back to a mirror,
and merges everything into data/la-overpass.json.

Re-running only fetches what is missing, so a timeout mid-run costs nothing.
Usage: python3 scripts/fetch-la-overpass.py [--force]
"""
import json
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
QUERY = ROOT / 'scripts/roads-la.overpass'
OUT = ROOT / 'data/la-overpass.json'
PROGRESS = ROOT / 'data/.la-overpass-progress.json'

# overpass-api.de is the reliable one; the kumi mirror was returning 504 during
# this build, so it is a last resort rather than half of a round-robin.
PRIMARY = 'https://overpass-api.de/api/interpreter'
FALLBACK = 'https://overpass.kumi.systems/api/interpreter'

BBOX = '33.42,-119.10,34.52,-117.25'
# trunk matters: SR 1 through Malibu and several state routes are tagged trunk,
# and leaving it out meant Latigo, Decker and Encinal had no PCH junction to anchor to.
HIGHWAYS = '^(trunk|primary|secondary|tertiary|unclassified|residential|construction)$'
REFS = '(^|;)(CA 1|CA 2|CA 23|CA 27|CA 39|CA 74|CA 133|CA 142)(;|$)'
BATCH = 3          # names per request; long roads like PCH are heavy on their own
DELAY_S = 4        # polite gap between requests
RETRIES = 5


def road_names():
    """The name alternatives already curated in the .overpass file."""
    text = QUERY.read_text()
    match = re.search(r'\[name~"\^\((.+?)\)\$"\]', text, re.S)
    if not match:
        raise SystemExit('Could not read road names from ' + str(QUERY))
    return [name for name in match.group(1).split('|') if name]


def run(query, label):
    body = urllib.parse.urlencode({'data': query}).encode()
    for attempt in range(RETRIES):
        # Stay on the primary; only the final attempt tries the mirror.
        endpoint = FALLBACK if attempt == RETRIES - 1 else PRIMARY
        request = urllib.request.Request(
            endpoint, data=body,
            headers={'User-Agent': 'california-touge/1.0 (road catalogue build script)'})
        try:
            with urllib.request.urlopen(request, timeout=300) as response:
                data = json.load(response)
            if data.get('remark'):
                raise ValueError(data['remark'])
            return data
        except Exception as error:
            detail = f'HTTP {error.code}' if isinstance(error, urllib.error.HTTPError) else type(error).__name__
            if attempt == RETRIES - 1:
                raise RuntimeError(detail) from error
            wait = DELAY_S * (attempt + 2)
            print(f'    {label}: {detail} from {urllib.parse.urlparse(endpoint).netloc}; '
                  f'retry {attempt + 1}/{RETRIES - 1} in {wait}s', flush=True)
            time.sleep(wait)
    return {}


def main():
    force = '--force' in sys.argv
    names = road_names()
    batches = [names[i:i + BATCH] for i in range(0, len(names), BATCH)]
    # The ref-based query is small and separate; keep it as its own unit.
    units = [('|'.join(b), b) for b in batches] + [('refs', None)]

    done = json.loads(PROGRESS.read_text()) if PROGRESS.exists() and not force else {}
    elements = {int(k): v for k, v in done.get('elements', {}).items()}
    finished = set(done.get('finished', []))
    timestamp = done.get('timestamp')

    failed = []
    for label, batch in units:
        if label in finished:
            continue
        if batch is None:
            query = (f'[out:json][timeout:180];way[highway~"{HIGHWAYS}"]'
                     f'[ref~"{REFS}"]({BBOX});out geom;')
        else:
            alternatives = '|'.join(batch)
            query = (f'[out:json][timeout:180];way[highway~"{HIGHWAYS}"]'
                     f'[name~"^({alternatives})$"]({BBOX});out geom;')
        print(f'-> {", ".join(batch) if batch else "by ref"}', flush=True)
        try:
            data = run(query, label)
        except Exception as error:
            print(f'    SKIPPED after {RETRIES} attempts ({error}); re-run to retry', flush=True)
            failed.append(label)
            time.sleep(DELAY_S * 3)
            continue
        got = [e for e in data.get('elements', []) if e.get('type') == 'way']
        elements.update({way['id']: way for way in got})
        timestamp = data.get('osm3s', {}).get('timestamp_osm_base', timestamp)
        finished.add(label)
        PROGRESS.write_text(json.dumps({
            'finished': sorted(finished), 'timestamp': timestamp,
            'elements': {str(k): v for k, v in elements.items()},
        }, separators=(',', ':')))
        print(f'    +{len(got)} ways (total {len(elements)})', flush=True)
        time.sleep(DELAY_S)

    OUT.write_text(json.dumps({
        'version': 0.6,
        'generator': 'chunked via scripts/fetch-la-overpass.py',
        'osm3s': {'timestamp_osm_base': timestamp},
        'elements': [elements[key] for key in sorted(elements)],
    }, separators=(',', ':')) + '\n')
    print(f'Wrote {OUT.relative_to(ROOT)}: {len(elements)} ways, OSM base {timestamp}')
    if failed:
        print(f'{len(failed)} unit(s) still missing; re-run this script to retry them.')
        raise SystemExit(1)


if __name__ == '__main__':
    main()
