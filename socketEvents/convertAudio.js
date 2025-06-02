import cp from "child_process";
import getVideoId from "helpers/getVideoIDFromURL";
import path from "path";
import fs from "fs";

export default async function convertAudio({
  videoUrl,
  sendProgress,
  sendError,
  sendComplete,
  ytdlPath,
  ffmpegPath,
}) {
  if (!videoUrl) {
    sendError("No URL provided");
    return;
  }

  try {
    const baseDir = path.join(process.cwd(), "mp3s");
    const tempDir = path.join(baseDir, "temp");
    const finalDir = baseDir;
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    const videoId = getVideoId(videoUrl);
    const outputName = videoId.replace(/[^a-zA-Z0-9]/g, "_");
    const tempFile = path.join(tempDir, `${outputName}_raw.m4a`);
    const finalFile = path.join(finalDir, `${outputName}.mp3`);

    if (fs.existsSync(tempFile)) {
      fs.unlinkSync(tempFile);
      console.log("Deleted existing temp file:", tempFile);
    }

    if (fs.existsSync(finalFile)) {
      fs.unlinkSync(finalFile);
      console.log("Deleted existing final file:", finalFile);
    }

    sendProgress({ stage: "Downloading..." });
    await new Promise((resolve, reject) => {
      const ytProcess = cp.spawn(ytdlPath, [
        "--newline",
        "-f",
        "bestaudio",
        "-o",
        tempFile,
        `https://www.youtube.com/watch?v=${videoId}`,
      ]);

      ytProcess.stdout.on("data", (data) => {
        const message = data.toString();
        const percentMatch = message.match(/\[download\]\s+([\d.]+)%/);
        const percent = percentMatch ? parseFloat(percentMatch[1]) : null;
        sendProgress({
          stage: "Downloading...",
          message,
          percent,
        });
      });

      ytProcess.stderr.on("data", (data) => {
        const message = data.toString();
        const percentMatch = message.match(/\[download\]\s+([\d.]+)%/);
        const percent = percentMatch ? parseFloat(percentMatch[1]) : null;
        sendProgress({
          stage: "Downloading...",
          message,
          percent,
        });
      });

      ytProcess.on("close", (code) => {
        if (code === 0) resolve();
        else reject(new Error(`yt-dlp exited with code ${code}`));
      });
    });

    sendProgress({ stage: "Encoding..." });
    await new Promise((resolve, reject) => {
      const ffmpegProcess = cp.spawn(ffmpegPath, [
        "-y",
        "-i",
        tempFile,
        "-vn",
        "-c:a",
        "libmp3lame",
        "-q:a",
        "0",
        finalFile,
      ]);

      ffmpegProcess.stderr.on("data", (data) => {
        const message = data.toString();
        const percentMatch = message.match(/\[download\]\s+([\d.]+)%/);
        const percent = percentMatch ? parseFloat(percentMatch[1]) : null;
        sendProgress({
          stage: "Encoding...",
          message,
          percent,
        });
      });

      ffmpegProcess.on("close", (code) => {
        if (code === 0) resolve();
        else reject(new Error(`ffmpeg exited with code ${code}`));
      });
    });

    fs.unlink(tempFile, (err) => {
      if (err) {
        console.warn("Could not delete temp file:", tempFile);
      }
    });

    sendComplete({
      msg: "Audio download complete!",
      file: `${outputName}.mp3`,
    });
  } catch (err) {
    console.error(err);
    sendError("Failed to download or process audio.");
  }
}
