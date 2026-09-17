import { ImageResponse } from "next/og";
import { drives, getDrive } from "../../lib/drives";
import { driveShapeUri } from "../../lib/road-shape";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "TougeMap driving guide and mapped road sections";

export function generateStaticParams() {
  return drives.map(drive => ({ slug: drive.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const drive = getDrive((await params).slug);
  if (!drive) return new Response("Not found", { status: 404 });
  const shape = await driveShapeUri(drive, 440, 440, "#a8d8c6");
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", padding: 60, background: "#141918", color: "#f1f0e9", fontFamily: "sans-serif", gap: 40 }}>
      <div style={{ width: 600, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 21, letterSpacing: 2, color: "#a8d8c6" }}>CALIFORNIA TOUGE · DRIVING GUIDE</div>
          <div style={{ fontSize: drive.title.length > 55 ? 48 : 58, fontWeight: 700, lineHeight: 1.1, marginTop: 30 }}>{drive.title}</div>
          <div style={{ fontSize: 25, color: "#b3c5b9", marginTop: 24 }}>{drive.character}</div>
        </div>
        <div style={{ fontSize: 25, color: "#a8d8c6" }}>Roads, route &amp; places to stop →</div>
      </div>
      <div style={{ display: "flex", alignItems: "center", width: 440 }}><img src={shape} width={440} height={440} alt="" /></div>
    </div>, size,
  );
}
