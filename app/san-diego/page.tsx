import type { Metadata } from "next";
import HomeMap from "../home-map";
import MapIntro from "../map-intro";
import { SiteFooter } from "../site-chrome";
import { bayAreaRoads, landmarksFor, losAngelesRoads, popularRoadsFor, roads as allRoads, sanDiegoRoads, sierraRoads, southernAppalachiansRoads, coloradoRoads, slugifyArea, toSummary } from "../lib/roads";

const roads = sanDiegoRoads;
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
      <HomeMap
        initialRegion="san-diego"
        data={{
          california: { roads: allRoads.map(toSummary), landmarks: landmarksFor("california"), popular: popularRoadsFor("california") },
          "bay-area": { roads: bayAreaRoads.map(toSummary), landmarks: landmarksFor("bay-area"), popular: popularRoadsFor("bay-area") },
          "los-angeles": { roads: losAngelesRoads.map(toSummary), landmarks: landmarksFor("los-angeles"), popular: popularRoadsFor("los-angeles") },
          "san-diego": { roads: sanDiegoRoads.map(toSummary), landmarks: landmarksFor("san-diego"), popular: popularRoadsFor("san-diego") },
          sierra: { roads: sierraRoads.map(toSummary), landmarks: landmarksFor("sierra"), popular: popularRoadsFor("sierra") },
          "southern-appalachians": { roads: southernAppalachiansRoads.map(toSummary), landmarks: landmarksFor("southern-appalachians"), popular: popularRoadsFor("southern-appalachians") },
          colorado: { roads: coloradoRoads.map(toSummary), landmarks: landmarksFor("colorado"), popular: popularRoadsFor("colorado") },
        }}
      />
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
