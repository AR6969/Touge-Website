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

Two stages. The first needs Overpass snapshots; the second does not.

```bash
# 1. Fetch: run scripts/roads.overpass and scripts/roads-extra.overpass at
#    https://overpass-api.de/api/interpreter, saving each result as JSON.
python3 scripts/build-road-data.py main-snapshot.json extra-snapshot.json

# 2. Derive what the site actually serves.
python3 scripts/build-derived-data.py
```

| Path | Stage | Notes |
| --- | --- | --- |
| `data/roads.full.geojson` | 1 | Full-precision archive. Outside `public/`, so it is never served. |
| `app/data/roads.json` | 1, 2 | Catalog. Stage 2 adds the `shape` statistics. |
| `public/data/roads.geojson` | 2 | Simplified overview geometry (~20% of the original point count). |
| `public/data/roads/<id>.geojson` | 2 | One road each, so a road page loads a few KB instead of the whole set. |
| `public/data/road-labels.geojson` | 1 | Label points for the overview map. |

Stage 2 always measures the full-precision archive, so re-running it is safe and
idempotent. See `docs/road-research.md` for sourcing and `/method` for the published
version of the same rules.

## Attribution

Road geometry and `maxspeed` tags © OpenStreetMap contributors, under the
[Open Database License](https://opendatacommons.org/licenses/odbl/1-0/).
Descriptions, difficulty ratings and corner counts are editorial. Posted signs always govern.
