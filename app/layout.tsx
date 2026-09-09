import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { siteName, siteUrl } from "./lib/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const description =
  "Driving roads across the Bay Area, Santa Cruz, Napa and Monterey — mapped from OpenStreetMap with corner counts, difficulty ratings and sourced speed-limit evidence for each road.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Best Driving Roads in the Bay Area & Northern California",
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
    title: "Best Driving Roads in the Bay Area & Northern California",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
