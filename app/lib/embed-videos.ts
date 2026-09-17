export type EmbedVideo = {
  roadId: string;
  title: string;
  youtubeId: string;
  creditLabel: string;
  creditUrl: string;
};

// Third-party footage we don't own and don't self-host — embedded via
// YouTube's player rather than downloaded, unlike roadVideos in
// road-videos.ts (our own filmed clips). Keep the two systems separate so
// the attribution is never ambiguous about whose footage this is.
const embedVideos: EmbedVideo[] = [
  {
    roadId: "tail-of-the-dragon",
    title: "Driving the Tail of the Dragon, US 129 North",
    youtubeId: "d_rFvkWySrQ",
    creditLabel: "Video via YouTube — not TougeMap's own footage",
    creditUrl: "https://www.youtube.com/watch?v=d_rFvkWySrQ",
  },
];

export function embedVideoForRoad(roadId: string) {
  return embedVideos.find(video => video.roadId === roadId);
}
