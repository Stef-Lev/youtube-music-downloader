import { Server as SocketIOServer } from "socket.io";
import cp from "child_process";
import path from "path";
import fs from "fs";

let io;

export default async function handler(req, res) {
  if (!res.socket.server.io) {
    console.log("Socket.IO is initializing");
    io = new SocketIOServer(res.socket.server, {
      maxHttpBufferSize: 1e8,
    });
    res.socket.server.io = io;

    io.on("connection", (socket) => {
      console.log("New socket connection:", socket.id);

      const sendProgress = (msg) => socket.emit("showProgress", msg);
      const sendError = (msg) => socket.emit("showError", msg);
      const sendComplete = (msg) => socket.emit("showComplete", msg);

      socket.on("downloadStream", async (videoUrl) => {
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
      });
    });
  } else {
    console.log("Socket.IO already initialized");
  }

  res.end();
}
