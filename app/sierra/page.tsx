import type { Metadata } from "next";
import HomeMap from "../home-map";
import MapIntro from "../map-intro";
import { SiteFooter } from "../site-chrome";
import { bayAreaRoads, landmarksFor, losAngelesRoads, popularRoadsFor, roads as allRoads, sanDiegoRoads, sierraRoads, slugifyArea, toSummary } from "../lib/roads";

const roads = sierraRoads;
import { siteUrl } from "../lib/site";

const title = "Best Driving Roads in the Sierra Nevada";
const description = "Tioga Pass, Sonora Pass, Rock Creek Road and the other high Sierra passes and canyons on one map. Corner counts measured from OpenStreetMap geometry, elevation from USGS data.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/sierra" },
  openGraph: { url: "/sierra", title, description },
};

const areas = [...new Set(roads.map(road => road.area))];
const totalMiles = Math.round(roads.reduce((sum, road) => sum + road.shape.lengthMi, 0));
const totalBends = roads.reduce((sum, road) => sum + road.shape.bends, 0);

export default function Sierra() {
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
        initialRegion="sierra"
        data={{
          california: { roads: allRoads.map(toSummary), landmarks: landmarksFor("california"), popular: popularRoadsFor("california") },
          "bay-area": { roads: bayAreaRoads.map(toSummary), landmarks: landmarksFor("bay-area"), popular: popularRoadsFor("bay-area") },
          "los-angeles": { roads: losAngelesRoads.map(toSummary), landmarks: landmarksFor("los-angeles"), popular: popularRoadsFor("los-angeles") },
          "san-diego": { roads: sanDiegoRoads.map(toSummary), landmarks: landmarksFor("san-diego"), popular: popularRoadsFor("san-diego") },
          sierra: { roads: sierraRoads.map(toSummary), landmarks: landmarksFor("sierra"), popular: popularRoadsFor("sierra") },
        }}
      />
      <MapIntro
        title={<>Best driving roads in the Sierra Nevada</>}
        stats={[
          { value: String(roads.length), label: "Roads" },
          { value: totalMiles.toLocaleString(), label: "Miles" },
          { value: totalBends.toLocaleString(), label: "Counted bends" },
          { value: String(areas.length), label: "Areas" },
        ]}
        linksLabel="Sierra Nevada driving areas"
        links={[
          ...areas.map(area => ({ href: `/regions/${slugifyArea(area)}`, label: area })),
          { href: "/roads", label: "All California roads" },
        ]}
      >
        The high mountain passes and eastern-slope canyons along Highway 395, plus the western Sierra climb to
        Huntington Lake. Most of these close with the first heavy snow and do not reopen until late spring —
        check the access note on each road&apos;s own page before planning a drive.
      </MapIntro>

      <SiteFooter />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structured).replace(/</g, "\\u003c") }} />
    </>
  );
}
