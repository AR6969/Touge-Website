import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "../site-chrome";
import { curviest, roads } from "../lib/roads";
import { roadGroups } from "../lib/region-guides";
import { colorFor } from "../lib/colors";
import { siteUrl } from "../lib/site";

const totalMiles = Math.round(roads.reduce((sum, road) => sum + road.shape.lengthMi, 0));

const title = `All ${roads.length} Driving Roads in California`;
const description = `Browse ${roads.length} California driving roads by region, from the Bay Area and Sierra foothills to Los Angeles and San Diego. Compare road character, mapped length and terrain.`;
export const metadata: Metadata = {
  title, description,
  alternates: { canonical: "/roads" },
  openGraph: { url: "/roads", title, description },
};

export default function RoadsIndex() {
  const structured = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `All ${roads.length} driving roads`,
    numberOfItems: curviest.length,
    itemListElement: curviest.map((road, index) => ({
      "@type": "ListItem", position: index + 1, url: `${siteUrl}/roads/${road.id}`, name: road.name,
    })),
  };

  return (
    <>
      <SiteHeader current="roads" />
      <main className="prose">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link> <span aria-hidden="true">/</span> Roads
        </nav>
        <h1>All {roads.length} driving roads</h1>
        <p className="lede">
          Find a road by name or start with a region. The collection covers {totalMiles.toLocaleString()} mapped miles;
          each road has its own map, character and access notes.
        </p>
        <nav className="intro-links" aria-label="Road regions">
          {roadGroups.map(group => <a key={group.id} href={`#roads-${group.id}`}>{group.name}</a>)}
          <Link href="/drives">Connected driving routes →</Link>
        </nav>
        {roadGroups.map(group => <section key={group.id} aria-labelledby={`roads-${group.id}`}>
          <h2 id={`roads-${group.id}`}>{group.name}</h2>
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
        <div className="table-scroll">
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
