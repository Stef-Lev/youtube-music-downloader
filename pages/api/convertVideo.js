import { Server as SocketIOServer } from "socket.io";
import cp from "child_process";
import path from "path";
import fs from "fs";
import getVideoId from "helpers/getVideoIDFromURL";

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

      socket.on("downloadVideo", async (videoUrl) => {
        if (!videoUrl) {
          sendError("No video url provided");
          return;
        }

        try {
          const baseDir = path.join(process.cwd(), "mp4s");
          const tempDir = path.join(baseDir, "temp");
          const finalDir = baseDir;
          if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
          }
          const videoId = getVideoId(videoUrl);
          const outputName = videoId.replace(/[^a-zA-Z0-9]/g, "_");

          const tempFile = path.join(tempDir, `${outputName}_raw.mp4`);
          const finalFile = path.join(finalDir, `${outputName}.mp4`);

          const ytdlPath = `C:\\ytdl\\yt-dlp.exe`;
          const ffmpegPath = `C:\\ffmpeg\\bin\\ffmpeg.exe`;

          sendProgress({ stage: "Downloading..." });
          await new Promise((resolve, reject) => {
            const ytProcess = cp.spawn(ytdlPath, [
              "-f",
              "bestvideo+bestaudio",
              "--merge-output-format",
              "mp4",
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
              "-i",
              tempFile,
              "-c:v",
              "libx264",
              "-c:a",
              "aac",
              "-movflags",
              "+faststart",
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

          sendComplete({ msg: "Done! Video saved!" });
        } catch (err) {
          console.error(err);
          sendError("Failed to download or process video.");
        }
      });
    });
  } else {
    console.log("Socket.IO already initialized");
  }

  res.end();
}
