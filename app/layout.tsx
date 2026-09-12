import type { Metadata } from "next";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { siteName, siteUrl } from "./lib/site";
import { gaMeasurementId } from "./lib/analytics";

const description =
  "Driving roads across California, from the Bay Area to Orange County — mapped from OpenStreetMap with corner counts, difficulty ratings and sourced speed-limit evidence for each road.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Best Driving Roads in California",
    // Road and region pages set only their own name; this appends the brand.
    template: `%s | ${siteName}`,
  },
  description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName,
    locale: "en_US",
    url: "/",
    title: "Best Driving Roads in California",
    description,
  },
  // Only the card type. Setting a title/description here would pin the site
  // defaults onto every page's Twitter card; left out, each page's own title
  // and description are used instead.
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
  // iOS was reading text like "68 Bay Area roads" as a street address and
  // making it tappable into Maps. Numbers next to place names show up all
  // over this site (road counts, mile figures), so this is turned off globally
  // rather than patched around one heading.
  formatDetection: { telephone: false, address: false, email: false },
  // Set once a property exists in Google Search Console: Settings → Ownership
  // verification → HTML tag → the content="..." value, not the whole tag.
  verification: process.env.NEXT_PUBLIC_GSC_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GSC_VERIFICATION }
    : undefined,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Analytics />
        {/* Loads only once NEXT_PUBLIC_GA_MEASUREMENT_ID is set. Region
            switches and road/landmark selections are also sent — see
            lib/analytics.ts and the calls in home-map.tsx / road-explorer.tsx. */}
        {gaMeasurementId && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`} strategy="afterInteractive" />
            <Script id="ga4-init" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag("js", new Date());
                gtag("config", "${gaMeasurementId}");`}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
