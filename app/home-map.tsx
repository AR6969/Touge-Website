"use client";

import { useCallback, useEffect, useState } from "react";
import RoadExplorer from "./road-explorer";
import { SiteHeader } from "./site-chrome";
import { track } from "./lib/analytics";
import type { Landmark, RoadSummary } from "./lib/roads";
import { mapRegions, type MapRegion } from "./lib/map-regions";

type RegionData = {
  roads: RoadSummary[];
  landmarks: Landmark[];
  popular: { id: string; name: string }[];
};

const STORAGE_KEY = "touge:region";

/**
 * Builds the shareable URL for a region, preserving whatever else is already
 * on the query string — utm_* tags from a shared link above all — and
 * dropping only `road`, since a region switch is the visitor choosing to
 * browse rather than following a specific road's permalink.
 */
function urlForRegion(region: MapRegion): string {
  if (typeof window === "undefined") return `/?region=${region}`;
  const params = new URLSearchParams(window.location.search);
  params.delete("road");
  params.set("region", region);
  const query = params.toString();
  return query ? `/?${query}` : "/";
}

export default function HomeMap({ initialRegion, data, remember = false }: {
  initialRegion: MapRegion;
  data: Record<MapRegion, RegionData>;
  /**
   * Only the bare landing page recalls a previous choice. A visitor who asked
   * for /los-angeles or /?region=bay-area named a region, so honour it.
   */
  remember?: boolean;
}) {
  const [region, setRegion] = useState<MapRegion>(initialRegion);

  // useState's initializer only runs on mount, so a client-side navigation that
  // lands back on this same route (the brand link, a shared URL with a
  // different ?region=) re-renders with a new initialRegion prop that state
  // would otherwise never pick up. switchRegion never changes initialRegion
  // itself (it only replaces the URL), so this never fights a manual switch.
  // Deferred for the same reason as the map status updates: this must not run
  // synchronously inside the effect.
  useEffect(() => { queueMicrotask(() => setRegion(initialRegion)); }, [initialRegion]);

  // Switching region is client-side state, not navigation: the map stays put and
  // only its data and camera change. The URL is kept honest for sharing.
  const switchRegion = useCallback((next: MapRegion) => {
    setRegion(next);
    window.history.replaceState(window.history.state, "", urlForRegion(next));
    track("switch_region", { region: next });
    // Storage can throw outright in private windows, so a failure to remember
    // must never take the switch down with it.
    try { window.localStorage.setItem(STORAGE_KEY, next); } catch { /* not remembered */ }
  }, []);

  // We used to ask for the visitor's location here, on load, before they had
  // seen anything. The permission prompt cost more visitors than the guess was
  // worth. A returning visitor's own last choice needs no permission at all.
  useEffect(() => {
    if (!remember || new URLSearchParams(window.location.search).has("road")) return;
    let stored: string | null = null;
    try { stored = window.localStorage.getItem(STORAGE_KEY); } catch { return; }
    if (!stored || !Object.hasOwn(mapRegions, stored) || stored === initialRegion) return;
    // Deferred for the same reason as the map status updates: this must not run
    // synchronously inside the effect.
    queueMicrotask(() => {
      setRegion(stored as MapRegion);
      window.history.replaceState(window.history.state, "", urlForRegion(stored as MapRegion));
    });
  }, [remember, initialRegion]);

  const selected = data[region];
  return (
    <>
      <SiteHeader current="map" mapRegion={region} onRegionChange={switchRegion} />
      <div className="explorer">
        {/* No key: remounting would rebuild the whole Mapbox map on every switch. */}
        <RoadExplorer roads={selected.roads} landmarks={selected.landmarks} popular={selected.popular} region={region} />
      </div>
    </>
  );
}
