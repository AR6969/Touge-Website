import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "../site-chrome";
import { drives } from "../lib/drives";
import { siteUrl } from "../lib/site";
import { mapRegions } from "../lib/map-regions";
import "../detail-pages.css";

const title = "California Driving Guides: Bay Area & Los Angeles";
const description = "Plan a Bay Area coastal loop or a Los Angeles mountain drive. Connected roads, clear junctions, maps, stops and current road-condition links.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/drives" },
  openGraph: { url: "/drives", title, description },
};

export default function DrivesIndex() {
  const groups = [...new Set(drives.map(drive => drive.mapRegion))]
    .map(id => ({ id, region: mapRegions[id], drives: drives.filter(drive => drive.mapRegion === id) }));
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
      <SiteHeader current="drives" />
      <main className="prose drives-index">
        <nav className="breadcrumb" aria-label="Breadcrumb"><Link href="/">Home</Link> <span aria-hidden="true">/</span> Driving guides</nav>
        <h1>California driving guides</h1>
        <p className="lede">Mountains, coast or a backcountry crossing. Pick an outing with connected roads, clear junctions and places to stop.</p>
        <nav className="detail-actions" aria-label="Driving guide areas">
          {groups.map(group => <a key={group.id} href={`#${group.id}`}>{group.region.name} · {group.drives.length}</a>)}
        </nav>
        {groups.map(group => <section key={group.id} aria-labelledby={group.id}>
          <h2 id={group.id}>{group.region.name} driving guides</h2>
          <ul className="card-list drive-cards">
          {group.drives.map(drive => (
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
          <p><Link href={group.region.href}>Explore the {group.region.name} map →</Link></p>
        </section>)}
        <p><Link href="/roads">Browse all driving roads →</Link></p>
      </main>
      <SiteFooter />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structured).replace(/</g, "\\u003c") }} />
    </>
  );
}
