import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "../site-chrome";
import { siteName } from "../lib/site";

const title = "Legal Disclaimer";
const description = "What TougeMap is and is not: a reference for road shape and terrain, not navigation, not a safety authority, and not a substitute for posted signs or your own judgment.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/legal" },
  openGraph: { url: "/legal", title, description },
  robots: { index: true, follow: true },
};

export default function LegalPage() {
  return (
    <>
      <SiteHeader />
      <main className="prose">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link> <span aria-hidden="true">/</span> Legal
        </nav>
        <h1>Legal disclaimer</h1>
        <p className="lede">
          {siteName} is a reference for road shape, terrain and general character — built for planning a drive,
          not for following behind the wheel. It is not navigation, not an authority on current conditions, and not
          a substitute for posted signs, local law, or your own judgment.
        </p>

        <section aria-labelledby="what-this-is">
          <h2 id="what-this-is">What this site is</h2>
          <p>
            A curated, editorial collection of driving roads with geometry measured from OpenStreetMap data and
            elevation from USGS survey data. Difficulty ratings, character labels and descriptions are our opinion,
            formed by looking at the map and available research — not an official assessment by any agency, and not
            a safety certification of any road. See <Link href="/method">how this is built</Link> for exactly what
            is and isn&apos;t measured, and how.
          </p>
        </section>

        <section aria-labelledby="no-warranty">
          <h2 id="no-warranty">No warranty, no live status</h2>
          <p>
            Everything here is provided &ldquo;as is,&rdquo; with no warranty of any kind, express or implied,
            including accuracy, completeness or fitness for a particular purpose. Road geometry comes from
            crowd-sourced OpenStreetMap data and can be outdated, incomplete or wrong. Speed information is
            explicitly scoped and sourced on every road page — where none was found, the site says so rather than
            guessing, but even a cited figure is not a guarantee of what is currently posted.
          </p>
          <p>
            This site has no live view of road conditions. Closures, construction, rockslides, fire damage, weather
            and one-way or seasonal restrictions can all change a road overnight. Check{" "}
            <a href="https://quickmap.dot.ca.gov/" target="_blank" rel="noopener noreferrer">Caltrans QuickMap</a>{" "}
            or the relevant county or land agency before you rely on anything written here.
          </p>
        </section>

        <section aria-labelledby="responsibility">
          <h2 id="responsibility">Your responsibility, not ours</h2>
          <p>
            Driving is inherently risky, and mountain and canyon roads more so: blind corners, narrow shoulders,
            loose surfaces, cyclists, wildlife and oncoming traffic are all normal conditions on roads described
            here, not exceptions. Nothing on this site is driving instruction, and a curve count or difficulty
            rating is not permission to drive faster than is safe or legal.
          </p>
          <p>
            Posted speed limits, traffic laws and signage always govern, regardless of anything measured, described
            or implied on this site. You are solely responsible for how you drive, for obeying the law, and for
            any outcome of a trip planned using information here — including but not limited to collisions, injury,
            citations, vehicle damage or getting lost. To the fullest extent the law allows, {siteName} and its
            operator accept no liability for any of it.
          </p>
        </section>

        <section aria-labelledby="third-party">
          <h2 id="third-party">Third-party sources and links</h2>
          <p>
            Road geometry and speed tags are © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap
            contributors</a>, used under the Open Database License; see <a href="/data/README.txt">data
            attribution</a>. Sourced discussions, agency pages and other external links are provided for reference
            and are not verified or endorsed, and we aren&apos;t responsible for their content or availability.
            This site has no affiliation with Caltrans, the OpenStreetMap Foundation, or any road or park agency
            it cites or links to.
          </p>
        </section>

        <p className="fine">
          This page explains how the site works and what it doesn&apos;t claim; it is not legal advice, and nothing
          here is a substitute for reading actual signage and driving within your own ability. Questions:{" "}
          <Link href="/contact">contact us</Link>.
        </p>
      </main>
      <SiteFooter />
    </>
  );
}
