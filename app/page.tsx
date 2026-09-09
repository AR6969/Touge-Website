import type { Metadata } from "next";
import Link from "next/link";
import RoadExplorer from "./road-explorer";
import { SiteFooter, SiteHeader } from "./site-chrome";
import { curviest, landmarks, roads, toSummary } from "./lib/roads";
import { siteName, siteUrl } from "./lib/site";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const tagline =
  `${roads.length} driving roads across the Bay Area, Santa Cruz, Napa and Monterey, with corners counted from OpenStreetMap geometry.`;
const totalMiles = Math.round(roads.reduce((sum, road) => sum + road.shape.lengthMi, 0));
const totalBends = roads.reduce((sum, road) => sum + road.shape.bends, 0);

export default function Home() {
  const structured = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebSite", name: siteName, url: siteUrl, description: tagline, inLanguage: "en-US" },
      {
        "@type": "ItemList",
        name: "Best driving roads in the Bay Area and Northern California",
        numberOfItems: curviest.length,
        itemListElement: curviest.map((road, index) => ({
          "@type": "ListItem",
          position: index + 1,
          url: `${siteUrl}/roads/${road.id}`,
          name: road.name,
        })),
      },
    ],
  };

  return (
    <>
      <SiteHeader current="map" />
      <div className="explorer">
        <RoadExplorer roads={roads.map(toSummary)} landmarks={landmarks} />
      </div>

      {/* Below the fold: the first screen stays pure map. This strip exists so the
          page still states what it is, and so crawlers reach the road pages from
          here rather than from the sitemap alone. */}
      <main className="home-intro">
        <h1>Best driving roads in the Bay Area &amp; Northern California</h1>
        <p>
          {roads.length} roads, {totalMiles} miles and {totalBends.toLocaleString()} counted bends — across the
          Peninsula, the Santa Cruz Mountains, the East Bay, Marin, Napa and Monterey. Every road has its own page
          with corners counted from its mapped centreline, elevation measured from USGS data, and the source behind
          any speed figure shown.
        </p>
        <nav className="home-links" aria-label="Sections">
          <Link href="/roads"><strong>All {roads.length} roads</strong><span>Ranked and compared in one table</span></Link>
          <Link href="/regions"><strong>Browse by region</strong><span>From the Peninsula to Monterey</span></Link>
          <Link href={`/roads/${curviest[0].id}`}><strong>Curviest road</strong><span>{curviest[0].name}, {curviest[0].shape.curvature}°/mile</span></Link>
          <Link href="/method"><strong>How this is built</strong><span>Ratings, measurements and sources</span></Link>
        </nav>
      </main>

      <SiteFooter />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structured).replace(/</g, "\\u003c") }} />
    </>
  );
}
