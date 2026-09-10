import type { Metadata } from "next";
import RoadExplorer from "../road-explorer";
import MapIntro from "../map-intro";
import { SiteFooter, SiteHeader } from "../site-chrome";
import { landmarksFor, sanDiegoRoads as roads, slugifyArea, toSummary } from "../lib/roads";
import { siteUrl } from "../lib/site";

const title = "Best Driving Roads in San Diego County";
const description = "Palomar Mountain, the Laguna and Cuyamaca ranges and the North County back roads on one map. Corner counts measured from OpenStreetMap geometry, elevation from USGS data.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/san-diego" },
  openGraph: { url: "/san-diego", title, description },
};

const areas = [...new Set(roads.map(road => road.area))];
const totalMiles = Math.round(roads.reduce((sum, road) => sum + road.shape.lengthMi, 0));
const totalBends = roads.reduce((sum, road) => sum + road.shape.bends, 0);

export default function SanDiego() {
  const structured = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: title,
    numberOfItems: roads.length,
    itemListElement: roads.map((road, index) => ({
      "@type": "ListItem", position: index + 1, name: road.name, url: `${siteUrl}/roads/${road.id}`,
    })),
  };

  return (
    <>
      <SiteHeader current="map" mapRegion="san-diego" />
      <div className="explorer">
        <RoadExplorer key="san-diego" roads={roads.map(toSummary)} landmarks={landmarksFor("san-diego")} region="san-diego" />
      </div>
      <MapIntro
        title={<>Best driving roads in San Diego County</>}
        stats={[
          { value: String(roads.length), label: "Roads" },
          { value: totalMiles.toLocaleString(), label: "Miles" },
          { value: totalBends.toLocaleString(), label: "Counted bends" },
          { value: String(areas.length), label: "Areas" },
        ]}
        linksLabel="San Diego driving areas"
        links={[
          ...areas.map(area => ({ href: `/regions/${slugifyArea(area)}`, label: area })),
          { href: "/roads", label: "All California roads" },
        ]}
      >
        Palomar Mountain, the Laguna and Cuyamaca ranges, and the North County back roads between Escondido
        and Julian. Traces cover selected sections rather than whole highways, and roads carrying a closure or
        one-way caveat say so on their own page.
      </MapIntro>

      <SiteFooter />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structured).replace(/</g, "\\u003c") }} />
    </>
  );
}
