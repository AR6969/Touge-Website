export type RoadVideo = {
  roadId: string;
  title: string;
  src: string;
  poster: string;
  width: number;
  height: number;
  description: string;
};

// Editorial media stays separate from the generated road catalog.
const roadVideos: RoadVideo[] = [
  {
    roadId: "glendora-mountain",
    title: "Glendora Mountain Road",
    src: "/videos/glendora-mountain-v3.mp4",
    poster: "/videos/glendora-mountain-v3.jpg",
    width: 1080,
    height: 1432,
    description: "F80 M3 and F87 M2 Competition cruising on Glendora Mountain Road.",
  },
];

export function videosForRoads(roadIds: string[]) {
  return roadVideos.filter(video => roadIds.includes(video.roadId));
}
