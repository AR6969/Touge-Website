export type Drive = {
  slug: string;
  title: string;
  description: string;
  character: string;
  start: string;
  finish: string;
  route: string[];
  intro: string;
  appeal: string;
  steps: { title: string; text: string; roadId: string }[];
  stops: { name: string; text: string; url?: string }[];
  returnRoute: string;
  sources: { title: string; url: string }[];
  updated: string;
};

export const drives: Drive[] = [
  {
    slug: "highway-9-skyline-pescadero-coastal-drive",
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
    updated: "2026-09-09",
  },
  {
    slug: "page-mill-skyline-alices-driving-route",
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
    updated: "2026-09-09",
  },
];

export function getDrive(slug: string) {
  return drives.find(drive => drive.slug === slug);
}
