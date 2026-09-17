type PlanningNote = { text: string; source?: { title: string; url: string } };
export type RoadGuide = {
  heading: string;
  title: string;
  description: string;
  notes: PlanningNote[];
  connections: { roadId: string; note: string }[];
  updated: string;
};

// Page-level editorial notes, separate from the generated geometry and road catalog.
// These are the first ten pages prioritized for useful planning content, not a ranking.
export const collectionUpdated = "2026-09-15";
const updated = "2026-09-15";
const roadGuides: Record<string, RoadGuide> = {
  "highway-9-front": {
    heading: "Highway 9 Front Side: Saratoga to Skyline",
    title: "Highway 9 Front Side: Saratoga to Skyline | TougeMap",
    description: "Plan the Highway 9 climb from Saratoga to Saratoga Gap. Explore the road map, wooded bends, Skyline connections and a longer Pescadero coastal drive.",
    updated,
    notes: [
      { text: "This is the front side of Highway 9: the wooded climb from Saratoga to Saratoga Gap. The junction with Skyline Boulevard (Highway 35) is the key decision point at the top. It makes a useful starting leg for a Santa Cruz Mountains drive, with a clear place to choose your next road.", source: { title: "Midpen: Saratoga Gap junction and parking", url: "https://www.openspace.org/preserves/saratoga-gap" } },
      { text: "For a ridge-and-coast outing, head north on Skyline toward Highway 84 and Alice’s, then use the coastal guide below for the turns through Pescadero. Continuing on Highway 9 takes you onto the separately mapped back side toward Boulder Creek. Allow space for cyclists and traffic around bends; the map’s length covers this selected climb." },
    ],
    connections: [
      { roadId: "skyline", note: "The ridge road at Saratoga Gap; head north for the Peninsula junctions." },
      { roadId: "highway-9-back", note: "The continuation beyond the gap toward Boulder Creek and the San Lorenzo Valley." },
    ],
  },
  "page-mill": {
    heading: "Page Mill Road",
    title: "Page Mill Road to Skyline: Driving Guide | TougeMap",
    description: "Explore Page Mill Road’s climb from the Peninsula foothills to Skyline. Road map, tight bends, cycling considerations and a route to Alice’s and Woodside.",
    updated,
    notes: [
      { text: "Page Mill is the technical foothill climb in the Page Mill–Skyline–Alice’s guide. The upper road reaches the Skyline Boulevard and Alpine Road junction beside Russian Ridge Preserve. That junction separates the climb from the ridge road and the westward descent, so choose the next leg before setting off.", source: { title: "Midpen: Russian Ridge directions", url: "https://www.openspace.org/preserves/russian-ridge" } },
      { text: "The appeal is the changing rhythm of the bends and the climb toward the ridge. Short sightlines and bicycle traffic deserve attention throughout. For the Woodside outing, turn north on Skyline toward Alice’s and take Highway 84 downhill toward Woodside; the driving guide spells out that direction at the junction." },
      { text: "Make Alice’s the food and meetup stop after the climb. Head north on Skyline to Highway 84; Saturday and Sunday mornings are a favorite for car and motorcycle enthusiasts. Our tip: leave room for dessert.", source: { title: "Alice’s Restaurant: food and visitor information", url: "https://alicesrestaurant.com/" } },
    ],
    connections: [
      { roadId: "skyline", note: "Turn north at the top for the ridge leg toward Alice’s and Highway 84." },
      { roadId: "west-alpine", note: "A separate western descent from the same ridge junction toward Pescadero Creek." },
    ],
  },
  skyline: {
    heading: "Skyline Boulevard (Highway 35)",
    title: "Skyline Boulevard (Hwy 35): Driving Guide | TougeMap",
    description: "Plan a Skyline Boulevard drive between Highway 92 and Highway 9. Find Page Mill and Highway 84 connections, Alice’s, road maps and linked driving guides.",
    updated,
    notes: [
      { text: "The mapped Skyline section runs along the Peninsula ridge between Highway 92 and Highway 9. It is the connecting leg in several local outings: Page Mill meets it near Russian Ridge, Highway 84 crosses at Sky Londa, and Highway 9 meets it at Saratoga Gap. Alice’s Restaurant is on Skyline at the Highway 84 junction.", source: { title: "Alice’s: location and visitor information", url: "https://alicesrestaurant.com/" } },
      { text: "Pick a section to suit the rest of your outing. The Page Mill guide uses Skyline to reach the Woodside descent, while the Highway 9 coastal guide follows the ridge before heading through La Honda and Pescadero. Pull fully into a designated parking area for a stop; preserve entrances and junctions bring people on and off the road.", source: { title: "Midpen: ridge junction and parking at Russian Ridge", url: "https://www.openspace.org/preserves/russian-ridge" } },
      { text: "Alice’s is the social stop on this ridge drive: a car and motorcycle enthusiast haven, especially on Saturday and Sunday mornings. Come for the cars, stay for great food, and save room for dessert—it’s a TougeMap favorite. There is gas and a deli at the junction.", source: { title: "Alice’s Restaurant: food and visitor information", url: "https://alicesrestaurant.com/" } },
    ],
    connections: [
      { roadId: "page-mill", note: "A technical approach to the ridge from the Peninsula foothills." },
      { roadId: "la-honda", note: "Highway 84 at Sky Londa: choose Woodside or the La Honda/coast direction." },
      { roadId: "highway-9-front", note: "The Saratoga approach at Skyline’s southern junction in this map." },
    ],
  },
  pescadero: {
    heading: "Pescadero Creek Road",
    title: "Pescadero Creek Road: Redwoods to Coast | TougeMap",
    description: "Follow Pescadero Creek Road through Loma Mar toward Pescadero and Highway 1: bend density, single-lane sections, redwood stops and a connected drive.",
    updated,
    notes: [
      { text: "Pescadero Creek Road runs longer and mellower than the ridge roads that feed it — 13.6 miles with 55 bends, a density of 4 per mile against West Alpine's 11 — but the character is different, not easier: single-lane width in places through Sam McDonald County Park's redwoods, with blind curves that call for watching for oncoming cars and cyclists rather than carrying speed. Traffic is light most of the week, heavier on weekends as a through-route between the ridge and the coast.", source: { title: "San Mateo County: Pescadero Creek Park", url: "https://www.smcgov.org/parks/pescadero-creek-park-trails" } },
      { text: "Pescadero Creek Road brings a change of scenery to a Peninsula drive: redwoods around Loma Mar, then the country around Pescadero and the coast. Memorial Park sits on this road and gives you a place to plan a proper stop among the redwoods. Check the park’s visitor information if you want to combine the drive with a walk.", source: { title: "San Mateo County: Memorial Park", url: "https://www.smcgov.org/parks/memorial-park" } },
      { text: "At the coast, Pescadero Creek Road meets Highway 1 beside the southern access to Pescadero State Beach. This makes the road a useful link in a mountain-to-ocean outing. Use the coastal driving guide for the full Highway 9–Skyline–Highway 84 approach and decide which direction you want to take on Highway 1 before reaching the coast.", source: { title: "State Parks: Pescadero beach access", url: "https://parks.ca.gov/?page_id=522" } },
      { text: "Leave time for downtown Pescadero before the beach. It’s small, full of character and a lovely coffee stop between the redwoods and Highway 1." },
    ],
    connections: [
      { roadId: "west-alpine", note: "The steeper, tighter descent from Skyline that feeds into this road." },
      { roadId: "la-honda", note: "Highway 84 supplies the inland approach from the La Honda side." },
      { roadId: "highway-1-coast", note: "The coastal continuation at Pescadero State Beach." },
    ],
  },
  "highway-1-coast": {
    heading: "Highway 1: Pacifica to Santa Cruz",
    title: "Highway 1: Pacifica to Santa Cruz Drive | TougeMap",
    description: "Explore the Coastside Highway 1 drive through Half Moon Bay, Pescadero and Davenport. Map, coastal stops and connections into the Santa Cruz Mountains.",
    updated,
    notes: [
      { text: "This page covers the Coastside outing from Pacifica toward Santa Cruz through Half Moon Bay, the Pescadero coast and Davenport. It is the coastal section shown on this map, with town approaches mixed into the more open stretches. Choose a start and finish that leave time to get out of the car along the way." },
      { text: "Pescadero State Beach is one option for a coast stop, with its southern access at the Pescadero Creek Road junction. Turning inland there links the ocean leg to the redwoods and the Peninsula’s mountain roads. The Highway 9–Skyline–Pescadero guide brings those sections together; check current highway conditions before extending your trip beyond the mapped area.", source: { title: "State Parks: Pescadero State Beach locations", url: "https://parks.ca.gov/?page_id=522" } },
    ],
    connections: [
      { roadId: "pescadero", note: "An inland turn toward Pescadero, Loma Mar and the redwoods." },
      { roadId: "la-honda", note: "The Highway 84 connection inland from the San Gregorio coast." },
    ],
  },
  mines: {
    heading: "Mines Road from Livermore",
    title: "Mines Road, Livermore: Driving Guide | TougeMap",
    description: "Plan a Mines Road drive south of Livermore. Explore its remote bends, the San Antonio Valley connection and a longer route to Mount Hamilton and Lick Observatory.",
    updated,
    notes: [
      { text: "Mines Road heads into the backcountry south of Livermore, with open valley stretches and narrower, winding sections. The San Antonio Valley Road and Del Puerto Canyon Road junction is the useful route-planning landmark at the far end. The county’s Mines Road repair information also uses that junction to locate work along the road.", source: { title: "Santa Clara County: Mines Road and its southern junction", url: "https://roads.santaclaracounty.gov/services/storm-damaged-roads/mines-road-site-1" } },
      { text: "Decide whether you want an out-and-back on Mines or a longer outing through San Antonio Valley toward Mount Hamilton. The latter adds more mountain road beyond the length shown here. The linked guide covers that sequence to Lick Observatory; check the observatory’s visitor information separately if it is your destination." },
    ],
    connections: [
      { roadId: "san-antonio", note: "The next road south for the Mount Hamilton outing." },
      { roadId: "hamilton", note: "Reached via San Antonio Valley on the longer observatory drive, not directly from Mines." },
    ],
  },
  "glendora-mountain": {
    heading: "Glendora Mountain Road (GMR)",
    title: "Glendora Mountain Road (GMR): Route & Map | TougeMap",
    description: "Explore GMR from Glendora to East Fork Road: mountain bends, original driving footage, gate-access links and the connected drive to Highway 39 and Azusa.",
    updated,
    notes: [
      { text: "GMR runs 12.4 miles from Big Dalton Canyon Road to East Fork Road with 118 counted bends, 28 of them full switchbacks — a long, sustained technical climb rather than a short burst. The grade stays gentle by canyon-road standards (6.5% at its steepest, 282 ft of climb per mile on average), so the difficulty here is corner count and blind, decreasing-radius turns rather than outright steepness. Much of the road has no centerline, which matters on the blind sections." },
      { text: "GMR is genuinely narrow and shared: cyclists climb it in packs, often several abreast, and weekend mornings bring joggers and antique-car clubs as well as other drivers. A late-afternoon or weekday run gets you a clearer road than a weekend morning. The sustained downhill also cooks brakes on an unprepared car — check pads, fluid and tires before treating this as a spirited descent, not just a scenic one.", source: { title: "The Gentleman Racer: Drive — Glendora Mountain Road / Glendora Ridge Road", url: "https://thegentlemanracer.com/2014/05/drive-glendora-mountain-roadglendora/" } },
      { text: "The GMR trace starts at Big Dalton Canyon Road, climbs to the ridge junction and descends to East Fork Road. Glendora Ridge Road is the separate branch toward Mount Baldy. East Fork Road then continues the drive toward Highway 39 and Azusa, changing character into a more open canyon road. Check the county's vehicle-access notices before going: the presence of a mapped road or recorded driving footage does not establish that a gate is open today.", source: { title: "LA County: road and gate closures", url: "https://pw.lacounty.gov/roadclosures/" } },
    ],
    connections: [
      { roadId: "east-fork-road", note: "Follow it west from the north end of GMR to reach Highway 39." },
      { roadId: "san-gabriel-canyon", note: "The Highway 39 leg toward Azusa after East Fork; the northern road is a separate outing." },
      { roadId: "glendora-ridge", note: "The branch toward Mount Baldy at the Cow Canyon Saddle junction." },
    ],
  },
  "angeles-crest-west": {
    heading: "Angeles Crest Highway: Western SR 2",
    title: "Angeles Crest Highway: Western SR 2 | TougeMap",
    description: "Plan the western Angeles Crest drive from La Cañada Flintridge to Upper Big Tujunga. Road map, connecting canyon roads and official SR 2 closure information.",
    updated,
    notes: [
      { text: "This is the western approach to Angeles Crest Highway from La Cañada Flintridge, ending at the Upper Big Tujunga junction in this catalog. It gives you a defined mountain outing from the LA side. The next section toward Newcomb’s Ranch has its own road page so you can assess it separately." },
      { text: "Check the current Caltrans SR 2 report before planning any extension toward Wrightwood. Closures farther east can interrupt a through-drive even when the western approach is usable. Angeles Forest Highway and Upper Big Tujunga are separate connections with their own road pages; check each leg rather than assuming a line on the map means the whole loop is available.", source: { title: "Caltrans: current SR 2 conditions", url: "https://roads.dot.ca.gov/?roadnumber=2" } },
    ],
    connections: [
      { roadId: "angeles-forest", note: "The separate road branching from Angeles Crest at Clear Creek." },
      { roadId: "upper-big-tujunga", note: "The connector at the eastern end of this selected section." },
      { roadId: "angeles-crest-newcombs", note: "The next mapped SR 2 section; check current access before continuing." },
    ],
  },
  "latigo-canyon": {
    heading: "Latigo Canyon Road, Malibu",
    title: "Latigo Canyon Road, Malibu: Driving Guide | TougeMap",
    description: "Explore Latigo Canyon Road from Malibu’s PCH into the Santa Monica Mountains: 98 bends and 24 switchbacks over ten miles, the highest switchback count of any road in this catalog.",
    updated,
    notes: [
      { text: "Latigo packs 98 counted bends into 10.2 miles, 24 of them full switchbacks — more switchbacks than any other road mapped here, stacked almost continuously from PCH to the ridge. The grade stays moderate (7.3% at its steepest), so the demand is sustained direction-change and working through the switchback sequence cleanly, not outright steepness. The upper road also provides access to the Backbone Trail, so watch for hikers entering and leaving the trailhead area mid-corner.", source: { title: "LA County Parks: Backbone Trail — Latigo Canyon access", url: "https://trails.lacounty.gov/Trail/74/backbone-trail---latigo-canyon" } },
      { text: "Plan the coastal and ridge ends as separate parts of the drive. PCH supplies the coast approach, while Kanan Dume is another road to consult when choosing a return through the canyon network. Check current county closures before joining the roads into a loop; the route shown here describes Latigo itself.", source: { title: "LA County: current road closures", url: "https://pw.lacounty.gov/roadclosures/" } },
    ],
    connections: [
      { roadId: "pch-malibu", note: "The Malibu coast road at Latigo’s southern end." },
      { roadId: "kanan-dume", note: "A broader connection between the coast and the canyon network to consider for your return." },
    ],
  },
  "palomar-south-grade": {
    heading: "Palomar Mountain South Grade Road (S6)",
    title: "Palomar Mountain South Grade (S6) Drive | TougeMap",
    description: "Explore Palomar Mountain’s South Grade Road from Highway 76. Map, switchbacks, the East Grade connection and planning notes for an observatory visit.",
    updated,
    notes: [
      { text: "South Grade Road is the switchback climb from Highway 76 onto Palomar Mountain. At the upper junction, South Grade (S6), East Grade (S7) and Summit Road come together. That is the point to decide between extending the mountain outing and choosing your descent.", source: { title: "Forest Service: Palomar junction at Crestline", url: "https://www.fs.usda.gov/sopa/components/reports/sopa-110502-2024-07.pdf" } },
      { text: "The mapped South Grade climb is only one part of a Palomar day trip. East Grade offers a separate way off the mountain toward the Lake Henshaw side. If you want to include the observatory, plan that onward visit separately and check Caltech’s visitor information for access and opening arrangements.", source: { title: "Caltech: visiting Palomar Observatory", url: "https://sites.astro.caltech.edu/palomar/visitor/" } },
    ],
    connections: [
      { roadId: "palomar-east-grade", note: "The longer eastern descent toward the Lake Henshaw side of Highway 76." },
    ],
  },
  "highway-9-back": {
    "heading": "Highway 9 Back Side: Saratoga Gap to Santa Cruz",
    "title": "Highway 9 Back Side: Redwoods to Santa Cruz | TougeMap",
    "description": "Explore Highway 9’s back side from Saratoga Gap through Boulder Creek and the San Lorenzo Valley to Santa Cruz. Map, redwood scenery and connecting roads.",
    "updated": "2026-09-15",
    "notes": [
      {
        "text": "Over Saratoga Gap, Highway 9 changes from the front-side climb into a much longer drive through the redwoods. The mapped back side continues through Boulder Creek and the San Lorenzo Valley toward Santa Cruz. Choose it for a forest drive with towns along the way, rather than treating the whole road as one uninterrupted mountain section."
      },
      {
        "text": "At the ridge, Skyline and the Saratoga front side provide two different ways to continue. Farther down, Highway 236 is a separate Big Basin detour and Bear Creek is another mountain connection near Boulder Creek. Check Caltrans for Highway 9 and any state-highway detours before setting off; town centers and residential entrances change the pace.",
        "source": {
          "title": "Caltrans: Highway 9 conditions",
          "url": "https://roads.dot.ca.gov/?roadnumber=9"
        }
      }
    ],
    "connections": [
      {
        "roadId": "highway-9-front",
        "note": "The other side of Saratoga Gap, descending toward Saratoga."
      },
      {
        "roadId": "skyline",
        "note": "Head north from the gap toward Alice’s and the Highway 84 junction."
      },
      {
        "roadId": "big-basin",
        "note": "Highway 236 is a separate forest detour; check its access before adding it."
      },
      {
        "roadId": "bear-creek",
        "note": "A mountain-road connection near Boulder Creek."
      }
    ]
  },
  "grizzly": {
    "heading": "Grizzly Peak Boulevard, Berkeley & Oakland",
    "title": "Grizzly Peak Boulevard: Berkeley Hills Drive | TougeMap",
    "description": "Explore Grizzly Peak Boulevard in the Berkeley and Oakland hills. Bay views, a road map, Tilden Park stops and connections for a relaxed East Bay drive.",
    "updated": "2026-09-15",
    "notes": [
      {
        "text": "Grizzly Peak is a good choice when you want winding hills and Bay views without committing to a remote mountain day. The road serves Berkeley and Oakland neighborhoods as well as park visitors. Enjoy the overlooks from a permitted parking spot; leave entrances and the travel lane clear."
      },
      {
        "text": "Tilden is a natural way to turn the drive into a longer stop, with entrances off Grizzly Peak and Wildcat Canyon Road. Check the park’s road notices before adding an interior park route: South Park Drive has a seasonal vehicle closure. Cyclists also use these hills, so give them room through the bends.",
        "source": {
          "title": "East Bay Parks: Tilden access and road notices",
          "url": "https://www.ebparks.org/parks/tilden"
        }
      }
    ],
    "connections": [
      {
        "roadId": "skyline-oakland",
        "note": "Continue into the Oakland hills on the local Skyline Boulevard—not Highway 35 on the Peninsula."
      }
    ]
  },
  "the-snake": {
    "heading": "The Snake: Mulholland Highway",
    "title": "The Snake on Mulholland Highway: Road Guide | TougeMap",
    "description": "Explore the Snake on Mulholland Highway between Kanan and Sierra Creek roads. Map, tight mountain bends, Rock Store context and official access information.",
    "updated": "2026-09-15",
    "notes": [
      {
        "text": "The Snake is the compact, twisting Mulholland Highway section in the Santa Monica Mountains near the Rock Store. This page maps the Kanan Road to Sierra Creek Road corridor, including the famous bends. It is part of Mulholland Highway in the Malibu mountains, separate from Mulholland Drive in the Hollywood Hills.",
        "source": {
          "title": "LA County: Mulholland Highway corridor and the Snake",
          "url": "https://pw.lacounty.gov/tpp/mulholland-hwy/"
        }
      },
      {
        "text": "Make it one leg of a canyon outing, with a proper stop instead of stopping along a bend. Kanan Dume connects the western end toward PCH, while the wider Mulholland Highway page helps put this short section in context. Check current county access notices before leaving; older videos and reopening stories do not establish today’s road conditions.",
        "source": {
          "title": "LA County: current road closures",
          "url": "https://pw.lacounty.gov/roadclosures/"
        }
      }
    ],
    "connections": [
      {
        "roadId": "kanan-dume",
        "note": "The connection toward the coast at the western end of this selected corridor."
      },
      {
        "roadId": "mulholland-highway-malibu",
        "note": "The wider Mulholland Highway route through the Malibu mountains."
      }
    ]
  },
  "tuna-canyon": {
    heading: "Tuna Canyon Road: Saddle Peak to PCH",
    title: "Tuna Canyon Road: Route, Map & Access | TougeMap",
    description: "Plan the Tuna Canyon Road descent from Saddle Peak to Pacific Coast Highway: what the corners actually demand, the one-way layout, and nearby Tuna Canyon Park.",
    updated,
    notes: [
      { text: "Tuna Canyon drops about 1,800 ft off the Saddle Peak ridge to PCH in just over four miles, with 61 counted bends and 7 full switchbacks — the tightest bend density of any road in this catalog. Many of those corners are off-camber or decreasing-radius, tightening after you commit rather than opening up, which punishes carrying speed in. The road rewards braking early and getting it done before the apex over trying to trail-brake through a corner that's still closing on you.", source: { title: "Eat Sleep Ride: Tuna Canyon is 70 turns in 4 miles", url: "https://eatsleepride.com/routes/tuna_canyon_is_70_turns_in_4_miles_hidden_in_the_malibu_hills-117190" } },
      { text: "It's permanently one-way downhill toward the coast, which removes oncoming traffic from the equation entirely — a real factor on a road this tight and blind. The tradeoff is a mandatory right turn onto PCH at the bottom, with county flaggers working that junction to stop wrong-way entries. Tuna Canyon Park, an MRCA preserve of coastal-facing ridgeline, borders the upper corridor. Check current status before relying on it: the road has been closed by wildfire more than once, most recently reopening in May 2025.", source: { title: "County of Los Angeles: LA County fully reopens Tuna Canyon Road near Malibu", url: "https://lacounty.gov/2025/05/23/la-county-fully-reopens-tuna-canyon-road-near-malibu/" } },
    ],
    connections: [
      { roadId: "schueren-saddle-peak", note: "The ridge connector at the top, toward Old Topanga and Stunt Road." },
      { roadId: "pch-malibu", note: "The coastal road at the bottom; the one-way rule only allows a right turn here." },
    ],
  },
  "west-alpine": {
    heading: "West Alpine Road: Skyline to Pescadero Creek",
    title: "West Alpine Road: Route, Map & Driving Notes | TougeMap",
    description: "Plan the West Alpine Road descent from Skyline into the redwoods toward Pescadero Creek Road: bend density, forest sightlines, and the connecting roads.",
    updated,
    notes: [
      { text: "West Alpine packs 84 counted bends into 7.6 miles — 11.1 bends per mile, denser than all but a couple of roads in this catalog — as it drops off Skyline through redwood forest toward Pescadero Creek Road. The grade is moderate (8.4% at its steepest) but sightlines change constantly under tree cover, closing in around blind bends and opening briefly at clearings. Alpine Creek and Heritage Grove Redwoods Preserve border the corridor, so expect cyclists and hikers as well as other drivers.", source: { title: "Midpeninsula Regional Open Space District: Alpine Road corridor", url: "https://www.openspace.org/what-we-do/projects/alpine-road-regional-trail-improvement-project" } },
    ],
    connections: [
      { roadId: "skyline", note: "The ridge road at the top of the descent." },
      { roadId: "pescadero", note: "West Alpine ends where Pescadero Creek Road continues toward the coast." },
    ],
  },
  "piuma-road": {
    heading: "Piuma Road: Malibu Canyon Ridge",
    title: "Piuma Road: Route, Map & Driving Notes | TougeMap",
    description: "Plan the Piuma Road climb above Malibu Canyon: 53 bends over a ridge with overlook views, plus the Stunt Road and Malibu Canyon connections.",
    updated,
    notes: [
      { text: "Piuma climbs the ridge dividing the Malibu Canyon and Cold Creek watersheds, with 53 counted bends over 6.5 miles and a steady 8.3% grade at its steepest. The road has real scenic-overlook pull-outs with panoramic views down Malibu Canyon toward the coast, which makes it easy to carry too much speed past them rather than into the next corner — a hairpin sits right above the Malibu Creek Gorge picnic area, one of the tighter points on the climb.", source: { title: "MRCA: Piuma Ridge Overlook", url: "https://mrca.ca.gov/wp-content/uploads/2018/02/piumaRidgeOverlook.pdf" } },
    ],
    connections: [
      { roadId: "malibu-canyon-las-virgenes", note: "The canyon floor road Piuma climbs away from." },
      { roadId: "stunt-road", note: "The ridge continues onto Stunt Road at Piuma's eastern end." },
    ],
  },
  "little-tujunga": {
    heading: "Little Tujunga Canyon Road: Bear Divide",
    title: "Little Tujunga Canyon Road: Route, Map & Driving Notes | TougeMap",
    description: "Plan the Little Tujunga Canyon Road climb over Bear Divide: hairpins, drop-offs, and what the pavement and traffic are actually like.",
    updated,
    notes: [
      { text: "Little Tujunga climbs from the San Fernando Valley over Bear Divide with 74 counted bends and 16 switchbacks across 10.8 miles — the road gains most of its 271 ft-per-mile average climb in short bursts rather than evenly, so the switchback sections come in concentrated stretches. Armco guardrail covers many corners but not all of them, and the drop-offs beside the road are real; sand and hillside debris collect in corners after rain. It's well used by motorcyclists on weekends, so expect company." },
    ],
    connections: [
      { roadId: "big-tujunga", note: "The other Tujunga canyon road, reached via Big Tujunga Canyon Road to the east." },
    ],
  },
  "hecker-pass": {
    heading: "Hecker Pass: Gilroy to Watsonville",
    title: "Hecker Pass Highway (SR 152): Route, Map & Driving Notes | TougeMap",
    description: "Plan the Hecker Pass Highway drive over Mount Madonna between Gilroy and Watsonville: gentle grade, continuous curves, and the summit crossing.",
    updated,
    notes: [
      { text: "Hecker Pass crosses Mount Madonna at a modest 1,339 ft, and it shows in the numbers: 18 bends over 7.9 miles is a much lower density than the Santa Cruz Mountains' tighter roads, and the grade never exceeds 6.2%, the gentlest climb in this catalog's Peninsula/Santa Cruz cluster. The character is continuous, banked curves rather than switchbacks — a sustained rhythm road through redwoods and farmland on the Watsonville side, not a technical climb.", source: { title: "Wikipedia: Hecker Pass", url: "https://en.wikipedia.org/wiki/Hecker_Pass" } },
    ],
    connections: [
      { roadId: "watsonville-road", note: "Continues the Santa Cruz Mountains crossing toward Watsonville." },
    ],
  },
  "kanan-dume": {
    heading: "Kanan Dume Road: Coast to Canyon",
    title: "Kanan Dume Road: Route, Map & Driving Notes | TougeMap",
    description: "Plan the Kanan Dume Road drive between US 101 and PCH: three tunnels, a steep coastal descent, and what the corners are actually like section by section.",
    updated,
    notes: [
      { text: "Kanan Dume covers 6.2 miles with only 14 counted bends — far fewer than the tight canyon roads around it — but an 8% grade on the descent toward the coast, the steepest sustained stretch in this cluster. The character changes by section: wide, predictable curves near US 101, tightening through the recreation area at the highest elevation, then three narrow tunnels (built between 1967 and 1982, known locally as T-1, T-2 and T-3) on the final drop to PCH. A runaway-truck ramp near the bottom is a fair indicator of how steep that last stretch runs.", source: { title: "SoCal Regional Rocks and Roads: Kanan Dume Road", url: "https://www.socalregion.com/highways/scenic_drives/kanan-dume-road/" } },
    ],
    connections: [
      { roadId: "pch-malibu", note: "The coast road at Kanan Dume's southern end." },
      { roadId: "latigo-canyon", note: "A parallel canyon road to consider for a return leg." },
      { roadId: "mulholland-highway-malibu", note: "Crosses Kanan Dume partway up, toward the Snake and the Rock Store." },
    ],
  },
  "mesa-grande": {
    heading: "Mesa Grande Road: Santa Ysabel Backcountry",
    title: "Mesa Grande Road: Route, Map & Driving Notes | TougeMap",
    description: "Plan the Mesa Grande Road drive through San Diego's backcountry: switchbacks up, a long sightline straight across the mesa, and switchbacks back down.",
    updated,
    notes: [
      { text: "Mesa Grande runs 12.1 miles with 48 bends in a distinctive three-part shape: switchbacks climbing to the mesa top, a long straight across the plateau with enough sightline to see well ahead, then more tight turns on the way back down — the steepest grade in this batch at 8.8%. Pavement quality is good, kept up in part by the reservation land it crosses, though sand and gravel wash onto the road after rain. Watch the southern bridge specifically: taking that corner too fast puts you in the creek, not just off the shoulder.", source: { title: "PCA San Diego Region: Mesa Grande Road guide", url: "https://www.pcasdr.org/mesa-grande" } },
    ],
    connections: [
      { roadId: "palomar-south-grade", note: "Another Palomar & North County road to pair with this one." },
      { roadId: "highland-valley", note: "A nearby backcountry road in the same area." },
    ],
  },
  "tail-of-the-dragon": {
    heading: "Tail of the Dragon: Deals Gap to Chilhowee Lake",
    title: "Tail of the Dragon (US 129): Route, Map & Driving Notes | TougeMap",
    description: "Plan a run on the Tail of the Dragon: 318 curves in 11 miles, no intersections or driveways, and what that actually means for how the road drives.",
    updated: "2026-09-16",
    notes: [
      { text: "The Dragon packs 115 counted bends and 24 switchbacks into 11.0 miles — 10.5 bends per mile, in the same range as this catalog's tightest California roads, sustained over a much longer stretch than most of them manage. What makes it unusual isn't just the count: there are no intersections, driveways or side roads anywhere on it, so every vehicle on the road is there to drive it, not to get somewhere. Much of it also has no guardrail, with the road cut into the hillside above the Little Tennessee River gorge.", source: { title: "US129DragonsTail.com: Tail of the Dragon overview", url: "https://www.us129dragonstail.com/" } },
      { text: "Go on a weekday if you want the road to yourself; April through October is the season, and weekends bring heavy motorcycle and sports-car traffic in both directions on a road with no passing lanes. The road currently also carries detour traffic from I-40 repairs near the state line, so TDOT and NCDOT enforce a strict length limit — no truck-trailer combinations or single units over 30 ft — check current conditions before relying on it being clear.", source: { title: "TDOT: Tennessee 511 traveler information", url: "https://www.tn.gov/tdot/welcome-to-tennessee-511.html" } },
    ],
    connections: [
      { roadId: "cherohala-skyway", note: "A completely different character at the Robbinsville end: long sweepers over a much longer climb instead of tight switchbacks." },
    ],
  },
  "cherohala-skyway": {
    heading: "Cherohala Skyway: Tellico Plains to Robbinsville",
    title: "Cherohala Skyway: Route, Map & Driving Notes | TougeMap",
    description: "Plan the Cherohala Skyway: 41.6 miles of long, sweeping mountain curves climbing to over 5,300 ft between Tennessee and North Carolina, and what that means next to the Dragon's tight switchbacks.",
    updated: "2026-09-16",
    notes: [
      { text: "The Skyway is built for a completely different rhythm than the Dragon it connects to: 149 bends and 34 switchbacks sound similar until you spread them over 41.6 miles instead of 11 — a density of 3.6 per mile against the Dragon's 10.5. These are long, high-speed sweepers with real sightlines, not blind hairpins, climbing steadily to 5,382 ft. It rewards a smooth, sustained rhythm rather than the Dragon's braking-and-recovery demands.", source: { title: "National Scenic Byway Foundation: Cherohala Skyway", url: "https://nsbfoundation.com/nb/cherohala-skyway-nc/" } },
      { text: "The road closes without much warning above roughly 4,000 ft when ice or snow hits, typically November through March. North Carolina plows its side; Tennessee's side doesn't get the same treatment, so a closed gate at the Robbinsville end can mean the upper sections are out even when the Tennessee approach looks clear. Check current status before a winter or early-spring run.", source: { title: "Cherohala.org: winter conditions", url: "http://www.cherohala.org/winter.html" } },
    ],
    connections: [
      { roadId: "tail-of-the-dragon", note: "Meets US 129 at the Robbinsville end — a totally different, tighter road." },
    ],
  },
  "back-of-the-dragon": {
    heading: "Back of the Dragon: Marion to Tazewell",
    title: "Back of the Dragon (VA 16): Route, Map & Driving Notes | TougeMap",
    description: "Plan the Back of the Dragon: 32.7 miles of Virginia Route 16 over Clinch Mountain, Virginia's officially designated motorcycle route and the Dragon's sister road further north in the Appalachians.",
    updated: "2026-09-16",
    notes: [
      { text: "Back of the Dragon runs 32.7 miles from Marion to Tazewell with 156 counted bends and 36 switchbacks, crossing Clinch Mountain in the process — a longer, more sustained climb than the Dragon itself, with more total elevation change (8,413 ft of cumulative climb) even though its single steepest grade (8.2%) is milder. Speed limits swing from 25 mph through the two town centers to 55 mph on the open mountain sections, so the character changes more than on a road that's rural the whole way.", source: { title: "Back of the Dragon: the official route site", url: "https://backofthedragon.com/the-road/" } },
      { text: "This is Virginia's only officially designated motorcycle route, and it draws the same enthusiast community as the Dragon further south — the two roads are commonly driven as a pair by people touring the Appalachian touge circuit. Mountain sections ice over in winter; check current Virginia road conditions before relying on it being clear." },
    ],
    connections: [],
  },
};

export function getRoadGuide(id: string): RoadGuide | undefined {
  return roadGuides[id];
}

export const guidedRoadIds = Object.keys(roadGuides);
