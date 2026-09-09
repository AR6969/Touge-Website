# California Touge

A map and reference for driving roads across the Bay Area, Santa Cruz, Napa and Monterey.
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

| Path | Stage | Notes |
| --- | --- | --- |
| `data/roads.full.geojson` | 1 | Full-precision archive. Outside `public/`, so it is never served. |
| `public/data/road-labels.geojson` | 1 | Label points for the overview map. |
| `data/elevation.json` | 2 | Cached elevation samples. ~160 API calls; delete an entry to refetch it. |
| `app/data/roads.json` | 3 | Catalog, plus `shape`, `elevation`, `profile` and `score`. |
| `app/data/score-config.json` | 3 | Score weights and anchors, so `/method` quotes the real values. |
| `public/data/roads.geojson` | 3 | Simplified overview geometry (~20% of the original point count). |
| `public/data/roads/<id>.geojson` | 3 | One road each, so a road page loads a few KB instead of the whole set. |

Stage 3 always measures the full-precision archive, so re-running it is safe and
idempotent. See `docs/road-research.md` for sourcing and `/method` for the published
version of the same rules.

## The Touge Score

A 0-100 score for how engaging a road is to drive, per mile: corner density (45),
climb per mile (35) and our editorial difficulty rating (20). The weights and
anchors live in `scripts/score.py`, are exported to `app/data/score-config.json`
at build time, and are published in full at `/method`. Anchors are absolute
rather than percentile, so adding roads never shifts an existing score.

## Attribution

Road geometry and `maxspeed` tags © OpenStreetMap contributors, under the
[Open Database License](https://opendatacommons.org/licenses/odbl/1-0/).
Elevation from USGS 10 m data (public domain) via
[OpenTopoData](https://www.opentopodata.org/).
Descriptions, difficulty ratings and corner counts are editorial. Posted signs always govern.
