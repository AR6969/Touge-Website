export type ReadingLink = {
  title: string;
  publisher: string;
  url: string;
  /** Publication date (YYYY-MM-DD), shown so readers can judge how current it is. */
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
  ],
};

export function readingForRoad(roadId: string): ReadingLink[] {
  return reading[roadId] ?? [];
}
