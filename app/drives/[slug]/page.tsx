import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteFooter, SiteHeader } from "../../site-chrome";
import { drives, getDrive } from "../../lib/drives";
import { getRoad, slugifyArea } from "../../lib/roads";
import { mapRegions } from "../../lib/map-regions";
import DriveMap, { type DriveLeg } from "../../drive-map";
import { siteName, siteUrl } from "../../lib/site";
import "../../detail-pages.css";

type DrivePageProps = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return drives.map(drive => ({ slug: drive.slug }));
}

export async function generateMetadata({ params }: DrivePageProps): Promise<Metadata> {
  const drive = getDrive((await params).slug);
  if (!drive) return {};
  return {
    title: drive.title,
    description: drive.description,
    alternates: { canonical: `/drives/${drive.slug}` },
    openGraph: { type: "article", url: `/drives/${drive.slug}`, title: drive.title, description: drive.description },
  };
}

export default async function DrivePage({ params }: DrivePageProps) {
  const drive = getDrive((await params).slug);
  if (!drive) notFound();
  const region = mapRegions[drive.mapRegion];
  const updated = new Date(drive.updated).toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric", timeZone: "UTC",
  });

  const legs: DriveLeg[] = drive.steps.flatMap((step, index) => {
    const road = step.roadId ? getRoad(step.roadId) : undefined;
    return road ? [{ id: road.id, name: road.name, step: index + 1, section: step.mapSection }] : [];
  });
  const routeRoads = legs.map(leg => getRoad(leg.id)!);
  const areas = [...new Set(routeRoads.map(road => road.area))];
  const conditionSources = drive.conditionSources ?? [...new Map([
    ...routeRoads.flatMap(road => road.access ? [{ title: `${road.name}: current access`, url: road.access.url }] : []),
    { title: "Caltrans QuickMap: state-highway conditions", url: "https://quickmap.dot.ca.gov/" },
  ].map(source => [source.url, source])).values()];
  const otherDrives = drives.filter(other => other.slug !== drive.slug && other.mapRegion === drive.mapRegion)
    .sort((a, b) => {
      const shared = (other: typeof drive) => other.steps.filter(step => legs.some(leg => leg.id === step.roadId)).length;
      return shared(b) - shared(a);
    }).slice(0, 3);

  const boxes = legs.map(leg => getRoad(leg.id)!.bounds);
  const routeBounds: [[number, number], [number, number]] | null = boxes.length ? [
    [Math.min(...boxes.map(b => b[0][0])), Math.min(...boxes.map(b => b[0][1]))],
    [Math.max(...boxes.map(b => b[1][0])), Math.max(...boxes.map(b => b[1][1]))],
  ] : null;
  const structured = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article", headline: drive.title, description: drive.description,
        url: `${siteUrl}/drives/${drive.slug}`, datePublished: drive.updated, dateModified: drive.updated,
        author: { "@type": "Organization", name: siteName, url: siteUrl },
        mainEntityOfPage: `${siteUrl}/drives/${drive.slug}`,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
          { "@type": "ListItem", position: 2, name: "Driving guides", item: `${siteUrl}/drives` },
          { "@type": "ListItem", position: 3, name: drive.title },
        ],
      },
    ],
  };

  return (
    <>
      <SiteHeader current="drives" />
      <main className="prose drive-page">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link> <span aria-hidden="true">/</span>{" "}
          <Link href="/drives">Driving guides</Link> <span aria-hidden="true">/</span> {drive.character}
        </nav>
        <p className="eyebrow">{region.name} driving guide · {drive.character}</p>
        <h1>{drive.title}</h1>
        <p className="lede">{drive.intro}</p>
        <nav className="detail-actions" aria-label="Drive shortcuts">
          <a href="#route">Route &amp; roads ↓</a>
          <a href="#conditions">Road conditions ↓</a>
          <Link href={region.href}>{region.name} map →</Link>
        </nav>
        {drive.access && <p className="warning detail-access">{drive.access.note}{" "}
          <a href={drive.access.url} target="_blank" rel="noopener noreferrer">Check vehicle access ↗</a>
        </p>}
        {routeBounds && legs.length > 0 && (
          <DriveMap legs={legs} bounds={routeBounds} title={drive.title} />
        )}
        <p className="fine drive-map-note">Road overview, not turn-by-turn navigation. Follow the junctions below; some catalog traces extend beyond the written drive. Use two fingers to move the map.</p>
        <ol className="drive-route" aria-label="Route in order">
          {drive.route.map(leg => <li key={leg}>{leg}</li>)}
        </ol>
        <dl className="drive-endpoints">
          <div><dt>Start</dt><dd>{drive.start}</dd></div>
          <div><dt>Finish</dt><dd>{drive.finish}</dd></div>
          <div><dt>Return</dt><dd><a href="#return">Return options below ↓</a></dd></div>
        </dl>

        <section aria-labelledby="why-this-drive">
          <h2 id="why-this-drive">Why this drive</h2>
          <p>{drive.appeal}</p>
        </section>

        <section aria-labelledby="route">
          <h2 id="route">The route</h2>
          <ol className="drive-steps">
            {drive.steps.map(step => (
              <li key={step.title}>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
                {step.roadId && <Link href={`/roads/${step.roadId}`}>{getRoad(step.roadId)?.name ?? "Road details"} &amp; map →</Link>}
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="stops">
          <h2 id="stops">Good places to stop</h2>
          <ul className="drive-stops">
            {drive.stops.map(stop => (
              <li key={stop.name}>
                <h3>{stop.url ? <a href={stop.url} target="_blank" rel="noopener noreferrer">{stop.name} ↗</a> : stop.name}</h3>
                <p>{stop.text}</p>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="return">
          <h2 id="return">The way back</h2>
          <p>{drive.returnRoute}</p>
        </section>

        <section aria-labelledby="conditions">
          <h2 id="conditions">Road conditions</h2>
          {drive.conditions && <p>{drive.conditions}</p>}
          <p>Expect drivers, motorcycles and cyclists, especially at popular junctions and stops. Give people space, follow posted limits and check current access before setting off.</p>
          <ul className="source-list">
            {conditionSources.map(source => <li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.title} ↗</a></li>)}
          </ul>
        </section>

        <section aria-labelledby="sources">
          <h2 id="sources">Route references</h2>
          <ul className="source-list">
            {drive.sources.map(source => <li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.title} ↗</a></li>)}
          </ul>
          <p className="fine">Guide updated {updated}. Route descriptions cover the named sections; check current access before travelling.</p>
        </section>

        <section aria-labelledby="more-drives">
          <h2 id="more-drives">Keep exploring</h2>
          {otherDrives.length > 0 && <ul className="card-list">
            {otherDrives.map(other => <li key={other.slug}><Link href={`/drives/${other.slug}`}><strong>{other.title}</strong><span className="card-body">{other.character} · {other.start} → {other.finish}</span></Link></li>)}
          </ul>}
          <div className="detail-actions">
            {areas.map(area => <Link key={area} href={`/regions/${slugifyArea(area)}`}>More {area} roads →</Link>)}
            <Link href="/drives">All driving guides →</Link>
          </div>
        </section>
      </main>
      <SiteFooter />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structured).replace(/</g, "\\u003c") }} />
    </>
  );
}
