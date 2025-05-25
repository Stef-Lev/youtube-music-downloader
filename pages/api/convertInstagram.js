import { Server as SocketIOServer } from "socket.io";
import cp from "child_process";
import path from "path";
import fs from "fs";

const ytdlPath = `C:\\ytdl\\yt-dlp.exe`; // Custom path to yt-dlp.exe

let io;

export default async function handler(req, res) {
  if (!res.socket.server.io) {
    io = new SocketIOServer(res.socket.server);
    res.socket.server.io = io;

    io.on("connection", (socket) => {
      console.log("Instagram socket connected:", socket.id);

      const sendProgress = (msg) => socket.emit("showProgress", msg);
      const sendError = (msg) => socket.emit("showError", msg);
      const sendComplete = (msg) => socket.emit("showComplete", msg);

      socket.on("downloadInstagram", async (videoUrl) => {
        if (!videoUrl) {
          sendError("No URL provided.");
          return;
        }
        console.log({ videoUrl });

        try {
          const timestamp = Date.now();
          const fileName = `instagram_${timestamp}.mp4`;

          const mp4Dir = path.join(process.cwd(), "mp4s");
          if (!fs.existsSync(mp4Dir)) {
            fs.mkdirSync(mp4Dir);
          }

          const outputPath = path.join(mp4Dir, fileName);
          console.log(mp4Dir);
          const ytDlp = cp.spawn(ytdlPath, [
            "-f",
            "mp4",
            "-o",
            outputPath,
            videoUrl,
          ]);

          ytDlp.stdout.on("data", (data) => {
            console.log("yt-dlp output:", data.toString());
            sendProgress({ stage: "Downloading..." });
          });

          ytDlp.stderr.on("data", (data) => {
            const output = data.toString();
            console.error("yt-dlp error:", output);
            if (output.toLowerCase().includes("error")) {
              sendError("yt-dlp error occurred.");
            }
          });

          ytDlp.on("close", (code) => {
            if (code === 0) {
              sendComplete({ msg: `Download complete: ${fileName}` });
            } else {
              sendError(`yt-dlp exited with code ${code}`);
            }
          });
        } catch (err) {
          console.error("Download error:", err);
          sendError("Download failed.");
        }
      });
    });
  }

  res.end();
}
