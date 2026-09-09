import Link from "next/link";
import { reviewedOn } from "./lib/site";

export function SiteHeader({ current }: { current?: "roads" | "regions" }) {
  return (
    <header className="header">
      <Link href="/" className="brand">
        <span className="brand-symbol" aria-hidden="true">峠</span> California Touge<span className="brand-dot">.</span>
      </Link>
      <nav aria-label="Main">
        <Link href="/roads" className="region" aria-current={current === "roads" ? "page" : undefined}>All roads</Link>
        <Link href="/regions" className="region" aria-current={current === "regions" ? "page" : undefined}>Regions</Link>
      </nav>
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
