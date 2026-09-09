import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import RoadMap from "../../road-map";
import { SiteFooter, SiteHeader } from "../../site-chrome";
import {
  curvatureRank, difficultyColors, difficultyLabels, getRoad, nearbyRoads, roads, slugifyArea, speedGuide,
} from "../../lib/roads";
import { reviewedOn, siteUrl } from "../../lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return roads.map(road => ({ slug: road.id }));
}

function summary(road: NonNullable<ReturnType<typeof getRoad>>) {
  const { lengthMi, bends, switchbacks } = road.shape;
  const switchbackText = switchbacks ? ` and ${switchbacks} switchbacks` : "";
  return `${road.name} in ${road.area}: ${lengthMi} miles with ${bends} counted bends${switchbackText}. ` +
    `Difficulty ${road.difficulty}/3. Map, corner statistics and sourced speed-limit evidence.`;
}

export async function generateMetadata({ params }: PageProps<"/roads/[slug]">): Promise<Metadata> {
  const road = getRoad((await params).slug);
  if (!road) return {};
  const title = `${road.name} — ${road.area} Driving Road`;
  return {
    title,
    description: summary(road),
    alternates: { canonical: `/roads/${road.id}` },
    openGraph: { type: "article", url: `/roads/${road.id}`, title, description: summary(road) },
  };
}

export default async function RoadPage({ params }: PageProps<"/roads/[slug]">) {
  const road = getRoad((await params).slug);
  if (!road) notFound();

  const guide = speedGuide(road);
  const rank = curvatureRank(road);
  const nearby = nearbyRoads(road);
  const color = difficultyColors[road.difficulty - 1];
  const mapsQuery = encodeURIComponent(`${road.name.replace(/ ·.*/, "")}, ${road.area}, California`);

  const structured = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
          { "@type": "ListItem", position: 2, name: "Roads", item: `${siteUrl}/roads` },
          { "@type": "ListItem", position: 3, name: road.area, item: `${siteUrl}/regions/${slugifyArea(road.area)}` },
          { "@type": "ListItem", position: 4, name: road.name },
        ],
      },
      {
        "@type": "Place",
        name: road.name,
        description: road.description,
        url: `${siteUrl}/roads/${road.id}`,
        address: { "@type": "PostalAddress", addressRegion: "CA", addressCountry: "US" },
        geo: { "@type": "GeoCoordinates", latitude: road.center[1], longitude: road.center[0] },
      },
    ],
  };

  return (
    <>
      <SiteHeader current="roads" />
      <main className="prose road-page">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link> <span aria-hidden="true">/</span>{" "}
          <Link href="/roads">Roads</Link> <span aria-hidden="true">/</span>{" "}
          <Link href={`/regions/${slugifyArea(road.area)}`}>{road.area}</Link>
        </nav>

        <h1>{road.name}</h1>
        <p className="lede">{road.description}</p>
        <div className="road-badges">
          <span><i style={{ background: color }} /> Difficulty {road.difficulty}/3 · {difficultyLabels[road.difficulty - 1]}</span>
          {/* Difficulty and character are separate axes that can share a word. */}
          <span>Character: {road.character}</span>
          <span>{road.area}</span>
        </div>

        <RoadMap id={road.id} name={road.name} bounds={road.bounds} color={color} />

        <section aria-labelledby="shape">
          <h2 id="shape">Road shape</h2>
          <dl className="stat-grid">
            <div><dt>Length</dt><dd>{road.shape.lengthMi} <small>mi</small></dd></div>
            <div><dt>Bends</dt><dd>{road.shape.bends}</dd></div>
            <div><dt>Switchbacks</dt><dd>{road.shape.switchbacks}</dd></div>
            <div><dt>Bends per mile</dt><dd>{road.shape.bendsPerMile}</dd></div>
            <div><dt>Turning per mile</dt><dd>{road.shape.curvature}<small>°</small></dd></div>
            <div><dt>Curviest rank</dt><dd>{rank}<small>of {roads.length}</small></dd></div>
          </dl>
          <p className="fine">
            Measured from the OpenStreetMap centreline, resampled at a fixed 20&nbsp;m step. A <em>bend</em> is a
            sustained direction change of 40° or more; a <em>switchback</em> reverses through 130° or more.
            These describe the shape of the mapped road. They are not a difficulty score, a safety assessment, or any
            indication of how fast the road should be driven.
          </p>
        </section>

        <section aria-labelledby="speed">
          <h2 id="speed">Speed limits</h2>
          <div className="speed-block">
            <p className="speed-value">{guide.value}</p>
            <p className="speed-kind">{road.speed.kind}</p>
          </div>
          <p>{guide.note}</p>
          <p className="fine">{road.speed.note}</p>
          {road.speed.source && (
            <p><a href={road.speed.source} target="_blank" rel="noopener noreferrer">Speed-limit source ↗</a></p>
          )}
          <p className="warning">
            Posted signs always govern. A published document is not proof of a current sign, and limits change by
            section along every road here.
          </p>
        </section>

        <section aria-labelledby="rating">
          <h2 id="rating">How this road is rated</h2>
          <p>
            <strong>Difficulty {road.difficulty}/3 ({difficultyLabels[road.difficulty - 1]})</strong> is our editorial
            assessment of width, bends and sightlines — not a community vote, an official assessment, or driving
            instruction. <strong>{road.character}</strong> describes the road&apos;s character, deliberately without any
            recommended speed. Read the <Link href="/method">full method</Link>.
          </p>
        </section>

        <section aria-labelledby="sources">
          <h2 id="sources">Sources</h2>
          <p>This road was identified from the following discussions and guides, used for discovery only:</p>
          <ul className="source-list">
            {road.sources.map(source => (
              <li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.title} ↗</a></li>
            ))}
            <li>
              <a href={`https://www.openstreetmap.org/way/${road.osmWayIds[0]}`} target="_blank" rel="noopener noreferrer">
                OpenStreetMap road data ↗
              </a>{" "}
              <span className="dim">({road.osmWayIds.length} ways in this trace)</span>
            </li>
          </ul>
          <p className="fine">Reviewed {reviewedOn}. The trace shows selected road sections — not a navigation route, and not live closures.</p>
        </section>

        <section aria-labelledby="nearby">
          <h2 id="nearby">Roads nearby</h2>
          <ul className="card-list">
            {nearby.map(({ road: other, miles }) => (
              <li key={other.id}>
                <Link href={`/roads/${other.id}`}>
                  <strong>{other.name}</strong>
                  <span className="card-meta">
                    <i style={{ background: difficultyColors[other.difficulty - 1] }} />
                    {Math.round(miles)} mi away · {other.shape.lengthMi} mi · {other.shape.bends} bends
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <div className="detail-bottom">
          <a href="https://quickmap.dot.ca.gov/" target="_blank" rel="noopener noreferrer">Check road conditions ↗</a>
          <a href={`https://www.google.com/maps/search/?api=1&query=${mapsQuery}`} target="_blank" rel="noopener noreferrer">Open in Google Maps ↗</a>
          <Link href="/roads">All {roads.length} roads →</Link>
        </div>
      </main>
      <SiteFooter />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structured).replace(/</g, "\\u003c") }} />
    </>
  );
}
