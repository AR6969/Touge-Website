"use client";

import { useCallback, useEffect, useState } from "react";
import RoadExplorer from "./road-explorer";
import { SiteHeader } from "./site-chrome";
import type { Landmark, RoadSummary } from "./lib/roads";
import { mapRegions, type MapRegion } from "./lib/map-regions";

type RegionData = {
  roads: RoadSummary[];
  landmarks: Landmark[];
};

const STORAGE_KEY = "touge:region";

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

  // Switching region is client-side state, not navigation: the map stays put and
  // only its data and camera change. The URL is kept honest for sharing.
  const switchRegion = useCallback((next: MapRegion) => {
    setRegion(next);
    const url = next === "california" ? "/" : `/?region=${next}`;
    window.history.replaceState(null, "", url);
    // Storage can throw outright in private windows, so a failure to remember
    // must never take the switch down with it.
    try { window.localStorage.setItem(STORAGE_KEY, next); } catch { /* not remembered */ }
  }, []);

  // We used to ask for the visitor's location here, on load, before they had
  // seen anything. The permission prompt cost more visitors than the guess was
  // worth. A returning visitor's own last choice needs no permission at all.
  useEffect(() => {
    if (!remember) return;
    let stored: string | null = null;
    try { stored = window.localStorage.getItem(STORAGE_KEY); } catch { return; }
    if (!stored || stored === "california" || !Object.hasOwn(mapRegions, stored)) return;
    // Deferred for the same reason as the map status updates: this must not run
    // synchronously inside the effect.
    queueMicrotask(() => {
      setRegion(stored as MapRegion);
      window.history.replaceState(null, "", `/?region=${stored}`);
    });
  }, [remember]);

  const selected = data[region];
  return (
    <>
      <SiteHeader current="map" mapRegion={region} onRegionChange={switchRegion} />
      <div className="explorer">
        {/* No key: remounting would rebuild the whole Mapbox map on every switch. */}
        <RoadExplorer roads={selected.roads} landmarks={selected.landmarks} region={region} />
      </div>
    </>
  );
}
