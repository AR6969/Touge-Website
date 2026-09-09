import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "../site-chrome";
import { drives } from "../lib/drives";
import { siteUrl } from "../lib/site";

const title = "Best Drives in the Bay Area";
const description = "Two Bay Area driving guides: Highway 9, Skyline and Pescadero to the coast, or a technical Page Mill climb via Alice’s. Routes, stops and optional loops.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/drives" },
  openGraph: { url: "/drives", title, description },
};

export default function DrivesIndex() {
  const structured = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: title,
    numberOfItems: drives.length,
    itemListElement: drives.map((drive, index) => ({
      "@type": "ListItem", position: index + 1, name: drive.title, url: `${siteUrl}/drives/${drive.slug}`,
    })),
  };

  return (
    <>
      <SiteHeader />
      <main className="prose">
        <nav className="breadcrumb" aria-label="Breadcrumb"><Link href="/">Home</Link> <span aria-hidden="true">/</span> Driving guides</nav>
        <h1>Best drives in the Bay Area</h1>
        <p className="lede">Two routes we’d start with: mountains to the ocean, or a technical climb with a stop at Alice’s.</p>
        <p>These guides connect individual driving roads into an outing, with a clear start, finish and optional return to make a loop. Pick the scenery and road character you’re in the mood for.</p>
        <ul className="card-list drive-cards">
          {drives.map(drive => (
            <li key={drive.slug}>
              <Link href={`/drives/${drive.slug}`}>
                <span className="card-meta">{drive.character}</span>
                <strong>{drive.title}</strong>
                <span className="card-body">{drive.intro}</span>
                <span className="card-meta">{drive.start} → {drive.finish}</span>
                <span className="drive-card-link">Explore drive →</span>
              </Link>
            </li>
          ))}
        </ul>
        <p><Link href="/">Explore all roads on the map →</Link></p>
      </main>
      <SiteFooter />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structured).replace(/</g, "\\u003c") }} />
    </>
  );
}
