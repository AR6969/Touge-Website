import Link from "next/link";

type Stat = { value: string; label: string };
type Item = { href: string; label: string };

/**
 * The strip under the map.
 *
 * Leads with the measurements rather than a grid of equal-weight cards: the
 * counts are the thing this site has that a list of road names does not, and a
 * row of identical boxes gives a reader no idea what to look at first.
 */
export default function MapIntro({ title, children, stats, links, linksLabel }: {
  title: React.ReactNode;
  children: React.ReactNode;
  stats: Stat[];
  links: Item[];
  linksLabel: string;
}) {
  return (
    <main className="intro" id="about">
      <div className="intro-lead">
        <h1>{title}</h1>
        <p>{children}</p>
        <nav className="intro-links" aria-label={linksLabel}>
          {links.map(link => <Link key={link.href} href={link.href}>{link.label}</Link>)}
        </nav>
      </div>
      <dl className="intro-stats">
        {stats.map(stat => (
          <div key={stat.label}>
            <dd>{stat.value}</dd>
            <dt>{stat.label}</dt>
          </div>
        ))}
      </dl>
    </main>
  );
}
