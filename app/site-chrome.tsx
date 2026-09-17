import Link from "next/link";
import StateSwitcher from "./state-switcher";
import { mapRegions, states, type MapRegion, type StateId } from "./lib/map-regions";

export function SiteHeader({ current, mapRegion, onRegionChange }: {
  current?: "map" | "roads" | "regions" | "drives";
  mapRegion?: MapRegion;
  /** Supplied by map pages so a region switch changes state instead of navigating. */
  onRegionChange?: (region: MapRegion) => void;
}) {
  // Only a map page has an active state to highlight; /roads, /drives and
  // /regions cover every state at once, so none of the state links claim
  // "current" there rather than misleadingly defaulting to California.
  const activeState: StateId | undefined = mapRegion ? mapRegions[mapRegion].state : undefined;
  const showStateSwitcher = Object.keys(states).length > 1;

  return (
    <header className="header">
      {/* Explicit ?region=california rather than a bare "/": the home page
          otherwise restores whatever region was last remembered, so clicking
          the brand from, say, the LA map would not actually reach the
          statewide overview this link is supposed to be "home" to. */}
      <Link href="/?region=california" className="brand">
        <span className="brand-symbol" aria-hidden="true">峠</span>
        <span className="brand-words">
          <span className="brand-name">TougeMap<span className="brand-dot">.</span></span>
          <small className="brand-tagline">The best driving roads</small>
        </span>
      </Link>
      <div className="header-nav-row">
        <nav aria-label="Main">
          {current === "map" ? (
            // Sierra Nevada roads live inside the California tab rather than getting
            // their own peer tab — reachable by panning the statewide map, not by nav.
            (Object.entries(mapRegions) as [MapRegion, typeof mapRegions[MapRegion]][])
              .filter(([id, region]) => id !== "sierra" && region.state === activeState)
              .map(([id, region]) => (
                onRegionChange
                  ? <button key={id} type="button" className="region" aria-current={mapRegion === id ? "page" : undefined}
                            onClick={() => onRegionChange(id)}>{region.name}</button>
                  : <Link key={id} href={region.href} className="region" aria-current={mapRegion === id ? "page" : undefined}>{region.name}</Link>
              ))
          ) : (
            <>
              <Link href="/" className="region">Map</Link>
              <Link href="/roads" className="region" aria-current={current === "roads" ? "page" : undefined}>All roads</Link>
              <Link href="/drives" className="region" aria-current={current === "drives" ? "page" : undefined}>Drives</Link>
              <Link href="/regions" className="region" aria-current={current === "regions" ? "page" : undefined}>Regions</Link>
            </>
          )}
        </nav>
        {/* Deliberately outside <nav>: on mobile that nav is a horizontally
            scrollable strip (overflow-x:auto, see globals.css), and a tap on a
            button living at its scroll edge is exactly the gesture real touch
            browsers most often misread as "start scrolling" instead of "click"
            — a fine-grained timing/movement thing a synthetic test tap doesn't
            reproduce but a real thumb does constantly. Pulling the switcher out
            into its own non-scrolling flex sibling removes the ambiguity
            outright rather than tuning touch-action heuristics against a
            moving target. Still a dropdown, not one pill per state, for the
            same reason as before: it costs exactly one slot regardless of how
            many states exist, so this fix doesn't get revisited at state three. */}
        {showStateSwitcher && <StateSwitcher activeState={activeState} />}
      </div>
    </header>
  );
}

export function SiteFooter({ roadStatus = { label: "Caltrans QuickMap", url: "https://quickmap.dot.ca.gov/" } }: {
  /** Named so a non-California page (Southern Appalachians, say) doesn't point visitors at Caltrans. */
  roadStatus?: { label: string; url: string };
}) {
  return (
    <footer className="site-footer">
      <p>
        Road geometry and speed tags © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>,
        under the Open Database License. Difficulty ratings, road descriptions and corner counts are our own —
        see <Link href="/method">how this is built</Link> and <a href="/data/README.txt">data attribution</a>.
      </p>
      <p>
        Review dates appear on each road page. No live road status: check{" "}
        <a href={roadStatus.url} target="_blank" rel="noopener noreferrer">{roadStatus.label}</a> for
        closures and conditions. Posted signs always govern.
      </p>
      <p className="footer-contact"><Link href="/contact">Contact</Link> · <Link href="/legal">Legal disclaimer</Link></p>
    </footer>
  );
}
