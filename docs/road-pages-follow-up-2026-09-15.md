# Requested road-page follow-up — September 15, 2026

## Editorial changes

- `/roads/highway-9-front`: explicitly names the front side in its heading and search title.
- `/roads/highway-9-back`: new title, description, planning notes and links to the front side, Skyline, Highway 236 and Bear Creek.
- `/roads/grizzly`: new search metadata, Bay-view/Tilden planning notes and a connection to Oakland's Skyline Boulevard, distinguished from Peninsula Highway 35.
- `/roads/the-snake`: new search metadata and planning notes, plus the route correction below.
- `/roads/page-mill` and `/roads/skyline`: Alice's food and meetup recommendations.
- `/roads/pescadero`: adds downtown's small-town character and coffee stop.
- Alice's map landmark and the Alice's stop on both `/drives/page-mill-skyline-alices-driving-route` and `/drives/highway-9-skyline-pescadero-coastal-drive`: car and motorcycle enthusiast gathering spot, especially Saturday/Sunday mornings; great food and a dessert recommendation.

The weekend/dessert recommendations are the site owner's editorial contribution, not a claim about a scheduled event or an invented third-party review. [Alice's official site](https://alicesrestaurant.com/) verifies its location, food service, homemade pie and enthusiast setting. No hours or specific dessert availability are promised.

[Caltrans SR 9](https://roads.dot.ca.gov/?roadnumber=9) supplies the back-side access-check link. [Tilden's official park page](https://www.ebparks.org/parks/tilden) supports the park entrances and seasonal South Park Drive closure. Road measurements and limits outside the Snake correction are retained.

## Snake geometry correction

The old page labeled Cornell Road–Las Virgenes Road as the Snake, east of the actual corridor. [LA County's project page](https://pw.lacounty.gov/tpp/mulholland-hwy/) and its [corridor report](https://pw.lacounty.gov/tpp/mulholland-hwy/docs/Mulholland-Hwy-Board-Motion-Report.pdf) identify the Kanan Road–Sierra Creek Road corridor.

The correction follows exact OpenStreetMap nodes, including the ways named **Mulholland Highway (The Snake)** that the old name selection omitted. The new `data/snake-osm.json` is a filtered response from the OSM map API; its source URL and retrieval date are recorded inside. The original regional snapshot is preserved. The new snapshot uses a retrieval date, not an invented Overpass database timestamp.

- Western junction: OSM node `122878004`, Kanan Road / Kanan Dume Road / Mulholland Highway.
- Eastern junction: OSM node `122635481`, Sierra Creek Road / Mulholland Highway.
- Both anchors must snap within one metre and share nodes with their named junction roads.
- `scripts/la-roads.json` and `scripts/la-anchor-plan.json` preserve the selection. A per-road `snapshot` override in the existing tracer permits a focused refresh without replacing the regional archive.
- `python3 scripts/build-la-road-data.py --only the-snake` preserves every other catalog entry and its order. The regular full-region builder remains supported.
- The elevation cache is refreshed for this road, then stage 3 regenerates measurements, map traces, labels and the existing dormant score.
- No posted speed is invented. The existing unverified speed value remains. Historical OSM closure notes are not treated as current access information; the page links the county's live notices.

## Verification

Passed: rendered SEO checks for 16 priority pages, 205 internal links/anchors and 182 sitemap destinations; the corrected trace's exact named junction nodes and single connected line; matching elevation sample count; all four existing drive-geometry tests; lint; and the production build (333 static outputs). The focused rebuild changed only the Snake catalog record.

The shared workspace received concurrent Claude commits `f9c4c7d` and `1274af9` during this work. Those commits already captured the requested page copy and geometry. This follow-up preserves them and completes the refreshed elevation data, explicit Sierra Creek junction check and independently dated source provenance.
