import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { SiteFooter, SiteHeader } from "../site-chrome";
import { drives } from "../lib/drives";
import { siteUrl } from "../lib/site";
import { mapRegions } from "../lib/map-regions";
import { driveShapeUri } from "../lib/road-shape";
import "./drives-index.css";

const title = "California Driving Guides: Bay Area & Los Angeles";
const description = "Plan a Bay Area coastal loop or a Los Angeles mountain drive. Connected roads, clear junctions, maps, stops and current road-condition links.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/drives" },
  openGraph: { url: "/drives", title, description },
};

export default async function DrivesIndex() {
  // Explicit regional order stays stable as guides are added to the catalog.
  const groups = Object.entries(mapRegions)
    .map(([id, region]) => ({ id, region, drives: drives.filter(drive => drive.mapRegion === id) }))
    .filter(group => group.drives.length > 0);
  const shapes = new Map(await Promise.all(drives.map(async drive =>
    [drive.slug, await driveShapeUri(drive, 120, 96, "#a8d8c6")] as const,
  )));
  const structured = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: title,
    numberOfItems: drives.length,
    itemListElement: groups.flatMap(group => group.drives).map((drive, index) => ({
      "@type": "ListItem", position: index + 1, name: drive.title, url: `${siteUrl}/drives/${drive.slug}`,
    })),
  };

  return (
    <>
      <SiteHeader current="drives" />
      <main className="prose drives-index">
        <nav className="breadcrumb" aria-label="Breadcrumb"><Link href="/">Home</Link> <span aria-hidden="true">/</span> Driving guides</nav>
        <h1>Driving guides</h1>
        <p className="lede drives-lead">A few good roads, joined into a day out. Pick a region and find your next drive.</p>
        <nav className="drives-categories" aria-label="Driving guide categories">
          {groups.map(group => <a key={group.id} href={`#${group.id}`}>{group.region.name}<span>{group.drives.length} {group.drives.length === 1 ? "drive" : "drives"}</span></a>)}
        </nav>
        {groups.map(group => <section className="drive-category" key={group.id} id={group.id} aria-labelledby={`${group.id}-title`}>
          <div className="drive-category-heading">
            <h2 id={`${group.id}-title`}>{group.region.name}</h2>
            <Link href={group.region.href} aria-label={`Explore the ${group.region.name} map`}>Open map ↗</Link>
          </div>
          <ul className="drive-directory">
            {group.drives.map(drive => <li key={drive.slug}>
              <Link href={`/drives/${drive.slug}`} aria-labelledby={`title-${drive.slug}`}>
                <Image className="drive-route-mark" src={shapes.get(drive.slug)!} width={120} height={96} alt="" unoptimized />
                <div className="drive-row-copy">
                  <span className="drive-row-kind">{drive.character}</span>
                  <h3 className="drive-row-title" id={`title-${drive.slug}`}>{drive.title}</h3>
                  <span className="drive-row-route">{drive.route.map((road, i) => <span key={`${road}-${i}`}>
                    {i > 0 && <b aria-hidden="true">→</b>}{road}
                  </span>)}</span>
                </div>
                <span className="drive-row-arrow" aria-hidden="true">↗</span>
              </Link>
            </li>)}
          </ul>
        </section>)}
        <p className="drives-outro"><Link href="/roads">Just looking for a road? Browse the full map collection →</Link></p>
      </main>
      <SiteFooter />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structured).replace(/</g, "\\u003c") }} />
    </>
  );
}
