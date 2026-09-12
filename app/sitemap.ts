import type { MetadataRoute } from "next";
import { regions, roads } from "./lib/roads";
import { siteUrl } from "./lib/site";
import { drives } from "./lib/drives";

export default function sitemap(): MetadataRoute.Sitemap {
  // The catalog records the date its sources were last reviewed.
  const lastModified = new Date(roads[0].reviewed);

  return [
    { url: siteUrl, lastModified, changeFrequency: "monthly", priority: 1 },
    { url: `${siteUrl}/san-diego`, lastModified, changeFrequency: "monthly", priority: 0.9 },
    { url: `${siteUrl}/los-angeles`, lastModified: new Date("2026-09-09"), changeFrequency: "monthly", priority: 0.9 },
    { url: `${siteUrl}/roads`, lastModified, changeFrequency: "monthly", priority: 0.9 },
    { url: `${siteUrl}/regions`, lastModified, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteUrl}/method`, lastModified, changeFrequency: "yearly", priority: 0.4 },
    { url: `${siteUrl}/drives`, lastModified: new Date(drives[0].updated), changeFrequency: "monthly", priority: 0.8 },
    ...drives.map(drive => ({
      url: `${siteUrl}/drives/${drive.slug}`,
      lastModified: new Date(drive.updated),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...regions.map(region => ({
      url: `${siteUrl}/regions/${region.slug}`,
      lastModified,
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
