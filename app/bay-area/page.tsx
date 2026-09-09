import type { Metadata } from "next";
import RoadExplorer from "../road-explorer";
import MapIntro from "../map-intro";
import { SiteFooter, SiteHeader } from "../site-chrome";
import { bayAreaRoads as roads, landmarksFor, toSummary } from "../lib/roads";
import { siteUrl } from "../lib/site";

const title = "Best Driving Roads in the Bay Area & Northern California";
const description =
  "Explore Bay Area driving roads on one map — the Peninsula, Santa Cruz Mountains, East Bay, Marin, Napa " +
  "and Monterey. Corner counts measured from OpenStreetMap geometry, elevation from USGS data.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/bay-area" },
  openGraph: { url: "/bay-area", title, description },
};

const totalMiles = Math.round(roads.reduce((sum, road) => sum + road.shape.lengthMi, 0));
const bayAreaRegions = new Set(roads.map(road => road.area)).size;
const totalBends = roads.reduce((sum, road) => sum + road.shape.bends, 0);
const curviest = [...roads].sort((a, b) => b.shape.curvature - a.shape.curvature);

export default function BayArea() {
  const structured = {
    "@context": "https://schema.org",
    "@graph": [
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
      <SiteHeader current="map" mapRegion="bay-area" />
      <div className="explorer">
        <RoadExplorer key="bay-area" roads={roads.map(toSummary)} landmarks={landmarksFor("bay-area")} region="bay-area" />
      </div>

      {/* Below the fold: the first screen stays pure map. This strip exists so the
          page still states what it is, and so crawlers reach the road pages from
          here rather than from the sitemap alone. */}
      <MapIntro
        title={<>Best driving roads in the Bay Area &amp; Northern California</>}
        stats={[
          { value: String(roads.length), label: "Roads" },
          { value: totalMiles.toLocaleString(), label: "Miles" },
          { value: totalBends.toLocaleString(), label: "Counted bends" },
          { value: String(bayAreaRegions), label: "Areas" },
        ]}
        linksLabel="Sections"
        links={[
          { href: "/roads", label: "All California roads" },
          { href: "/regions", label: "Browse by region" },
          { href: "/drives", label: "Driving guides" },
          { href: "/method", label: "How this is built" },
        ]}
      >
        Every road here is measured, not just recommended. Corners are counted off the mapped centreline,
        elevation comes from USGS survey data, and any speed figure links to the document behind it — or says
        plainly that no such document was found. The Peninsula, the Santa Cruz Mountains, the East Bay, Marin,
        Napa and Monterey.
      </MapIntro>

      <SiteFooter />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structured).replace(/</g, "\\u003c") }} />
    </>
  );
}
