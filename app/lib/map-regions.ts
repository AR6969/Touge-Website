export type MapRegion = "california" | "bay-area" | "los-angeles" | "san-diego" | "sierra" | "southern-appalachians";

// The state a region belongs to. California's regions keep their existing
// flat paths and their own in-map tab switcher (see site-chrome.tsx); a
// region belonging to a different state gets its own dedicated page instead
// of joining that switcher, since swapping states is a bigger jump than
// swapping California sub-regions.
export type StateId = "california" | "southern-appalachians";

export const states: Record<StateId, { name: string }> = {
  california: { name: "California" },
  "southern-appalachians": { name: "Southern Appalachians" },
};

export const mapRegions: Record<MapRegion, {
  name: string;
  href: string;
  pickerTitle: string;
  state: StateId;
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
    href: "/?region=california",
    pickerTitle: "All California roads",
    state: "california",
    center: [-119.5, 36.7],
    bounds: [[-123.45, 32.55], [-116.05, 39.05]],
  },
  "bay-area": {
    name: "Bay Area",
    href: "/?region=bay-area",
    pickerTitle: "Bay Area & nearby drives",
    state: "california",
    center: [-122.10, 37.57],
    // Santa Cruz up to Point Reyes, Pacific across to Mount Hamilton.
    bounds: [[-122.95, 36.94], [-121.55, 38.12]],
  },
  "los-angeles": {
    name: "Los Angeles",
    href: "/los-angeles",
    pickerTitle: "LA, Malibu & Orange County",
    state: "california",
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
    state: "california",
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
    state: "california",
    center: [-118.70, 37.20],
    // Sonora Pass in the north to Horseshoe Meadow in the south, the 395
    // corridor roughly down the middle, plus the western-slope Hwy 168 climb.
    bounds: [[-119.55, 36.30], [-117.85, 38.55]],
  },
  "southern-appalachians": {
    name: "Southern Appalachians",
    href: "/southern-appalachians",
    pickerTitle: "Tail of the Dragon & the Smokies",
    state: "southern-appalachians",
    center: [-83.93, 35.55],
    // Framed around the Deals Gap / Chilhowee Lake cluster with room to grow
    // toward the Cherohala Skyway and North Georgia without needing a resize.
    bounds: [[-84.35, 35.15], [-83.30, 35.80]],
  },
};
