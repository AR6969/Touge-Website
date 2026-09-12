export type MapRegion = "california" | "bay-area" | "los-angeles" | "san-diego" | "sierra";

export const mapRegions: Record<MapRegion, {
  name: string;
  href: string;
  pickerTitle: string;
  center: [number, number];
  /**
   * The frame the map opens to — not the region's full data extent. Fitting the
   * outermost roads (Carmel Valley to Mount St. Helena, say) opens so far out
   * that the core is unreadable, so these frame the dense middle and leave the
   * outliers to be found by panning.
   */
  bounds: [[number, number], [number, number]];
}> = {
  california: {
    name: "California",
    href: "/",
    pickerTitle: "All California roads",
    center: [-119.5, 36.7],
    bounds: [[-123.45, 32.55], [-116.05, 39.05]],
  },
  "bay-area": {
    name: "Bay Area",
    href: "/?region=bay-area",
    pickerTitle: "Bay Area & nearby drives",
    center: [-122.10, 37.57],
    // Santa Cruz up to Point Reyes, Pacific across to Mount Hamilton.
    bounds: [[-122.95, 36.94], [-121.55, 38.12]],
  },
  "los-angeles": {
    name: "Los Angeles",
    href: "/los-angeles",
    pickerTitle: "LA, Malibu & Orange County",
    center: [-118.22, 34.02],
    // Wide east and west of the city, because the roads people drive from LA
    // reach the San Bernardino and San Jacinto mountains and the Ojai back
    // country — but drawn in enough that the city itself is still legible.
    bounds: [[-119.30, 33.46], [-116.70, 34.60]],
  },
  "san-diego": {
    name: "San Diego",
    href: "/san-diego",
    pickerTitle: "San Diego & the backcountry",
    center: [-116.90, 33.15],
    bounds: [[-117.45, 32.75], [-116.25, 33.55]],
  },
  sierra: {
    name: "Sierra Nevada",
    // No dedicated page or nav tab by design — these roads are reached by
    // panning the statewide map, not a peer region. This href only matters
    // for roadMapHref(), so a Sierra road's own "view on map" link lands on
    // the view that actually contains it.
    href: "/?region=california",
    pickerTitle: "High Sierra passes & canyons",
    center: [-118.70, 37.20],
    // Sonora Pass in the north to Horseshoe Meadow in the south, the 395
    // corridor roughly down the middle, plus the western-slope Hwy 168 climb.
    bounds: [[-119.55, 36.30], [-117.85, 38.55]],
  },
};
