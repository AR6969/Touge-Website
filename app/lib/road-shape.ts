import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { selectDriveSection, type RoadTrace } from "./drive-geometry";
import type { Drive } from "./drives";

type Line = [number, number][];

function readLines(geojson: { type: string; features?: unknown[] } & Record<string, unknown>): Line[] {
  const features = geojson.type === "FeatureCollection" ? (geojson.features as Record<string, unknown>[]) : [geojson];
  return features.flatMap(feature => {
    const geometry = feature.geometry as { type: string; coordinates: Line[] | Line };
    return geometry.type === "MultiLineString" ? (geometry.coordinates as Line[]) : [geometry.coordinates as Line];
  });
}

async function loadLines(file: string) {
  return readLines(JSON.parse(await readFile(join(process.cwd(), "public/data", file), "utf8")));
}

/**
 * Render road geometry as an SVG data URI, fitted to `width` x `height`.
 *
 * Satori (which backs ImageResponse) cannot render SVG child elements directly,
 * so the drawing is handed to it as an <img> source instead.
 */
function toDataUri(lines: Line[], width: number, height: number, stroke: string, strokeWidth: number) {
  const points = lines.flat();
  const lat0 = (points.reduce((sum, [, y]) => sum + y, 0) / points.length) * (Math.PI / 180);
  const projected = lines.map(line => line.map(([x, y]) => [x * Math.cos(lat0), y] as [number, number]));
  const flat = projected.flat();

  const minX = Math.min(...flat.map(p => p[0]));
  const maxX = Math.max(...flat.map(p => p[0]));
  const minY = Math.min(...flat.map(p => p[1]));
  const maxY = Math.max(...flat.map(p => p[1]));

  const pad = strokeWidth;
  const scale = Math.min((width - pad * 2) / (maxX - minX || 1), (height - pad * 2) / (maxY - minY || 1));
  const offsetX = (width - (maxX - minX) * scale) / 2;
  const offsetY = (height - (maxY - minY) * scale) / 2;

  const paths = projected
    .map(line => {
      const d = line
        // SVG y grows downward; latitude grows upward.
        .map(([x, y], i) => `${i ? "L" : "M"}${(offsetX + (x - minX) * scale).toFixed(1)} ${(height - offsetY - (y - minY) * scale).toFixed(1)}`)
        .join("");
      return `<path d="${d}"/>`;
    })
    .join("");

  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">` +
    `<g fill="none" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round">${paths}</g>` +
    `</svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/** One road's trace, for its own share card. */
export async function roadShapeUri(id: string, width: number, height: number, stroke: string) {
  return toDataUri(await loadLines(`roads/${id}.geojson`), width, height, stroke, 7);
}

/** Every road at once, for the site-wide share card. */
export async function collectionShapeUri(width: number, height: number, stroke: string) {
  return toDataUri(await loadLines("roads.geojson"), width, height, stroke, 2.5);
}

/** The same selected road sections as a driving guide's map. */
export async function driveShapeUri(drive: Drive, width: number, height: number, stroke: string) {
  const lines = await Promise.all(drive.steps.filter(step => step.roadId).map(async step => {
    const feature = JSON.parse(await readFile(join(process.cwd(), "public/data/roads", `${step.roadId}.geojson`), "utf8")) as RoadTrace;
    return readLines(selectDriveSection(feature, step.mapSection) as unknown as Parameters<typeof readLines>[0]);
  }));
  return toDataUri(lines.flat(), width, height, stroke, 7);
}
