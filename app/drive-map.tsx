"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN?.trim();
const validToken = token?.startsWith("pk.");
const ROUTE = "#a8d8c6";

export type DriveLeg = { id: string; name: string; step: number };

/**
 * The whole drive on one map: every leg drawn as one continuous route, numbered
 * in the order you drive them. Each leg is a small per-road file, so this costs
 * a handful of KB rather than the full regional payload.
 */
export default function DriveMap({ legs, bounds, title }: {
  legs: DriveLeg[];
  bounds: [[number, number], [number, number]];
  title: string;
}) {
  const container = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState(validToken ? "Loading map…" : "Map unavailable: no Mapbox token is configured.");

  useEffect(() => {
    if (!container.current || !validToken) return;
    let disposed = false;
    let loaded = false;
    let instance: mapboxgl.Map | undefined;
    let observer: ResizeObserver | undefined;
    const abort = new AbortController();
    const update = (message: string) => { if (!disposed) setStatus(message); };

    try {
      if (!mapboxgl.supported()) {
        queueMicrotask(() => update("Your browser cannot display the map. Enable graphics acceleration or try another browser."));
        return;
      }
      const map = new mapboxgl.Map({
        container: container.current, accessToken: token, attributionControl: false,
        style: "mapbox://styles/mapbox/dark-v11", bounds, fitBoundsOptions: { padding: 46 },
      });
      instance = map;
      map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "top-right");
      map.addControl(new mapboxgl.AttributionControl({ compact: true, customAttribution: '<a href="/data/README.txt" target="_blank">Road traces: © OpenStreetMap contributors</a>' }), "bottom-right");

      let started = false;
      const begin = async () => {
        if (started || disposed) return;
        started = true;
        try {
          const parts = await Promise.all(legs.map(async leg => {
            const response = await fetch(`/data/roads/${leg.id}.geojson`, { signal: abort.signal });
            if (!response.ok) throw new Error("Road data unavailable");
            const feature = await response.json();
            return { ...feature, properties: { ...feature.properties, step: leg.step, name: leg.name } };
          }));
          if (disposed) return;
          map.addSource("route", { type: "geojson", data: { type: "FeatureCollection", features: parts } });
          map.addLayer({
            id: "route-casing", type: "line", source: "route",
            layout: { "line-cap": "round", "line-join": "round" },
            paint: { "line-color": "#111817", "line-width": ["interpolate", ["linear"], ["zoom"], 7, 6, 13, 12] },
          });
          map.addLayer({
            id: "route-line", type: "line", source: "route",
            layout: { "line-cap": "round", "line-join": "round" },
            paint: { "line-color": ROUTE, "line-width": ["interpolate", ["linear"], ["zoom"], 7, 2.6, 13, 6] },
          });
          // A numbered marker at the middle of each leg, matching the written steps.
          map.addLayer({
            id: "route-steps", type: "symbol", source: "route",
            layout: {
              "symbol-placement": "line-center",
              "text-field": ["concat", ["to-string", ["get", "step"]], "  ", ["get", "name"]],
              "text-font": ["DIN Pro Medium", "Arial Unicode MS Regular"],
              "text-size": 12, "text-padding": 10, "text-optional": true,
            },
            paint: { "text-color": "#f4f1e8", "text-halo-color": "#141918", "text-halo-width": 2.5 },
          });
          loaded = true;
          update("");
        } catch {
          update("The route could not load. Check your connection and try again.");
        }
      };
      map.on("load", begin);
      map.on("styledata", () => { if (map.isStyleLoaded()) begin(); });
      // Events can be missed if the style finishes before these listeners attach.
      const ready = window.setInterval(() => {
        if (disposed || started) { window.clearInterval(ready); return; }
        if (map.isStyleLoaded()) { window.clearInterval(ready); begin(); }
      }, 200);
      window.setTimeout(() => {
        if (!loaded && !disposed) update("The map is taking longer than expected. Reload to try again.");
      }, 10000);
      observer = new ResizeObserver(() => map.resize());
      observer.observe(container.current);
    } catch {
      queueMicrotask(() => update("The map could not start. Try another browser or enable graphics acceleration."));
    }
    return () => { disposed = true; abort.abort(); observer?.disconnect(); instance?.remove(); };
  }, [legs, bounds]);

  return (
    <figure className="drive-map" role="img" aria-label={`Map of the ${title} route`}>
      <div ref={container} className="map" />
      {status && <p className="road-map-status" role="status">{status}</p>}
    </figure>
  );
}
