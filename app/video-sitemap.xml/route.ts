import { roads } from "../lib/roads";
import { drives } from "../lib/drives";
import { roadVideos } from "../lib/road-videos";
import { siteUrl } from "../lib/site";

// Help search engines discover each self-hosted clip and its landing pages.
// One <url> per page where the video appears: the road page and any matching guide.
// https://developers.google.com/search/docs/crawling-indexing/sitemaps/video-sitemaps
function escapeXml(value: string) {
  return value.replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" }[char]!));
}

export function GET() {
  const entries = roadVideos.flatMap(video => {
    const road = roads.find(r => r.id === video.roadId);
    if (!road) return [];
    const pages = [
      `${siteUrl}/roads/${road.id}`,
      ...drives.filter(drive => drive.steps.some(step => step.roadId === road.id)).map(drive => `${siteUrl}/drives/${drive.slug}`),
    ];
    return pages.map(pageUrl => ({ pageUrl, video }));
  });

  const body = entries.map(({ pageUrl, video }) => `  <url>
    <loc>${escapeXml(pageUrl)}</loc>
    <video:video>
      <video:thumbnail_loc>${escapeXml(siteUrl + video.poster)}</video:thumbnail_loc>
      <video:title>${escapeXml(video.title)}</video:title>
      <video:description>${escapeXml(video.description)}</video:description>
      <video:content_loc>${escapeXml(siteUrl + video.src)}</video:content_loc>
    </video:video>
  </url>`).join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${body}
</urlset>`;

  return new Response(xml, { headers: { "Content-Type": "application/xml" } });
}
