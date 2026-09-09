import Link from "next/link";
import { reviewedOn } from "./lib/site";
import { mapRegions, type MapRegion } from "./lib/map-regions";

export function SiteHeader({ current, mapRegion }: { current?: "map" | "roads" | "regions"; mapRegion?: MapRegion }) {
  return (
    <header className="header">
      <Link href={mapRegions[mapRegion ?? "bay-area"].href} className="brand">
        <span className="brand-symbol" aria-hidden="true">峠</span>
        <span className="brand-words">
          <span className="brand-name">California Touge<span className="brand-dot">.</span></span>
          {/* "Touge" is niche vocabulary; this says what the site is to everyone else. */}
          <small className="brand-tagline">Best driving roads in California</small>
        </span>
      </Link>
      {current === "map" ? (
        <nav aria-label="Map regions">
          <Link href="/" className="region" aria-current={mapRegion ? undefined : "page"}>California</Link>
          {(Object.entries(mapRegions) as [MapRegion, typeof mapRegions[MapRegion]][]).map(([id, region]) => (
            <Link key={id} href={region.href} className="region" aria-current={mapRegion === id ? "page" : undefined}>{region.name}</Link>
          ))}
        </nav>
      ) : (
        <nav aria-label="Main">
          <Link href="/bay-area" className="region">Map</Link>
          <Link href="/" className="region">California</Link>
          <Link href="/roads" className="region" aria-current={current === "roads" ? "page" : undefined}>All roads</Link>
          <Link href="/regions" className="region" aria-current={current === "regions" ? "page" : undefined}>Regions</Link>
        </nav>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <p>
        Road geometry and speed tags © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>,
        under the Open Database License. Difficulty ratings, road descriptions and corner counts are our own —
        see <Link href="/method">how this is built</Link> and <a href="/data/README.txt">data attribution</a>.
      </p>
      <p>
        Sources reviewed {reviewedOn}. No live road status: check{" "}
        <a href="https://quickmap.dot.ca.gov/" target="_blank" rel="noopener noreferrer">Caltrans QuickMap</a> for
        closures and conditions. Posted signs always govern.
      </p>
    </footer>
  );
}
