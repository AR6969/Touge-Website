import type { Metadata } from "next";
import Link from "next/link";
import RoadExplorer from "./road-explorer";
import { SiteFooter, SiteHeader } from "./site-chrome";
import { curviest, difficultyColors, longest, regions, roads, toSummary } from "./lib/roads";
import { siteUrl } from "./lib/site";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const totalMiles = Math.round(roads.reduce((sum, road) => sum + road.shape.lengthMi, 0));
const totalBends = roads.reduce((sum, road) => sum + road.shape.bends, 0);

export default function Home() {
  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Best driving roads in the Bay Area and Northern California",
    numberOfItems: curviest.length,
    itemListElement: curviest.map((road, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${siteUrl}/roads/${road.id}`,
      name: road.name,
    })),
  };

  return (
    <>
      <SiteHeader />
      <div className="explorer">
        <RoadExplorer roads={roads.map(toSummary)} />
      </div>

      <main className="prose">
        <h1>Best driving roads in the Bay Area &amp; Northern California</h1>
        <p className="lede">
          {roads.length} roads, {totalMiles} miles and {totalBends.toLocaleString()} counted bends — from Page Mill and
          Old La Honda on the Peninsula, through the Santa Cruz Mountains and the East Bay ridges, out to the Marin
          coast, Napa and Monterey. Every road has its own page with the corner count measured from its mapped
          centreline, a difficulty rating, and the actual source behind any speed figure we show.
        </p>

        <section aria-labelledby="curviest">
          <h2 id="curviest">The 10 curviest roads</h2>
          <p>
            Ranked by <strong>degrees of direction change per mile</strong>, measured on the OpenStreetMap centreline at
            a fixed 20&nbsp;m sampling step. It is a measure of road shape, not of difficulty or of how fast anything
            should be driven.
          </p>
          <div className="table-scroll">
            <table className="rank-table">
              <thead>
                <tr><th>#</th><th>Road</th><th>Area</th><th>Length</th><th>Bends</th><th>Switchbacks</th><th>°/mile</th></tr>
              </thead>
              <tbody>
                {curviest.slice(0, 10).map((road, index) => (
                  <tr key={road.id}>
                    <td className="rank">{index + 1}</td>
                    <td><Link href={`/roads/${road.id}`}>{road.name}</Link></td>
                    <td className="dim">{road.area}</td>
                    <td>{road.shape.lengthMi} mi</td>
                    <td>{road.shape.bends}</td>
                    <td>{road.shape.switchbacks}</td>
                    <td className="figure">{road.shape.curvature}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section aria-labelledby="longest">
          <h2 id="longest">The longest drives</h2>
          <ul className="card-list">
            {longest.slice(0, 6).map(road => (
              <li key={road.id}>
                <Link href={`/roads/${road.id}`}>
                  <strong>{road.name}</strong>
                  <span className="card-meta">
                    <i style={{ background: difficultyColors[road.difficulty - 1] }} />
                    {road.shape.lengthMi} mi · {road.shape.bends} bends · {road.area}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="regions">
          <h2 id="regions">Browse by region</h2>
          <ul className="card-list">
            {regions.map(region => (
              <li key={region.slug}>
                <Link href={`/regions/${region.slug}`}>
                  <strong>{region.area}</strong>
                  <span className="card-meta">
                    {region.roads.length} road{region.roads.length === 1 ? "" : "s"} ·{" "}
                    {Math.round(region.roads.reduce((sum, road) => sum + road.shape.lengthMi, 0))} mi
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="all-roads">
          <h2 id="all-roads">Every road in the collection</h2>
          <ul className="guide-roads">
            {[...roads].sort((a, b) => a.name.localeCompare(b.name)).map(road => (
              <li key={road.id}>
                <Link href={`/roads/${road.id}`}>{road.name}</Link>
                <span>{road.area} · Difficulty {road.difficulty}/3 · {road.shape.lengthMi} mi</span>
              </li>
            ))}
          </ul>
          <p>
            <Link className="more-link" href="/roads">Compare all {roads.length} roads in one table →</Link>
          </p>
        </section>
      </main>

      <SiteFooter />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList).replace(/</g, "\\u003c") }} />
    </>
  );
}
