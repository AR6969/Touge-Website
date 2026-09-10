import type mapboxgl from "mapbox-gl";

/**
 * Make a trackpad pinch zoom the map rather than the page.
 *
 * A pinch on a trackpad is delivered as a wheel event with ctrlKey set, which
 * browsers use for full-page zoom. Ordinary two-finger scrolling has no ctrlKey
 * and is left alone, so the page still scrolls past the map normally.
 */
export function enablePinchZoom(map: mapboxgl.Map, element: HTMLElement) {
  const onWheel = (event: WheelEvent) => {
    if (!event.ctrlKey) return;
    event.preventDefault();
    const rect = element.getBoundingClientRect();
    const around = map.unproject([event.clientX - rect.left, event.clientY - rect.top]);
    // Zoom about the pointer, so the map moves under your fingers.
    map.easeTo({ zoom: map.getZoom() - event.deltaY * 0.02, around, duration: 0 });
  };
  element.addEventListener("wheel", onWheel, { passive: false });
  return () => element.removeEventListener("wheel", onWheel);
}
