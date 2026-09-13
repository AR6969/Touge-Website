import type { Feature, LineString, MultiLineString, Position } from "geojson";
import type { DriveSection } from "./drives";

export type RoadTrace = Feature<LineString | MultiLineString>;

function distanceMeters(a: Position, b: Position) {
  const dx = (a[0] - b[0]) * Math.cos((a[1] + b[1]) * Math.PI / 360);
  return Math.hypot(dx, a[1] - b[1]) * 111_320;
}

/**
 * Keep only the selected part of one continuous road trace, in driving order.
 * Endpoints snap to existing OSM vertices, never to a straight-line shortcut.
 * A disconnected trace or distant anchor fails instead of inventing a route.
 */
export function selectDriveSection(feature: RoadTrace, section?: DriveSection): RoadTrace {
  if (!section) return feature;
  const lines = feature.geometry.type === "LineString"
    ? [feature.geometry.coordinates] : feature.geometry.coordinates;
  let best: { points: Position[]; from: number; to: number; error: number } | undefined;
  for (const points of lines) {
    const nearest = (target: Position) => points.reduce((index, point, i) =>
      distanceMeters(point, target) < distanceMeters(points[index], target) ? i : index, 0);
    if (points.length < 2) continue;
    const from = nearest(section.from);
    const to = nearest(section.to);
    const fromError = distanceMeters(points[from], section.from);
    const toError = distanceMeters(points[to], section.to);
    if (from === to || fromError > 100 || toError > 100) continue;
    const error = fromError + toError;
    if (!best || error < best.error) best = { points, from, to, error };
  }
  if (!best) throw new Error("The selected drive section is missing from the road trace.");
  const coordinates = best.points.slice(Math.min(best.from, best.to), Math.max(best.from, best.to) + 1);
  if (best.from > best.to) coordinates.reverse();
  return { ...feature, geometry: { type: "LineString", coordinates } };
}

export function traceBounds(features: RoadTrace[]): [[number, number], [number, number]] | null {
  const points = features.flatMap(feature => feature.geometry.type === "LineString"
    ? feature.geometry.coordinates : feature.geometry.coordinates.flat());
  if (!points.length) return null;
  return [
    [Math.min(...points.map(p => p[0])), Math.min(...points.map(p => p[1]))],
    [Math.max(...points.map(p => p[0])), Math.max(...points.map(p => p[1]))],
  ];
}
