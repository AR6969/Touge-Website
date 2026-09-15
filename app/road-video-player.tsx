"use client";

import { useRef, useState } from "react";
import type { RoadVideo } from "./lib/road-videos";

export default function RoadVideoPlayer({ video }: { video: RoadVideo }) {
  const player = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);
  const [muted, setMuted] = useState(false);
  const [failed, setFailed] = useState(false);

  async function playWithSound() {
    const element = player.current;
    if (!element) return;
    element.muted = false;
    element.volume = 1;
    setMuted(false);
    setFailed(false);
    try {
      await element.play();
      element.focus();
    } catch {
      setFailed(true);
    }
  }

  function toggleSound() {
    const element = player.current;
    if (!element) return;
    const turnOn = element.muted || element.volume === 0;
    element.muted = !turnOn;
    if (turnOn) element.volume = 1;
  }

  return (
    <div className="road-video-player">
      <div className="road-video-screen">
        <video
          ref={player}
          controls
          playsInline
          preload="none"
          poster={video.poster}
          width={video.width}
          height={video.height}
          style={{ aspectRatio: `${video.width} / ${video.height}` }}
          aria-label={`${video.title} driving clip`}
          aria-describedby={`video-description-${video.roadId}`}
          onPlay={() => setStarted(true)}
          onVolumeChange={event => setMuted(event.currentTarget.muted || event.currentTarget.volume === 0)}
          onError={() => setFailed(true)}
        >
          <source src={video.src} type="video/mp4" />
          <a href={video.src}>Watch the {video.title} clip</a>
        </video>
        {!started && !failed && <button className="road-video-play" onClick={playWithSound}>Play with sound</button>}
      </div>
      {started && <button className="road-video-sound" onClick={toggleSound} aria-label={muted ? "Turn video sound on" : "Mute video"}>
        {muted ? "Sound off · Turn on" : "Sound on · Mute"}
      </button>}
      {failed && <p role="status" className="fine">Couldn’t play this clip. <a href={video.src}>Open the video directly →</a></p>}
    </div>
  );
}
