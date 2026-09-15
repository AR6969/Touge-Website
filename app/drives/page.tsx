import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { SiteFooter, SiteHeader } from "../site-chrome";
import { drives } from "../lib/drives";
import { siteUrl } from "../lib/site";
import { mapRegions } from "../lib/map-regions";
import { driveShapeUri } from "../lib/road-shape";
import "./drives-index.css";

// A drawn arrow rather than the Unicode ↗ this replaced: that glyph gets the
// system emoji font on iOS at this size, not a plain arrow. Sized off the
// surrounding font-size (1em) so the existing CSS needs no changes.
function ExternalArrow() {
  return (
    <svg width="1em" height="1em" viewBox="0 0 12 12" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
      <path d="M3 9L9 3M9 3H4M9 3V8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const title = "Bay Area & Los Angeles Driving Guides | TougeMap";
const description = "Plan a Bay Area coastal loop or a Los Angeles mountain drive. Connected roads, clear junctions, maps, stops and current road-condition links.";

export const metadata: Metadata = {
  title: { absolute: title },
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
    "@graph": [
      { "@type": "CollectionPage", "@id": `${siteUrl}/drives#webpage`, url: `${siteUrl}/drives`, name: "Bay Area and Los Angeles driving guides", description, mainEntity: { "@id": `${siteUrl}/drives#list` } },
      { "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
        { "@type": "ListItem", position: 2, name: "Driving guides", item: `${siteUrl}/drives` },
      ] },
      { "@type": "ItemList", "@id": `${siteUrl}/drives#list`,
        name: title,
        numberOfItems: drives.length,
        itemListElement: groups.flatMap(group => group.drives).map((drive, index) => ({
          "@type": "ListItem", position: index + 1, name: drive.title, url: `${siteUrl}/drives/${drive.slug}`,
        })),
      },
    ],
  };

  return (
    <>
      <SiteHeader current="drives" />
      <main className="prose drives-index">
        <nav className="breadcrumb" aria-label="Breadcrumb"><Link href="/">Home</Link> <span aria-hidden="true">/</span> Driving guides</nav>
        <h1>Driving guides</h1>
        <p className="lede drives-lead">A few good roads, joined into a day out. Explore Bay Area and Los Angeles routes with junctions, worthwhile stops and return options.</p>
        <nav className="drives-categories" aria-label="Driving guide categories">
          {groups.map(group => <a key={group.id} href={`#${group.id}`}>{group.region.name}<span>{group.drives.length} {group.drives.length === 1 ? "drive" : "drives"}</span></a>)}
        </nav>
        {groups.map(group => <section className="drive-category" key={group.id} id={group.id} aria-labelledby={`${group.id}-title`}>
          <div className="drive-category-heading">
            <h2 id={`${group.id}-title`}>{group.region.name}</h2>
            <Link href={group.region.href} aria-label={`Explore the ${group.region.name} map`}>Open map <ExternalArrow /></Link>
          </div>
          {group.id === "bay-area" && <p className="drive-category-intro">Start with <Link href="/roads/highway-9-front">Highway 9</Link> and <Link href="/roads/pescadero">Pescadero Creek Road</Link> for a mountain-to-coast outing, or choose a shorter ridge drive from <Link href="/roads/page-mill">Page Mill Road</Link>.</p>}
          {group.id === "los-angeles" && <p className="drive-category-intro">The <Link href="/roads/glendora-mountain">Glendora Mountain Road</Link> guide joins the tight mountain section to <Link href="/roads/san-gabriel-canyon">Highway 39</Link> via East Fork Road, with gate-access sources to check before leaving.</p>}
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
                <span className="drive-row-arrow" aria-hidden="true"><ExternalArrow /></span>
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
