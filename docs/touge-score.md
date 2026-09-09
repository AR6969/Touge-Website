# The Touge Score — built, then hidden

**Status: DORMANT.** The score is still computed for every road and stored in
`app/data/roads.json`. Nothing in the UI displays it. It was removed from the
site by the owner's decision, not because it was broken — do not delete it, and
do not rebuild it from scratch. Everything needed to switch it back on is below.

## What it is

A 0–100 score for how engaging a road is to drive, **per mile**. Three parts:

| Part | Weight | Measured as | Full marks at |
| --- | --- | --- | --- |
| Corners | 45 | Bends per mile | 14 per mile |
| Climb | 35 | Vertical change per mile | 500 ft per mile |
| Technical | 20 | Editorial difficulty rating | Difficulty 3/3 |

Each part is scored against its anchor, capped at 1.0, weighted, and summed.
The constants live in `scripts/score.py` and are the single source of truth.

## Where everything is

| Path | Role | Still active? |
| --- | --- | --- |
| `scripts/score.py` | The algorithm and its constants | Yes — runs every build |
| `scripts/build-derived-data.py` | Calls `touge_score()`, writes results | Yes |
| `app/data/roads.json` | `score: {score, corners, climb, technical}` per road | Yes — populated |
| `app/data/score-config.json` | Weights/anchors exported for the UI to quote | Yes — generated |
| `app/lib/roads.ts` | `byScore`, `scoreRank()` | Exported, currently unused |

## Why these three inputs

They are close to independent, which is the only reason combining them adds
information. This was measured, not assumed:

- **Corner density vs. turning per mile: ρ = 0.99.** They are the same
  measurement twice. Only one is used. A score built from corner geometry alone
  would have been the existing "curviest" ranking with extra arithmetic.
- **Elevation** is the dimension corner geometry cannot see — it separates a
  mountain climb from a flat squiggle of identical curvature.
- **Editorial difficulty vs. the measured parts: ρ = 0.44.** Genuinely
  independent; it carries information about width and sightlines that nothing
  here measures.

Two candidates were tested and **rejected** — do not reintroduce them without
new evidence:

- **Rhythm** (how often corners alternate direction) spans only 0.65–0.90 across
  all 40 roads. It does not discriminate.
- **Corner variety** (spread of corner magnitudes) peaks on roads with three or
  four bends. It is a small-sample artifact that rewards the dullest roads.

## Design rules that must not be broken

1. **Anchors are absolute, never percentile.** If anchors were relative to the
   collection, every road's score would shift whenever a road was added, and any
   number published elsewhere would silently go stale. Adding Los Angeles roads
   must leave existing scores untouched.
2. **The score is per mile and ignores length on purpose.** A short intense
   climb can outrank a long one. Mixing "how good is this road" with "how much of
   it is there" would make one number mean two things. If length is ever added,
   it is a product decision, not a bug fix.
3. **It is not a safety rating.** It describes shape and terrain. A high score
   often means a road demanding *more* care. Any UI must say so.
4. **If it is shown publicly, the formula is published too.** The original
   `/method` page carried the weights, the anchors, the rejected candidates and
   the caveats. A score nobody can check contradicts the sourcing standards the
   rest of this site is built on.

## How to switch it back on

The data is already there, so this is UI work only. No refetching, no rebuild of
the elevation cache.

1. **Ship it to the map component** — in `app/lib/roads.ts`, add `score: number`
   to `RoadSummary` and `score: road.score.score` to `toSummary()`.
2. **Road pages** — `app/roads/[slug]/page.tsx`: add a section rendering
   `road.score.score` with the three parts from `road.score`, and
   `scoreRank(road)` for its rank. CSS classes `.score-block`, `.score-value`,
   `.score-parts`, `.part-label`, `.part-bar`, `.part-score` are still in
   `app/globals.css`.
3. **Roads table** — `app/roads/page.tsx`: import `byScore` instead of
   `curviest`, add a `<th>Score</th>` column with
   `<td className="figure score-cell">`.
4. **`/method`** — `app/method/page.tsx`: restore a `<section id="score">`.
   Import `app/data/score-config.json` and quote it rather than retyping the
   numbers, so the page cannot drift from the algorithm.
5. **Share cards** — `app/roads/[slug]/opengraph-image.tsx`: add
   `["TOUGE SCORE", String(road.score.score)]` to `stats`.

Full prior implementation, including the removal diff, is in git history:

```bash
git log --oneline --all -- scripts/score.py
git show 1701c59          # the commit that added the score
```

## Changing the weights

Edit `scripts/score.py`, then re-run:

```bash
python3 scripts/build-derived-data.py
```

That recomputes every score and regenerates `app/data/score-config.json`. It does
**not** need the Overpass snapshots or the elevation API — both are cached.
