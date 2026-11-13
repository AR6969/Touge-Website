export type EmbedVideo = {
  roadId: string;
  title: string;
  youtubeId: string;
  /** The YouTube channel that published it, as YouTube's oEmbed reports it. */
  channel: string;
};

// Third-party footage we don't own and don't self-host — embedded via
// YouTube's player rather than downloaded, unlike roadVideos in
// road-videos.ts (our own filmed clips). Keep the two systems separate so
// the attribution is never ambiguous about whose footage this is.
//
// Before adding one: confirm it's public and embeddable (YouTube's oEmbed
// endpoint returns 200), credit the channel exactly, and prefer plain
// point-of-view drives over crash, "send it" or street-racing footage —
// this site doesn't present roads as places to go fast.
const embedVideos: EmbedVideo[] = [
  { roadId: "tail-of-the-dragon", title: "Driving the Tail of the Dragon, US 129 North", youtubeId: "d_rFvkWySrQ", channel: "414 Road Trips" },
  { roadId: "the-snake", title: "Mulholland Snake from the Rock Store to the Lookout", youtubeId: "t1IzlkIz-UM", channel: "Aerialbd" },
  { roadId: "the-snake", title: "Mulholland Snake to the Rock Store", youtubeId: "CzrhkCVq-LY", channel: "ZXKawi" },
  { roadId: "latigo-canyon", title: "Downhill Drive on Latigo Canyon Road", youtubeId: "GWDF92vxYbw", channel: "Cinematic Drive" },
  { roadId: "latigo-canyon", title: "Latigo Canyon Road after the Franklin Fire", youtubeId: "cMD57cNSNO4", channel: "Everyday On Tour" },
  { roadId: "kanan-dume", title: "Kanan & Kanan Dume Road: the tunnels to Malibu", youtubeId: "GMvM7Kg5fVs", channel: "motofabio" },
  { roadId: "decker-canyon", title: "Decker Canyon Road (SR 23) from Thousand Oaks to Malibu", youtubeId: "N6gCsm_UDOU", channel: "AdventureEveryDay" },
];

export function embedVideosForRoad(roadId: string) {
  return embedVideos.filter(video => video.roadId === roadId);
}
