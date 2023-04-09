import { Server } from "socket.io";
const readline = require("readline");
const ytdl = require("ytdl-core");
const cp = require("child_process");

export default async function handler(req, res) {
  if (res.socket.server.io) {
    console.log("Socket is already running");
    res.end();
    return;
  }
  console.log("Socket is initializing");
  const io = new Server(res.socket.server);
  res.socket.server.io = io;

  io.on("connection", async (socket) => {
    console.log(socket.id, "socketID");

    const sendError = async (msg) => {
      socket.emit("showError", msg);
    };

    const sendProgress = async (msg) => {
      console.log(msg);
      socket.emit("showProgress", msg);
    };

    const sendComplete = async (msg) => {
      console.log(msg);
      socket.emit("showComplete", msg);
    };

    const downloadVideo = async (url) => {
      try {
        const tracker = {
          start: Date.now(),
          audio: { downloaded: 0, total: Infinity },
          video: { downloaded: 0, total: Infinity },
          merged: { frame: 0, speed: "0x", fps: 0 },
        };

        // Get audio and video streams
        const audio = ytdl(url, { quality: "highestaudio" }).on(
          "progress",
          (_, downloaded, total) => {
            tracker.audio = { downloaded, total };
          }
        );
        const video = ytdl(url, { quality: "highestvideo" }).on(
          "progress",
          (_, downloaded, total) => {
            tracker.video = { downloaded, total };
          }
        );
        let videoName;
        await ytdl.getInfo(url).then((info) => {
          const videoTitle = info.videoDetails.title;
          videoName = videoTitle
            .replace(/[^a-zA-Z0-9α-ωΑ-Ωίϊΐόάέύϋΰήώ]/g, "_")
            .replace(/\s+/g, "_");
        });
        // Prepare the progress bar
        let progressbarHandle = null;
        const progressbarInterval = 1000;
        const showProgress = () => {
          readline.cursorTo(process.stdout, 0);
          const toMB = (i) => (i / 1024 / 1024).toFixed(2);

          process.stdout.write(
            `Audio  | ${(
              (tracker.audio.downloaded / tracker.audio.total) *
              100
            ).toFixed(2)}% processed `
          );
          process.stdout.write(
            `(${toMB(tracker.audio.downloaded)}MB of ${toMB(
              tracker.audio.total
            )}MB).${" ".repeat(10)}\n`
          );

          process.stdout.write(
            `Video  | ${(
              (tracker.video.downloaded / tracker.video.total) *
              100
            ).toFixed(2)}% processed `
          );
          process.stdout.write(
            `(${toMB(tracker.video.downloaded)}MB of ${toMB(
              tracker.video.total
            )}MB).${" ".repeat(10)}\n`
          );

          process.stdout.write(
            `Merged | processing frame ${tracker.merged.frame} `
          );
          process.stdout.write(
            `(at ${tracker.merged.fps} fps => ${
              tracker.merged.speed
            }).${" ".repeat(10)}\n`
          );

          process.stdout.write(
            `running for: ${((Date.now() - tracker.start) / 1000 / 60).toFixed(
              2
            )} Minutes.`
          );
          readline.moveCursor(process.stdout, 0, -3);
          sendProgress({
            percentage: +(
              (tracker.video.downloaded / tracker.video.total) *
              100
            ).toFixed(2),
          });
        };

        // Start the ffmpeg child process
        const ffmpegPath = "C:\\ffmpeg\\bin\\ffmpeg.exe";
        const ffmpegProcess = cp.spawn(
          ffmpegPath,
          [
            // Remove ffmpeg's console spamming
            "-loglevel",
            "8",
            "-hide_banner",
            // Redirect/Enable progress messages
            "-progress",
            "pipe:3",
            // Set inputs
            "-i",
            "pipe:4",
            "-i",
            "pipe:5",
            // Map audio & video from streams
            "-map",
            "0:a",
            "-map",
            "1:v",
            // Keep encoding
            "-c:v",
            "h264",
            // Define output file
            `./mp4s/${videoName}.mp4`,
          ],
          {
            windowsHide: true,
            stdio: [
              /* Standard: stdin, stdout, stderr */
              "inherit",
              "inherit",
              "inherit",
              /* Custom: pipe:3, pipe:4, pipe:5 */
              "pipe",
              "pipe",
              "pipe",
            ],
          }
        );
        ffmpegProcess.on("close", () => {
          console.log("done");
          // Cleanup
          process.stdout.write("\n\n\n\n");
          clearInterval(progressbarHandle);
          sendComplete({ msg: "Video download succesful." });
        });

        // Link streams
        // FFmpeg creates the transformer streams and we just have to insert / read data
        ffmpegProcess.stdio[3].on("data", (chunk) => {
          // Start the progress bar
          if (!progressbarHandle)
            progressbarHandle = setInterval(showProgress, progressbarInterval);
          // Parse the param=value list returned by ffmpeg
          const lines = chunk.toString().trim().split("\n");
          const args = {};
          for (const l of lines) {
            const [key, value] = l.split("=");
            args[key.trim()] = value.trim();
          }
          tracker.merged = args;
        });
        audio.pipe(ffmpegProcess.stdio[4]);
        video.pipe(ffmpegProcess.stdio[5]);
      } catch (err) {
        console.error("ERROR", err);
      }
    };

    socket.on("downloadVideo", downloadVideo);
  });
  res.end();
}
