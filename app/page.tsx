import type { Metadata } from "next";
import Link from "next/link";
import HomeMap from "./home-map";
import { SiteFooter } from "./site-chrome";
import { bayAreaRoads, landmarksFor, losAngelesRoads, popularRoadsFor, roads, sanDiegoRoads, sierraRoads, southernAppalachiansRoads, coloradoRoads, toSummary } from "./lib/roads";
import { mapRegions, type MapRegion } from "./lib/map-regions";
import { drives } from "./lib/drives";
import { siteName, siteUrl } from "./lib/site";

const title = "California Driving Roads & Scenic Drives | TougeMap";
const description =
  "Find California driving roads on an interactive map. Explore Bay Area, Malibu, Los Angeles and San Diego roads, plus scenic drives with routes and stops.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/" },
  openGraph: { url: "/", title, description },
};

const featuredRoads = ["highway-9-front", "page-mill", "skyline", "latigo-canyon", "palomar-south-grade", "mines"]
  .flatMap(id => roads.find(road => road.id === id) ?? []);
const featuredDrives = ["highway-9-skyline-pescadero-coastal-drive", "page-mill-skyline-alices-driving-route", "glendora-mountain-road-highway-39-drive"]
  .flatMap(slug => drives.find(drive => drive.slug === slug) ?? []);

const regions = [
  { id: "bay-area" as const, roads: bayAreaRoads, blurb: "The Peninsula ridge roads, the Santa Cruz Mountains, the East Bay, Marin, Napa and Monterey." },
  { id: "los-angeles" as const, roads: losAngelesRoads, blurb: "The Malibu canyons, the Angeles and San Gabriel mountains, and the Orange County hills." },
  { id: "san-diego" as const, roads: sanDiegoRoads, blurb: "Palomar Mountain, the Laguna and Cuyamaca ranges, and the North County back roads." },
];
// Sierra Nevada roads (sierraRoads) are still in the "california" tab's full
// catalog and reachable by panning the statewide map — deliberately not a peer
// card here alongside the three regional maps.

export default async function Home({ searchParams }: { searchParams: Promise<{ region?: string }> }) {
  const { region } = await searchParams;
  // Experiment, started 2026-09-12: first-time visitors used to land on the
  // statewide view. At phone width a 9-mile road renders as ~3px there — too
  // small to read as a road at all, and 76% of traffic is mobile. Bay Area
  // opens roughly a zoom level closer. Revert to "california" if click-through
  // from / into a road page (currently ~7%) doesn't improve within a couple
  // of weeks of shipping this.
  const mapRegion: MapRegion = region && Object.hasOwn(mapRegions, region) ? region as MapRegion : "bay-area";

  const structured = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebSite", "@id": `${siteUrl}#website`, name: "TougeMap", alternateName: siteName, url: siteUrl, description, inLanguage: "en-US" },
      {
        "@type": "ItemList",
        name: "Roads to explore in California",
        numberOfItems: featuredRoads.length,
        itemListElement: featuredRoads.map((road, index) => ({
          "@type": "ListItem", position: index + 1, url: `${siteUrl}/roads/${road.id}`, name: road.name,
        })),
      },
    ],
  };

  return (
    <>
      <HomeMap
        initialRegion={mapRegion}
        remember={!region}
        data={{
          california: { roads: roads.map(toSummary), landmarks: landmarksFor("california"), popular: popularRoadsFor("california") },
          "bay-area": { roads: bayAreaRoads.map(toSummary), landmarks: landmarksFor("bay-area"), popular: popularRoadsFor("bay-area") },
          "los-angeles": { roads: losAngelesRoads.map(toSummary), landmarks: landmarksFor("los-angeles"), popular: popularRoadsFor("los-angeles") },
          "san-diego": { roads: sanDiegoRoads.map(toSummary), landmarks: landmarksFor("san-diego"), popular: popularRoadsFor("san-diego") },
          sierra: { roads: sierraRoads.map(toSummary), landmarks: landmarksFor("sierra"), popular: popularRoadsFor("sierra") },
          "southern-appalachians": { roads: southernAppalachiansRoads.map(toSummary), landmarks: landmarksFor("southern-appalachians"), popular: popularRoadsFor("southern-appalachians") },
          colorado: { roads: coloradoRoads.map(toSummary), landmarks: landmarksFor("colorado"), popular: popularRoadsFor("colorado") },
        }}
      />
      <main className="prose landing" id="about">
        <h1>Best driving roads in California</h1>
        <p className="lede">
          Find your next mountain road, coastal detour or weekend loop in the Bay Area, Los Angeles or San Diego. Tap a colored road on the map,
          or start with a guide for the route, worthwhile stops and access notes.
        </p>
        <nav className="intro-links" aria-label="Explore California">
          <Link href="/roads">Browse all {roads.length} roads →</Link>
          <Link href="/drives">Find a driving route →</Link>
        </nav>
        <section aria-labelledby="featured-drives">
          <h2 id="featured-drives">Make a drive of it</h2>
          <ul className="card-list">
            {featuredDrives.map(drive => <li key={drive.slug}>
              <Link href={`/drives/${drive.slug}`}>
                <strong>{drive.title}</strong>
                <span className="card-body">{drive.intro}</span>
                <span className="card-meta">Route &amp; stops →</span>
              </Link>
            </li>)}
          </ul>
        </section>
        <section aria-labelledby="featured-roads">
          <h2 id="featured-roads">A few roads to start with</h2>
          <ul className="card-list">
            {featuredRoads.map(road => <li key={road.id}>
              <Link href={`/roads/${road.id}`}>
                <strong>{road.name}</strong>
                <span className="card-meta">{road.area} · {road.shape.lengthMi} mi</span>
                <span className="card-body">{road.description}</span>
              </Link>
            </li>)}
          </ul>
        </section>

        <section aria-labelledby="maps">
          <h2 id="maps">Pick a map</h2>
          <ul className="region-choice">
            {regions.map(region => {
              const miles = Math.round(region.roads.reduce((sum, road) => sum + road.shape.lengthMi, 0));
              return (
                <li key={region.id}>
                  <Link href={mapRegions[region.id].href}>
                    <strong>{mapRegions[region.id].name}</strong>
                    <span className="region-count">{region.roads.length} roads · {miles} miles</span>
                    <span className="card-body">{region.blurb}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        <p className="lede">
          Also now mapping <Link href="/southern-appalachians">the Southern Appalachians</Link> — Tail of the Dragon
          and five more roads across Tennessee, North Carolina, Virginia and Georgia — and <Link href="/colorado">Colorado</Link>,
          from the Million Dollar Highway to Trail Ridge Road.
        </p>

        <nav className="intro-links" aria-label="Sections">
          <Link href="/roads">All {roads.length} roads</Link>
          <Link href="/regions">Browse by region</Link>
          <Link href="/drives">Driving guides</Link>
          <Link href="/method">How this is built</Link>
        </nav>
      </main>
      <SiteFooter />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structured).replace(/</g, "\\u003c") }} />
    </>
  );
}
