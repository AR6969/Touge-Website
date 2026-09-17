import { mapRegions, type MapRegion } from "./map-regions";
import { regions, roads } from "./roads";

// These are navigation groups, not new map tabs. Sierra roads deliberately stay
// inside the statewide map while remaining easy to find in the written catalog.
const groupOrder: MapRegion[] = ["bay-area", "los-angeles", "san-diego", "sierra", "southern-appalachians", "colorado"];

export const roadGroups = groupOrder.map(id => ({
  id,
  name: id === "bay-area" ? "Bay Area & nearby" : mapRegions[id].name,
  mapName: id === "sierra" ? "California" : mapRegions[id].name,
  mapHref: mapRegions[id].href,
  roads: roads.filter(road => (road.mapRegion ?? "bay-area") === id),
  areas: regions.filter(region => region.roads.some(road => (road.mapRegion ?? "bay-area") === id)),
})).filter(group => group.roads.length > 0);

// Short editorial introductions help readers choose within a region. Specific
// road descriptions, mapped section boundaries and sources stay on road pages.
export const regionIntroductions: Record<string, string> = {
  "auburn-sierra-foothills": "Highway 49 connects Auburn to Cool through the American River canyon. From Cool, the eastern section of Highway 193 heads through Georgetown toward Placerville. Mosquito Ridge is a separate, longer mountain drive out of Foresthill; check its forest access notes before planning that detour.",
  "mendocino-lake-county": "Hopland Grade is on Highway 175 between Hopland and the Lakeport side of the mountains. Its page covers the crossing from US 101 to Highway 29, including the tighter grade and the approaches at either end.",
  "sonoma-north-bay": "Eastside and Westside follow different sides of the Russian River Valley near Healdsburg. They are well-used cycling roads: expect bikes around the bends. Check the road and bridge notices before treating Wohler Road as a connection between them.",
  peninsula: "Skyline is the starting point for many Peninsula drives. Compare Page Mill and West Alpine for a more technical climb, or follow the Pescadero and La Honda road pages to plan a coastward drive. The guides below connect selected roads into a route with explicit turns and stops.",
  "santa-cruz-mountains": "Highway 9 has separate front-side and back-side pages, so you can see which section you are choosing. Empire Grade, Bear Creek and the smaller forest roads offer other ways into these mountains. Compare the mapped sections before combining them into a drive.",
  "east-bay": "The East Bay collection ranges from the wooded roads around Redwood and Pinehurst to the longer Mines Road drive out of Livermore. Choose a road for its setting and character, then use its map and nearby-road links to plan the next section.",
  "south-bay": "Mount Hamilton and Mount Umunhum are summit drives; Uvas and McKean offer a different route through the South Bay hills. Each page shows the section we have mapped, so a climb to a destination is easy to distinguish from a road you can use to continue a longer drive.",
  marin: "Start with Panoramic Highway and Ridgecrest for the Mount Tamalpais roads, or look at Lucas Valley, Nicasio and the Petaluma roads for a West Marin drive. The guides below explain the connecting roads and return options.",
  "malibu-santa-monica-mountains": "Compare Latigo, Piuma and Stunt for winding canyon roads, or look at Pacific Coast Highway for the coastal section. Tuna Canyon is the tightest of the ridge-to-coast drops, and it's permanently one-way toward PCH. Mulholland Highway and its Snake section have separate pages; they are distinct from Mulholland Drive in the Hollywood Hills. Use the road pages to check the exact section and access notes.",
  "angeles-san-gabriel-mountains": "The Tujunga and Angeles Forest roads form one part of this collection; Glendora Mountain, Glendora Ridge and Mount Baldy form another. Angeles Crest is split into selected sections. A road appearing on the map does not mean a full mountain crossing is currently open, so read the access notes before joining sections.",
  "orange-county": "Santiago Canyon and Live Oak–Trabuco are useful starting points for an Orange County canyon drive. Ortega is a longer mountain crossing, while the coastal highway and Laguna Canyon have a different road character. Compare the selected sections and follow the individual pages for current-access sources.",
  "palomar-north-county": "Palomar has separate South Grade and East Grade road pages, each with its own shape and character. Mesa Grande, Highland Valley and Couser Canyon add other North County choices. Open the road maps to compare the selected sections before planning your drive.",
  "laguna-cuyamaca-mountains": "Sunrise Highway, Highway 79 through Cuyamaca and Banner Grade give three different starting points for the San Diego mountain roads. The road pages show their selected sections, elevation profiles and nearby options.",
  "sierra-nevada": "Compare the Sonora and Tioga pass crossings with destination roads such as Rock Creek, Bishop Creek Canyon and Horseshoe Meadow. These are mapped sections rather than a single connected itinerary; check each road's access sources when planning a mountain drive.",
  "great-smoky-mountains": "Tail of the Dragon is the anchor: 318 curves in 11 miles at Deals Gap. Cherohala Skyway meets it at the Robbinsville end with a completely different, longer-sweeper character. Check each road's access notes — winter conditions and detour traffic both affect this area.",
  "cherokee-nantahala-national-forests": "The Cherohala Skyway's own page covers its full 41.6-mile crossing between Tennessee and North Carolina. It connects to Tail of the Dragon at the Robbinsville end for a genuinely different kind of driving on the same trip.",
  "clinch-mountain-southwest-virginia": "Back of the Dragon (VA 16) is Virginia's officially designated motorcycle route, commonly paired with Tail of the Dragon further south by people touring the Appalachian circuit. Check current Virginia road conditions before a trip; mountain sections ice over in winter.",
  "blue-ridge-parkway-corridor-north-carolina": "Devil's Whip (NC 80) drops from Buck Creek Gap on the Blue Ridge Parkway to Marion, with real landslide and wildfire closure history — check DriveNC.gov rather than assuming a mapped road is currently open.",
  "north-georgia-mountains": "Wolf Pen Gap Road (GA 180) is the western, name-branded 11-mile section near Suches; the state route continues east under a different name past the US 19/129 concurrency. Richard B. Russell Scenic Highway (GA 348) between Helen and Blairsville is a gentler, rolling counterpart with one unexpectedly steep section — check each road's own page for the difference.",
  "sawatch-range-the-divide": "Independence Pass (CO 82) crosses the Continental Divide at 12,095 ft between Aspen and Twin Lakes — the highest paved state highway in Colorado, closed every winter without exception.",
  "san-juan-mountains": "The Million Dollar Highway (US 550) and Lizard Head Pass (CO 145) are the two western legs of the San Juan Skyway, joined at Ridgway. Red Mountain Pass on the Million Dollar Highway has real, recurring avalanche and rockfall closure history — check current conditions before relying on it.",
  "rocky-mountain-national-park": "Trail Ridge Road (US 34) is the highest continuous paved road in North America, and inside a National Park — an entrance fee applies, and it closes every winter on a schedule set by that year's snowfall, not a fixed date.",
};
