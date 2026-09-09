import type { MetadataRoute } from "next";
import { siteUrl } from "./lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    // `/?road=` now 308s to /bay-area, so let crawlers follow it and consolidate
    // rather than blocking the redirect they need to see.
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
