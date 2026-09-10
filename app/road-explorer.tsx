"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import mapboxgl, { type ExpressionSpecification, type FilterSpecification } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import type { Landmark, RoadSummary } from "./lib/roads";
import { characterColors, characters, colorFor, landmarkColor, type Character } from "./lib/colors";
import { mapRegions, type MapRegion } from "./lib/map-regions";

// Colour is character, so the filter buttons and the roads they filter agree.
const roadColor: ExpressionSpecification = [
  "match", ["get", "character"],
  "Technical", characterColors.Technical,
  "Low speed", characterColors["Low speed"],
  "Medium speed", characterColors["Medium speed"],
  "High speed", characterColors["High speed"],
  "#9fb0a4",
];
const layers = ["road-casing", "road-lines", "road-hit", "road-names", "road-dots"];
const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN?.trim();
const validToken = token?.startsWith("pk.");
const tokenMessage = "Add a public Mapbox token to NEXT_PUBLIC_MAPBOX_TOKEN in .env.local, then restart the server.";

export default function RoadExplorer({ roads, landmarks, region = "bay-area" }: { roads: RoadSummary[]; landmarks: Landmark[]; region?: MapRegion }) {
  const regionConfig = mapRegions[region];
  const container = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [enabled, setEnabled] = useState<Character[]>([]);
  const [attempt, setAttempt] = useState(0);
  const [ready, setReady] = useState(false);
  const [showRoads, setShowRoads] = useState(false);
  const [roadQuery, setRoadQuery] = useState("");
  const [landmark, setLandmark] = useState<string | null>(null);
  const dataRef = useRef({ roads, landmarks });
  const [status, setStatus] = useState(validToken ? "Loading map…" : tokenMessage);
  const visible = roads.filter(road => enabled.length === 0 || enabled.includes(road.character as Character));
  const matchingRoads = visible.filter(road => road.name.toLowerCase().includes(roadQuery.trim().toLowerCase()));
  const active = visible.find(road => road.id === selected);
  const activeLandmark = landmarks.find(mark => mark.name === landmark);

  useEffect(() => { dataRef.current = { roads, landmarks }; }, [roads, landmarks]);

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
            style: "mapbox://styles/mapbox/dark-v11", center: regionConfig.center,
          scrollZoom: region === "california",
          zoom: container.current!.clientWidth < 640 ? 7.3 : 8,
          ...(region === "los-angeles" || region === "california" ? { bounds: regionConfig.bounds, fitBoundsOptions: { padding: { top: 110, right: 40, bottom: 65, left: 40 } } } : {}),
        });
        instance = current;
        map.current = current;
        current.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "top-right");
        current.addControl(new mapboxgl.AttributionControl({ compact: true, customAttribution: '<a href="/data/README.txt" target="_blank">Road traces: © OpenStreetMap contributors</a>' }), "bottom-right");

        // "load" means style-ready AND first frame painted, and the frame can fail
        // to arrive — leaving the map usable but the UI stuck on "Loading map…".
        // Start from whichever signal says the style is ready first, once only.
        let started = false;
        const begin = async () => {
          if (started || disposed) return;
          started = true;
          try {
            const [lines, labels] = await Promise.all(["roads", "road-labels"].map(async name => {
              const path = region === "california" ? `/data/${name}.geojson` : `/data/${region}/${name}.geojson`;
              const response = await fetch(path, { signal: abort.signal });
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
            current.addSource("landmarks", {
              type: "geojson",
              data: {
                type: "FeatureCollection",
                features: dataRef.current.landmarks.map(mark => ({
                  type: "Feature" as const,
                  properties: { name: mark.name },
                  geometry: { type: "Point" as const, coordinates: mark.coordinates },
                })),
              },
            });
            // Named junctions, drawn above the roads and never hidden by the filter.
            current.addLayer({
              id: "landmark-dots", type: "circle", source: "landmarks",
              paint: {
                "circle-color": landmarkColor, "circle-radius": 6,
                "circle-stroke-width": 2.5, "circle-stroke-color": "#141918",
              },
            });
            current.addLayer({
              id: "landmark-names", type: "symbol", source: "landmarks",
              layout: {
                "text-field": ["get", "name"],
                "text-font": ["DIN Pro Medium", "Arial Unicode MS Regular"],
                "text-size": 12, "text-anchor": "top", "text-offset": [0, 0.8], "text-padding": 8,
              },
              paint: { "text-color": landmarkColor, "text-halo-color": "#141918", "text-halo-width": 2.5 },
            });
            current.on("click", event => {
              const box: [mapboxgl.PointLike, mapboxgl.PointLike] =
                [[event.point.x - 8, event.point.y - 8], [event.point.x + 8, event.point.y + 8]];
              const marks = current.queryRenderedFeatures(box, { layers: ["landmark-dots", "landmark-names"] });
              const markName = marks[0]?.properties?.name;
              if (typeof markName === "string") {
                setLandmark(markName);
                setSelected(null);
                setShowRoads(false);
                return;
              }
              const hits = current.queryRenderedFeatures(box, { layers: ["road-names", "road-hit", "road-dots"] });
              const id = hits[0]?.properties?.id;
              if (typeof id === "string") { setSelected(id); setLandmark(null); setShowRoads(false); }
            });
            current.on("mousemove", event => {
              current.getCanvas().style.cursor = current.queryRenderedFeatures(event.point, { layers: ["landmark-dots", "landmark-names", "road-names", "road-hit"] }).length ? "pointer" : "";
            });
            loaded = true;
            updateStatus("");
            setReady(true);
            const roadId = new URLSearchParams(window.location.search).get("road");
            if (roads.some(road => road.id === roadId)) {
              setSelected(roadId); setLandmark(null); setShowRoads(false);
            }
          } catch {
            if (!disposed) updateStatus("Roads could not load. Check your connection and try again.");
          }
        };
        current.on("load", begin);
        current.on("styledata", () => { if (current.isStyleLoaded()) begin(); });
        // Events alone are not enough: if the style finishes before these
        // listeners attach, no event ever arrives and the overlay sticks. Poll
        // the actual readiness flag as well, so the outcome does not depend on
        // winning a race.
        const ready = window.setInterval(() => {
          if (disposed || started) { window.clearInterval(ready); return; }
          if (current.isStyleLoaded()) { window.clearInterval(ready); begin(); }
        }, 200);

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
    // 25s of an unexplained "Loading map…" is indistinguishable from a broken
    // page. Say something actionable much sooner.
    const timeout = window.setTimeout(() => {
      if (!loaded && !disposed) setStatus(previous => previous === "Loading map…" ? "The map is taking longer than expected. Check your connection and try again." : previous);
    }, 10000);
    return () => { disposed = true; abort.abort(); window.clearTimeout(timeout); observer?.disconnect(); instance?.remove(); map.current = null; };
    // `roads` and `landmarks` are deliberately not dependencies: they are new
    // arrays on every render, and listing them lets any re-render destroy a
    // half-loaded map and reset the overlay. Read through dataRef instead.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attempt, region, regionConfig]);

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
    setSelected(null); setLandmark(null); setEnabled([]); setShowRoads(false); setRoadQuery("");
    map.current?.fitBounds(regionConfig.bounds, { padding: { top: 135, right: 45, bottom: 65, left: 45 }, duration: 1000 });
  }

  return (
    <section className="map-panel" aria-label={`${regionConfig.name} driving roads map`}>
      <div ref={container} className="map" />
      <fieldset className="character-filter">
        <legend>Road character{enabled.length > 0 && <button className="clear-filters" onClick={() => setEnabled([])}>Clear</button>}</legend>
        <div className="filter-options">
          {characters.map(character => (
            <button key={character} className="character" aria-pressed={enabled.includes(character)} aria-label={character}
                    style={{ "--swatch": characterColors[character] } as React.CSSProperties}
                    onClick={() => toggleCharacter(character)}>
              {/* "speed" is dropped on narrow screens so all four fit one row;
                  aria-label keeps the full name for assistive tech. */}
              <i />
              {/* One element, so the flex gap does not open a second space
                  between "Low" and "speed". */}
              <span className="chip-label">
                {character.replace(" speed", "")}
                {character.endsWith(" speed") && <span className="chip-suffix"> speed</span>}
              </span>
            </button>
          ))}
        </div>
      </fieldset>
      <button className="reset" onClick={resetMap} aria-label="Show all roads" title="Show all roads">⌖</button>
      <div className="map-bottom">
        <a className="map-scroll-hint" href="#about">About this map ↓</a>
        <button className="browse-roads" aria-label={`${visible.length} roads`} aria-expanded={showRoads} aria-controls="road-picker" onClick={() => { setShowRoads(!showRoads); setSelected(null); setLandmark(null); setRoadQuery(""); }}>{visible.length} roads <span>{showRoads ? "−" : "+"}</span></button>
      </div>
      {showRoads && <div id="road-picker" className="road-picker" aria-label="Choose a road">
        <div className="picker-title">
          {regionConfig.pickerTitle}<button className="close" aria-label="Close road list" onClick={() => setShowRoads(false)}>×</button>
          <input className="road-search" type="search" aria-label="Find a road" placeholder="Find a road…" value={roadQuery} onChange={event => setRoadQuery(event.target.value)} autoComplete="off" spellCheck={false} />
        </div>
        {matchingRoads.map(road => <button key={road.id} onClick={() => { setSelected(road.id); setLandmark(null); setShowRoads(false); }}><i style={{ background: colorFor(road.character) }} /><span>{road.name}<small>{road.area}</small></span><span className="picker-rating">{road.difficulty}/3</span></button>)}
        {matchingRoads.length === 0 && <p role="status">No matching roads.{enabled.length > 0 && " Try clearing the road character filters."}</p>}
      </div>}
      {status && <div className="map-status" role="status"><span>{status}</span>{status !== "Loading map…" && validToken && <button onClick={() => setAttempt(value => value + 1)}>Try again</button>}</div>}
      {visible.length === 0 && !status && !showRoads && <p className="empty-hint" role="status">Select a road character to show roads.</p>}
      {activeLandmark && <article className="detail landmark-card" aria-label={`${activeLandmark.name} details`}>
        <button className="close" aria-label="Close junction details" onClick={() => setLandmark(null)}>×</button>
        <p className="eyebrow">{activeLandmark.kind}</p>
        <h2>{activeLandmark.name}</h2>
        <p>{activeLandmark.note}</p>
        {activeLandmark.sourceUrl && <a className="detail-cta" href={activeLandmark.sourceUrl} target="_blank" rel="noopener noreferrer">{activeLandmark.sourceLabel ?? "More information"} ↗</a>}
      </article>}
      {active && <article className="detail" aria-label={`${active.name} details`}>
        <button className="close" aria-label="Close road details" onClick={() => setSelected(null)}>×</button>
        <p className="eyebrow">{active.area}</p>
        <h2>{active.name}</h2>
        <div className="road-badges"><span><i style={{ background: colorFor(active.character) }} /> {active.character}</span><span>Difficulty {active.difficulty}/3</span></div>
        <p>{active.description}</p>
        {active.access && <p className="fine">{active.access.note}{" "}<a href={active.access.url} target="_blank" rel="noopener noreferrer">Check access ↗</a></p>}
        <dl className="mini-stats">
          <div><dt>Length</dt><dd>{active.lengthMi} mi</dd></div>
          <div><dt>Bends</dt><dd>{active.bends}</dd></div>
          <div><dt>Speed guide</dt><dd>{active.speed}</dd></div>
        </dl>
        <Link className="detail-cta" href={`/roads/${active.id}`}>Full road guide, sources &amp; speed evidence →</Link>
      </article>}
    </section>
  );
}
