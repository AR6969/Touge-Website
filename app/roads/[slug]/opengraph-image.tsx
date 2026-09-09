import { ImageResponse } from "next/og";
import { difficultyLabels, getRoad, roads } from "../../lib/roads";
import { colorFor } from "../../lib/colors";
import { roadShapeUri } from "../../lib/road-shape";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Road shape, length and corner count";

export function generateStaticParams() {
  return roads.map(road => ({ slug: road.id }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const road = getRoad((await params).slug);
  if (!road) return new Response("Not found", { status: 404 });

  const color = colorFor(road.character);
  const shape = await roadShapeUri(road.id, 500, 500, color);

  const stats: [string, string][] = [
    ["LENGTH", `${road.shape.lengthMi} mi`],
    ["BENDS", `${road.shape.bends}`],
    ["SWITCHBACKS", `${road.shape.switchbacks}`],
    ["CLIMB / MILE", road.elevation ? `${road.elevation.climbPerMile} ft` : "—"],
  ];

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#141918", color: "#f1f0e9", padding: 64, fontFamily: "sans-serif" }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", paddingRight: 40 }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {/* Satori has no CJK font loaded, so the 峠 mark is left to the site itself. */}
            <div style={{ display: "flex", alignItems: "center", fontSize: 22, color: "#a8d8c6", letterSpacing: 2 }}>
              CALIFORNIA TOUGE
            </div>
            <div style={{ fontSize: 66, fontWeight: 700, lineHeight: 1.05, marginTop: 28, letterSpacing: -2 }}>
              {road.name}
            </div>
            <div style={{ fontSize: 27, color: "#9fb0a4", marginTop: 16 }}>
              {`${road.area} · Difficulty ${road.difficulty}/3 · ${difficultyLabels[road.difficulty - 1]}`}
            </div>
          </div>
          <div style={{ display: "flex", gap: 44 }}>
            {stats.map(([label, value]) => (
              <div key={label} style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ fontSize: 15, color: "#8ba394", letterSpacing: 1.4 }}>{label}</div>
                <div style={{ fontSize: 40, fontWeight: 600, marginTop: 6 }}>{value}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", width: 500, alignItems: "center", justifyContent: "center" }}>
          <img src={shape} width={500} height={500} alt="" />
        </div>
      </div>
    ),
    size,
  );
}
