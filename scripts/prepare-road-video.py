#!/usr/bin/env python3
"""Create a mobile-sized MP4 and matching poster; retain the original locally.

Example (FFmpeg with libx264 and zscale required):
  python3 scripts/prepare-road-video.py 'GMR clip website.mov' glendora-mountain-v1 --hlg --poster-at 35
Use a new version suffix when replacing published media so cached URLs stay valid.
"""
import argparse
from pathlib import Path
import subprocess

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument("source", type=Path)
parser.add_argument("name", help="Output filename stem, including version")
parser.add_argument("--ffmpeg", default="ffmpeg")
parser.add_argument("--hlg", action="store_true", help="Tone-map HLG footage to standard SDR")
parser.add_argument("--poster-at", default="0")
args = parser.parse_args()
output = Path(__file__).resolve().parents[1] / "public" / "videos"
output.mkdir(parents=True, exist_ok=True)
video = output / f"{args.name}.mp4"
poster = output / f"{args.name}.jpg"
filters = "scale=720:-2,fps=30"
if args.hlg:
    filters += ",zscale=t=linear:npl=100,format=gbrpf32le,zscale=p=bt709,tonemap=tonemap=mobius:desat=0,zscale=t=bt709:m=bt709:r=tv"
filters += ",format=yuv420p,setsar=1"
subprocess.run([
    args.ffmpeg, "-hide_banner", "-loglevel", "warning", "-nostdin", "-n",
    "-i", str(args.source), "-map", "0:v:0", "-map", "0:a:0?",
    "-vf", filters, "-c:v", "libx264", "-preset", "medium", "-crf", "26",
    "-maxrate", "2800k", "-bufsize", "5600k", "-tag:v", "avc1",
    "-color_primaries", "bt709", "-color_trc", "bt709", "-colorspace", "bt709",
    "-c:a", "aac", "-b:a", "96k", "-movflags", "+faststart", "-map_metadata", "-1",
    str(video),
], check=True)
subprocess.run([
    args.ffmpeg, "-hide_banner", "-loglevel", "warning", "-nostdin", "-n",
    "-ss", args.poster_at, "-i", str(video), "-frames:v", "1", "-q:v", "3",
    "-update", "1", str(poster),
], check=True)
print(f"Created {video.name}: {video.stat().st_size / 1_000_000:.1f} MB")
print(f"Created {poster.name}: {poster.stat().st_size / 1_000:.0f} KB")
