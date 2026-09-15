import type { MetadataRoute } from "next";
import { siteUrl } from "./lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    // Query-string map selections remain crawlable; each map page supplies its
    // clean canonical URL. Blocking those URLs hides that signal from crawlers.
    rules: { userAgent: "*", allow: "/" },
    sitemap: [`${siteUrl}/sitemap.xml`, `${siteUrl}/video-sitemap.xml`],
    host: siteUrl,
  };
}
