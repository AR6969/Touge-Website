export type ReadingLink = {
  title: string;
  publisher: string;
  url: string;
  /** Publication date (YYYY-MM-DD), shown so readers can judge how current it is. Empty for reference pages with no single date. */
  published: string;
  /** One line on what the piece adds, in our words. */
  note: string;
};

// Outside writing worth reading about a road: history, culture, rider
// perspective. Kept separate from road-guides.ts, where every note's source
// backs a specific claim on the page. These links aren't cited for a fact;
// they're recommended reading, so they get their own section and label.
//
// Use the article's own published title, link the original publisher (not a
// syndicated copy), and add the date. Check each link still loads before
// adding it.
const reading: Record<string, ReadingLink[]> = {
  "the-snake": [
    {
      title: "One of SoCal's most infamous roads has reopened, but locals don't want you to know — for good reason",
      publisher: "LAist",
      url: "https://laist.com/news/la-history/an-iconic-stretch-of-mulholland-called-the-snake-has-reopened-ever-so-quietly-heres-its-roaring-history",
      published: "2025-12-06",
      note: "The Snake's reopening after about seven years closed, its history with James Dean and Steve McQueen, and why neighbors are wary.",
    },
    {
      title: "Riding Harleys on the Mulholland Snake",
      publisher: "2LaneLife",
      url: "https://2lanelife.com/blogs/news/thesnake",
      published: "2025-12-10",
      note: "A rider's take on the reopening, and the mudslides, fires and late-night racing complaints that kept it shut.",
    },
    {
      title: "Mulholland Is Burning: How the Iconic Rock Store Survived the Woolsey Fire",
      publisher: "The Drive",
      url: "https://www.thedrive.com/news/25457/mulholland-is-burning-how-the-iconic-rock-store-survived-the-woolsey-fire",
      published: "2018-12-17",
      note: "The story of the Rock Store at the foot of the Snake, a family grocery since 1961, and how it was saved in 2018.",
    },
  ],
  "mulholland-highway-malibu": [
    {
      title: "Mulholland Highway Is Improbable Perfection",
      publisher: "Motorcyclist",
      url: "https://motorcyclistonline.com/mulholland-highway-is-improbable-perfection",
      published: "2018-05-02",
      note: "A rider's guide to the whole highway: the Snake, the Rock Store, and the canyon roads that branch down to the coast.",
    },
    {
      title: "Mulholland Is Burning: How the Iconic Rock Store Survived the Woolsey Fire",
      publisher: "The Drive",
      url: "https://www.thedrive.com/news/25457/mulholland-is-burning-how-the-iconic-rock-store-survived-the-woolsey-fire",
      published: "2018-12-17",
      note: "History of the Rock Store, the motorcycle stop at the Snake's western end.",
    },
    {
      title: "The Paramount Ranch is rising from the ashes after its destruction in the 2018 Woolsey Fire",
      publisher: "KCLU",
      url: "https://www.kclu.org/local-news/2026-09-08/the-paramount-ranch-is-rising-from-the-ashes-after-its-destruction-in-the-2018-woolsey-fire",
      published: "2026-09-08",
      note: "The $26 million rebuild of the movie ranch near Cornell, aiming to reopen for its 2027 centennial.",
    },
    {
      title: "Paramount: Past, Present, and Future",
      publisher: "National Park Service",
      url: "https://www.nps.gov/samo/learn/historyculture/paramount-past-present-and-future.htm",
      published: "",
      note: "The ranch's history from 1927, and what the fire took.",
    },
  ],
  "tail-of-the-dragon": [
    {
      title: "Tail of the Dragon: A road trip for people who love driving",
      publisher: "The Globe and Mail",
      url: "https://www.theglobeandmail.com/globe-drive/news/off-the-streets/tail-of-the-dragon-a-road-trip-for-people-who-love-driving/article19467615/",
      published: "2014-07-07",
      note: "Peter Cheney drives the Dragon: bootlegger history, the Tree of Shame, and the photographers who shoot every car.",
    },
    {
      title: "How The Fugitive Pulled Off Its Brilliant Dam Jump Scene",
      publisher: "SlashFilm",
      url: "https://www.slashfilm.com/815419/how-the-fugitive-pulled-off-its-brilliant-dam-jump-scene/",
      published: "2022-03-29",
      note: "How the dam jump was filmed at Cheoah Dam, just down US 129 from Deals Gap.",
    },
    {
      title: "The Dragon Motorcycle Ride - World Famous Motorcycle Road (AKA Deals Gap Motorcycle Ride)",
      publisher: "Motorcycle Roads",
      url: "https://motorcycleroads.com/motorcycle-articles/the-dragon-motorcycle-ride-world-famous-motorcycle-road-aka-deals-gap",
      published: "",
      note: "A rider's guide to the Dragon, with rider reviews and nearby routes.",
    },
    {
      title: "Deals Gap, North Carolina",
      publisher: "Wikipedia",
      url: "https://en.wikipedia.org/wiki/Deals_Gap,_North_Carolina",
      published: "",
      note: "Background on the gap, the road's name, speed limits and crash history.",
    },
  ],
  "cherohala-skyway": [
    {
      title: "The Long & Winding Road",
      publisher: "WNC Magazine",
      url: "https://wncmagazine.com/feature/long_winding_road",
      published: "2012-10-01",
      note: "The 34-year fight to build the Skyway, from a 1958 Kiwanis meeting and wagon trains to the 1996 opening.",
    },
    {
      title: "1996: The Completion of the Cherohala Skyway",
      publisher: "Transportation History",
      url: "https://transportationhistory.org/2022/10/12/1996-its-just-majestic-the-completion-of-the-cherohala-skyway/",
      published: "2022-10-12",
      note: "A short history marking the anniversary of the Skyway's dedication.",
    },
  ],
  "moonshiner-28": [
    {
      title: "A Secret Two-Lane Route Through North Carolina's Moonshine Country Offers A Scenic Crowd-Free Road Trip",
      publisher: "Islands",
      url: "https://www.islands.com/1912945/secret-scenic-two-lane-route-moonshiner-28-north-carolina-moonshine-country-crowd-free-road-trip/",
      published: "2025-07-20",
      note: "Where the Moonshiner 28 name comes from and what to see along the way.",
    },
    {
      title: "Fontana Dam (Q-53)",
      publisher: "NC Department of Natural and Cultural Resources",
      url: "https://www.dncr.nc.gov/blog/2024/01/23/fontana-dam-q-53",
      published: "2024-01-23",
      note: "The state historical marker story of the TVA dam that reshaped NC 28.",
    },
  ],
  "foothills-parkway": [
    {
      title: "A Step Closer to Completing the \"Missing Link\"",
      publisher: "National Park Service",
      url: "https://www.nps.gov/grsm/learn/news/bridge-2-complete.htm",
      published: "",
      note: "The park's own account of the bridges that finally closed the Missing Link.",
    },
  ],
  "yerba-buena-little-sycamore": [
    {
      title: "Go On Location: Los Angeles Locations from The Fast and the Furious Movies",
      publisher: "Discover Los Angeles",
      url: "https://www.discoverlosangeles.com/things-to-do/go-on-location-los-angeles-locations-from-the-fast-and-the-furious-movies",
      published: "2024-11-20",
      note: "Neptune's Net and the other real LA locations from the franchise.",
    },
    {
      title: "Neptune's Net",
      publisher: "Wikipedia",
      url: "https://en.wikipedia.org/wiki/Neptune%27s_Net",
      published: "",
      note: "History of the county-line seafood stop at the bottom of Yerba Buena.",
    },
  ],
  "malibu-canyon-las-virgenes": [
    {
      title: "Movies and TV",
      publisher: "Malibu Creek State Park",
      url: "https://malibucreekstatepark.org/about/movies-tv/",
      published: "",
      note: "The park's film history: the Fox Ranch years, M*A*S*H and Planet of the Apes.",
    },
  ],
};

export function readingForRoad(roadId: string): ReadingLink[] {
  return reading[roadId] ?? [];
}
