import type { Metadata } from "next";
import Link from "next/link";
import RoadExplorer from "../road-explorer";
import { SiteFooter, SiteHeader } from "../site-chrome";
import { losAngelesRoads as roads, slugifyArea, toSummary } from "../lib/roads";
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
        <RoadExplorer key="los-angeles" roads={roads.map(toSummary)} landmarks={[]} region="los-angeles" />
      </div>
      <main className="home-intro">
        <h1>Best driving roads in Los Angeles, Malibu &amp; Orange County</h1>
        <p>
          {roads.length} driving roads, from Latigo, Piuma and Stunt to the Angeles mountains,
          Santiago Canyon and Ortega Highway. Explore all three areas on the map, or choose a road
          for its difficulty, measured bends and speed evidence. Traces show selected sections;
          access notes appear when you select an affected road.
        </p>
        <nav className="home-links" aria-label="Los Angeles driving areas">
          {areas.map(area => <Link key={area} href={`/regions/${slugifyArea(area)}`}>
            <strong>{area}</strong><span>{roads.filter(road => road.area === area).length} driving roads</span>
          </Link>)}
          <Link href="/roads"><strong>All California roads</strong><span>Browse the full collection</span></Link>
        </nav>
      </main>
      <SiteFooter />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structured).replace(/</g, "\\u003c") }} />
    </>
  );
}
