"use client";

import { useCallback, useEffect, useState } from "react";
import RoadExplorer from "./road-explorer";
import { SiteHeader } from "./site-chrome";
import type { Landmark, RoadSummary } from "./lib/roads";
import type { MapRegion } from "./lib/map-regions";

type RegionData = {
  roads: RoadSummary[];
  landmarks: Landmark[];
};

function regionForLocation(latitude: number, longitude: number): Exclude<MapRegion, "california"> | null {
  const areas: [Exclude<MapRegion, "california">, number, number, number, number][] = [
    ["bay-area", 36.4, 38.85, -123.2, -121.2],
    ["los-angeles", 33.7, 34.8, -119.6, -116.45],
    ["san-diego", 32.5, 33.7, -117.65, -115.8],
  ];
  const match = areas.find(([, minLat, maxLat, minLon, maxLon]) =>
    latitude >= minLat && latitude <= maxLat && longitude >= minLon && longitude <= maxLon,
  );
  return match?.[0] ?? null;
}

export default function HomeMap({ initialRegion, data, autoLocate }: {
  initialRegion: MapRegion;
  data: Record<MapRegion, RegionData>;
  autoLocate: boolean;
}) {
  const [region, setRegion] = useState<MapRegion>(initialRegion);

  // Switching region is client-side state, not navigation: the map stays put and
  // only its data and camera change. The URL is kept honest for sharing.
  const switchRegion = useCallback((next: MapRegion) => {
    setRegion(next);
    const url = next === "california" ? "/" : `/?region=${next}`;
    window.history.replaceState(null, "", url);
  }, []);

  useEffect(() => {
    if (!autoLocate || !navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(({ coords }) => {
      const nearbyRegion = regionForLocation(coords.latitude, coords.longitude);
      if (!nearbyRegion) return;
      setRegion(nearbyRegion);
      window.history.replaceState(null, "", `/?region=${nearbyRegion}`);
    }, () => undefined, { enableHighAccuracy: false, maximumAge: 86400000, timeout: 5000 });
  }, [autoLocate]);

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
