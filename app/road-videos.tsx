import type { RoadVideo } from "./lib/road-videos";
import "./road-videos.css";

export default function RoadVideos({ videos }: { videos: RoadVideo[] }) {
  if (!videos.length) return null;

  return (
    <section aria-labelledby="on-the-road">
      <h2 id="on-the-road">On the road</h2>
      {videos.map(video => (
        <figure className="road-video" key={video.src}>
          <video
            controls
            playsInline
            preload="none"
            poster={video.poster}
            width={video.width}
            height={video.height}
            aria-label={`${video.title} driving clip`}
            aria-describedby={`video-description-${video.roadId}`}
          >
            <source src={video.src} type="video/mp4" />
            <a href={video.src}>Watch the {video.title} clip</a>
          </video>
          <figcaption id={`video-description-${video.roadId}`}>
            <p className="road-video-title">{video.title}</p>
            <p>{video.description}</p>
            <p className="fine">TougeMap original footage · 1 minute</p>
          </figcaption>
        </figure>
      ))}
    </section>
  );
}
