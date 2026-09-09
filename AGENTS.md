<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# California Touge — project rules

Everything above this line is managed by `next dev`. Everything below is ours.

## Dormant feature: the Touge Score

**Do not delete `scripts/score.py`, the `score` field in `app/data/roads.json`,
or `app/data/score-config.json`. Do not rebuild a road-scoring algorithm from
scratch.**

A 0–100 road score already exists and is computed on every build. It is
deliberately hidden from the UI — removed by the owner's choice, not because it
failed. If you are asked to add a road score, ranking or rating, read
[`docs/touge-score.md`](docs/touge-score.md) first: it has the algorithm, the
correlation evidence behind each input, two designs that were tested and
rejected, and step-by-step instructions to switch it back on. Re-enabling is UI
work only — the data is already in the catalog.

## Data pipeline

Generated files must not be hand-edited except as a stopgap; `scripts/` is the
source of truth. Three stages, documented in [`README.md`](README.md):

1. `build-road-data.py` — needs Overpass snapshots. Writes `data/roads.full.geojson`.
2. `fetch-elevation.py` — cached in `data/elevation.json`. Only fetches what is missing.
3. `build-derived-data.py` — needs neither. Regenerates everything the site serves.

Stage 3 always measures the full-precision archive, so re-running it is safe.
If you change an editorial field (difficulty, character, description), update
**both** `scripts/build-road-data.py` and `app/data/roads.json`, plus the
`character`/`difficulty` copies in `data/roads.full.geojson` and
`public/data/road-labels.geojson`, then re-run stage 3.

## Standards this project holds itself to

- **Never invent a speed limit.** Not by averaging tags, inferring from road
  shape, reading a routing duration, or quoting a driver. Absent evidence, say so.
- **Measurements are not safety ratings.** Corner counts, gradients and scores
  describe shape and terrain. Never present them as advice about speed.
- **Cite the source.** Published claims link to the document they came from,
  scoped to the section that document actually covers.
- **Publish the method.** `/method` explains how every number is derived,
  including what was rejected. See [`docs/road-research.md`](docs/road-research.md).
