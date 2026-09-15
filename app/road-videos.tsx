import type { RoadVideo } from "./lib/road-videos";
import RoadVideoPlayer from "./road-video-player";
import "./road-videos.css";

export default function RoadVideos({ videos }: { videos: RoadVideo[] }) {
  if (!videos.length) return null;

  return (
    <section aria-labelledby="on-the-road">
      <h2 id="on-the-road">On the road</h2>
      {videos.map(video => (
        <figure className="road-video" key={video.src}>
          <RoadVideoPlayer video={video} />
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
