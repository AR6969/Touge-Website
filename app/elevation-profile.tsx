import type { Road } from "./lib/roads";

const WIDTH = 720;
const HEIGHT = 150;
const PAD = 4;

/**
 * Elevation along the road, as inline SVG.
 *
 * Server-rendered with no client JavaScript: it is a fixed picture of fixed
 * data, so shipping a charting library to draw 72 points would be waste.
 */
export default function ElevationProfile({ road }: { road: Road }) {
  const profile = road.profile;
  const elevation = road.elevation;
  if (!profile || !elevation) return null;

  const { points } = profile;
  const low = Math.min(...points);
  const high = Math.max(...points);
  const span = high - low || 1;

  const x = (i: number) => (i / (points.length - 1)) * WIDTH;
  const y = (value: number) => PAD + (1 - (value - low) / span) * (HEIGHT - PAD * 2);

  const line = points.map((value, i) => `${i ? "L" : "M"}${x(i).toFixed(1)} ${y(value).toFixed(1)}`).join("");
  const area = `${line}L${WIDTH} ${HEIGHT}L0 ${HEIGHT}Z`;

  return (
    <figure className="profile">
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} preserveAspectRatio="none" role="img"
           aria-label={`Elevation profile: ${low} to ${high} feet over ${profile.miles} miles`}>
        <defs>
          <linearGradient id="profile-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a8d8c6" stopOpacity="0.30" />
            <stop offset="100%" stopColor="#a8d8c6" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={area} fill="url(#profile-fill)" />
        <path d={line} fill="none" stroke="#a8d8c6" strokeWidth="2"
              strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      </svg>
      {/* Labelled "low"/"high", not left/right: the trace is drawn in the order
          the geometry is stored, which is not necessarily the way you drive it. */}
      <div className="profile-axis">
        <span>Low {low.toLocaleString()} ft</span>
        <span>{profile.miles} mi{profile.coverage < 95 && ` · longest continuous section, ${profile.coverage}% of the road`}</span>
        <span>High {high.toLocaleString()} ft</span>
      </div>
    </figure>
  );
}
