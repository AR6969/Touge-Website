import type { Metadata } from "next";
import "./globals.css";
import { siteName, siteUrl } from "./lib/site";

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
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
