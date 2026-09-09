// Canonical URLs, the sitemap and OG image tags all need an absolute origin.
// Set NEXT_PUBLIC_SITE_URL to the real domain before deploying; on Vercel the
// project's production URL is used automatically if that variable is missing.
const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();

export const siteUrl = (
  configured || (vercel ? `https://${vercel}` : "http://localhost:3000")
).replace(/\/+$/, "");

export const siteName = "California Touge";
export const reviewedOn = "September 8, 2026";
