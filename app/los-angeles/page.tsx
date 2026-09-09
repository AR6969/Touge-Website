import type { Metadata } from "next";
import RoadExplorer from "../road-explorer";
import MapIntro from "../map-intro";
import { SiteFooter, SiteHeader } from "../site-chrome";
import { landmarksFor, losAngelesRoads as roads, slugifyArea, toSummary } from "../lib/roads";
import { siteUrl } from "../lib/site";

const title = "Best Driving Roads in Los Angeles, Malibu & Orange County";
const description = "Explore Malibu canyon roads, the Angeles and San Gabriel Mountains, and Orange County driving roads on one map. Road character, difficulty, selected road sections and sourced speed guides.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/los-angeles" },
  openGraph: { url: "/los-angeles", title, description },
};

const areas = [...new Set(roads.map(road => road.area))];
const totalMiles = Math.round(roads.reduce((sum, road) => sum + road.shape.lengthMi, 0));
const totalBends = roads.reduce((sum, road) => sum + road.shape.bends, 0);

export default function LosAngeles() {
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
      <SiteHeader current="map" mapRegion="los-angeles" />
      <div className="explorer">
        <RoadExplorer key="los-angeles" roads={roads.map(toSummary)} landmarks={landmarksFor("los-angeles")} region="los-angeles" />
      </div>
      <MapIntro
        title={<>Best driving roads in Los Angeles, Malibu &amp; Orange County</>}
        stats={[
          { value: String(roads.length), label: "Roads" },
          { value: totalMiles.toLocaleString(), label: "Miles" },
          { value: totalBends.toLocaleString(), label: "Counted bends" },
          { value: String(areas.length), label: "Areas" },
        ]}
        linksLabel="Los Angeles driving areas"
        links={[
          ...areas.map(area => ({ href: `/regions/${slugifyArea(area)}`, label: area })),
          { href: "/roads", label: "All California roads" },
        ]}
      >
        Three ranges with little in common beyond the city behind them: the Malibu canyons, the San Gabriels,
        and the Santa Ana hills. Traces cover selected sections rather than whole highways, and roads carrying
        a closure or one-way caveat say so on their own page.
      </MapIntro>

      <SiteFooter />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structured).replace(/</g, "\\u003c") }} />
    </>
  );
}
