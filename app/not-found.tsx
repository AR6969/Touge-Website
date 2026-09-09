import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "./site-chrome";
import { curviest, regions, roads } from "./lib/roads";
import { colorFor } from "./lib/colors";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="prose">
        <h1>That road isn&apos;t here</h1>
        <p className="lede">
          The page you asked for doesn&apos;t exist. It may have moved, or the link may be wrong.
          Here is where everything lives.
        </p>
        <nav className="home-links" aria-label="Sections">
          <Link href="/"><strong>The map</strong><span>All {roads.length} roads at once</span></Link>
          <Link href="/roads"><strong>All {roads.length} roads</strong><span>Ranked and compared in one table</span></Link>
          <Link href="/regions"><strong>Browse by region</strong><span>{regions.length} areas across Northern California</span></Link>
          <Link href="/method"><strong>How this is built</strong><span>Ratings, measurements and sources</span></Link>
        </nav>

        <section aria-labelledby="popular">
          <h2 id="popular">Or start with the curviest</h2>
          <ul className="card-list">
            {curviest.slice(0, 4).map(road => (
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
      </main>
      <SiteFooter />
    </>
  );
}
