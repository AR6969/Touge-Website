import catalog from "../data/roads.json";
import landmarkData from "../data/landmarks.json";
import { mapRegions, type MapRegion } from "./map-regions";

export type Road = {
  id: string;
  name: string;
  area: string;
  mapRegion?: MapRegion;
  access?: { note: string; url: string; checked: string };
  difficulty: number;
  character: string;
  description: string;
  sources: { title: string; url: string }[];
  center: [number, number];
  /** Overrides `center` as the map label anchor. */
  labelPoint?: [number, number];
  bounds: [[number, number], [number, number]];
  speed: { value: string; kind: string; note: string; source: string | null };
  mappedSpeed: string;
  taggedPercent: number;
  osmWayIds: number[];
  reviewed: string;
  /** Set when this road is one half of a road that was split in two. */
  splitFrom?: string;
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
export type RoadSummary = Pick<Road, "id" | "name" | "area" | "difficulty" | "character" | "description" | "access"> & {
  bounds: Road["bounds"];
  lengthMi: number;
  bends: number;
  speed: string;
};

export const roads = catalog as Road[];
export const bayAreaRoads = roads.filter(road => road.mapRegion !== "los-angeles");
export const losAngelesRoads = roads.filter(road => road.mapRegion === "los-angeles");

export function roadMapHref(road: Road) {
  return `${mapRegions[road.mapRegion ?? "bay-area"].href}?road=${encodeURIComponent(road.id)}`;
}

/** Named junctions worth marking on the map. Editorial, hand-maintained. */
export type Landmark = {
  id: string; name: string; kind: string; note: string;
  sourceUrl?: string;
  sourceLabel?: string;
  coordinates: [number, number];
};
export const landmarks = landmarkData as Landmark[];

const byCurvature = [...roads].sort((a, b) => b.shape.curvature - a.shape.curvature);
const curvatureRanks = new Map(byCurvature.map((road, index) => [road.id, index + 1]));

/**
 * Ranked by Touge Score. DORMANT: the score is computed and stored on every
 * road, but nothing in the UI shows it right now. See docs/touge-score.md for
 * what it is and how to put it back.
 */
export const byScore = [...roads].sort((a, b) => b.score.score - a.score.score || a.name.localeCompare(b.name));
const scoreRanks = new Map(byScore.map((road, index) => [road.id, index + 1]));

export function scoreRank(road: Road) {
  return scoreRanks.get(road.id) ?? roads.length;
}

// "Demanding", not "Technical": difficulty 3 and the "Technical" character are
// separate axes, and sharing a word made the map legend unreadable.
export const difficultyLabels = ["Relaxed", "Winding", "Demanding"];

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
    access: road.access,
    bounds: road.bounds,
    lengthMi: road.shape.lengthMi,
    bends: road.shape.bends,
    speed: speedGuide(road).value,
  };
}

/** Summarise the source values as a range. Never invent a limit by averaging. */
export function speedGuide(road: Road) {
  if (road.mapRegion === "los-angeles") {
    return { value: road.speed.kind === "Published limits" ? road.speed.value : "Varies", note: road.speed.note };
  }
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
