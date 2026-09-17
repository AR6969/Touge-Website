import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "../site-chrome";
import { curviest, roads } from "../lib/roads";
import { roadGroups } from "../lib/region-guides";
import { colorFor } from "../lib/colors";
import { siteUrl } from "../lib/site";

const totalMiles = Math.round(roads.reduce((sum, road) => sum + road.shape.lengthMi, 0));

const title = "All Driving Roads by Region | TougeMap";
const description = `Browse ${roads.length} driving roads by region: California's Bay Area, Los Angeles, San Diego and Sierra Nevada, plus the Southern Appalachians. Find road maps, access notes and connected driving guides.`;
export const metadata: Metadata = {
  title: { absolute: title }, description,
  alternates: { canonical: "/roads" },
  openGraph: { url: "/roads", title, description },
};

export default function RoadsIndex() {
  const directoryRoads = roadGroups.flatMap(group => [...group.roads].sort((a, b) => a.name.localeCompare(b.name)));
  const structured = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "CollectionPage", "@id": `${siteUrl}/roads#webpage`, url: `${siteUrl}/roads`, name: "All driving roads", description, mainEntity: { "@id": `${siteUrl}/roads#list` } },
      { "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
        { "@type": "ListItem", position: 2, name: "Roads", item: `${siteUrl}/roads` },
      ] },
      { "@type": "ItemList", "@id": `${siteUrl}/roads#list`,
        name: `All ${roads.length} driving roads`,
        numberOfItems: directoryRoads.length,
        itemListElement: directoryRoads.map((road, index) => ({
          "@type": "ListItem", position: index + 1, url: `${siteUrl}/roads/${road.id}`, name: road.name,
        })),
      },
    ],
  };

  return (
    <>
      <SiteHeader current="roads" />
      <main className="prose roads-index">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link> <span aria-hidden="true">/</span> Roads
        </nav>
        <h1>All driving roads</h1>
        <p className="lede">
          Browse {roads.length} roads across {totalMiles.toLocaleString()} mapped miles, from California to the Southern Appalachians. Pick a region, then open a road for its map, character and access notes.
        </p>
        <nav className="intro-links" aria-label="Road regions">
          {roadGroups.map(group => <a key={group.id} href={`#roads-${group.id}`}>{group.name}</a>)}
          <Link href="/drives">Connected driving routes →</Link>
        </nav>
        {roadGroups.map(group => <section key={group.id} aria-labelledby={`roads-${group.id}`}>
          <h2 id={`roads-${group.id}`}>{group.name}</h2>
          <p className="directory-map-link"><Link href={group.mapHref}>Explore the {group.mapName} map →</Link></p>
          <ul className="road-directory">
            {[...group.roads].sort((a, b) => a.name.localeCompare(b.name)).map(road => <li key={road.id}>
              <Link href={`/roads/${road.id}`} prefetch={false}>
                <strong><i style={{ background: colorFor(road.character) }} /> {road.name}</strong>
                <span>{road.area} · {road.character} · {road.shape.lengthMi} mi</span>
              </Link>
            </li>)}
          </ul>
        </section>)}

        <section aria-labelledby="ranked">
        <h2 id="ranked">Compare the numbers</h2>
        <details className="road-comparison"><summary>Open the full comparison table</summary>
        <p className="fine">Sorted by direction change per mile. These measurements describe the road, not a safe driving speed.</p>
        <div className="table-scroll" tabIndex={0} role="region" aria-label="Road comparison table, scroll horizontally for more columns">
          <table className="rank-table">
            <thead>
              <tr>
                <th>#</th><th>Road</th><th>Area</th><th>Difficulty</th><th>Character</th>
                <th>Length</th><th>Bends</th><th>Climb/mi</th><th>°/mile</th>
              </tr>
            </thead>
            <tbody>
              {curviest.map((road, index) => (
                <tr key={road.id}>
                  <td className="rank">{index + 1}</td>
                  <td><Link href={`/roads/${road.id}`}>{road.name}</Link></td>
                  <td className="dim">{road.area}</td>
                  <td>{road.difficulty}/3</td>
                  <td><i style={{ background: colorFor(road.character) }} /> <span className="dim">{road.character}</span></td>
                  <td>{road.shape.lengthMi} mi</td>
                  <td>{road.shape.bends}</td>
                  <td>{road.elevation ? `${road.elevation.climbPerMile} ft` : "—"}</td>
                  <td className="figure">{road.shape.curvature}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </details>
        </section>
        <p><Link className="more-link" href="/">Back to the map →</Link></p>
      </main>
      <SiteFooter />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structured).replace(/</g, "\\u003c") }} />
    </>
  );
}
