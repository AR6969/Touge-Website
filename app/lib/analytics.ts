declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Unset until NEXT_PUBLIC_GA_MEASUREMENT_ID is added in the Vercel project
 * settings (a GA4 property's Measurement ID, "G-XXXXXXXXXX"). Every call
 * below is a no-op until then — nothing loads or sends without it.
 */
export const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() || null;

/**
 * Fires a GA4 event. Safe to call unconditionally: it is a no-op before
 * gtag.js has loaded, before consent (there is none configured), or when no
 * measurement ID is set at all.
 */
export function track(event: string, params: Record<string, string | number | boolean> = {}) {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", event, params);
}
