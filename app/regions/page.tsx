import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "../site-chrome";
import { regions } from "../lib/roads";
import { roadGroups } from "../lib/region-guides";
import { siteUrl } from "../lib/site";

const title = "Driving Roads by Region";
const description = "Find driving roads by area: California's Bay Area, Malibu, Angeles mountains, Orange County, San Diego and Sierra Nevada, plus the Southern Appalachians. Choose a region to compare roads and find a drive.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/regions" },
  openGraph: { url: "/regions", title, description },
};

export default function RegionsIndex() {
  const orderedRegions = roadGroups.flatMap(group => group.areas);
  const structured = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: title,
    numberOfItems: orderedRegions.length,
    itemListElement: orderedRegions.map((region, index) => ({
      "@type": "ListItem", position: index + 1, name: region.area, url: `${siteUrl}/regions/${region.slug}`,
    })),
  };

  return (
    <>
      <SiteHeader current="regions" />
      <main className="prose">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link> <span aria-hidden="true">/</span> Regions
        </nav>
        <h1>Driving roads by region</h1>
        <p className="lede">
          Find a drive in one of {regions.length} areas across every region on this site. Pick a region to compare its roads,
          open their maps and find related driving guides.
        </p>
        <nav className="intro-links" aria-label="Jump to a region">
          {roadGroups.map(group => <a key={group.id} href={`#${group.id}`}>{group.name}</a>)}
        </nav>
        {roadGroups.map(group => (
          <section key={group.id} aria-labelledby={group.id}>
            <h2 id={group.id}>{group.name}</h2>
            <p><Link href={group.mapHref}>Open the {group.mapName} map →</Link></p>
            <ul className="card-list">
              {group.areas.map(region => (
                <li key={region.slug}>
                  <Link href={`/regions/${region.slug}`}>
                    <strong>{region.area}</strong>
                    <span className="card-meta">
                      {region.roads.length} road{region.roads.length === 1 ? "" : "s"} · {Math.round(region.roads.reduce((sum, road) => sum + road.shape.lengthMi, 0))} mapped miles
                    </span>
                    <span className="card-body">{region.roads.slice(0, 3).map(road => road.name).join(" · ")}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
        <p><Link className="more-link" href="/drives">Looking for a connected route? Browse driving guides →</Link></p>
      </main>
      <SiteFooter />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structured).replace(/</g, "\\u003c") }} />
    </>
  );
}
