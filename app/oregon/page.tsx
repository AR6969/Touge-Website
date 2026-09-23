import type { Metadata } from "next";
import Link from "next/link";
import HomeMap from "../home-map";
import MapIntro from "../map-intro";
import { SiteFooter } from "../site-chrome";
import { bayAreaRoads, coloradoRoads, landmarksFor, losAngelesRoads, oregonRoads, popularRoadsFor, roads as allRoads, sanDiegoRoads, sierraRoads, southernAppalachiansRoads, washingtonRoads, slugifyArea, toSummary } from "../lib/roads";
import { siteUrl } from "../lib/site";

const roads = oregonRoads;

const title = "Best Driving Roads in Oregon";
const description = "The Historic Columbia River Highway, McKenzie Pass, Larch Mountain Road and more on one map. Corner counts measured from OpenStreetMap geometry, elevation from USGS data — the same method used for every road on this site.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/oregon" },
  openGraph: { url: "/oregon", title, description },
};

const areas = [...new Set(roads.map(road => road.area))];
const totalMiles = Math.round(roads.reduce((sum, road) => sum + road.shape.lengthMi, 0));
const totalBends = roads.reduce((sum, road) => sum + road.shape.bends, 0);

export default function Oregon() {
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
      {/* This map only ever opens to oregon: the in-map region switcher is
          California-only (see site-chrome.tsx), so there is no onRegionChange
          here and no way to land on this state by mistake. */}
      <HomeMap
        initialRegion="oregon"
        data={{
          california: { roads: allRoads.map(toSummary), landmarks: landmarksFor("california"), popular: popularRoadsFor("california") },
          "bay-area": { roads: bayAreaRoads.map(toSummary), landmarks: landmarksFor("bay-area"), popular: popularRoadsFor("bay-area") },
          "los-angeles": { roads: losAngelesRoads.map(toSummary), landmarks: landmarksFor("los-angeles"), popular: popularRoadsFor("los-angeles") },
          "san-diego": { roads: sanDiegoRoads.map(toSummary), landmarks: landmarksFor("san-diego"), popular: popularRoadsFor("san-diego") },
          sierra: { roads: sierraRoads.map(toSummary), landmarks: landmarksFor("sierra"), popular: popularRoadsFor("sierra") },
          "southern-appalachians": { roads: southernAppalachiansRoads.map(toSummary), landmarks: landmarksFor("southern-appalachians"), popular: popularRoadsFor("southern-appalachians") },
          colorado: { roads: coloradoRoads.map(toSummary), landmarks: landmarksFor("colorado"), popular: popularRoadsFor("colorado") },
          washington: { roads: washingtonRoads.map(toSummary), landmarks: landmarksFor("washington"), popular: popularRoadsFor("washington") },
          oregon: { roads: roads.map(toSummary), landmarks: landmarksFor("oregon"), popular: popularRoadsFor("oregon") },
        }}
      />
      <MapIntro
        title={<>Best driving roads in Oregon</>}
        stats={[
          { value: String(roads.length), label: "Roads" },
          { value: totalMiles.toLocaleString(), label: "Miles" },
          { value: totalBends.toLocaleString(), label: "Counted bends" },
          { value: String(areas.length), label: "Areas" },
        ]}
        linksLabel="Oregon driving areas"
        links={[
          ...areas.map(area => ({ href: `/regions/${slugifyArea(area)}`, label: area })),
        ]}
      >
        Five roads spanning the Columbia River Gorge to the Willamette National Forest: the Historic Columbia River
        Highway is America&rsquo;s first planned scenic roadway, McKenzie Pass and Santiam Pass combine into one loop with
        very different characters, and Aufderheide Drive runs 58 miles with no gas or cell service. Several close
        for winter — check current conditions before a trip.
      </MapIntro>

      <section aria-labelledby="oregon-roads" className="prose">
        <h2 id="oregon-roads">The roads</h2>
        <ul className="card-list">
          {roads.map(road => <li key={road.id}>
            <Link href={`/roads/${road.id}`}>
              <strong>{road.name}</strong>
              <span className="card-meta">{road.area} · {road.shape.lengthMi} mi</span>
              <span className="card-body">{road.description}</span>
            </Link>
          </li>)}
        </ul>
      </section>

      <SiteFooter roadStatus={{ label: "TripCheck road conditions", url: "https://tripcheck.com/" }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structured).replace(/</g, "\\u003c") }} />
    </>
  );
}
