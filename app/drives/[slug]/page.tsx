import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteFooter, SiteHeader } from "../../site-chrome";
import { drives, getDrive } from "../../lib/drives";
import { getRoad } from "../../lib/roads";
import DriveMap, { type DriveLeg } from "../../drive-map";
import { siteName, siteUrl } from "../../lib/site";

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
  const updated = new Date(drive.updated).toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric", timeZone: "UTC",
  });

  // One entry per step, in driving order, plus a box that holds the whole route.
  const legs: DriveLeg[] = drive.steps
    .map((step, index) => ({ road: getRoad(step.roadId), step: index + 1 }))
    .filter((leg): leg is { road: NonNullable<ReturnType<typeof getRoad>>; step: number } => Boolean(leg.road))
    .map(({ road, step }) => ({ id: road.id, name: road.name, step }));

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
      <SiteHeader />
      <main className="prose drive-page">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link> <span aria-hidden="true">/</span>{" "}
          <Link href="/drives">Driving guides</Link> <span aria-hidden="true">/</span> {drive.character}
        </nav>
        <p className="eyebrow">Bay Area driving guide · {drive.character}</p>
        <h1>{drive.title}</h1>
        <p className="lede">{drive.intro}</p>
        {routeBounds && legs.length > 0 && (
          <DriveMap legs={legs} bounds={routeBounds} title={drive.title} />
        )}
        <ol className="drive-route" aria-label="Route in order">
          {drive.route.map(leg => <li key={leg}>{leg}</li>)}
        </ol>
        <dl className="drive-endpoints">
          <div><dt>Start</dt><dd>{drive.start}</dd></div>
          <div><dt>Finish</dt><dd>{drive.finish}</dd></div>
          <div><dt>Return</dt><dd>Optional loop below</dd></div>
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
                <Link href={`/roads/${step.roadId}`}>Road details &amp; map →</Link>
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
          <h2 id="return">Make it a loop</h2>
          <p>{drive.returnRoute}</p>
        </section>

        <section aria-labelledby="weekends">
          <h2 id="weekends">Weekends &amp; road conditions</h2>
          <p>Police sometimes patrol Highway 9 and Skyline, including weekends. <a href="https://www.bayarearidersforum.com/forums/threads/psa-heavy-chp-sheriff-crackdown-on-hwy-9-skyline-ride-smart-out-there.567075/" target="_blank" rel="noopener noreferrer">Local riders have reported enforcement on both roads.</a> Follow posted limits throughout the drive.</p>
          <p>Expect other drivers, motorcycles and cyclists around these popular roads and junctions. Before heading out, check <a href="https://quickmap.dot.ca.gov/" target="_blank" rel="noopener noreferrer">Caltrans QuickMap</a> for state-highway conditions and <a href="https://www.smcgov.org/publicworks/county-road-closures" target="_blank" rel="noopener noreferrer">San Mateo County road closures</a> for local roads.</p>
        </section>

        <section aria-labelledby="sources">
          <h2 id="sources">Route references</h2>
          <ul className="source-list">
            {drive.sources.map(source => <li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.title} ↗</a></li>)}
          </ul>
          <p className="fine">Guide updated {updated}. Route descriptions cover the named sections; check current access before travelling.</p>
        </section>

        <section aria-labelledby="more-drives">
          <h2 id="more-drives">Another drive to try</h2>
          {drives.filter(other => other.slug !== drive.slug).map(other => <p key={other.slug}><Link href={`/drives/${other.slug}`}>{other.title} →</Link></p>)}
          <p><Link href="/drives">All Bay Area driving guides →</Link></p>
        </section>
      </main>
      <SiteFooter />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structured).replace(/</g, "\\u003c") }} />
    </>
  );
}
