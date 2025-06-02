import cp from "child_process";
import path from "path";
import fs from "fs";

export default async function convertStream({
  videoUrl,
  sendProgress,
  sendError,
  sendComplete,
}) {
  if (!videoUrl || typeof videoUrl !== "string") {
    sendError("No valid video URL provided.");
    return;
  }

  let parsedUrl;
  try {
    parsedUrl = new URL(videoUrl.trim());
    if (!parsedUrl.pathname.endsWith(".m3u8")) {
      throw new Error("Only direct .m3u8 stream URLs are supported.");
    }
  } catch (e) {
    sendError("Invalid video stream URL.");
    return;
  }

  const domain = parsedUrl.hostname.replace(/\W+/g, "_");
  const timestamp = Date.now();
  const fileName = `${domain}_${timestamp}.mp4`;

  const mp4Dir = path.join(process.cwd(), "mp4s");
  if (!fs.existsSync(mp4Dir)) {
    fs.mkdirSync(mp4Dir);
  }

  const outputPath = path.join(mp4Dir, fileName);

  const ffmpeg = cp.spawn("ffmpeg", [
    "-protocol_whitelist",
    "file,http,https,tcp,tls",
    "-i",
    videoUrl,
    "-c",
    "copy",
    "-y",
    outputPath,
  ]);

  ffmpeg.stderr.on("data", (data) => {
    const output = data.toString();
    console.error(output);

    if (output.includes("frame=") || output.includes("time=")) {
      sendProgress({
        percent: null,
        stage: "Downloading...",
      });
    } else if (output.toLowerCase().includes("error")) {
      sendError("FFmpeg error: " + output);
    }
  });

  ffmpeg.on("close", (code) => {
    if (code === 0) {
      sendComplete({ msg: `Download complete: ${fileName}` });
    } else {
      sendError(`FFmpeg exited with code ${code}`);
    }
  });
}
