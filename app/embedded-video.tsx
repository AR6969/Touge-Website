import type { EmbedVideo } from "./lib/embed-videos";
import "./embedded-video.css";

// For footage we don't own: a standard YouTube embed, not the self-hosted
// <video> player in road-videos.tsx. That component's copy says "TougeMap
// original footage" — true for our own filmed clips, false for this, so the
// two never share a component. Lazy-loading the iframe (loading="lazy") and
// using youtube-nocookie.com keeps this from costing a full player load for
// visitors who never scroll to it or click play.
export default function EmbeddedVideo({ video }: { video: EmbedVideo }) {
  return (
    <section aria-labelledby="on-the-road">
      <h2 id="on-the-road">On the road</h2>
      <figure className="embedded-video">
        <div className="embedded-video-frame">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}`}
            title={video.title}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        <figcaption>
          <p className="embedded-video-title">{video.title}</p>
          <p className="fine"><a href={video.creditUrl} target="_blank" rel="noopener noreferrer">{video.creditLabel} ↗</a></p>
        </figcaption>
      </figure>
    </section>
  );
}
