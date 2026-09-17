import Link from "next/link";
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
  const stateEntries = Object.entries(states) as [StateId, typeof states[StateId]][];

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
          <small className="brand-tagline">Best driving roads, state by state</small>
        </span>
      </Link>
      <nav aria-label="Main">
        {/* Always visible, on every page, regardless of map/non-map mode —
            this is the fix for a region in a second state otherwise having
            no way back to the first, and no way to be reached at all except
            a buried in-page link. Shown even with just two states so a third
            slots in here later without a design change. On a map page the
            active state's own region tabs already say where you are, so only
            the *other* states appear here — otherwise "California" would sit
            right next to a "California" region tab, which is one pill too many
            for a phone-width header to survive with room for anything else. */}
        {stateEntries.length > 1 && stateEntries
          .filter(([id]) => id !== activeState)
          .map(([id, state]) => (
            <Link key={id} href={mapRegions[state.defaultRegion].href} className="region other-state">{state.name}</Link>
          ))}
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
