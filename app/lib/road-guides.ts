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
    description: "Follow Pescadero Creek Road through Loma Mar toward Pescadero and Highway 1. Explore the map, redwood stops and a connected Santa Cruz Mountains drive.",
    updated,
    notes: [
      { text: "Pescadero Creek Road brings a change of scenery to a Peninsula drive: redwoods around Loma Mar, then the country around Pescadero and the coast. Memorial Park sits on this road and gives you a place to plan a proper stop among the redwoods. Check the park’s visitor information if you want to combine the drive with a walk.", source: { title: "San Mateo County: Memorial Park", url: "https://www.smcgov.org/parks/memorial-park" } },
      { text: "At the coast, Pescadero Creek Road meets Highway 1 beside the southern access to Pescadero State Beach. This makes the road a useful link in a mountain-to-ocean outing. Use the coastal driving guide for the full Highway 9–Skyline–Highway 84 approach and decide which direction you want to take on Highway 1 before reaching the coast.", source: { title: "State Parks: Pescadero beach access", url: "https://parks.ca.gov/?page_id=522" } },
      { text: "Leave time for downtown Pescadero before the beach. It’s small, full of character and a lovely coffee stop between the redwoods and Highway 1." },
    ],
    connections: [
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
    description: "Explore Latigo Canyon Road from Malibu’s PCH into the Santa Monica Mountains. Map, tight bends, canyon-road connections and practical planning notes.",
    updated,
    notes: [
      { text: "Latigo climbs away from Pacific Coast Highway into the Santa Monica Mountains, with repeated bends through the canyon. It is an involved mountain leg to pair with a coastal outing. The upper road also provides access to the Backbone Trail, so watch for people entering and leaving the trailhead area.", source: { title: "LA County Parks: Latigo Canyon trailhead access", url: "https://trails.lacounty.gov/Trail/74/backbone-trail---latigo-canyon" } },
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
};

export function getRoadGuide(id: string): RoadGuide | undefined {
  return roadGuides[id];
}

export const guidedRoadIds = Object.keys(roadGuides);
