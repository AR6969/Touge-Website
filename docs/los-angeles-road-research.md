# Los Angeles, Malibu, and Orange County driving roads

Implementation update, September 9, 2026: all 32 candidates below are now represented
by selected road traces in the LA map. The live collection also includes additional
LA-area roads. The tables below preserve the research-stage proposals; published
endpoints, descriptions and access notes are maintained in `scripts/la-roads.json`.
In particular, Topanga continues to Mulholland Drive, and Laguna Canyon reaches PCH
via Broadway Street. Some other traces cover shorter sections than initially proposed.

California Touge should begin its Southern California collection with three distinct groups: Malibu and the Santa Monica Mountains, the Angeles and San Gabriel Mountains, and Orange County. The strongest editorial starting points are Latigo, Piuma and Stunt in Malibu; the western Angeles Crest network and Glendora roads in the mountains; and Santiago, Live Oak and Ortega in Orange County. These combinations offer different scenery and road shapes, rather than filling the map with interchangeable canyon names. Recent local discussions support this selection, although forum popularity is not a representative vote or a measure of safety.[^1][^2][^3]

The shortlist contains **32 candidates**, of which **21 are proposed for the first release**, ten are secondary, and one is held for access verification. “First release” expresses editorial priority, not present readiness: geometry, directionality and access still need checks before publication. Proposed difficulty and character are editorial judgments, not measured scores. None of these draft entries is a live map feature yet.

## Scope and selection

The collection covers paved public roads suitable for a normal passenger car. “Los Angeles” functions as the regional navigation label; each road retains a more specific area. Western Malibu routes can cross into Ventura County, Carbon Canyon reaches San Bernardino County, and Ortega reaches Riverside County. These boundaries should be explicit on road pages without adding more top-level tabs.

Candidate selection weighs recurring local recommendations, distinctive scenery or road geometry, useful connections, and the ability to describe an unambiguous public-road segment. Motorcycle and cycling sources help establish names and connections; a bicycle itinerary does not establish legal car access. A road does not become a recommended through-route just because it appears in a forum loop. Recent discussion also describes congestion and commuter use on familiar roads, which argues for including a mix of short scenic drives and longer mountain trips rather than promising empty pavement.[^1][^4]

Evidence is assessed as of **September 9, 2026**. Current official conditions take precedence over older accounts. Municipal codes and adopted traffic orders establish documented limits only within their stated boundaries. Older maps remain useful for geography, but do not prove that a gate is open today. Search-index excerpts are explicitly distinguished from accessible full documents in the source inventory.

The existing categories should remain unchanged: difficulty **1 = Relaxed**, **2 = Winding**, **3 = Demanding**. Character remains **Technical**, **Low speed**, **Medium speed**, or **High speed**. “High speed” describes comparatively open highway character; it is not a suggested driving speed. A demanding road can have a low posted limit. Draft assignments below should be checked against the eventual selected trace, especially when a road changes character between its residential and mountain sections.

## Malibu and the Santa Monica Mountains

This is the best place to establish the visual identity of the LA map. Latigo, Piuma and Stunt provide a recognizable canyon network; Decker and Encinal extend the selection westward; PCH anchors it to the coast. Owner discussions and local route guides repeatedly identify this group, but their descriptions are often historical and should not be republished as current surface or traffic guarantees.[^5][^6][^7]

Keep connectors visible without giving every connector equal editorial prominence. Schueren is especially important because Stunt and Piuma need an intervening connection. Malibu Canyon and Kanan Dume help explain how canyon roads meet the coast and inland network. Old Topanga and Tuna add variety, but their access and direction details deserve more attention before launch than an ordinary two-way road.[^6][^8][^9]

The table defines proposed trace boundaries. These are mapping specifications to validate, not completed navigation instructions. Speed details appear separately below so an incomplete numeric claim is not mistaken for a whole-road limit.

| ID | Road | Proposed segment | Difficulty | Character | Priority | Editorial appeal and mapping requirement | Sources |
| --- | --- | --- | --- | --- | --- | --- | --- |
| latigo-canyon | Latigo Canyon Road | PCH to Kanan Dume Road | 3 | Technical | First | Tight canyon candidate with a useful coast-to-ridge connection; separate city and county speed evidence. | [^5][^6][^10][^11] |
| piuma-road | Piuma Road | Malibu Canyon Road to Rambla Pacifico Road | 3 | Technical | First | Elevated winding-road candidate; connect Stunt through the actual Schueren junctions, and verify the selected eastern endpoint. | [^5][^8][^12] |
| stunt-road | Stunt Road | Mulholland Highway to Schueren Road | 3 | Technical | First | Short mountain link suited to a Piuma guide; do not draw a direct Stunt–Piuma intersection. | [^6][^8] |
| schueren-saddle-peak | Schueren / Saddle Peak connector | Schueren from Stunt through the Piuma connection; optional Saddle Peak branch toward Tuna | 3 | Technical | First | Connects otherwise misleading route descriptions; distinguish the two named roads and confirm each legal junction before tracing. | [^8][^9] |
| decker-canyon | Decker Road · SR 23 | PCH to Mulholland Highway | 3 | Technical | First | Western canyon candidate; do not merge the entire inland SR 23 corridor into the coastal climb. | [^5][^13] |
| encinal-canyon | Encinal Canyon Road | PCH to Mulholland Highway | 2 | Medium speed | First | Complementary western canyon connection; the city code covers only the lower municipal section. | [^6][^10] |
| mulholland-highway-malibu | Mulholland Highway · Malibu mountains | Select paved sections between Decker Road and Stunt Road; identify The Snake separately | 2 | Medium speed | First | Backbone connecting several canyon choices; isolate The Snake for its own access and character review. | [^6][^11][^14] |
| yerba-buena-little-sycamore | Yerba Buena / Little Sycamore | PCH to Mulholland Highway via the named-road transition | 3 | Technical | Secondary | Western extension crossing the LA/Ventura area; preserve the name change instead of silently routing onto a park trail. | [^1][^15] |
| topanga-canyon | Topanga Canyon Boulevard · SR 27 | PCH to the Mulholland Highway junction | 2 | Medium speed | Secondary | Useful canyon and village corridor, with active repair constraints; keep a construction note attached to affected sections. | [^16][^17] |
| old-topanga-canyon | Old Topanga Canyon Road | Topanga Canyon Boulevard to Mulholland Highway | 3 | Technical | Secondary | Smaller-road alternative within the eastern network; verify residential access and current county restrictions. | [^6][^9] |
| tuna-canyon | Tuna Canyon Road | Saddle Peak Road to PCH, subject to verified direction boundaries | 3 | Technical | Secondary | Distinctive coastward option; lower road is one-way southbound, while the northern portion includes two-way access. | [^9][^18] |
| las-flores-canyon | Las Flores Canyon Road | PCH toward Rambla Pacifico / Schueren, with exact public connection to be verified | 3 | Technical | Secondary | Potential eastern climb; do not let routing choose an unverified gated Rambla Pacifico alternative. | [^9][^10] |
| malibu-canyon-las-virgenes | Malibu Canyon / Las Virgenes | PCH to US 101 along the named-road transition | 2 | Medium speed | First | Practical canyon connector with a clear coast-to-inland role; keep the Malibu city speed section distinct. | [^5][^6][^10] |
| kanan-dume | Kanan Dume Road | PCH to Mulholland Highway | 2 | Medium speed | Secondary | Useful link between western canyons; separate this segment from the longer Kanan Road corridor inland. | [^6][^10] |
| pch-malibu | Pacific Coast Highway · Malibu | Topanga Canyon Boulevard to the Yerba Buena Road area | 1 | Medium speed | First | Scenic coastal backbone; its access points, traffic and changing sections justify a different character from the Bay Area coastal entry. | [^5][^17][^19] |

Mulholland requires particular care. A March 2026 county meeting transcript acknowledges The Snake’s reopening; older guides that still describe a continuous closure beginning in 2019 are not current access evidence. That historical reopening also does not establish its status on a future visit. Separately, urban Mulholland Drive must not be joined to the western canyon network through “Dirt Mulholland” as though it were a continuous paved car route.[^14][^20]

## Angeles and the San Gabriel Mountains

The mountain collection should initially emphasize a bounded western Angeles Crest route and its connecting roads, rather than the familiar but presently misleading full La Cañada–Wrightwood crossing. Angeles Forest, Big Tujunga and Upper Big Tujunga provide a coherent network to investigate. Mount Wilson adds a destination-oriented spur, while Glendora Mountain and Glendora Ridge supply a separate eastern cluster.[^1][^21][^22]

Glendora Mountain Road and Glendora Ridge Road should be separate records with distinct names and endpoints. Combining them into one vaguely named road makes searches less useful and obscures closures. Mount Baldy Road is a third route, with a lower approach, village area and upper continuation that should not inherit one undifferentiated speed or difficulty claim.[^23]

| ID | Road | Proposed segment | Difficulty | Character | Priority | Editorial appeal and mapping requirement | Sources |
| --- | --- | --- | --- | --- | --- | --- | --- |
| angeles-crest-west | Angeles Crest Highway · western SR 2 | La Cañada Flintridge to Upper Big Tujunga Canyon Road junction | 2 | Medium speed | First | Flagship mountain approach; this deliberately bounded candidate avoids claiming a through-route to Wrightwood. | [^1][^21][^24] |
| angeles-forest | Angeles Forest Highway · N3 | Clear Creek / SR 2 to Upper Big Tujunga Canyon Road junction initially | 2 | Medium speed | First | Core connection for a compact mountain circuit; a northern extension toward Vincent can follow later. | [^21][^22] |
| big-tujunga | Big Tujunga Canyon Road | Los Angeles city boundary to Angeles Forest Highway | 2 | Medium speed | First | Alternative mountain approach with a specifically documented county speed section. | [^1][^23] |
| upper-big-tujunga | Upper Big Tujunga Canyon Road | Angeles Forest Highway to Angeles Crest Highway | 2 | Medium speed | First | Important paved connector; verify routing stays on this road throughout. | [^1][^21][^22] |
| little-tujunga | Little Tujunga Canyon Road | Southern approach through Bear Divide toward Sand Canyon Road | 3 | Technical | Hold | Worth retaining as a candidate, but recent reports of northern access problems prevent a confident through-route recommendation. | [^1][^25] |
| glendora-mountain | Glendora Mountain Road · GMR | Glendora approach to East Fork Road, via the Glendora Ridge junction | 3 | Technical | First | Main technical-road candidate in the eastern cluster; verify both endpoint gates and any intermediate restriction. | [^1][^26] |
| glendora-ridge | Glendora Ridge Road · GRR | Glendora Mountain Road to Mount Baldy Road | 3 | Technical | First | Ridge connection with a separate identity from GMR; current vehicle access needs a county check. | [^1][^26] |
| mount-baldy-road | Mount Baldy Road | Claremont boundary to Glendora Ridge Road; upper continuation kept separate | 2 | Medium speed | First | Useful approach and return for the Glendora cluster; documented lower-road speed sections do not cover the ski-area ascent. | [^23] |
| mount-wilson-red-box | Mount Wilson Red Box Road | Red Box / SR 2 to Mount Wilson Observatory access | 3 | Technical | Secondary | Destination spur for a shorter mountain itinerary; verify gate access and visitor parking requirements. | [^1][^27] |
| san-gabriel-canyon | San Gabriel Canyon Road · SR 39 | Azusa to the Crystal Lake Road junction area | 2 | Medium speed | Secondary | Canyon out-and-back candidate; never represent the closed northern connection to SR 2 as a usable loop. | [^28] |

The available Caltrans SR 2 report, stamped September 9, 2026 at 10:48 a.m., lists two consecutive closure sections: from 3.3 miles east of Newcomb’s Ranch to Islip Saddle, and from Islip Saddle to Vincent Gulch, 5.4 miles west of Big Pines. The report therefore rules out the full through-drive, not every western approach. The SR 39 report, stamped September 8 at 6:16 p.m., places its northern closure between two miles north of Crystal Lake Road and SR 2.[^24][^28]

Recent Glendora discussion concerns a holiday vehicle closure. A stated reopening time is not evidence that gates actually reopened. Likewise, February–April reports about Little Tujunga are useful reasons to investigate, but are too old and unofficial to label its current southern or northern access conclusively. Current county closure information remains a publication prerequisite for these roads.[^25][^26][^29]

## Orange County

Orange County deserves its own subregion within LA rather than a handful of distant pins with no context. Santiago and the paved Live Oak–Trabuco corridor provide the strongest compact starting combination. Ortega offers a substantially different mountain crossing, while Carbon Canyon serves northern OC. A coastal option broadens the collection beyond technical roads and helps visitors looking for scenery.[^2][^3][^30]

The attraction of these routes is not an assurance of light traffic. Community discussions identify Santiago and Ortega both as enjoyable drives and as working commuter corridors. Silverado is a secondary village-oriented spur, rather than a substitute for the main canyon network. Avoid presenting every forest road beyond the village as suitable for an ordinary road car.[^4][^31]

| ID | Road | Proposed segment | Difficulty | Character | Priority | Editorial appeal and mapping requirement | Sources |
| --- | --- | --- | --- | --- | --- | --- | --- |
| santiago-canyon | Santiago Canyon Road | Jamboree / Chapman transition to Live Oak Canyon Road | 2 | High speed | First | Main inland OC candidate with relatively open-road character; keep the southern junction’s speed evidence separate. | [^2][^3][^32] |
| live-oak-trabuco | Live Oak / Trabuco Canyon | Santiago Canyon Road via Live Oak and paved Trabuco Canyon Road toward Plano Trabuco Road | 2 | Low speed | First | Shaded, smaller-scale contrast to Santiago; preserve the paved county-road corridor rather than a similarly named forest branch. | [^2][^3][^33] |
| ortega-highway | Ortega Highway · SR 74 | San Juan Capistrano to Grand Avenue / Lake Elsinore | 3 | Technical | First | Main longer OC mountain candidate; identify the Riverside County portion and construction constraints. | [^2][^3][^34] |
| carbon-canyon | Carbon Canyon Road · SR 142 | Brea’s Valencia Avenue area to Chino Hills Parkway | 2 | Medium speed | First | Short northern OC option; distinguish it from Carbon Canyon Road in Malibu. | [^30][^31] |
| laguna-canyon | Laguna Canyon Road · SR 133 | I-405 approach to PCH in Laguna Beach | 1 | Medium speed | Secondary | Scenic access corridor candidate, with lower launch priority than the inland canyon pair; validate its exact scenic subsection. | [^31] |
| pch-orange-county | Pacific Coast Highway · Orange County | Newport Beach to Dana Point via Laguna Beach | 1 | Low speed | First | Coastal sightseeing counterpart; urban sections and stops make it a different experience from a mountain loop. | [^2][^3] |
| silverado-canyon | Silverado Canyon Road | Santiago Canyon Road through Silverado to the verified end of the public paved town approach | 2 | Low speed | Secondary | Village and canyon spur; do not automatically extend onto Maple Springs or assume a paved through-connection. | [^31][^35] |

The current Airport Fire order applies to specific National Forest roads and an identified closure area. Its Exhibit B lists Long Canyon 6S05, Hot Springs Canyon 6S10, Trabuco Canyon 6S13 and Holy Jim 6S14. The order is effective May 27, 2026 through May 26, 2027 and supersedes an earlier order. Forest Road 6S13 must not be confused with the paved county Trabuco Canyon corridor in the proposed guide; the order also should not be interpreted as a blanket closure of Ortega Highway. Maple Springs is absent from that current enumerated list, which by itself proves neither unrestricted access nor normal-car suitability.[^35]

## Speed summaries and access evidence

Use short visitor-facing speed summaries only where the underlying evidence supports the selected section. The Bay Area summary style can stay, but no LA road should receive a guessed average to fill an empty field. Unknown values should remain null in research data and become “Varies” if a road is otherwise ready to publish. Advisory corner speeds, forum driving speeds and routing estimates do not establish posted limits.

| Road | Documented evidence | Publication implication |
| --- | --- | --- |
| Latigo | Malibu’s current online code specifies 30 mph between PCH and the northern city limit. A 2019 county order establishes 30 mph between Kanan Dume and the city boundary described in that order. | Strongest candidate for a simple 30 mph summary after matching both jurisdictions to the trace.[^10][^11] |
| Encinal | Malibu code: 40 mph, PCH to northern city limit. | 40 mph applies to the documented city section; do not silently extend it to Mulholland.[^10] |
| Kanan Dume | Malibu code: 45 mph within the specified city segment. | Verify the remaining selected section independently.[^10] |
| Malibu Canyon | Malibu code: 40 mph, PCH to northern city limit. | Does not establish a single limit for the Las Virgenes continuation.[^10] |
| Las Flores | Malibu code includes the city portion among 25 mph roads. | Applies to that portion, not an inferred limit for the complete mountain climb.[^10] |
| Mulholland Highway | A 2019 county order lists 40 mph from Westlake Boulevard to Encinal and 45 mph from Encinal to Stunt. | Historical, bounded evidence; check subsequent changes and The Snake separately before publishing.[^11] |
| Big Tujunga | August 2025 county order: 45 mph between the LA city boundary and Angeles Forest Highway. | A useful source aligned with the proposed candidate segment.[^23] |
| Mount Baldy | Same order: 35 mph from Glendora Ridge to Mountain Avenue; 45 mph from Mountain Avenue to the defined Claremont boundary. | A scoped 35–45 mph guide may fit the lower road; upper mountain sections need separate evidence.[^23] |
| Santiago | A March 2024 county study describes 55 mph for surveyed corridor sections and 50 mph at the Live Oak junction; another section of the report assumes 55 mph at the junction. | Internal inconsistency and age require a current boundary/sign check; do not call the whole road uniformly 55.[^32] |
| Other candidates | No sufficiently current, segment-matched posted-limit source established here. | Leave the numeric summary unverified; do not borrow a similarly named road’s code. |

Topanga illustrates why construction information needs its own field. The more recent Caltrans repair page says overnight access was restored May 12, 2026, superseding March announcements of nightly closure. It also identifies a temporary 15 mph work zone at post miles 2.5–2.8. That temporary restriction is not a normal limit for the full canyon. A separate paving project begun in June anticipates work into summer 2027.[^16][^17]

The retrieved SR 23 condition report carries a September 7, 2026 timestamp and reports no restrictions. It is a dated highway snapshot, not proof that every adjoining county canyon is open. For Ortega, the September 9 SR 74 report lists overnight one-way traffic control in the Riverside-side segment, from 5.7 to 11.8 miles east of the county line at Grand Avenue, Tuesday–Saturday through September 12. These temporary details should be refreshed before a guide recommends a departure time.[^13][^34]

County road access is the largest unresolved evidence gap. The LA County closure page was inaccessible to direct retrieval, and the Angeles National Forest alert index also could not be read. Accordingly, no first-release county candidate has been marked “open.” Municipal announcements, search snippets and old ride reports cannot close that gap. An eventual page should link visitors to the responsible authority and show the date of any checked status.[^29]

## Driving guides to build from the collection

These are proposed itinerary structures, not verified turn-by-turn routes. They should receive actual road traces, junction checks and current access checks before mileage, timing or a navigation link is published. Distances cannot be borrowed from bicycle trips or inferred from a few map points.

**Malibu canyon and coast circuit.** Start on PCH near Latigo, climb Latigo to Kanan Dume, connect to Mulholland, continue toward Stunt, then use Schueren and Piuma to reach Malibu Canyon and return to PCH. This combines the main eastern canyon candidates in one understandable guide. Its value would be an accurate map showing every connector and a clearly identified starting point; the exact legal turn sequence remains to be checked against geometry.[^6][^8]

**Western Malibu canyon drive.** Pair Decker and Encinal using their verified Mulholland connection and a coastal return on PCH. Keep Yerba Buena/Little Sycamore as a later extension. This provides a second Malibu guide with different endpoints rather than rewriting the same Latigo itinerary under a new title.[^6][^15]

**Western Angeles mountain circuit.** From La Cañada, follow SR 2 to Clear Creek, Angeles Forest to Upper Big Tujunga, and Upper Big Tujunga back to SR 2. Return on the western highway section after checking all three roads. This established connection structure avoids the closed middle of the full Angeles Crest crossing, but the old route map supporting the connections is not evidence of current openness.[^21][^24]

**Glendora ridge drive.** Use the Glendora approach to GMR, turn onto GRR and reach Mount Baldy Road. A return using lower Mount Baldy Road and the ordinary street network is a different proposition from continuing toward ski-area roads. Gate checks are essential before deciding whether this is a circuit, an out-and-back or temporarily unavailable.[^1][^23][^26]

**Orange County oak-and-canyon drive.** Begin with Santiago, turn onto Live Oak at the Cook’s Corner junction, and follow the verified paved Trabuco corridor toward Rancho Santa Margarita. Offer a straightforward return or a clearly mapped urban connection; do not invent an all-canyon loop. Ortega warrants its own longer crossing or out-and-back guide rather than being attached as an unexplained short detour.[^2][^3]

Stop information should be researched as a separate, small layer. Mount Wilson is a credible destination because the observatory publishes visitor access and parking information; its page contains differing seasonal hours, so hours need confirmation before copying. Rock Store, Neptune’s Net and Cook’s Corner are sensible next stop candidates to verify individually. A named location on a highway report, including Newcomb’s Ranch, does not establish that its restaurant is operating.[^27]

## Website and search recommendations

Keep **Bay Area** and **Los Angeles** as the top-level map choices. Within LA, offer Malibu / Santa Monica Mountains, Angeles / San Gabriel Mountains, and Orange County as regional navigation in the existing design. The current clean map does not need a paragraph of research, a permanent closure dashboard or additional filter groups. Preserve the simple road search and OR behavior for selected character filters.

A small set of substantive pages would give this collection useful search entry points: “Best driving roads in Los Angeles,” “Malibu canyon driving loop,” “Angeles Crest alternatives and current route options,” and “Orange County scenic drives: Santiago, Live Oak and Ortega.” These are proposed topics based on the road collection and recurring questions, not verified keyword-volume findings. No traffic forecast, search-volume estimate or ranking guarantee is supported by this research.

Each guide should answer concrete questions that generic lists leave open: where the mapped road starts and ends, whether it is a loop, which direction a one-way section runs, what connects two canyons, and which restrictions affect the proposed trip. Short road descriptions can stay on selection cards; full context and source links belong on road and guide pages. Search aliases should include ACH, GMR, GRR, Big Tujunga, PCH and familiar highway numbers without combining distinct road records.

The first implementation pass should add regional support to the existing data pipeline, acquire actual road geometry, verify junctions and direction restrictions, and then apply the draft editorial fields. Existing measured shape statistics and the dormant Touge Score should continue to come from the established pipeline. Do not create placeholder line segments, copy Bay Area lengths or scores, or put research-only candidates into the live catalog before they have real traces.

The accompanying JSON is a research handoff: every entry is unpublished, its geometry is pending, and its sources reference this report. First-release priorities can proceed through verification first; unresolved entries can remain outside the live map. After traces and access checks, the next useful deliverable is an operational LA region with a small number of complete guides, rather than a large catalog of incomplete pages.

## Sources

All sources were reviewed or their accessible indexed excerpts examined September 9, 2026. Document dates below are publication, adoption or stated report dates where established, not search-engine crawl dates. Dynamic conditions may have changed since their displayed timestamps. Numbered references identify the evidence attached to each claim; editorial ratings and priorities are independent judgments.

[^1]: Reddit, r/Touge. [“Attention all who live in and around Los Angeles”](https://www.reddit.com/r/Touge/comments/1rfuxan/attention_all_who_live_in_and_around_los_angeles/), February 27, 2026 and subsequent comments. Community discovery and conflicting firsthand reports; not a source of legal limits or verified present access.
[^2]: Reddit, r/orangecounty. [“Best Saturday drives”](https://www.reddit.com/r/orangecounty/comments/1vpbasa/best_saturday_drives/), August 15, 2026. Local recommendations for Santiago, Live Oak, Ortega and coastal outings.
[^3]: Reddit, r/orangecounty. [Driving-road discussion](https://www.reddit.com/r/orangecounty/comments/1e14d51/), July 12, 2024. Named connections in the Santiago–Live Oak–Trabuco corridor and Ortega recommendations.
[^4]: Reddit, r/orangecounty. [Local driving-road discussion](https://www.reddit.com/r/orangecounty/comments/1987ha9/), January 2024. Counterevidence concerning commuter traffic and road expectations.
[^5]: Rennlist. [“Question for CA members”](https://rennlist.com/forums/997-forum/1210294-question-for-ca-members.html), date not independently established. Indexed excerpts identify canyon preferences; full-page retrieval returned 403. Used only for discovery and attributed owner opinion.
[^6]: Helen’s Cycles. [“Our favorite rides and routes”](https://www.helenscycles.com/events/our-favorite-rides-and-routes-pg1456.htm), undated. Indexed route descriptions identify Latigo, Kanan, Encinal, Mulholland, Topanga, Stunt and Piuma connections. Direct retrieval unavailable; cycling connections require separate motor-vehicle validation.
[^7]: Rennlist. [“7 best roads in California to drive your Porsche”](https://rennlist.com/how-tos/slideshows/7-best-roads-in-california-to-drive-your-porsche-436786), historical editorial guide; publication date not independently established. Discovery only; its inconsistent Glendora naming is not adopted.
[^8]: G35Driver. [“Official 9/11/04 Malibu cruise”](https://g35driver.com/forums/southern-california/32689-official-9-11-04-malibu-cruise.html), 2004. Historical route discussion explaining the Schueren connection between Stunt and Piuma; not current access evidence.
[^9]: Epic Road Rides. [“Eastern Santa Monica Mountains / Mulholland Highway East”](https://epicroadrides.com/cycling-usa/santa-monica-mountains-national-park/eastern-santa-monica-mountains-mulholland-hway-east/), undated in the reviewed material. Named-road network and cycling itinerary; not permission to drive every depicted connection.
[^10]: City of Malibu. [Municipal Code, Chapter 10.08, Speed Limits](https://ecode360.com/44334514), currently published online code, §10.08.030. Specific city-road limits; not a field survey or authority for county continuations.
[^11]: Los Angeles County Board of Supervisors / Public Works. [Traffic regulations, adopted April 30, 2019](https://file.lacounty.gov/SDSInter/bos/supdocs/134856.pdf). Latigo and bounded Mulholland speed sections; subsequent changes require checking.
[^12]: Greg Drevenstedt, Rider Magazine. [“Cortech Piuma Jacket”](https://ridermagazine.com/2011/09/14/cortech-piuma-jacket/), September 14, 2011. Historical direct description of the namesake road and its endpoints, not present pavement conditions.
[^13]: Caltrans. [SR 23 highway conditions](https://roads.dot.ca.gov/?roadnumber=23), displayed report September 7, 2026, 4:50 p.m. Dynamic state-highway restrictions only.
[^14]: Los Angeles County Board of Supervisors. [Meeting transcript, March 3, 2026](https://file.lacounty.gov/SDSInter/bos/sop/transcripts/1203313_030326.pdf), discussion around p. 211. Acknowledges The Snake’s reopening; not a same-day gate report.
[^15]: San Diego Reader. [“Visit the Grotto and its spooky rock formations…”](https://www.sandiegoreader.com/news/2005/apr/14/visit-grotto-and-its-spooky-rock-formations-circle/), April 14, 2005. Historical access directions identifying the Little Sycamore / Yerba Buena transition.
[^16]: Caltrans District 7. [SR 27 Topanga Canyon Palisades repairs](https://dot.ca.gov/caltrans-near-me/district-7/district-7-projects/sr27-topanga-canyon-palisades-repairs), project information updated June 2026. May 12 overnight reopening and localized work-zone constraints; supersedes earlier repair-stage hours.
[^17]: Caltrans District 7. [“SR-27 pavement rehabilitation in Topanga Canyon restarts June 15, 2026”](https://dot.ca.gov/caltrans-near-me/district-7/district-7-news/sr-27-pavement-rehabilitation-topanga-canyon-restarts-june-15-2026), June 1, 2026. Paving scope and anticipated schedule; not a live incident feed.
[^18]: City of Malibu. [Malibu Evacuation Plan](https://www.malibucity.org/DocumentCenter/View/34818), 2020. Tuna Canyon’s southbound one-way city portion and northern two-way context. Older speed statements are not substituted for the current municipal code.
[^19]: City of Malibu. [PCH safety](https://www.malibucity.org/pchsafety), current city information including an August 2026 update. Context for the coastal corridor; planned future program dates do not imply current enforcement status.
[^20]: National Park Service. [San Vicente Mountain](https://home.nps.gov/samo/planyourvisit/sanvicente.htm), undated visitor information. Identifies the unpaved Mulholland access context; supports excluding a presumed continuous paved cross-mountain drive.
[^21]: Angeles Crest Christian Camp. [Directions via Angeles Crest, Angeles Forest and Upper Big Tujunga](https://angelescrest.com/wp-content/uploads/2023/11/Map-directions-to-ACCC-8-Angeles-Crest-to-Angeles-Forest-to-Upper-Big-Tujunga.pdf), archived November 2023. Evidence of named-road connections, not current closure status.
[^22]: Gribblenation. [“Angeles Forest Highway (Los Angeles County Route N3)”](https://www.gribblenation.org/2023/09/angeles-forest-highway-los-angeles.html), September 2023. Independent road account identifying the broader corridor and junctions.
[^23]: Los Angeles County Board of Supervisors / Public Works. [Traffic regulations, adopted August 12, 2025](https://file.lacounty.gov/SDSInter/bos/supdocs/205649.pdf). Big Tujunga and Mount Baldy speed-section orders.
[^24]: Caltrans. [SR 2 highway conditions](https://roads.dot.ca.gov/?roadnumber=2), displayed report September 9, 2026, 10:48 a.m. Explicit middle-mountain closure boundaries; dynamic information.
[^25]: Reddit, r/socalbirding. [“Bear Divide is popping off”](https://www.reddit.com/r/socalbirding/comments/1sg9ii2/bear_divide_is_popping_off/), April 8, 2026. Reports about Sand Canyon and southern access; historical community evidence, not a current authority.
[^26]: Reddit, r/BikeLA. [“GMR closed to cars Labor Day”](https://www.reddit.com/r/BikeLA/comments/1w43b2m/gmr_closed_to_cars_labor_day/), September 1, 2026. Recent holiday closure discussion linking county information; bicycle access and scheduled reopening do not establish present vehicle access.
[^27]: Mount Wilson Observatory. [Visiting](https://www.mtwilson.edu/visiting/), current visitor page, undated. Access and parking information; differing hour statements on the page require confirmation before publication.
[^28]: Caltrans. [SR 39 highway conditions](https://roads.dot.ca.gov/?roadnumber=39), displayed report September 8, 2026, 6:16 p.m. Northern closure between the Crystal Lake area and SR 2; dynamic information.
[^29]: Los Angeles County Public Works. [Road closures](https://pw.lacounty.gov/roadclosures/), dynamic authority page. Direct retrieval blocked; linked as the required check, not cited as proof of any road being open. The [Angeles National Forest alert index](https://www.fs.usda.gov/r05/angeles/alerts) was also inaccessible; individual accessible documents are cited separately.
[^30]: Orange County Outdoors. [Carbon Canyon scenic drive](https://www.orangecountyoutdoors.com/get-out-there/scenic-drives/carbon-canyon), undated. Indexed discovery and general endpoints only; direct retrieval failed. No park-boundary or scenic-designation claim is adopted.
[^31]: Reddit, r/orangecounty. [Scenic-driving discussion](https://www.reddit.com/r/orangecounty/comments/14c1tx1/), June 2023. Secondary candidates and local discovery; not current access or speed evidence.
[^32]: Iteris for Orange County Public Works. [Master Plan of Arterial Highways Reclassification Study, Final Report](https://ocds.ocpublicworks.com/sites/ocpwocds/files/2025-02/Attachment%203%20-%20MPAH_Final%20Transportation%20Assessment%20Report%2024.03.22%20compressed.pdf), March 22, 2024. Speed descriptions at printed pp. 89, 92 and 96–104; the differing junction assumptions are preserved as an unresolved issue.
[^33]: Orange County Public Works. [Live Oak Canyon / Trabuco Canyon lane-striping notice](https://ocpublicworks.com/sites/ocpw/files/2023-07/Notification.Lane%20Striping.Live%20Oak%20Cyn%20Rd-Trabuco%20Cyn%20Rd%20%287-24-2023%29.pdf), July 24, 2023. Evidence of the paved county-road corridor; not present construction status.
[^34]: Caltrans. [SR 74 highway conditions](https://roads.dot.ca.gov/?roadnumber=74), displayed report September 9, 2026, 10:27 a.m. Riverside-side overnight control relevant to the Ortega candidate; unrelated SR 74 sections should not be attached to it.
[^35]: USDA Forest Service, Cleveland National Forest. [Order 02-26-09, Airport Fire closure](https://www.fs.usda.gov/sites/nfs/files/r05/cleveland/publication/alerts/02-26-09_AIRPORT%20FIRE%20CLOSURE%20ORDER_0526%20FINAL%20%28003%29.pdf), signed May 26, 2026, effective May 27, 2026–May 26, 2027. Current order and Exhibit B; earlier superseded orders are not used as current closure lists.
