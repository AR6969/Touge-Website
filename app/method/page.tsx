import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "../site-chrome";
import { roads } from "../lib/roads";
import { reviewedOn } from "../lib/site";

export const metadata: Metadata = {
  title: "How These Roads Are Rated & Measured",
  description:
    "The method behind the collection: how roads were selected, how difficulty is rated, how bends are counted from " +
    "OpenStreetMap geometry, and why a published speed figure is never treated as a verified posted sign.",
  alternates: { canonical: "/method" },
  openGraph: { url: "/method", title: "How these roads are rated & measured", description: "How California Touge selects roads, measures road geometry and elevation, and handles speed-limit evidence." },
};

export default function MethodPage() {
  return (
    <>
      <SiteHeader />
      <main className="prose">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link> <span aria-hidden="true">/</span> Method
        </nav>
        <h1>How these roads are rated &amp; measured</h1>
        <p className="lede">
          This is a curated {roads.length}-road collection, not an exhaustive inventory and not a field survey.
          Everything below is what we do and do not claim. The initial source review was {reviewedOn}; each road shows its own review date.
        </p>

        <section aria-labelledby="selection">
          <h2 id="selection">How roads were selected</h2>
          <p>
            Candidate roads came from local forums and guides — r/Touge, r/bayarea, r/SanJose, Rennlist, the Bay Area
            Riders Forum, CivicX, Best Biking Roads and Pebble Beach — plus road-specific and posted-limit searches.
            Several forum pages blocked direct retrieval; their indexed excerpts were used for <em>discovery only</em>,
            never as evidence for a current speed or access claim.
          </p>
          <p>
            Each road links to the discussions it came from, so you can judge the sourcing yourself rather than taking
            our word for it.
          </p>
          <p>
            The Sierra Nevada collection and newer northern additions were requested directly rather than found in a forum thread, so their sourcing
            leans on official agency pages (NPS, USFS) and enthusiast route write-ups instead, linked from each
            road&apos;s own page.
          </p>
        </section>

        <section aria-labelledby="difficulty">
          <h2 id="difficulty">Difficulty ratings</h2>
          <p>Difficulty is an editorial assessment of road width, bends and sightlines. It is not a community vote, an official assessment, driving instruction, or a safety guarantee.</p>
          <ul className="plain-list">
            <li><strong>1 — Relaxed.</strong> Relatively open or gentle.</li>
            <li><strong>2 — Winding.</strong> Sustained curves at a steady pace.</li>
            <li><strong>3 — Demanding.</strong> Narrow sections, hairpins, blind crests or complex mountain geometry.</li>
          </ul>
          <p>
            Road <em>character</em> is a separate axis and deliberately carries no mph target.
            <strong> Technical</strong> means tight or complex; <strong>Low</strong>, <strong>Medium</strong> and{" "}
            <strong>High speed</strong> describe relative road character, still subject to every local limit.
            Character is what the map colours, because it is what the map filters by; difficulty is shown as a
            number so the two axes never compete for the same visual channel. Difficulty 3 is called
            &ldquo;Demanding&rdquo; rather than &ldquo;Technical&rdquo; so the two scales do not share a word.
          </p>
        </section>

        <section aria-labelledby="geometry">
          <h2 id="geometry">How bends are counted</h2>
          <p>
            Road geometry comes from OpenStreetMap ways, fetched with the Overpass queries checked into the repository.
            Bay Area traces are clipped at existing vertices and joined at matching endpoints. Southern California
            traces, and the newer Hopland, Auburn and Sonoma additions, follow connected road edges between selected existing vertices and junctions, excluding ways tagged
            private, inaccessible to cars or unpaved. Neither build draws a straight bridge across a gap. These are
            selected road sections, not turn-by-turn navigation routes or a guarantee of current access.
          </p>
          <p>
            Because OpenStreetMap vertex spacing is uneven, each trace is resampled at a fixed 20&nbsp;m step before any
            corner is counted. Then:
          </p>
          <ul className="plain-list">
            <li><strong>Bend</strong> — a run of sustained same-direction turning of 40° or more. Direction wobble under 3° is treated as digitising noise and does not split a sweeping curve into several.</li>
            <li><strong>Switchback</strong> — a bend that carries through 130° or more.</li>
            <li><strong>Turning per mile</strong> — total absolute direction change divided by length. A scale-free measure of how curvy a road is, used for the rankings.</li>
          </ul>
          <p className="warning">
            These are measurements of a mapped centreline. They are not a difficulty score, not a safety assessment, and
            not an indication of how fast any road should be driven.
          </p>
        </section>

        <section aria-labelledby="elevation">
          <h2 id="elevation">Elevation</h2>
          <p>
            Each road is sampled every 100&nbsp;m along its centreline and looked up in USGS 10&nbsp;m elevation data,
            a public-domain federal dataset, via OpenTopoData. Samples are smoothed over 300&nbsp;m before anything is
            measured, because a digital terrain model carries noise that would otherwise be counted as climb.
          </p>
          <p>
            <strong>Total climb counts vertical change in both directions.</strong> Summing only the ascents would
            depend on which way round the road&apos;s geometry happens to be stored — the first version of this
            measurement reported Page Mill Road as climbing 124&nbsp;ft, because its trace runs downhill. A road is
            driven both ways regardless.
          </p>
          <p>
            A terrain model describes the ground, not the roadway. Where a road tunnels, bridges or runs on a cliff
            shelf, the model reports the hillside instead: Devil&apos;s Slide on Highway&nbsp;1 initially measured as a
            35% grade. Steps implying a grade above 20% are therefore treated as terrain rather than road, and the
            steepest-grade figure is the 95th percentile of half-kilometre stretches, not the maximum, so a handful of
            cliff samples cannot set the figure for a whole road.
          </p>
          <p className="fine">
            Elevation profiles are drawn along the longest continuous section of each road, and say so where that is
            less than the whole. Splicing disconnected pieces together would draw a climb nobody can drive.
          </p>
        </section>

        <section aria-labelledby="speed">
          <h2 id="speed">Speed evidence</h2>
          <p>
            A published source is not a current field-verified sign, and this site never treats one as the other. Every
            entry scopes its claim and links its source. Specifically:
          </p>
          <ul className="plain-list">
            <li><strong>Published limits</strong> cite a county code, ordinance or agency document, scoped to the section that document actually describes.</li>
            <li><strong>Mapped limits</strong> are community OpenStreetMap <code>maxspeed</code> tags, shown with the approximate share of the trace they cover, and explicitly not checked against current signs.</li>
            <li><strong>Unverified</strong> means no reliable posted limit was found. We leave it blank rather than guess.</li>
          </ul>
          <p>
            Speed limits are never invented by averaging tags, inferring from road shape, reading a routing duration, or
            quoting a driver&apos;s reported speed. Research turned up a 2012 Panoramic Highway draft ordinance and a
            2008 Mines Road proposal; because adoption could not be established, neither is presented as a current
            posted limit. Recent reporting notes 2026 changes on Highway 9 — another reason mapped tags must not be read
            as current signage.
          </p>
          <p className="warning">Posted signs always govern.</p>
        </section>

        <section aria-labelledby="limits">
          <h2 id="limits">What this site is not</h2>
          <ul className="plain-list">
            <li>Not live road status. Check <a href="https://quickmap.dot.ca.gov/" target="_blank" rel="noopener noreferrer">Caltrans QuickMap</a> for closures and conditions.</li>
            <li>Not navigation. Traces show selected road sections, not complete driving itineraries. 17-Mile Drive&apos;s named-road trace is not the full signed scenic loop.</li>
            <li>Not a guarantee of access. Park hours, private-road fees and seasonal closures apply on several roads.</li>
          </ul>
        </section>

        <section aria-labelledby="attribution">
          <h2 id="attribution">Attribution</h2>
          <p>
            Road geometry and <code>maxspeed</code> tags are © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>,
            available under the Open Database License. Full details in <a href="/data/README.txt">the data README</a>.
            Descriptions, difficulty ratings and corner counts are ours.
          </p>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
