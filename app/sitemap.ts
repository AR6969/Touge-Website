import type { MetadataRoute } from "next";
import { regions, roads } from "./lib/roads";
import { siteUrl } from "./lib/site";
import { drives } from "./lib/drives";

function latestDate(dates: string[]) {
  const timestamps = dates.map(date => Date.parse(date)).filter(Number.isFinite);
  return timestamps.length ? new Date(Math.max(...timestamps)) : undefined;
}

export default function sitemap(): MetadataRoute.Sitemap {
  // Collection pages change when any included road/guide changes, not just the
  // first entry in an editorially ordered array. Do not stamp every URL at build.
  const lastModified = latestDate(roads.map(road => road.reviewed));
  const indexUpdated = "2026-09-13";

  return [
    { url: siteUrl, lastModified, changeFrequency: "monthly", priority: 1 },
    ...(["san-diego", "los-angeles"] as const).map(region => ({
      url: `${siteUrl}/${region}`,
      lastModified: latestDate(roads.filter(road => road.mapRegion === region).map(road => road.reviewed)),
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
    { url: `${siteUrl}/roads`, lastModified: latestDate([indexUpdated, ...roads.map(road => road.reviewed)]), changeFrequency: "monthly", priority: 0.9 },
    { url: `${siteUrl}/regions`, lastModified: latestDate([indexUpdated, ...roads.map(road => road.reviewed)]), changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteUrl}/method`, changeFrequency: "yearly", priority: 0.4 },
    { url: `${siteUrl}/contact`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${siteUrl}/legal`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${siteUrl}/drives`, lastModified: latestDate(drives.map(drive => drive.updated)), changeFrequency: "monthly", priority: 0.8 },
    ...drives.map(drive => ({
      url: `${siteUrl}/drives/${drive.slug}`,
      lastModified: new Date(drive.updated),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...regions.map(region => ({
      url: `${siteUrl}/regions/${region.slug}`,
      lastModified: latestDate([
        indexUpdated,
        ...region.roads.map(road => road.reviewed),
        ...drives.filter(drive => drive.steps.some(step => region.roads.some(road => road.id === step.roadId))).map(drive => drive.updated),
      ]),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...roads.map(road => ({
      url: `${siteUrl}/roads/${road.id}`,
      lastModified: new Date(road.reviewed),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
