import catalog from "../data/roads.json";

export type Road = {
  id: string;
  name: string;
  area: string;
  difficulty: number;
  character: string;
  description: string;
  sources: { title: string; url: string }[];
  center: [number, number];
  bounds: [[number, number], [number, number]];
  speed: { value: string; kind: string; note: string; source: string | null };
  mappedSpeed: string;
  taggedPercent: number;
  osmWayIds: number[];
  reviewed: string;
  shape: { lengthMi: number; bends: number; switchbacks: number; curvature: number; bendsPerMile: number };
  /** Null only if elevation has not been fetched for this road yet. */
  elevation: {
    climbFt: number; highFt: number; lowFt: number;
    reliefFt: number; maxGradient: number; climbPerMile: number;
  } | null;
  /** Elevation in feet along the longest continuous segment, for the profile chart. */
  profile: { points: number[]; miles: number; coverage: number } | null;
  /** The Touge Score and the three weighted parts it is made of. See /method. */
  score: { score: number; corners: number; climb: number; technical: number };
};

/** What the map component needs. Everything else stays on the server. */
export type RoadSummary = Pick<Road, "id" | "name" | "area" | "difficulty" | "character" | "description"> & {
  bounds: Road["bounds"];
  lengthMi: number;
  bends: number;
  speed: string;
  score: number;
};

export const roads = catalog as Road[];

const byCurvature = [...roads].sort((a, b) => b.shape.curvature - a.shape.curvature);
const curvatureRanks = new Map(byCurvature.map((road, index) => [road.id, index + 1]));

/** Ranked by Touge Score, the site's headline ordering. */
export const byScore = [...roads].sort((a, b) => b.score.score - a.score.score || a.name.localeCompare(b.name));
const scoreRanks = new Map(byScore.map((road, index) => [road.id, index + 1]));

export function scoreRank(road: Road) {
  return scoreRanks.get(road.id) ?? roads.length;
}

export const difficultyColors = ["#78caba", "#eac47c", "#e99488"];
export const difficultyLabels = ["Relaxed", "Winding", "Technical"];

export function getRoad(id: string) {
  return roads.find(road => road.id === id);
}

/** Rank by degrees of direction change per mile, 1 = curviest in the collection. */
export function curvatureRank(road: Road) {
  return curvatureRanks.get(road.id) ?? roads.length;
}

export const curviest = byCurvature;
export const longest = [...roads].sort((a, b) => b.shape.lengthMi - a.shape.lengthMi);

export function slugifyArea(area: string) {
  return area.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export const regions = [...new Set(roads.map(road => road.area))]
  .map(area => ({ area, slug: slugifyArea(area), roads: roads.filter(road => road.area === area) }))
  .sort((a, b) => b.roads.length - a.roads.length || a.area.localeCompare(b.area));

export function getRegion(slug: string) {
  return regions.find(region => region.slug === slug);
}

function distanceMi(a: Road, b: Road) {
  const [x1, y1] = a.center;
  const [x2, y2] = b.center;
  // Equirectangular is accurate enough to order neighbours within one region.
  const x = (x2 - x1) * Math.cos(((y1 + y2) / 2) * (Math.PI / 180));
  return Math.hypot(x, y2 - y1) * 69;
}

/** Nearest roads by centre point, for internal links between road pages. */
export function nearbyRoads(road: Road, count = 4) {
  return roads
    .filter(other => other.id !== road.id)
    .map(other => ({ road: other, miles: distanceMi(road, other) }))
    .sort((a, b) => a.miles - b.miles)
    .slice(0, count);
}

export function toSummary(road: Road): RoadSummary {
  return {
    id: road.id,
    name: road.name,
    area: road.area,
    difficulty: road.difficulty,
    character: road.character,
    description: road.description,
    bounds: road.bounds,
    lengthMi: road.shape.lengthMi,
    bends: road.shape.bends,
    speed: speedGuide(road).value,
    score: road.score.score,
  };
}

/** Summarise the source values as a range. Never invent a limit by averaging. */
export function speedGuide(road: Road) {
  if (road.id === "highway-1-coast") {
    return { value: "55 mph", note: "Open stretches; lower limits through towns and some coastal sections." };
  }
  const values = road.speed.value.match(/\d+/g)?.map(Number) ?? [];
  if (!values.length) return { value: "Varies", note: "Check posted signs along the road." };
  const low = Math.min(...values);
  const high = Math.max(...values);
  return {
    value: low === high ? `${low} mph` : `${low}–${high} mph`,
    note: sectionNotes[road.id] ?? "Approximate guide; limits vary by section. Follow posted signs.",
  };
}

const sectionNotes: Record<string, string> = {
  pescadero: "35 mph near Pescadero; other sections vary.",
  "bear-creek": "30–35 mph in the documented sections; limits vary elsewhere.",
  empire: "40 mph outside Santa Cruz city limits; city sections vary.",
  soquel: "35 mph near Soquel, then 40 mph toward Summit Road.",
  "bonny-doon": "35 mph in the section north of Pine Flat Road; other sections vary.",
  marshall: "40 mph in the documented section; check signs elsewhere.",
  umunhum: "Lower speeds may be needed at bends. Follow posted signs.",
  "17-mile": "25 mph in residential and school zones; other sections vary.",
};
