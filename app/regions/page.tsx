import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "../site-chrome";
import { difficultyColors, regions } from "../lib/roads";

export const metadata: Metadata = {
  title: "Driving Roads by Region",
  description:
    "Browse Northern California driving roads by area — the Peninsula, Santa Cruz Mountains, East Bay, Marin, " +
    "Napa, the Diablo Range and Monterey.",
  alternates: { canonical: "/regions" },
  openGraph: { url: "/regions", title: "Driving roads by region" },
};

export default function RegionsIndex() {
  return (
    <>
      <SiteHeader current="regions" />
      <main className="prose">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link> <span aria-hidden="true">/</span> Regions
        </nav>
        <h1>Driving roads by region</h1>
        <p className="lede">
          {regions.length} areas across Northern California, from the Peninsula ridge roads to the Monterey coast.
        </p>
        {regions.map(region => (
          <section key={region.slug} aria-labelledby={region.slug}>
            <h2 id={region.slug}>
              <Link href={`/regions/${region.slug}`}>{region.area}</Link>
            </h2>
            <ul className="card-list">
              {region.roads.map(road => (
                <li key={road.id}>
                  <Link href={`/roads/${road.id}`}>
                    <strong>{road.name}</strong>
                    <span className="card-meta">
                      <i style={{ background: difficultyColors[road.difficulty - 1] }} />
                      {road.shape.lengthMi} mi · {road.shape.bends} bends · Difficulty {road.difficulty}/3
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </main>
      <SiteFooter />
    </>
  );
}
