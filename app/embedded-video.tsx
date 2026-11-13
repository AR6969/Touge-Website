"use client";

import { useState } from "react";
import type { EmbedVideo } from "./lib/embed-videos";
import ExternalArrow from "./external-arrow";
import "./embedded-video.css";

// For footage we don't own: a YouTube embed, not the self-hosted <video>
// player in road-videos.tsx. That component's copy says "TougeMap original
// footage" — true for our own filmed clips, false for this, so the two never
// share a component.
//
// Click-to-load facade: until someone presses play, this is just a
// thumbnail image and a button. A YouTube iframe pulls ~1 MB of player
// script per embed, so loading two or three of them up front would slow every
// road page for visitors who never watch. youtube-nocookie.com keeps
// YouTube's tracking cookies off until the viewer opts in by playing.
function VideoFacade({ video }: { video: EmbedVideo }) {
  const [playing, setPlaying] = useState(false);
  return (
    <figure className="embedded-video">
      <div className="embedded-video-frame">
        {playing ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&rel=0`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button type="button" className="embedded-video-poster" onClick={() => setPlaying(true)} aria-label={`Play video: ${video.title}`}>
            {/* A plain <img>: next/image would route YouTube's own CDN thumbnail through our image optimizer for no gain. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`https://i.ytimg.com/vi/${video.youtubeId}/hqdefault.jpg`} alt="" loading="lazy" decoding="async" width={480} height={360} />
            <span className="embedded-video-play" aria-hidden="true" />
          </button>
        )}
      </div>
      <figcaption>
        <p className="embedded-video-title">{video.title}</p>
        <p className="fine">
          <a href={`https://www.youtube.com/watch?v=${video.youtubeId}`} target="_blank" rel="noopener noreferrer">
            Video by {video.channel} on YouTube, not TougeMap&rsquo;s own footage <ExternalArrow />
          </a>
        </p>
      </figcaption>
    </figure>
  );
}

export default function EmbeddedVideos({ videos }: { videos: EmbedVideo[] }) {
  return (
    <section aria-labelledby="on-the-road">
      <h2 id="on-the-road">On the road</h2>
      <div className="embedded-video-list">
        {videos.map(video => <VideoFacade key={video.youtubeId} video={video} />)}
      </div>
      <p className="fine">
        Videos show the road on the day they were filmed. They don&rsquo;t reflect current closures or conditions,
        and they aren&rsquo;t a guide to how fast to drive it.
      </p>
    </section>
  );
}
