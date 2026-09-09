"""Fetch ground elevation along every road, once, and cache it.

Source: OpenTopoData's public instance serving USGS NED 10 m, a US federal
dataset in the public domain. No API key. The public instance allows 1000 calls
a day at 1 call a second, 100 locations a call, so this script rate-limits
itself and caches to data/elevation.json.

Re-running only fetches roads missing from the cache. Delete the cache entry for
a road to refetch it. Usage: python3 scripts/fetch-elevation.py [road-id ...]
"""
import json
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

from geometry import resample_lonlat

ROOT = Path(__file__).resolve().parents[1]
CACHE = ROOT / "data/elevation.json"
DATASET = "ned10m"
STEP_M = 100
BATCH = 100
DELAY_S = 1.1
RETRIES = 3


def fetch(points):
    """Elevations, in metres, for up to BATCH lon/lat points. None where unknown."""
    locations = "|".join(f"{lat:.6f},{lon:.6f}" for lon, lat in points)
    url = f"https://api.opentopodata.org/v1/{DATASET}?" + urllib.parse.urlencode({"locations": locations})
    for attempt in range(RETRIES):
        try:
            with urllib.request.urlopen(url, timeout=60) as response:
                body = json.load(response)
            if body.get("status") != "OK":
                raise ValueError(body.get("error", "unknown error"))
            return [point["elevation"] for point in body["results"]]
        except (urllib.error.URLError, ValueError, KeyError) as error:
            if attempt == RETRIES - 1:
                raise
            # Public instance; back off rather than hammer it.
            time.sleep(DELAY_S * 4 * (attempt + 1))
            print(f"    retry {attempt + 1} after {type(error).__name__}", flush=True)
    return []


geojson = json.loads((ROOT / "data/roads.full.geojson").read_text())
cache = json.loads(CACHE.read_text()) if CACHE.exists() else {}
only = set(sys.argv[1:])
calls = 0

for feature in geojson["features"]:
    road_id = feature["properties"]["id"]
    if only and road_id not in only:
        continue
    if road_id in cache and not only:
        continue

    segments = [resample_lonlat(line, STEP_M) for line in feature["geometry"]["coordinates"]]
    total = sum(len(segment) for segment in segments)
    print(f"{road_id}: {total} points", flush=True)

    elevations = []
    for segment in segments:
        values = []
        for start in range(0, len(segment), BATCH):
            values.extend(fetch(segment[start:start + BATCH]))
            calls += 1
            time.sleep(DELAY_S)
        elevations.append(values)

    cache[road_id] = {"dataset": DATASET, "stepM": STEP_M, "segments": elevations}
    CACHE.write_text(json.dumps(cache, separators=(",", ":")) + "\n")

print(f"Done. {calls} API calls, {len(cache)} roads cached in {CACHE.relative_to(ROOT)}.")
