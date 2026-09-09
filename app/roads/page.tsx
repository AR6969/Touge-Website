import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "../site-chrome";
import { curviest, longest, roads } from "../lib/roads";
import { colorFor } from "../lib/colors";
import { siteUrl } from "../lib/site";

const totalMiles = Math.round(roads.reduce((sum, road) => sum + road.shape.lengthMi, 0));

export const metadata: Metadata = {
  title: `All ${roads.length} Driving Roads in California`,
  description:
    `Compare ${roads.length} driving roads across the Bay Area, Los Angeles, Malibu and Orange County — ${totalMiles} miles ` +
    "ranked by length, bend count, climb per mile and degrees of turning per mile.",
  alternates: { canonical: "/roads" },
  openGraph: { url: "/roads", title: `All ${roads.length} driving roads in California` },
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
          Every road in the collection, ranked by degrees of direction change per mile. {totalMiles} miles in total,
          measured from OpenStreetMap centrelines. Difficulty is our editorial rating of width, bends and sightlines.
        </p>
        <section aria-labelledby="longest">
          <h2 id="longest">The longest drives</h2>
          <ul className="card-list">
            {longest.slice(0, 6).map(road => (
              <li key={road.id}>
                <Link href={`/roads/${road.id}`}>
                  <strong>{road.name}</strong>
                  <span className="card-meta">
                    <i style={{ background: colorFor(road.character) }} />
                    {road.shape.lengthMi} mi · {road.shape.bends} bends · {road.area}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="ranked">
        <h2 id="ranked">Every road, ranked by turning per mile</h2>
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
        </section>
        <p><Link className="more-link" href="/">Back to the map →</Link></p>
      </main>
      <SiteFooter />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structured).replace(/</g, "\\u003c") }} />
    </>
  );
}
