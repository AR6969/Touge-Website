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
    src: "/videos/glendora-mountain-v2.mp4",
    poster: "/videos/glendora-mountain-v2.jpg",
    width: 1080,
    height: 1432,
    description: "An F80 M3 and an F87 M2 Competition cruising through GMR: winding pavement, rocky hillsides and mountain views, filmed from inside the car.",
  },
];

export function videosForRoads(roadIds: string[]) {
  return roadVideos.filter(video => roadIds.includes(video.roadId));
}
