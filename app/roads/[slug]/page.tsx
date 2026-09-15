import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import RoadMap from "../../road-map";
import ElevationProfile from "../../elevation-profile";
import { mapRegions } from "../../lib/map-regions";
import { SiteFooter, SiteHeader } from "../../site-chrome";
import {
  curvatureRank, difficultyLabels, getRoad, nearbyRoads, roads, roadMapHref, slugifyArea, speedGuide,
} from "../../lib/roads";
import { colorFor } from "../../lib/colors";
import { siteUrl } from "../../lib/site";
import { drives } from "../../lib/drives";
import RoadVideos from "../../road-videos";
import { videosForRoads } from "../../lib/road-videos";
import { getRoadGuide } from "../../lib/road-guides";
import "../../detail-pages.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return roads.map(road => ({ slug: road.id }));
}

function summary(road: NonNullable<ReturnType<typeof getRoad>>) {
  const { lengthMi, bends, switchbacks } = road.shape;
  const switchbackText = switchbacks ? ` and ${switchbacks} switchbacks` : "";
  const climb = road.elevation ? `, ${road.elevation.climbPerMile} ft of climb per mile` : "";
  return `${road.name} in ${road.area}: ${lengthMi} miles with ${bends} counted bends${switchbackText}${climb}. ` +
    `Difficulty ${road.difficulty}/3. Map, elevation profile and sourced speed-limit evidence.`;
}

export async function generateMetadata({ params }: PageProps<"/roads/[slug]">): Promise<Metadata> {
  const road = getRoad((await params).slug);
  if (!road) return {};
  const editorial = getRoadGuide(road.id);
  const title = editorial?.title ?? `${road.name} — ${road.area} Driving Road`;
  const description = editorial?.description ?? summary(road);
  return {
    title: editorial ? { absolute: title } : title,
    description,
    alternates: { canonical: `/roads/${road.id}` },
    openGraph: { type: "article", url: `/roads/${road.id}`, title, description },
  };
}

export default async function RoadPage({ params }: PageProps<"/roads/[slug]">) {
  const road = getRoad((await params).slug);
  if (!road) notFound();

  const editorial = getRoadGuide(road.id);
  const guide = speedGuide(road);
  const rank = curvatureRank(road);
  const nearby = nearbyRoads(road);
  const relatedDrives = drives.filter(drive => drive.steps.some(step => step.roadId === road.id));
  const videos = videosForRoads([road.id]);
  const color = colorFor(road.character);
  const mapsQuery = encodeURIComponent(`${road.name.replace(/ ·.*/, "")}, ${road.area}, California`);

  const structured = {
    "@context": "https://schema.org",
    "@graph": [
      ...(editorial ? [{
        "@type": "WebPage", "@id": `${siteUrl}/roads/${road.id}#webpage`,
        url: `${siteUrl}/roads/${road.id}`, name: editorial.heading, description: editorial.description,
        dateModified: editorial.updated, isPartOf: { "@id": `${siteUrl}#website` },
        about: { "@type": "Place", name: road.name, url: `${siteUrl}/roads/${road.id}` },
      }] : []),
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
      <main className={`prose road-page${editorial ? " road-editorial" : ""}`}>
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link> <span aria-hidden="true">/</span>{" "}
          <Link href="/roads">Roads</Link> <span aria-hidden="true">/</span>{" "}
          <Link href={`/regions/${slugifyArea(road.area)}`}>{road.area}</Link>
        </nav>

        <h1>{editorial?.heading ?? road.name}</h1>
        <p className="lede">{road.description}</p>
        <div className="road-badges">
          <span><i style={{ background: color }} /> {road.character}</span>
          <span>Difficulty {road.difficulty}/3 · {difficultyLabels[road.difficulty - 1]}</span>
          <span className="badge-area">{road.area}</span>
        </div>
        <nav className="detail-actions" aria-label="Road shortcuts">
          <Link href={roadMapHref(road)}>Explore on the map →</Link>
          {editorial && <a href="#drive-notes">Plan the drive ↓</a>}
          {videos.length > 0 && <a href="#on-the-road">Watch the road ↓</a>}
          {relatedDrives.length > 0 && <a href="#driving-guides">Drives with this road ↓</a>}
          <a href="#nearby">Nearby roads ↓</a>
        </nav>

        <RoadMap id={road.id} name={road.name} bounds={road.bounds} color={color} />
        {road.access && <p className="warning">{road.access.note}{" "}
          <a href={road.access.url} target="_blank" rel="noopener noreferrer">Check current access ↗</a>
          <span className="fine"> · Reviewed {road.access.checked}</span>
        </p>}

        <RoadVideos videos={videos} />

        {editorial && <section className="road-planning" aria-labelledby="drive-notes">
          <h2 id="drive-notes">Planning the drive</h2>
          {editorial.notes.map((note, index) => <p key={index}>
            {note.text}{note.source && <> <a className="planning-source" href={note.source.url} target="_blank" rel="noopener noreferrer">{note.source.title} ↗</a></>}
          </p>)}
          <h3>Roads to connect</h3>
          <ul className="road-connections">
            {editorial.connections.map(connection => {
              const next = getRoad(connection.roadId)!;
              return <li key={next.id}><Link href={`/roads/${next.id}`}>{next.name}</Link><span>{connection.note}</span></li>;
            })}
          </ul>
          {relatedDrives.length > 0 && <p>Full route: <Link href={`/drives/${relatedDrives[0].slug}`}>{relatedDrives[0].title} →</Link></p>}
          <p className="fine">Driving notes updated <time dateTime={editorial.updated}>{new Date(`${editorial.updated}T12:00:00Z`).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" })}</time>.</p>
        </section>}

        <section aria-labelledby="shape">
          <h2 id="shape">Road shape</h2>
          <dl className="stat-grid">
            <div><dt>Length</dt><dd>{road.shape.lengthMi} <small>mi</small></dd></div>
            <div><dt>Bends</dt><dd>{road.shape.bends}</dd></div>
            <div><dt>Switchbacks</dt><dd>{road.shape.switchbacks}</dd></div>
            <div><dt>Bends per mile</dt><dd>{road.shape.bendsPerMile}</dd></div>
            <div><dt>Turning per mile</dt><dd>{road.shape.curvature}°</dd></div>
            <div><dt>Curviest rank</dt><dd>{rank}<small>of {roads.length}</small></dd></div>
          </dl>
          <p className="fine">
            Measured from the OpenStreetMap centreline at a 20&nbsp;m sampling step — road shape only, not a safety
            or speed judgement. <Link href="/method#geometry">How bends are counted</Link>.
          </p>
        </section>

        {road.elevation && (
          <section aria-labelledby="elevation">
            <h2 id="elevation">Elevation</h2>
            <ElevationProfile road={road} />
            <dl className="stat-grid">
              <div><dt>Total climb</dt><dd>{road.elevation.climbFt.toLocaleString()}<small>ft</small></dd></div>
              <div><dt>Climb per mile</dt><dd>{road.elevation.climbPerMile}<small>ft</small></dd></div>
              <div><dt>Highest point</dt><dd>{road.elevation.highFt.toLocaleString()}<small>ft</small></dd></div>
              <div><dt>Steepest grade</dt><dd>{road.elevation.maxGradient}%</dd></div>
            </dl>
            <p className="fine">
              Sampled every 100&nbsp;m from USGS 10&nbsp;m elevation data, a public-domain federal dataset. Total climb
              counts vertical change in both directions, so it does not depend on which way you drive.{" "}
              <Link href="/method#elevation">How elevation is measured</Link>.
            </p>
          </section>
        )}

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
          <p className="warning">Posted signs always govern. <Link href="/method#speed">How speed evidence is handled</Link>.</p>
        </section>

        <section aria-labelledby="sources">
          <h2 id="sources">Sources</h2>
          <p className="fine">
            Difficulty {road.difficulty}/3 ({difficultyLabels[road.difficulty - 1]}) is our editorial rating of width,
            bends and sightlines; &ldquo;{road.character}&rdquo; describes character, not a target speed.{" "}
            <Link href="/method">Full method</Link>. Identified from:
          </p>
          <ul className="source-list">
            {road.sources.map(source => (
              <li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.title} ↗</a></li>
            ))}
            <li>
              <a href={`https://www.openstreetmap.org/way/${road.osmWayIds[0]}`} target="_blank" rel="noopener noreferrer">
                OpenStreetMap road data ↗
              </a>{" "}
              <span className="dim">
                {road.splitFrom
                  /* Ways could not be split with the geometry, so this is the list for the whole road. */
                  ? "(ways for the full route, of which this is one half)"
                  : `(${road.osmWayIds.length} ways in this trace)`}
              </span>
            </li>
          </ul>
          <p className="fine">Reviewed {road.reviewed}. The trace shows selected road sections, not a navigation route.</p>
        </section>

        {relatedDrives.length > 0 && <section aria-labelledby="driving-guides">
          <h2 id="driving-guides">Drives that include this road</h2>
          <ul className="card-list">
            {relatedDrives.map(drive => <li key={drive.slug}>
              <Link href={`/drives/${drive.slug}`}>
                <strong>{drive.title}</strong>
                <span className="card-body">{drive.character} · {drive.start} → {drive.finish}</span>
              </Link>
            </li>)}
          </ul>
        </section>}

        <section aria-labelledby="nearby">
          <h2 id="nearby">Roads nearby</h2>
          <p className="fine">Distances are approximate straight lines between road centers, not driving distances or direct connections.</p>
          <ul className="card-list">
            {nearby.map(({ road: other, miles }) => (
              <li key={other.id}>
                <Link href={`/roads/${other.id}`}>
                  <strong>{other.name}</strong>
                  <span className="card-meta">
                    <i style={{ background: colorFor(other.character) }} />
                    About {Math.round(miles)} mi away · {other.character}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="detail-region-link"><Link href={`/regions/${slugifyArea(road.area)}`}>Explore all {road.area} roads →</Link></p>
        </section>

        <div className="detail-bottom">
          <Link href={roadMapHref(road)}>View on the {road.mapRegion === "sierra" ? "California" : mapRegions[road.mapRegion ?? "bay-area"].name} map →</Link>
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
