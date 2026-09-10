"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { enablePinchZoom } from "./lib/pinch-zoom";

const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN?.trim();
const validToken = token?.startsWith("pk.");

/**
 * A single road, drawn on its own page. Loads only that road's geometry, so a
 * road page never pays for the full collection.
 */
export default function RoadMap({ id, name, bounds, color }: {
  id: string;
  name: string;
  bounds: [[number, number], [number, number]];
  color: string;
}) {
  const container = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState(validToken ? "Loading map…" : "Map unavailable: no Mapbox token is configured.");

  useEffect(() => {
    if (!container.current || !validToken) return;
    let disposed = false;
    let loaded = false;
    let instance: mapboxgl.Map | undefined;
    let observer: ResizeObserver | undefined;
    let detachPinch: (() => void) | undefined;
    const abort = new AbortController();
    // Deferred so the status updates below never run synchronously inside the effect.
    const updateStatus = (message: string) => { if (!disposed) setStatus(message); };

    try {
      if (!mapboxgl.supported()) {
        queueMicrotask(() => updateStatus("Your browser cannot display the map. Enable graphics acceleration or try another browser."));
        return;
      }
      const map = new mapboxgl.Map({
        container: container.current, accessToken: token, attributionControl: false,
        style: "mapbox://styles/mapbox/dark-v11", bounds, fitBoundsOptions: { padding: 40 },
      });
      instance = map;
      detachPinch = enablePinchZoom(map, container.current);
      map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "top-right");
      map.addControl(new mapboxgl.AttributionControl({ compact: true, customAttribution: '<a href="/data/README.txt" target="_blank">Road trace: © OpenStreetMap contributors</a>' }), "bottom-right");

      // Same reason as the explorer: "load" waits on a first frame that can fail
      // to arrive, so accept whichever ready signal comes first.
      let started = false;
      const begin = async () => {
        if (started || disposed) return;
        started = true;
        try {
          const response = await fetch(`/data/roads/${id}.geojson`, { signal: abort.signal });
          if (!response.ok) throw new Error("Road data unavailable");
          const data = await response.json();
          if (disposed) return;
          map.addSource("road", { type: "geojson", data });
          map.addLayer({ id: "road-casing", type: "line", source: "road", layout: { "line-cap": "round", "line-join": "round" }, paint: { "line-color": "#111817", "line-width": ["interpolate", ["linear"], ["zoom"], 8, 5, 14, 11] } });
          map.addLayer({ id: "road-line", type: "line", source: "road", layout: { "line-cap": "round", "line-join": "round" }, paint: { "line-color": color, "line-width": ["interpolate", ["linear"], ["zoom"], 8, 2.5, 14, 6] } });
          loaded = true;
          updateStatus("");
        } catch {
          updateStatus("The road trace could not load. Check your connection and try again.");
        }
      };
      map.on("load", begin);
      map.on("styledata", () => { if (map.isStyleLoaded()) begin(); });
      // Events alone are not enough: if the style finishes before these
      // listeners attach, no event ever arrives and the overlay sticks. Poll
      // the actual readiness flag as well, so the outcome does not depend on
      // winning a race.
      const ready = window.setInterval(() => {
        if (disposed || started) { window.clearInterval(ready); return; }
        if (map.isStyleLoaded()) { window.clearInterval(ready); begin(); }
      }, 200);

      map.on("error", () => { if (!loaded) updateStatus("The map could not finish loading."); });
      // Same reason as the explorer: fail loudly rather than sitting on "Loading map…".
      window.setTimeout(() => {
        if (!loaded && !disposed) updateStatus("The map is taking longer than expected. Reload to try again.");
      }, 10000);
      observer = new ResizeObserver(() => map.resize());
      observer.observe(container.current);
    } catch {
      queueMicrotask(() => updateStatus("The map could not start. Try another browser or enable graphics acceleration."));
    }
    return () => { disposed = true; abort.abort(); detachPinch?.(); observer?.disconnect(); instance?.remove(); };
  }, [id, color, bounds]);

  return (
    <div className="road-map" role="img" aria-label={`Map of ${name}`}>
      <div ref={container} className="map" />
      {status && <p className="road-map-status" role="status">{status}</p>}
    </div>
  );
}
