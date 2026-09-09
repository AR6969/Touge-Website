import type { MetadataRoute } from "next";
import { siteUrl } from "./lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    // `?road=` is a map deep-link into the same page as `/`; the canonical tag
    // already points there, and this keeps the duplicates out of the crawl.
    rules: { userAgent: "*", allow: "/", disallow: "/?road=" },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
