// Canonical URLs, the sitemap and OG image tags all need an absolute origin.
// Keep preview deployments and local builds pointed at the established public
// origin. Falling back to a Vercel project hostname can split canonical signals.
const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();

export const siteUrl = new URL(configured || "https://www.tougemap.com").origin;

export const siteName = "California Touge";
export const reviewedOn = "September 8, 2026";

// Where the contact page sends messages once no form backend is configured
// (NEXT_PUBLIC_FORMSPREE_ENDPOINT unset) — a mailto fallback that needs no
// third-party account, so the page is never a dead end.
export const contactEmail = "arkt.rentals@gmail.com";
