import RoadExplorer from "./road-explorer";
import roads from "./data/roads.json";

export default function Home() {
  const roadList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Bay Area driving roads and nearby scenic drives",
    numberOfItems: roads.length,
    itemListElement: roads.map((road, index) => ({ "@type": "ListItem", position: index + 1, item: { "@type": "Place", name: road.name, description: road.description } })),
  };
  return (
    <main>
      <RoadExplorer />
      <footer className="road-guide">
        <details>
          <summary>Bay Area driving roads <span>About the collection ↗</span></summary>
          <div className="guide-content">
            <h2>Explore the best Bay Area driving roads</h2>
            <p>A curated starting point for scenic drives and mountain roads around San Francisco: Page Mill Road, Calaveras Road, Pescadero Creek Road, Highway 1 and more. The collection also includes nearby Santa Cruz, Napa and Monterey drives, including 17-Mile Drive.</p>
            <p>Roads were selected from local forums, Reddit discussions and travel guides. Our 1–3 difficulty ratings reflect road width, bends and sightlines, not popularity or a speed recommendation. Technical means tight or complex; low, medium and high speed describe relative road character. Posted signs always govern.</p>
            <p>Speed guides give a simple overview, not one limit for the entire road. Follow current posted signs; lower limits apply in some sections. Road traces do not indicate live closures.</p>
            <ul className="guide-roads">{roads.map(road => <li key={road.id}><a href={`/?road=${road.id}`}>{road.name}</a><span>{road.area} · Difficulty {road.difficulty}/3</span></li>)}</ul>
            <p>Road geometry © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>, available under the Open Database License. <a href="/data/README.txt">Data sources and attribution</a>.</p>
          </div>
        </details>
      </footer>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(roadList).replace(/</g, "\\u003c") }} />
    </main>
  );
}
