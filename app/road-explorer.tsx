"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import mapboxgl, { type ExpressionSpecification, type FilterSpecification } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import type { RoadSummary } from "./lib/roads";

const characters = ["Technical", "Low speed", "Medium speed", "High speed"] as const;
type Character = (typeof characters)[number];
const colors = ["#78caba", "#eac47c", "#e99488"];
const roadColor: ExpressionSpecification = ["match", ["get", "difficulty"], 1, colors[0], 2, colors[1], colors[2]];
const layers = ["road-casing", "road-lines", "road-hit", "road-names", "road-dots"];
const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN?.trim();
const validToken = token?.startsWith("pk.");
const tokenMessage = "Add a public Mapbox token to NEXT_PUBLIC_MAPBOX_TOKEN in .env.local, then restart the server.";
const initialCenter: [number, number] = [-122.10, 37.57];

export default function RoadExplorer({ roads }: { roads: RoadSummary[] }) {
  const container = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [enabled, setEnabled] = useState<Character[]>([]);
  const [attempt, setAttempt] = useState(0);
  const [ready, setReady] = useState(false);
  const [showRoads, setShowRoads] = useState(false);
  const [status, setStatus] = useState(validToken ? "Loading map…" : tokenMessage);
  const visible = roads.filter(road => enabled.length === 0 || enabled.includes(road.character as Character));
  const active = visible.find(road => road.id === selected);

  useEffect(() => {
    if (!container.current || !validToken) return;
    let disposed = false;
    let loaded = false;
    let instance: mapboxgl.Map | undefined;
    let observer: ResizeObserver | undefined;
    const abort = new AbortController();
    const updateStatus = (message: string) => { if (!disposed) setStatus(message); };

    queueMicrotask(() => {
      if (disposed) return;
      setReady(false);
      updateStatus("Loading map…");
      try {
        if (!mapboxgl.supported()) {
          updateStatus("Your browser cannot display the map. Enable graphics acceleration or try another browser.");
          return;
        }
        const current = new mapboxgl.Map({
          container: container.current!, accessToken: token, attributionControl: false,
          style: "mapbox://styles/mapbox/dark-v11", center: initialCenter,
          zoom: container.current!.clientWidth < 640 ? 7.3 : 8,
        });
        instance = current;
        map.current = current;
        current.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "top-right");
        current.addControl(new mapboxgl.AttributionControl({ compact: true, customAttribution: '<a href="/data/README.txt" target="_blank">Road traces: © OpenStreetMap contributors</a>' }), "bottom-right");

        current.on("load", async () => {
          try {
            const [lines, labels] = await Promise.all(["roads", "road-labels"].map(async name => {
              const response = await fetch(`/data/${name}.geojson`, { signal: abort.signal });
              if (!response.ok) throw new Error("Road data unavailable");
              return response.json();
            }));
            if (disposed) return;
            current.addSource("roads", { type: "geojson", data: lines });
            current.addSource("road-labels", { type: "geojson", data: labels });
            current.addLayer({ id: "road-casing", type: "line", source: "roads", layout: { "line-cap": "round", "line-join": "round" }, paint: { "line-color": "#111817", "line-width": ["interpolate", ["linear"], ["zoom"], 6, 3, 12, 8] } });
            current.addLayer({ id: "road-lines", type: "line", source: "roads", layout: { "line-cap": "round", "line-join": "round" }, paint: { "line-color": roadColor, "line-width": ["interpolate", ["linear"], ["zoom"], 6, 1.7, 10, 3, 14, 5], "line-opacity": 0.85 } });
            current.addLayer({ id: "road-selected", type: "line", source: "roads", filter: ["==", ["get", "id"], ""], layout: { "line-cap": "round", "line-join": "round" }, paint: { "line-color": "#ffffff", "line-width": 5 } });
            current.addLayer({ id: "road-hit", type: "line", source: "roads", paint: { "line-width": 18, "line-opacity": 0 } });
            current.addLayer({ id: "road-dots", type: "circle", source: "road-labels", maxzoom: 10, paint: { "circle-color": roadColor, "circle-radius": 3, "circle-stroke-width": 1, "circle-stroke-color": "#18211d" } });
            current.addLayer({
              id: "road-names", type: "symbol", source: "road-labels",
              layout: { "text-field": ["get", "name"], "text-font": ["DIN Pro Medium", "Arial Unicode MS Regular"], "text-size": ["interpolate", ["linear"], ["zoom"], 6, 10, 10, 12], "text-anchor": "left", "text-offset": [0.7, 0], "text-max-width": 14, "text-padding": 6, "text-optional": true },
              paint: { "text-color": "#f1f0e9", "text-halo-color": "#1b2220", "text-halo-width": 2 },
            });
            current.on("click", event => {
              const hits = current.queryRenderedFeatures([[event.point.x - 5, event.point.y - 5], [event.point.x + 5, event.point.y + 5]], { layers: ["road-names", "road-hit", "road-dots"] });
              const id = hits[0]?.properties?.id;
              if (typeof id === "string") { setSelected(id); setShowRoads(false); }
            });
            current.on("mousemove", event => {
              current.getCanvas().style.cursor = current.queryRenderedFeatures(event.point, { layers: ["road-names", "road-hit"] }).length ? "pointer" : "";
            });
            loaded = true;
            updateStatus("");
            setReady(true);
            const roadId = new URLSearchParams(window.location.search).get("road");
            if (roads.some(road => road.id === roadId)) setSelected(roadId);
          } catch {
            if (!disposed) updateStatus("Roads could not load. Check your connection and try again.");
          }
        });
        current.on("error", event => {
          if (loaded) return;
          const code = (event.error as Error & { status?: number }).status;
          updateStatus(code === 401 || code === 403
            ? "Mapbox rejected this token. Check its permissions and allowed website URLs."
            : "The map could not finish loading. Check your connection and try again.");
        });
        observer = new ResizeObserver(() => current.resize());
        observer.observe(container.current!);
      } catch {
        updateStatus("The map could not start. Try another browser or enable graphics acceleration.");
      }
    });
    const timeout = window.setTimeout(() => {
      if (!loaded && !disposed) setStatus(previous => previous === "Loading map…" ? "The map is taking longer than expected. Check your connection and try again." : previous);
    }, 25000);
    return () => { disposed = true; abort.abort(); window.clearTimeout(timeout); observer?.disconnect(); instance?.remove(); map.current = null; };
  }, [attempt, roads]);

  useEffect(() => {
    if (!ready || !map.current?.getLayer("road-lines")) return;
    const filter: FilterSpecification = ["in", ["get", "character"], ["literal", enabled.length ? enabled : [...characters]]];
    for (const layer of layers) map.current.setFilter(layer, filter);
    map.current.setFilter("road-selected", ["all", filter, ["==", ["get", "id"], selected ?? ""]]);
  }, [enabled, selected, ready]);

  useEffect(() => {
    const road = roads.find(item => item.id === selected);
    if (!road || !ready || !map.current) return;
    const mobile = (container.current?.clientWidth ?? 1440) < 640;
    map.current.fitBounds(road.bounds as [[number, number], [number, number]], {
      padding: mobile ? { top: 115, right: 35, bottom: 300, left: 35 } : { top: 130, right: 80, bottom: 100, left: 440 },
      maxZoom: 12, duration: 1000,
    });
  }, [selected, ready, roads]);

  function toggleCharacter(character: Character) {
    const next = enabled.includes(character) ? enabled.filter(item => item !== character) : [...enabled, character];
    setEnabled(next);
    if (active && next.length && !next.includes(active.character as Character)) setSelected(null);
  }
  function resetMap() {
    setSelected(null); setEnabled([]); setShowRoads(false);
    map.current?.fitBounds([[-123.13, 36.42], [-121.35, 38.80]], { padding: { top: 125, right: 45, bottom: 65, left: 45 }, duration: 1000 });
  }

  return (
    <section className="map-panel" aria-label="Northern California driving roads map">
      <div ref={container} className="map" />
      <fieldset className="character-filter">
        <legend>Road character{enabled.length > 0 && <button className="clear-filters" onClick={() => setEnabled([])}>Clear</button>}</legend>
        <div className="filter-options">
          {characters.map(character => <button key={character} className="character" aria-pressed={enabled.includes(character)} onClick={() => toggleCharacter(character)}>{character}</button>)}
        </div>
      </fieldset>
      <button className="reset" onClick={resetMap} aria-label="Show all roads" title="Show all roads">⌖</button>
      <div className="map-bottom">
        <div className="difficulty-legend" aria-label="Difficulty color legend">
          <span>Difficulty</span>
          {["1 · Relaxed", "2 · Winding", "3 · Technical"].map((label, i) => <span key={label}><i style={{ background: colors[i] }} />{label}</span>)}
        </div>
        <button className="browse-roads" aria-label={`${visible.length} roads`} aria-expanded={showRoads} aria-controls="road-picker" onClick={() => { setShowRoads(!showRoads); setSelected(null); }}>{visible.length} roads <span>{showRoads ? "−" : "+"}</span></button>
      </div>
      {showRoads && <div id="road-picker" className="road-picker" aria-label="Choose a road">
        <div className="picker-title">Bay Area & nearby drives<button className="close" aria-label="Close road list" onClick={() => setShowRoads(false)}>×</button></div>
        {visible.map(road => <button key={road.id} onClick={() => { setSelected(road.id); setShowRoads(false); }}><i style={{ background: colors[road.difficulty - 1] }} /><span>{road.name}<small>{road.area}</small></span><span className="picker-rating">{road.difficulty}/3</span></button>)}
        {visible.length === 0 && <p>Select a road character above to show roads.</p>}
      </div>}
      {status && <div className="map-status" role="status"><span>{status}</span>{status !== "Loading map…" && validToken && <button onClick={() => setAttempt(value => value + 1)}>Try again</button>}</div>}
      {visible.length === 0 && !status && !showRoads && <p className="empty-hint" role="status">Select a road character to show roads.</p>}
      {active && <article className="detail" aria-label={`${active.name} details`}>
        <button className="close" aria-label="Close road details" onClick={() => setSelected(null)}>×</button>
        <p className="eyebrow">{active.area}</p>
        <h2>{active.name}</h2>
        <div className="road-badges"><span><i style={{ background: colors[active.difficulty - 1] }} /> Difficulty {active.difficulty}/3</span><span>{active.character}</span></div>
        <p>{active.description}</p>
        <dl className="mini-stats">
          <div><dt>Touge Score</dt><dd className="mini-score">{active.score}</dd></div>
          <div><dt>Length</dt><dd>{active.lengthMi} mi</dd></div>
          <div><dt>Bends</dt><dd>{active.bends}</dd></div>
          <div><dt>Speed</dt><dd>{active.speed}</dd></div>
        </dl>
        <Link className="detail-cta" href={`/roads/${active.id}`}>Full road guide, sources &amp; speed evidence →</Link>
      </article>}
    </section>
  );
}
