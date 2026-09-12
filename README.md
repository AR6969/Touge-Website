# California Touge

A map and reference for California driving roads, including the Bay Area, Los Angeles,
Malibu, the Angeles/San Gabriel Mountains, Orange County, San Diego and the Sierra Nevada.
Every road has its own page with a map, corner statistics measured from OpenStreetMap
geometry, difficulty and character ratings, and the source behind any speed figure shown.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables

Set these in `.env.local` (not committed):

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | yes | Public Mapbox token (`pk.…`) for the basemap. Without it the site still renders — only the map area shows a message. |
| `NEXT_PUBLIC_SITE_URL` | for deploys | Absolute origin, e.g. `https://example.com`. Canonical tags, `sitemap.xml`, `robots.txt` and social-card URLs are built from it. On Vercel it falls back to the project's production URL; otherwise it falls back to `http://localhost:3000`. |

## Routes

| Route | What it is |
| --- | --- |
| `/` | Map explorer, plus rankings and links to every road |
| `/?region=bay-area` | Bay Area map |
| `/los-angeles` | LA map, including Malibu, the Angeles/San Gabriel Mountains and Orange County |
| `/san-diego` | San Diego map |
| `/sierra` | Sierra Nevada map: Tioga Pass, Sonora Pass and the other high passes and canyons |
| `/roads` | All roads in one comparison table |
| `/roads/[slug]` | One road: map, shape statistics, speed evidence, sources, nearby roads |
| `/regions` and `/regions/[slug]` | Roads grouped by area |
| `/method` | How roads are selected, rated and measured |
| `/sitemap.xml`, `/robots.txt` | Generated from the catalog |

Road and region pages are statically generated with `generateStaticParams`, and each has
a share card drawn from the road's real geometry (`opengraph-image.tsx`).

## Rebuilding the road data

Three stages. Only the first needs Overpass snapshots.

```bash
# 1. Fetch: run scripts/roads.overpass and scripts/roads-extra.overpass at
#    https://overpass-api.de/api/interpreter, saving each result as JSON.
python3 scripts/build-road-data.py main-snapshot.json extra-snapshot.json

# 2. Ground elevation, once per road, cached. Only fetches what is missing.
python3 scripts/fetch-elevation.py

# 3. Derive what the site actually serves.
python3 scripts/build-derived-data.py
```

Southern California editorial fields and selected trace endpoints live in
`scripts/la-roads.json`. Its raw OSM snapshot is checked in at `data/la-overpass.json`.
To refresh it, POST the query in `scripts/roads-la.overpass` to Overpass and save
the successful JSON response. Then run:

```bash
python3 scripts/build-la-road-data.py
python3 scripts/build-derived-data.py
```

The LA builder replaces the Southern California records it manages and preserves
the Bay Area archive. The Bay Area stage-1 builder also includes this saved snapshot
when present. Selected Southern California traces follow connected OSM nodes on the
specified roads; a missing connection fails the build instead of drawing a shortcut.
These traces are not navigation itineraries. See `docs/los-angeles-road-research.md`
for the research and the editorial source file for the published section boundaries.

The Sierra Nevada region follows the same bbox-clip approach as the Bay Area builder
rather than the LA anchor-graph tracer: each road there is a single named highway or
mountain road with unambiguous endpoints, not an urban grid needing disambiguation.
Its Overpass snapshot is fetched per-road (a compound name+ref query in one bbox
reliably timed out) and checked in at `data/sierra-overpass.json`:

```bash
python3 scripts/fetch-sierra-overpass.py   # resumable; only fetches what's missing
python3 scripts/build-sierra-road-data.py
python3 scripts/fetch-elevation.py
python3 scripts/build-derived-data.py
```

Like the LA builder, this replaces only the region it manages (`mapRegion: 'sierra'`)
and preserves every other region's archive entries. See `docs/sierra-road-research.md`
for sourcing, including why US 395 itself isn't catalogued as a road.

| Path | Stage | Notes |
| --- | --- | --- |
| `data/roads.full.geojson` | 1 | Full-precision archive. Outside `public/`, so it is never served. |
| `data/elevation.json` | 2 | Cached elevation samples. ~160 API calls; delete an entry to refetch it. |
| `app/data/roads.json` | 3 | Catalog, plus `shape`, `elevation`, `profile` and `score`. |
| `app/data/score-config.json` | 3 | Score weights and anchors, so `/method` quotes the real values. |
| `public/data/roads.geojson` | 3 | Simplified overview geometry (~20% of the original point count). |
| `public/data/roads/<id>.geojson` | 3 | One road each, so a road page loads a few KB instead of the whole set. |
| `public/data/road-labels.geojson` | 3 | Map label anchors. A road's `labelPoint` overrides its centre. |
| `public/data/<region>/roads.geojson` and `road-labels.geojson` | 3 | Separate region payloads; each regional map downloads its own road traces. |

Stage 3 always measures the full-precision archive, so re-running it is safe and
idempotent. See `docs/road-research.md` for sourcing and `/method` for the published
version of the same rules.

## The Touge Score (dormant)

A 0-100 road score — corner density, climb per mile and editorial difficulty —
is still computed on every build and stored on each road in
`app/data/roads.json`. **It is intentionally not shown anywhere on the site.**

Do not delete `scripts/score.py` or rebuild a scoring algorithm from scratch.
See [`docs/touge-score.md`](docs/touge-score.md) for the formula, the evidence
behind each input, the designs that were tested and rejected, and step-by-step
instructions to switch it back on. Re-enabling is UI work only.

## Map landmarks

Named points on the map live in `app/data/landmarks.json` — editorial, hand-maintained,
no build step. Each needs `id`, `name`, `kind`, `note` and `coordinates` as
`[longitude, latitude]` (that order, GeoJSON convention — longitude is the negative
one in California):

```json
{ "id": "saratoga-gap", "name": "Saratoga Gap", "kind": "Junction",
  "note": "Skyline Blvd (CA 35) × Highway 9.", "coordinates": [-122.12197, 37.25852] }
```

To get coordinates: right-click the spot in Google Maps and click the lat/long it
shows to copy it. That gives `37.25852, -122.12197` — **reverse the order** when
pasting in.

Sanity-check a new point against its actual location before trusting it. Junctions
should sit on their roads; destinations such as the Ritz-Carlton sit at the property,
off the main road. The Ritz-Carlton coordinate is the building location from
[OpenStreetMap via Mapcarta](https://mapcarta.com/W391400186), with the address and
access checked against the hotel's website. Optional `sourceUrl` and `sourceLabel`
fields add a reference link to the detail card.

Pending: **Lower Skid** (the pullout on the back side of Highway 9) is not placed —
its location has not been verified. A pin in the wrong pullout is worse than none.

## Driving guides

`app/lib/drives.ts` holds hand-maintained itineraries, stops, return routes and
references. `/drives` lists them and `/drives/[slug]` renders each guide. Road IDs
in each itinerary link to the existing road pages; those pages link back to the
guides. New guides are included in the sitemap automatically. Keep directions
explicit and distinguish the main drive from any optional return or extension.

## Attribution

Road geometry and `maxspeed` tags © OpenStreetMap contributors, under the
[Open Database License](https://opendatacommons.org/licenses/odbl/1-0/).
Elevation from USGS 10 m data (public domain) via
[OpenTopoData](https://www.opentopodata.org/).
Descriptions, difficulty ratings and corner counts are editorial. Posted signs always govern.
