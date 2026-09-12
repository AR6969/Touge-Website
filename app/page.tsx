import type { Metadata } from "next";
import Link from "next/link";
import HomeMap from "./home-map";
import { SiteFooter } from "./site-chrome";
import { bayAreaRoads, curviest, landmarksFor, losAngelesRoads, popularRoadsFor, roads, sanDiegoRoads, toSummary } from "./lib/roads";
import { mapRegions, type MapRegion } from "./lib/map-regions";
import { colorFor } from "./lib/colors";
import { siteName, siteUrl } from "./lib/site";

const title = "Best Driving Roads in California";
const description =
  "Every good driving road in California on two maps — the Bay Area and Los Angeles. Corner counts measured " +
  "from OpenStreetMap geometry, elevation from USGS data, and a source behind every speed figure.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/" },
  openGraph: { url: "/", title, description },
};

const totalMiles = Math.round(roads.reduce((sum, road) => sum + road.shape.lengthMi, 0));
const totalBends = roads.reduce((sum, road) => sum + road.shape.bends, 0);

const regions = [
  { id: "bay-area" as const, roads: bayAreaRoads, blurb: "The Peninsula ridge roads, the Santa Cruz Mountains, the East Bay, Marin, Napa and Monterey." },
  { id: "los-angeles" as const, roads: losAngelesRoads, blurb: "The Malibu canyons, the Angeles and San Gabriel mountains, and the Orange County hills." },
  { id: "san-diego" as const, roads: sanDiegoRoads, blurb: "Palomar Mountain, the Laguna and Cuyamaca ranges, and the North County back roads." },
];

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
      { "@type": "WebSite", name: siteName, url: siteUrl, description, inLanguage: "en-US" },
      {
        "@type": "ItemList",
        name: "Best driving roads in California",
        numberOfItems: curviest.length,
        itemListElement: curviest.map((road, index) => ({
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
        }}
      />
      <main className="prose landing">
        <h1>Best driving roads in California</h1>
        <p className="lede">
          Every road here is measured, not just recommended. Corners are counted off the mapped centreline,
          elevation comes from USGS survey data, and any speed figure links to the document behind it — or says
          plainly that no such document was found.
        </p>

        <dl className="landing-stats">
          <div><dd>{roads.length}</dd><dt>Roads</dt></div>
          <div><dd>{totalMiles.toLocaleString()}</dd><dt>Miles</dt></div>
          <div><dd>{totalBends.toLocaleString()}</dd><dt>Counted bends</dt></div>
        </dl>

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

        <section aria-labelledby="curviest">
          <h2 id="curviest">The ten curviest roads in California</h2>
          <p>
            Ranked by degrees of direction change per mile, measured on the OpenStreetMap centreline at a fixed
            20&nbsp;m sampling step. It describes road shape — not difficulty, and not how fast anything should
            be driven.
          </p>
          <div className="table-scroll">
            <table className="rank-table">
              <thead>
                <tr><th>#</th><th>Road</th><th>Area</th><th>Length</th><th>Bends</th><th>°/mile</th></tr>
              </thead>
              <tbody>
                {curviest.slice(0, 10).map((road, index) => (
                  <tr key={road.id}>
                    <td className="rank">{index + 1}</td>
                    <td>
                      <i style={{ background: colorFor(road.character) }} />{" "}
                      <Link href={`/roads/${road.id}`}>{road.name}</Link>
                    </td>
                    <td className="dim">{road.area}</td>
                    <td>{road.shape.lengthMi} mi</td>
                    <td>{road.shape.bends}</td>
                    <td className="figure">{road.shape.curvature}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>
            <Link className="more-link" href="/roads">Compare all {roads.length} roads →</Link>
          </p>
        </section>

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
