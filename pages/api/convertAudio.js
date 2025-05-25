import { Server as SocketIOServer } from "socket.io";
import cp from "child_process";
import getVideoId from "helpers/getVideoIDFromURL";
import path from "path";
import fs from "fs";

let io;

export default async function handler(req, res) {
  if (!res.socket.server.io) {
    console.log("Socket.IO is initializing");
    io = new SocketIOServer(res.socket.server);
    res.socket.server.io = io;

    io.on("connection", (socket) => {
      console.log("New socket connection:", socket.id);

      const sendProgress = (msg) => socket.emit("showProgress", msg);
      const sendError = (msg) => socket.emit("showError", msg);
      const sendComplete = (msg) => socket.emit("showComplete", msg);

      socket.on("downloadAudio", async (videoUrl) => {
        if (!videoUrl) {
          sendError("No video ID provided");
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

          const ytdlPath = "C:\\ytdl\\yt-dlp.exe";
          const ffmpegPath = "C:\\ffmpeg\\bin\\ffmpeg.exe";

          // Step 1: Download best audio
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

          // Step 2: Convert to MP3 with ffmpeg
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

          // Clean up
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
      });
    });
  } else {
    console.log("Socket.IO already initialized");
  }

  res.end();
}
