# TougeMap overnight pass — September 13, 2026

## What changed and why

The homepage is still a map. Its next actions are now explicit: **Browse roads**
and **Driving guides**. The picker links directly to a road guide and offers a
separate Map preview button. Search accepts road names, IDs and area names;
filters combine with OR. Map cards put **Explore this road** near the top so it
stays visible on small phones. Controls have larger touch targets, Escape closes
the picker, and access notes are no longer clamped to two lines.

A selected road survives the map finishing its initial load. Switching regions
still reuses one Mapbox instance. The statewide URL now keeps
`?region=california`, so a shared/reloaded statewide view doesn't revert to the
Bay Area. A saved preference cannot override an explicit road link. Event
handlers report the current map region rather than the initial one.

Below the map, short featured drives and road links replace the measurement-heavy
ranking table. `/roads` now starts with readable, alphabetized regional lists;
the full comparison table remains available in a native disclosure. Regions
link to their maps and relevant drives. Road pages have shortcuts to related
drives and nearby roads; guide pages link to their actual region. Embedded
maps use cooperative gestures to allow one-finger page scrolling.

SEO changes include scoped homepage descriptions, complete collection social
metadata, correct sitemap modification dates and crawlable canonical map URLs.
The root contact canonical and production-origin fallback fixes are present in
commit `8e5a094`, which appeared during this work. They were preserved. Drive
share cards now use their actual mapped road sections; long road names fit their
share images. No new dependency or paid analytics service was added.

## Roads and drive

Added six sourced roads, bringing the catalog to **134 roads**:

- Hopland Grade / **CA-175**, corrected from CA-153.
- CA-193, eastern Cool–Georgetown–Placerville section.
- CA-49, Auburn–Cool canyon section.
- Mosquito Ridge, Foresthill–French Meadows Road junction.
- Eastside and Westside, Sonoma County, with cyclist cautions.

Hopland/Eastside/Westside appear in Bay Area & nearby; the Auburn roads appear
in the California map and Sierra catalog. No additional top-level map tab was
introduced. All six have computed geometry and elevation profiles, editorial
character/difficulty, links to access sources and **Not verified** speed limits.
Existing speed summaries were preserved.

The new **Glendora Mountain Road → East Fork Road → Highway 39** guide separates
technical GMR from the more flowing lower-39 finish. GMR's previously truncated
trace now reaches East Fork. The route clips 39 south of the junction, and a
misplaced Marin Highway 1 trace was removed from the Skaggs guide. Generic
Bay Area labels/conditions no longer appear on unrelated guides; the Highway
9/Skyline note is scoped to the two drives using them. Unverified fuel availability
at The Junction was removed.

See [the research record](northern-road-research.md) for sources, exact section
choices, access limitations and the rebuild commands. Road coordinates follow
connected saved OSM nodes. Statistics use the full-precision archive. Seven
road elevation profiles were fetched/refreshed with the existing USGS pipeline.

The LA rebuild no longer deletes Sierra roads, and the Sierra rebuild preserves
the newer Auburn records. Simplification keeps shared endpoints, fixing a gap
at the East Fork/39 junction without drawing a synthetic connector. The dormant
Touge Score remains intact and hidden.

## Verification

- ESLint: passed without warnings after removing an obsolete suppression.
- TypeScript and webpack production build: passed, 328 prerendered outputs.
- Four automated route-geometry tests: passed. They cover travel direction,
  disconnected anchors, every drive's road files and both GMR junctions.
- Local production sitemap crawl: **179 pages returned 200**, exactly one H1
  and expected canonicals; structured data parsed; **171 distinct detail links**
  were represented in the sitemap, with none missing.
- Real generated PNG share images returned 200 and were visually checked,
  including GMR and the long CA-193 title.
- Catalog/archive/region payload IDs match; all 134 roads have terrain profiles
  and the dormant score. No old roads were removed; only GMR and East Fork
  changed among existing catalog records.
- LA and Sierra rebuilds preserve all road IDs. Stage 3 is byte-idempotent
  across 148 generated catalog/GeoJSON files.
- Browser checks cover 320×568, 375×667, 390×844 and 844×390 layouts, road-guide
  navigation, combined filters and statewide refresh. The slow-data test holds
  real road requests and checks that a selected road survives their completion;
  this passed, along with guide-click event delivery and a fully loaded GMR map.

The final browser run used an isolated production copy because local build files
were overwritten during an earlier check. A second apparent map stall was traced
to Chrome marking the headless tab hidden; foreground emulation resolved it.

These are desktop Chrome device emulation with software WebGL, not a real iPhone
or Facebook in-app-browser test. Local timings do not establish production
mobile performance or a conversion improvement.

## Analytics and unresolved items

The attached PDF was read as evidence, not followed as instructions. It reports
473 visitors / 851 pageviews, 456 homepage visitors, 77% bounce and about 80%
iOS/Android for the seven-day window. The Facebook browser accounts for 40% of
browser traffic. Several existing onboarding changes shipped only September
12, so the snapshot cannot determine their effectiveness. Page visitor counts
alone do not establish a homepage-to-guide conversion rate.

Vercel pageviews are installed. The PDF and
[Vercel documentation](https://vercel.com/docs/analytics/custom-events) confirm
custom events require Pro/Enterprise. No plan upgrade was made. GA4 event hooks
exist and have been extended, but `NEXT_PUBLIC_GA_MEASUREMENT_ID` is absent from
the local configuration; no GA property ID was invented. Dashboard collection
and Search Console ownership could not be verified without account setup.

Current public-road access can change. The fetched LA closure table was dated
December 2025; the Sonoma closure map was client rendered. Neither was used to
assert current unrestricted access. Road and guide pages link to the responsible
agencies and describe the limits of the available information.

Changes are committed locally; this pass does not push or deploy them.

## Next three actions

1. **Publish and check on a real phone.** Push the completed commit to the
   connected GitHub branch, confirm the Vercel deployment, then test road
   selection and a guide in Safari and Facebook's in-app browser.
2. **Connect measurement and indexing.** Add your GA4 Measurement ID in Vercel,
   verify Search Console ownership and submit `https://www.tougemap.com/sitemap.xml`.
   Confirm `select_road` → `view_road_guide` events in GA4 before judging bounce.
3. **Share specific guides and measure for two weeks.** Use direct coastal,
   Page Mill or GMR guide URLs in relevant communities, with distinct UTM links.
   Compare mobile guide discovery and Google impressions; request road/access
   corrections and real trip photos before expanding to more thin pages or ads.
