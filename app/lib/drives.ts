import type { MapRegion } from "./map-regions";

export type DriveSection = { from: [number, number]; to: [number, number] };

export type Drive = {
  slug: string;
  mapRegion: MapRegion;
  title: string;
  description: string;
  character: string;
  start: string;
  finish: string;
  route: string[];
  intro: string;
  appeal: string;
  steps: { title: string; text: string; roadId?: string; mapSection?: DriveSection }[];
  stops: { name: string; text: string; url?: string }[];
  returnRoute: string;
  conditions?: string;
  access?: { note: string; url: string };
  conditionSources?: { title: string; url: string }[];
  sources: { title: string; url: string }[];
  updated: string;
};

export const drives: Drive[] = [
  {
    slug: "glendora-mountain-road-highway-39-drive",
    mapRegion: "los-angeles",
    title: "Glendora Mountain Road to Highway 39",
    description: "A San Gabriel Mountains drive from technical GMR over the ridge, west along East Fork Road, then down Highway 39 to Azusa. Junctions, map and access checks.",
    character: "Technical mountain & canyon",
    start: "Glendora Mountain Road at Big Dalton Canyon Road",
    finish: "Highway 39 at the Azusa foothills",
    route: ["Glendora Mountain Road north", "East Fork Road west", "Highway 39 south"],
    intro: "GMR brings the tight turns and mountain views. Stay on it over the ridge and down to East Fork Road, then follow Highway 39 back toward Azusa for a more open canyon finish.",
    appeal: "The contrast is the draw. GMR is the involved part: repeated tight bends, changing sightlines and a climb followed by a descent. East Fork eases you into the canyon, and lower Highway 39 has a more flowing, everyday highway feel as it heads toward town. The character changes, but there are still bends, cyclists and traffic to account for throughout.",
    steps: [
      {
        title: "Glendora Mountain Road: climb, then descend to East Fork",
        text: "Begin at Big Dalton Canyon Road on the Glendora side and head uphill on GMR. At the Glendora Ridge Road junction, keep left on Glendora Mountain Road toward East Fork; the right branch goes toward Mount Baldy. Continue down the north side to East Fork Road. This climb and descent make up the technical section.",
        roadId: "glendora-mountain",
      },
      {
        title: "East Fork Road west to Highway 39",
        text: "At the foot of GMR, follow East Fork Road west toward Highway 39 / San Gabriel Canyon Road. This is the connecting road between GMR and 39; keep on East Fork through the canyon rather than taking the Shoemaker Canyon spur.",
        roadId: "east-fork-road",
      },
      {
        title: "Highway 39 south to Azusa",
        text: "At Highway 39, turn left toward Azusa. Follow San Gabriel Canyon Road south past the reservoirs to the foothills. The wider-feeling curves and return toward town give this section a more flowing, commuter-road character than GMR. This guide uses lower Highway 39, not the northern extension toward Crystal Lake or Angeles Crest.",
        roadId: "san-gabriel-canyon",
        // Junction and southern endpoint from the archived OSM trace. The map
        // clips the existing road rather than highlighting its northern spur.
        mapSection: { from: [-117.851308, 34.2391107], to: [-117.9100882, 34.151045] },
      },
    ],
    stops: [
      { name: "Glendora", text: "Get fuel, food and water in town before starting the mountain section." },
      { name: "GMR viewpoints", text: "The mountain views are a reason to pause. Use an open, legal pullout with enough room to leave the road completely; keep gates and junctions clear." },
      { name: "Azusa", text: "A convenient food stop at the end of the canyon section, before returning to Glendora or heading home." },
    ],
    returnRoute: "The mountain drive finishes in the Azusa foothills. Continue into Azusa and use the local street network or I-210 east to return to Glendora. That urban return is separate from the three mountain-road sections highlighted here.",
    access: { note: "Confirm vehicle access on GMR and East Fork before starting. Mountain gates can close for weather, fire restrictions or holidays; this guide is not a live open-road report.", url: "https://pw.lacounty.gov/roadclosures/" },
    conditions: "Check LA County’s vehicle closures and Angeles National Forest alerts for GMR and East Fork. Caltrans lists Highway 39 closed from two miles north of Crystal Lake Road to Highway 2; that northern closure is beyond this southbound itinerary. Pavement condition can change after storms, so an older report of smooth pavement is not a guarantee for today.",
    conditionSources: [
      { title: "LA County: GMR and East Fork vehicle closures", url: "https://pw.lacounty.gov/roadclosures/" },
      { title: "Caltrans: current Highway 39 conditions", url: "https://roads.dot.ca.gov/?roadnumber=39" },
      { title: "Angeles National Forest alerts", url: "https://www.fs.usda.gov/r05/angeles/alerts" },
    ],
    sources: [
      { title: "Autoblog: GMR, East Fork and the return to Azusa (2009 route report)", url: "https://www.autoblog.com/features/autoblog-sunday-drive-glendora-mountain-road" },
      { title: "Carl Pulley: GMR junctions and road character (June 2026)", url: "https://russbrown.com/glendora-mountain-ridge-roads-motorcycle-ride-by-carl-pulley/" },
      { title: "OpenStreetMap: Glendora Mountain Road", url: "https://www.openstreetmap.org/way/31525773" },
      { title: "Caltrans: Highway 39 conditions", url: "https://roads.dot.ca.gov/?roadnumber=39" },
    ],
    updated: "2026-09-13",
  },
  {
    slug: "skaggs-springs-lake-sonoma-to-the-coast",
    mapRegion: "bay-area",
    title: "Skaggs Springs Road: Lake Sonoma to the coast",
    description: "Thirty-five miles west from Lake Sonoma over the coast range to Stewarts Point on Highway 1, one of the longest uninterrupted mountain roads in the North Bay.",
    character: "Remote mountain crossing",
    start: "Lake Sonoma, north of Healdsburg",
    finish: "Stewarts Point on Highway 1",
    route: ["Skaggs Springs Road west", "Highway 1"],
    intro: "A long way from anywhere, which is the point. Skaggs Springs runs from the Lake Sonoma dam west over the ridges to the sea, and for most of that distance there is nothing beside the road but hillside.",
    appeal: "Length is what sets this one apart. Most good roads here are measured in single-digit miles; this is thirty-five of them in one go, at 630 degrees of turning per mile. Fuel up before you start — there is nothing on the road itself, and phone signal comes and goes.",
    steps: [
      {
        title: "West from Lake Sonoma",
        text: "Pick up Skaggs Springs Road at the Lake Sonoma dam and head west. The first miles run above the reservoir arms before the road turns inland and climbs.",
        roadId: "skaggs-springs",
      },
      {
        title: "Highway 1 at Stewarts Point",
        text: "The road ends on the coast highway. Turn north or south along the ocean, or turn around and drive it back the other way — it reads differently in each direction.",
      },
    ],
    stops: [
      { name: "Healdsburg", text: "The last town with fuel and food before the crossing. Worth topping up." },
      { name: "Stewarts Point Store", text: "A store and bakery at the coast end, and the usual place people stop after the run.", url: "https://twofishbaking.com" },
    ],
    returnRoute: "Either drive Skaggs Springs back east, or make a longer loop: north on Highway 1 to Gualala, inland toward Cloverdale, and south again through the Alexander Valley.",
    sources: [
      { title: "Rennlist: SF Bay Area best driving roads for a Sunday morning blast", url: "https://rennlist.com/forums/west-us-rennlist-region/998154-sf-bay-area-best-driving-roads-for-a-sunday-morning-blast.html" },
    ],
    updated: "2026-09-10",
  },
  {
    slug: "mines-road-to-lick-observatory",
    mapRegion: "bay-area",
    title: "Mines Road to Lick Observatory",
    description: "From Livermore south through the Diablo Range on Mines Road and San Antonio Valley Road, finishing with the climb up Mount Hamilton to Lick Observatory.",
    character: "Long backcountry run",
    start: "Livermore",
    finish: "Lick Observatory, Mount Hamilton",
    route: ["Mines Road south", "San Antonio Valley Road", "Mount Hamilton Road"],
    intro: "The back way to Lick. Most people drive up Mount Hamilton from San Jose; coming in from Livermore turns a hill climb into most of a day, through country that feels a long way from either city.",
    appeal: "Three roads that add up to more than their parts: Mines Road works south through ranch land, San Antonio Valley Road crosses the empty middle, and Mount Hamilton finishes with 224 counted bends and 48 switchbacks. Bring fuel and patience — the Junction is the only stop.",
    steps: [
      {
        title: "Mines Road south from Livermore",
        text: "Head south out of Livermore on Mines Road. The first section is narrow and wooded before it opens into the valleys.",
        roadId: "mines",
      },
      {
        title: "San Antonio Valley Road",
        text: "Mines Road becomes San Antonio Valley Road near The Junction. This is the remote middle of the drive, open and exposed.",
        roadId: "san-antonio",
      },
      {
        title: "Mount Hamilton Road to the observatory",
        text: "Turn west for the climb to Lick Observatory. Check the observatory's own visiting hours before relying on the gates being open.",
        roadId: "hamilton",
      },
    ],
    stops: [
      { name: "The Junction", text: "The cafe where Mines Road meets San Antonio Valley Road, and effectively the only stop on the route." },
      { name: "Lick Observatory", text: "Visitor hours and road conditions are posted by the observatory; the summit road is subject to closure in winter weather.", url: "https://www.lickobservatory.org/" },
    ],
    returnRoute: "Continue west and down Mount Hamilton Road into San Jose, which makes the whole thing a crossing rather than an out-and-back.",
    sources: [
      { title: "Rennlist: SF Bay Area best driving roads for a Sunday morning blast", url: "https://rennlist.com/forums/west-us-rennlist-region/998154-sf-bay-area-best-driving-roads-for-a-sunday-morning-blast.html" },
    ],
    updated: "2026-09-10",
  },
  {
    slug: "mount-tamalpais-panoramic-and-ridgecrest",
    mapRegion: "bay-area",
    title: "Mount Tamalpais: Panoramic Highway and Ridgecrest",
    description: "Up from Stinson Beach on Panoramic Highway, then out along Pantoll and East Ridgecrest Boulevard on the shoulder of Mount Tamalpais.",
    character: "Coastal mountain",
    start: "Stinson Beach",
    finish: "East Peak, Mount Tamalpais",
    route: ["Panoramic Highway", "Pantoll Road", "East Ridgecrest Boulevard"],
    intro: "A short drive that spends its whole length above the ocean. Panoramic climbs out of Stinson through the trees, and Ridgecrest runs the open spine of Tam with the Pacific on one side and the bay on the other.",
    appeal: "Ridgecrest is the reason to come: 1,137 degrees of turning per mile along an exposed ridge. It is also a park road with walkers, cyclists and parking pullouts, so this is a drive for the view and the road surface rather than for pace.",
    steps: [
      {
        title: "Panoramic Highway out of Stinson Beach",
        text: "Climb from the coast up through the forest toward Pantoll. The lower section near Stinson has been reported as patchy.",
        roadId: "panoramic",
      },
      {
        title: "Pantoll and East Ridgecrest",
        text: "Turn onto Pantoll Road and then East Ridgecrest Boulevard for the run along the ridge to the East Peak parking area.",
        roadId: "ridgecrest",
      },
    ],
    stops: [
      { name: "Pantoll Ranger Station", text: "Parking and the boundary of Mount Tamalpais State Park. Fees and hours apply.", url: "https://www.parks.ca.gov/?page_id=471" },
      { name: "East Peak", text: "The end of the road, with the whole bay laid out below." },
    ],
    returnRoute: "Back down Ridgecrest and Panoramic, then either south toward Mill Valley or north on Highway 1 along the Marin coast.",
    sources: [
      { title: "Rennlist: SF Bay Area best driving roads for a Sunday morning blast", url: "https://rennlist.com/forums/west-us-rennlist-region/998154-sf-bay-area-best-driving-roads-for-a-sunday-morning-blast.html" },
    ],
    updated: "2026-09-10",
  },
  {
    slug: "lucas-valley-and-the-nicasio-loop",
    mapRegion: "bay-area",
    title: "Lucas Valley and the Nicasio loop",
    description: "A West Marin loop: Lucas Valley Road to Nicasio, out on Point Reyes–Petaluma Road, then back through Chileno Valley and Marshall–Petaluma Road.",
    character: "Ranch country loop",
    start: "Highway 101 at Lucas Valley Road",
    finish: "Back where you started",
    route: ["Lucas Valley Road", "Nicasio Valley Road", "Point Reyes–Petaluma Road", "Chileno Valley Road", "Marshall–Petaluma Road"],
    intro: "The classic West Marin morning. Lucas Valley gets the attention, but the loop beyond it — Nicasio, the Petaluma road, Chileno Valley — is where most of the distance and most of the quiet is.",
    appeal: "Four connected roads through dairy country with almost nothing on them early in the day. None of them is especially technical; the appeal is stringing them together and the scenery in between. Watch for cattle, farm traffic and blind crests.",
    steps: [
      { title: "Lucas Valley Road west", text: "Leave 101 at Lucas Valley Road and follow it west through the valley toward Nicasio.", roadId: "lucas" },
      { title: "Nicasio Valley Road", text: "Turn north at Nicasio, past the reservoir, toward the Point Reyes–Petaluma junction.", roadId: "nicasio-valley" },
      { title: "Point Reyes–Petaluma Road", text: "Head east over the hills toward Petaluma, or west toward the coast if you want to extend the day.", roadId: "point-reyes-petaluma" },
      { title: "Chileno Valley Road", text: "The quiet middle of the loop, running northwest through ranch land toward Tomales.", roadId: "chileno-valley" },
      { title: "Marshall–Petaluma Road", text: "Close the loop back toward Petaluma. Surface here has been reported as rough in places.", roadId: "marshall" },
    ],
    stops: [
      { name: "Nicasio", text: "A village, a church and a square. Not much else, which is the appeal." },
      { name: "Point Reyes Station", text: "The obvious food stop if you extend west instead of turning back.", url: "https://www.pointreyes.org/" },
    ],
    returnRoute: "From Petaluma take Highway 101 south, or repeat the loop in the opposite direction — the roads read differently the other way round.",
    sources: [
      { title: "Rennlist: SF Bay Area best driving roads for a Sunday morning blast", url: "https://rennlist.com/forums/west-us-rennlist-region/998154-sf-bay-area-best-driving-roads-for-a-sunday-morning-blast.html" },
    ],
    updated: "2026-09-10",
  },
  {
    slug: "east-bay-ridge-run",
    mapRegion: "bay-area",
    title: "East Bay ridge run: Skyline, Redwood and Pinehurst",
    description: "The Oakland hills end to end — Skyline Boulevard along the ridge, down Redwood Road, and back through Canyon on Pinehurst Road.",
    character: "Hills above the city",
    start: "Golf Links Road, Oakland",
    finish: "Moraga",
    route: ["Skyline Boulevard", "Redwood Road", "Pinehurst Road"],
    intro: "Three short roads that link into one good hour without leaving the East Bay. Skyline runs the ridge above Oakland, Redwood drops through the regional parks, and Pinehurst threads the redwoods at Canyon.",
    appeal: "Convenience is the point — this is minutes from the city rather than a day out. The trade is traffic: Redwood is heavily used by cyclists, Skyline has driveways along most of its length, and Pinehurst is narrow enough that pace stays low whatever you drive.",
    steps: [
      { title: "Skyline Boulevard north", text: "Start at Golf Links Road and follow Skyline along the ridge, with the bay below on the left.", roadId: "skyline-oakland" },
      { title: "Redwood Road", text: "Drop east on Redwood Road through the park. Expect cyclists at almost any hour.", roadId: "redwood" },
      { title: "Pinehurst Road through Canyon", text: "Turn onto Pinehurst for the narrow, shaded run down through Canyon toward Moraga.", roadId: "pinehurst" },
    ],
    stops: [
      { name: "Redwood Regional Park", text: "Parking and trailheads along Redwood Road if you want to stop.", url: "https://www.ebparks.org/parks/redwood" },
      { name: "Canyon", text: "A one-room post office and not much else, halfway down Pinehurst." },
    ],
    returnRoute: "From Moraga, take Moraga Way and Highway 24 back through the tunnel, or reverse the route and drive Pinehurst uphill.",
    sources: [
      { title: "Rennlist: SF Bay Area best driving roads for a Sunday morning blast", url: "https://rennlist.com/forums/west-us-rennlist-region/998154-sf-bay-area-best-driving-roads-for-a-sunday-morning-blast.html" },
    ],
    updated: "2026-09-10",
  },
  {
    slug: "mines-road-and-del-puerto-canyon",
    mapRegion: "bay-area",
    title: "Mines Road and Del Puerto Canyon",
    description: "South from Livermore on Mines Road, then east through Del Puerto Canyon and down the back of the Diablo Range to Interstate 5.",
    character: "Remote crossing",
    start: "Livermore",
    finish: "Patterson, on Interstate 5",
    route: ["Mines Road south", "Del Puerto Canyon Road east"],
    intro: "The other way off Mines Road. Instead of turning west for Mount Hamilton, carry on east and drop through Del Puerto Canyon to the Central Valley floor.",
    appeal: "Emptiness. Del Puerto runs twenty-four miles through a canyon with almost no development, and once you commit at The Junction there is no shortcut back. Read the surface note before you go — this is not a road for a low, stiff car.",
    steps: [
      { title: "Mines Road south from Livermore", text: "Follow Mines Road south to The Junction, where Del Puerto Canyon Road heads east.", roadId: "mines" },
      { title: "Del Puerto Canyon east", text: "Drop through the canyon toward Patterson. Drivers have reported broken pavement and slide damage in the section nearest Mines Road.", roadId: "del-puerto-canyon" },
    ],
    stops: [
      { name: "The Junction", text: "The meeting point of Mines, San Antonio Valley and Del Puerto Canyon roads. Bring fuel and water from town; confirm any cafe opening before relying on a stop here." },
      { name: "Frank Raines Regional Park", text: "Partway down the canyon, and the only facilities on that side.", url: "https://www.stancounty.com/parks/frank-raines.shtm" },
    ],
    returnRoute: "From Patterson, Interstate 5 north and Highway 580 west return you to Livermore in about an hour — or drive the canyon back up, which is the better road in that direction.",
    sources: [
      { title: "Rennlist: SF Bay Area best driving roads for a Sunday morning blast", url: "https://rennlist.com/forums/west-us-rennlist-region/998154-sf-bay-area-best-driving-roads-for-a-sunday-morning-blast.html" },
    ],
    updated: "2026-09-10",
  },
  {
    slug: "highway-9-skyline-pescadero-coastal-drive",
    mapRegion: "bay-area",
    title: "Highway 9, Skyline & Pescadero coastal drive",
    description: "A Bay Area mountain-to-coast drive: Highway 9 from Saratoga, Skyline, Highway 84, Pescadero Creek Road and Highway 1, with an optional loop back.",
    character: "Mountains & coast",
    start: "Downtown Saratoga",
    finish: "San Gregorio on Highway 1",
    route: ["Highway 9", "Skyline", "Highway 84 west", "Pescadero Creek Road", "Highway 1 north"],
    intro: "A great choice when you want a drive with a bit of everything: a wooded climb out of Saratoga, a stretch along Skyline, a stop at Alice’s, and a winding run through Pescadero to the ocean.",
    appeal: "The changing scenery is the reason to choose this drive. The mountain roads give the first part its character, Pescadero gives you a reason to stop, and the coast makes a satisfying finish. It suits a day built around the drive itself, with time for food and a beach stop along the way.",
    steps: [
      {
        title: "Highway 9: Saratoga to Saratoga Gap",
        text: "Start in downtown Saratoga and follow Highway 9 uphill to its junction with Skyline Boulevard. This is the front side of 9: wooded bends and a sustained climb to the ridge.",
        roadId: "highway-9-front",
      },
      {
        title: "Skyline north to Alice’s",
        text: "At Saratoga Gap, take Highway 35 north toward the Highway 84 junction at Alice’s. Skyline connects the two mountain crossings and gives this drive its ridge section.",
        roadId: "skyline",
      },
      {
        title: "Highway 84 west through La Honda",
        text: "At Alice’s, take Highway 84 west toward La Honda and the coast. After La Honda, turn left onto Pescadero Creek Road.",
        roadId: "la-honda",
      },
      {
        title: "Pescadero Creek Road to the ocean",
        text: "Follow Pescadero Creek Road through Loma Mar and on to Pescadero. Stop in town if you like, then continue west to Highway 1 at Pescadero State Beach.",
        roadId: "pescadero",
      },
      {
        title: "Highway 1 north to San Gregorio",
        text: "Turn north on Highway 1 for the coastal part of the drive, finishing at San Gregorio. The change from wooded roads to open ocean views is the payoff.",
        roadId: "highway-1-coast",
      },
    ],
    stops: [
      { name: "Chevron in Saratoga", text: "A convenient meetup and fuel stop before the climb up Highway 9." },
      { name: "Alice’s / Four Corners", text: "A popular motorcycle meetup at the Skyline–84 junction, with food and fuel nearby.", url: "https://alicesrestaurant.com/" },
      { name: "Downtown Pescadero", text: "A small downtown with cute coffee shops and lots of character. A lovely place to stretch your legs and grab a coffee before heading back to the coast.", url: "https://www.visithalfmoonbay.org/places/downtown-local/" },
      { name: "Pescadero State Beach", text: "A coastal stop right where Pescadero Creek Road meets Highway 1.", url: "https://www.parks.ca.gov/?page_id=522" },
      { name: "Optional extension: The Ritz-Carlton, Half Moon Bay", text: "Continue north past San Gregorio on Highway 1, then take Miramontes Point Road to the hotel. Great ocean views and a place to grab a drink. Don’t drink and drive. This extends the drive beyond its San Gregorio finish; return south to San Gregorio if you want to follow the loop below.", url: "https://www.ritzcarlton.com/en/hotels/hafrz-the-ritz-carlton-half-moon-bay/overview/" },
    ],
    returnRoute: "To close the loop, take Highway 84 east from San Gregorio through La Honda to Alice’s, then Skyline south to Saratoga Gap and Highway 9 downhill to Saratoga. This return retraces the Skyline and Highway 9 sections. You can also finish at the coast and choose your own route home.",
    sources: [
      { title: "BMW CCA: connecting Highway 9, Skyline, Highway 84 and Pescadero", url: "https://bmwcca.net/2017/03/21/driving-coast-roads/" },
      { title: "California State Parks: Coastside map and beach access", url: "https://www.parks.ca.gov/pages/521/files/SanMateoCoastBeachesParksWeb2016.pdf" },
      { title: "The Ritz-Carlton: Highway 1 and Miramontes Point Road access", url: "https://www.ritzcarlton.com/content/dam/marriott-digital/rz/us-canada/hws/h/hafrz/en_us/document/assets/signature_drive_final.pdf" },
    ],
    conditions: "Highway 9 and Skyline are public roads where enforcement can occur, including weekends. Expect motorcycles, cyclists and visitors around the ridge junctions; follow posted limits throughout.",
    conditionSources: [
      { title: "Caltrans QuickMap: state-highway conditions", url: "https://quickmap.dot.ca.gov/" },
      { title: "San Mateo County road closures", url: "https://www.smcgov.org/publicworks/county-road-closures" },
    ],
    updated: "2026-09-09",
  },
  {
    slug: "page-mill-skyline-alices-driving-route",
    mapRegion: "bay-area",
    title: "Page Mill, Skyline & Alice’s driving route",
    description: "A technical Bay Area drive up Page Mill Road, north along Skyline to Alice’s, then down Highway 84 toward Woodside. Stops, route notes and an optional return.",
    character: "Technical climb",
    start: "Page Mill Road at I-280",
    finish: "Woodside",
    route: ["Page Mill uphill", "Skyline north", "Alice’s", "Highway 84 east downhill"],
    intro: "A great Peninsula drive if you enjoy tighter, more involved mountain roads. Page Mill supplies the technical climb, Skyline connects you to Alice’s, and Highway 84 brings you back down toward Woodside.",
    appeal: "Choose this one for Page Mill’s changing bends and elevation, followed by a natural break at Alice’s. The climb is the demanding part: tight corners, short sightlines and bicycle traffic call for patience. The route then moves onto Skyline before the wooded descent on 84.",
    steps: [
      {
        title: "Page Mill Road uphill to Skyline",
        text: "Start at Page Mill Road near I-280 and follow it west into the hills, continuing uphill to Skyline Boulevard. The upper climb is the technical highlight of this route, with tighter bends and limited views around corners.",
        roadId: "page-mill",
      },
      {
        title: "Skyline north to Alice’s",
        text: "At the ridge, turn right onto Skyline Boulevard and head north to the Highway 84 junction. Alice’s is the stop between the Page Mill climb and the descent.",
        roadId: "skyline",
      },
      {
        title: "Highway 84 downhill toward Woodside",
        text: "From Alice’s, take Highway 84 east, downhill toward Woodside on the Bay side of the ridge. This guide finishes in Woodside; Highway 84 west from Alice’s is the separate descent toward La Honda and the coast.",
        roadId: "la-honda",
      },
    ],
    stops: [
      { name: "Alice’s / Four Corners", text: "The main meetup and food stop on this drive, with a gas station and deli around the junction.", url: "https://alicesrestaurant.com/" },
      { name: "Woodside", text: "The finish after the Highway 84 descent, before joining your route home." },
    ],
    returnRoute: "For a simple loop back to the start, continue on Highway 84 through Woodside to I-280, then take I-280 south to the Page Mill Road exit. The return uses the freeway; the mountain driving ends in Woodside.",
    sources: [
      { title: "Local driving guide: Page Mill and Skyline road character", url: "https://www.lahiri.me/drives/" },
      { title: "Western Wheelers: Peninsula climbs and Highway 84 connections", url: "https://www.westernwheelers.org/main/resources/BA_Climbs.html" },
      { title: "Alice’s Restaurant: location and visitor information", url: "https://alicesrestaurant.com/" },
    ],
    conditions: "Highway 9 and Skyline are public roads where enforcement can occur, including weekends. Expect motorcycles, cyclists and visitors around the ridge junctions; follow posted limits throughout.",
    conditionSources: [
      { title: "Caltrans QuickMap: state-highway conditions", url: "https://quickmap.dot.ca.gov/" },
      { title: "San Mateo County road closures", url: "https://www.smcgov.org/publicworks/county-road-closures" },
    ],
    updated: "2026-09-09",
  },
];

export function getDrive(slug: string) {
  return drives.find(drive => drive.slug === slug);
}
