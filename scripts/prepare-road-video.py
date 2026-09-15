#!/usr/bin/env python3
"""Create a web-sized MP4 and matching poster; retain the original locally.

Example (FFmpeg with libx264; --hlg also requires macOS and Swift):
  python3 scripts/prepare-road-video.py 'GMR clip website.mov' glendora-mountain-v3 --hlg --poster-at 35 \
      --width 1080 --crf 20 --maxrate 8000k --preset slow --audio-bitrate copy
Use a new version suffix when replacing published media so cached URLs stay valid.
"""
import argparse
from pathlib import Path
import subprocess
import tempfile

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument("source", type=Path)
parser.add_argument("name", help="Output filename stem, including version")
parser.add_argument("--ffmpeg", default="ffmpeg")
parser.add_argument("--hlg", action="store_true", help="Use Apple's native HDR-to-SDR conversion")
parser.add_argument("--poster-at", default="0")
parser.add_argument("--width", type=int, default=720, help="Output width in pixels; height keeps the source aspect ratio")
parser.add_argument("--fps", type=int, default=30)
parser.add_argument("--crf", type=int, default=26, help="x264 quality; lower is higher quality and larger, 18 is near-lossless")
parser.add_argument("--preset", default="medium", help="x264 encoder preset; slower presets compress better at the same CRF")
parser.add_argument("--maxrate", default="2800k", help="Peak bitrate cap for the VBV buffer")
parser.add_argument("--bufsize", default=None, help="VBV buffer size; defaults to 2x --maxrate")
parser.add_argument("--audio-bitrate", default="copy", help="copy preserves the camera audio; otherwise an AAC bitrate")
args = parser.parse_args()
output = Path(__file__).resolve().parents[1] / "public" / "videos"
output.mkdir(parents=True, exist_ok=True)
video = output / f"{args.name}.mp4"
poster = output / f"{args.name}.jpg"
bufsize = args.bufsize or f"{int(args.maxrate.rstrip('k')) * 2}k"
if video.exists() or poster.exists():
    parser.error("Output already exists. Use a new version suffix.")
filters = f"scale={args.width}:-2:flags=lanczos,fps={args.fps},format=yuv420p,setsar=1"
audio_args = ["-c:a", "copy"] if args.audio_bitrate == "copy" else ["-c:a", "aac", "-b:a", args.audio_bitrate]
with tempfile.TemporaryDirectory(prefix="touge-video-") as temp:
    picture_source = args.source
    if args.hlg:
        picture_source = Path(temp) / "sdr.mp4"
        subprocess.run([
            "swift", "-module-cache-path", str(Path(temp) / "swift-cache"),
            str(Path(__file__).with_name("export-sdr-video.swift")),
            str(args.source.resolve()), str(picture_source),
        ], check=True)
    subprocess.run([
        args.ffmpeg, "-hide_banner", "-loglevel", "warning", "-nostdin", "-n",
        "-i", str(picture_source), "-i", str(args.source),
        "-map", "0:v:0", "-map", "1:a:0?",
        "-vf", filters, "-c:v", "libx264", "-preset", args.preset, "-crf", str(args.crf),
        "-maxrate", args.maxrate, "-bufsize", bufsize, "-tag:v", "avc1",
        "-color_primaries", "bt709", "-color_trc", "bt709", "-colorspace", "bt709",
        *audio_args, "-movflags", "+faststart", "-map_metadata", "-1",
        str(video),
    ], check=True)
subprocess.run([
    args.ffmpeg, "-hide_banner", "-loglevel", "warning", "-nostdin", "-n",
    "-ss", args.poster_at, "-i", str(video), "-frames:v", "1", "-q:v", "3",
    "-update", "1", str(poster),
], check=True)
print(f"Created {video.name}: {video.stat().st_size / 1_000_000:.1f} MB")
print(f"Created {poster.name}: {poster.stat().st_size / 1_000:.0f} KB")
