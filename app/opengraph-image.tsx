import { ImageResponse } from "next/og";
import { roads } from "./lib/roads";
import { collectionShapeUri } from "./lib/road-shape";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Driving roads across the Bay Area and Northern California";

export default async function Image() {
  const shape = await collectionShapeUri(560, 560, "#a8d8c6");
  const miles = Math.round(roads.reduce((sum, road) => sum + road.shape.lengthMi, 0));
  const bends = roads.reduce((sum, road) => sum + road.shape.bends, 0);

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#141918", color: "#f1f0e9", padding: 64, fontFamily: "sans-serif" }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", paddingRight: 40 }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {/* Satori has no CJK font loaded, so the 峠 mark is left to the site itself. */}
            <div style={{ fontSize: 22, color: "#a8d8c6", letterSpacing: 2, display: "flex" }}>CALIFORNIA TOUGE</div>
            <div style={{ fontSize: 62, fontWeight: 700, lineHeight: 1.08, marginTop: 28, letterSpacing: -2 }}>
              The best driving roads in Northern California
            </div>
          </div>
          <div style={{ display: "flex", gap: 52 }}>
            {([["ROADS", `${roads.length}`], ["MILES", `${miles}`], ["COUNTED BENDS", bends.toLocaleString()]] as [string, string][]).map(
              ([label, value]) => (
                <div key={label} style={{ display: "flex", flexDirection: "column" }}>
                  <div style={{ fontSize: 15, color: "#8ba394", letterSpacing: 1.4 }}>{label}</div>
                  <div style={{ fontSize: 44, fontWeight: 600, marginTop: 6 }}>{value}</div>
                </div>
              ),
            )}
          </div>
        </div>
        <div style={{ display: "flex", width: 560, alignItems: "center", justifyContent: "center" }}>
          <img src={shape} width={560} height={560} alt="" />
        </div>
      </div>
    ),
    size,
  );
}
