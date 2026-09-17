import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteFooter, SiteHeader } from "../../site-chrome";
import { getRegion, regions } from "../../lib/roads";
import { colorFor } from "../../lib/colors";
import { siteUrl } from "../../lib/site";
import { drives } from "../../lib/drives";
import { regionIntroductions, roadGroups } from "../../lib/region-guides";

export const dynamicParams = false;

export function generateStaticParams() {
  return regions.map(region => ({ slug: region.slug }));
}

export async function generateMetadata({ params }: PageProps<"/regions/[slug]">): Promise<Metadata> {
  const region = getRegion((await params).slug);
  if (!region) return {};
  const miles = Math.round(region.roads.reduce((sum, road) => sum + road.shape.lengthMi, 0));
  const title = `${region.area} Driving Roads`;
  const description =
    `${region.roads.length} driving road${region.roads.length === 1 ? "" : "s"} in ${region.area}: ` +
    `${region.roads.slice(0, 2).map(road => road.name).join(", ")}. Compare ${miles} mapped miles, road character and access sources.`;
  return {
    title,
    description,
    alternates: { canonical: `/regions/${region.slug}` },
    openGraph: { url: `/regions/${region.slug}`, title, description },
  };
}

export default async function RegionPage({ params }: PageProps<"/regions/[slug]">) {
  const region = getRegion((await params).slug);
  if (!region) notFound();

  const sorted = [...region.roads].sort((a, b) => a.name.localeCompare(b.name));
  const miles = Math.round(region.roads.reduce((sum, road) => sum + road.shape.lengthMi, 0));
  const groups = roadGroups.filter(group => group.areas.some(area => area.slug === region.slug));
  const roadIds = new Set(region.roads.map(road => road.id));
  const relatedDrives = drives.filter(drive => drive.steps.some(step => step.roadId && roadIds.has(step.roadId)));

  const structured = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
          { "@type": "ListItem", position: 2, name: "Regions", item: `${siteUrl}/regions` },
          { "@type": "ListItem", position: 3, name: region.area },
        ],
      },
      {
        "@type": "ItemList",
        name: `${region.area} driving roads`,
        numberOfItems: sorted.length,
        itemListElement: sorted.map((road, index) => ({
          "@type": "ListItem", position: index + 1, name: road.name, url: `${siteUrl}/roads/${road.id}`,
        })),
      },
    ],
  };

  return (
    <>
      <SiteHeader current="regions" />
      <main className="prose">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link> <span aria-hidden="true">/</span>{" "}
          <Link href="/regions">Regions</Link> <span aria-hidden="true">/</span> {region.area}
        </nav>
        <h1>{region.area} driving roads</h1>
        <p className="lede">
          {region.roads.length} road{region.roads.length === 1 ? "" : "s"} and {miles} mapped miles.
          Pick a road to see its route, character and access notes.
        </p>
        {regionIntroductions[region.slug] && <p>{regionIntroductions[region.slug]}</p>}
        <nav className="intro-links" aria-label={`${region.area} maps and guides`}>
          {groups.map(group => <Link key={group.id} href={group.mapHref}>Open the {group.mapName} map</Link>)}
          {relatedDrives.length > 0 && <a href="#drives">Drives using these roads</a>}
          <Link href="/regions">Other regions</Link>
        </nav>
        <section aria-labelledby="roads">
          <h2 id="roads">Choose a road</h2>
          <ul className="card-list">
          {sorted.map(road => (
            <li key={road.id}>
              <Link href={`/roads/${road.id}`}>
                <strong>{road.name}</strong>
                <span className="card-meta">
                  <i aria-hidden="true" style={{ background: colorFor(road.character) }} />
                  {road.shape.lengthMi} mi · {road.character} · Difficulty {road.difficulty}/3
                </span>
                <span className="card-body">{road.description}</span>
              </Link>
            </li>
          ))}
          </ul>
        </section>
        {relatedDrives.length > 0 && (
          <section aria-labelledby="drives">
            <h2 id="drives">Drives using these roads</h2>
            <ul className="card-list">
              {relatedDrives.map(drive => (
                <li key={drive.slug}>
                  <Link href={`/drives/${drive.slug}`}>
                    <strong>{drive.title}</strong>
                    <span className="card-body">{drive.description}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
        <section aria-labelledby="explore">
          <h2 id="explore">Keep exploring</h2>
          <p><Link href="/regions">Browse other regions</Link> or <Link href="/roads">compare every road on the site</Link>.</p>
        </section>
      </main>
      <SiteFooter />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structured).replace(/</g, "\\u003c") }} />
    </>
  );
}
