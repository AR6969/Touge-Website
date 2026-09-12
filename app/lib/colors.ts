/**
 * One colour system for the whole site.
 *
 * Colour encodes ROAD CHARACTER, because that is the axis the map filter uses:
 * if colour meant anything else, the filter buttons could never agree with the
 * roads they filter. Difficulty is shown as a number (2/3) instead, so the two
 * axes never compete for the same visual channel.
 *
 * Kept free of data imports on purpose — the map is a client component, and
 * importing from lib/roads.ts would pull the whole road catalog into the
 * browser bundle.
 *
 * Four hues rather than four shades, so they stay separable for colour-blind
 * readers and at the 2 px width the map draws at low zoom.
 */
export const characters = ["Technical", "Low speed", "Medium speed", "High speed"] as const;
export type Character = (typeof characters)[number];

export const characterColors: Record<string, string> = {
  Technical: "#ff7d6b",       // coral
  "Low speed": "#c79af0",     // violet
  "Medium speed": "#5fd68a",  // green
  "High speed": "#79cdf2",    // sky
};

// Amber reads as "point of interest" without competing with any road colour.
export const landmarkColor = "#ffc861";

export function colorFor(character: string) {
  return characterColors[character] ?? "#9fb0a4";
}
