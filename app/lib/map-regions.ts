export type MapRegion = "bay-area" | "los-angeles";

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
    bounds: [[-119.02, 33.44], [-117.34, 34.36]],
  },
};
