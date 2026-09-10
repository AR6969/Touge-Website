import json, urllib.request, urllib.parse, time, pathlib
HW = '^(trunk|primary|secondary|tertiary|unclassified|residential)$'
BATCHES = [
    # San Diego County
    (["South Grade Road", "East Grade Road", "Sunrise Highway"], "32.60,-117.60,33.60,-116.20"),
    (["Highland Valley Road", "Mesa Grande Road", "Montezuma Valley Road"], "32.60,-117.60,33.60,-116.20"),
    (["Couser Canyon Road", "Palomar Mountain Road", "Nate Harrison Grade"], "32.60,-117.60,33.60,-116.20"),
    # Inland Empire mountains + Ojai, by route number
    (None, "33.60,-117.30,34.40,-116.60", '(^|;)(CA 18|CA 243|CA 38)(;|$)'),
    (None, "34.30,-119.60,34.90,-119.00", '(^|;)(CA 33)(;|$)'),
    (None, "32.60,-117.60,33.60,-116.20", '(^|;)(CA 79|CA 78|CA 76|S6|S7|S1|S22)(;|$)'),
]
out = {}
for spec in BATCHES:
    names, box = spec[0], spec[1]
    if names:
        q = f'[out:json][timeout:180];way[highway~"{HW}"][name~"^({"|".join(names)})$"]({box});out geom;'
        label = ", ".join(names)
    else:
        q = f'[out:json][timeout:180];way[highway~"{HW}"][ref~"{spec[2]}"]({box});out geom;'
        label = spec[2]
    for attempt in range(4):
        try:
            req = urllib.request.Request("https://overpass-api.de/api/interpreter",
                  data=urllib.parse.urlencode({"data": q}).encode(),
                  headers={"User-Agent": "california-touge/1.0"})
            d = json.load(urllib.request.urlopen(req, timeout=240))
            got = [w for w in d['elements'] if w['type'] == 'way']
            for w in got: out[w['id']] = w
            print(f"  {label}: +{len(got)}", flush=True)
            break
        except Exception as e:
            print(f"  {label}: {type(e).__name__}, retry {attempt+1}", flush=True)
            time.sleep(8 * (attempt + 1))
    time.sleep(4)
pathlib.Path('/tmp/sd.json').write_text(json.dumps({'elements': list(out.values())}))
from collections import Counter
c = Counter(w['tags'].get('name') for w in out.values())
print("\nfound:", {k: v for k, v in sorted(c.items()) if k})
