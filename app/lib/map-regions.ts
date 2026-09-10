export type MapRegion = "bay-area" | "los-angeles" | "san-diego";

export const mapRegions: Record<MapRegion, {
  name: string;
  href: string;
  pickerTitle: string;
  center: [number, number];
  bounds: [[number, number], [number, number]];
}> = {
  "bay-area": {
    name: "Bay Area",
    href: "/",
    pickerTitle: "Bay Area & nearby drives",
    center: [-122.10, 37.57],
    bounds: [[-123.13, 36.42], [-121.35, 38.80]],
  },
  "los-angeles": {
    name: "Los Angeles",
    href: "/los-angeles",
    pickerTitle: "LA, Malibu & Orange County",
    center: [-118.22, 34.02],
    // Widened east and west of the city: the roads people drive from LA include
    // the San Bernardino and San Jacinto mountains and the Ojai back country.
    bounds: [[-119.45, 33.40], [-116.55, 34.65]],
  },
  "san-diego": {
    name: "San Diego",
    href: "/san-diego",
    pickerTitle: "San Diego & the backcountry",
    center: [-116.90, 33.15],
    bounds: [[-117.45, 32.75], [-116.25, 33.55]],
  },
};
