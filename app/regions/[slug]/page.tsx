import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteFooter, SiteHeader } from "../../site-chrome";
import { difficultyColors, getRegion, regions } from "../../lib/roads";
import { siteUrl } from "../../lib/site";

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
    `${region.roads.length} driving roads in the ${region.area} area of California — ${miles} miles including ` +
    `${region.roads.slice(0, 3).map(road => road.name).join(", ")}. Corner counts, difficulty ratings and maps.`;
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

  const sorted = [...region.roads].sort((a, b) => b.shape.curvature - a.shape.curvature);
  const miles = Math.round(region.roads.reduce((sum, road) => sum + road.shape.lengthMi, 0));
  const bends = region.roads.reduce((sum, road) => sum + road.shape.bends, 0);

  const structured = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Regions", item: `${siteUrl}/regions` },
      { "@type": "ListItem", position: 3, name: region.area },
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
          {region.roads.length} road{region.roads.length === 1 ? "" : "s"}, {miles} miles and {bends} counted bends,
          ordered by degrees of turning per mile.
        </p>
        <ul className="card-list">
          {sorted.map(road => (
            <li key={road.id}>
              <Link href={`/roads/${road.id}`}>
                <strong>{road.name}</strong>
                <span className="card-meta">
                  <i style={{ background: difficultyColors[road.difficulty - 1] }} />
                  {road.shape.lengthMi} mi · {road.shape.bends} bends · {road.shape.curvature}°/mi · {road.character}
                </span>
                <span className="card-body">{road.description}</span>
              </Link>
            </li>
          ))}
        </ul>
        <p><Link className="more-link" href="/regions">All regions →</Link></p>
      </main>
      <SiteFooter />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structured).replace(/</g, "\\u003c") }} />
    </>
  );
}
