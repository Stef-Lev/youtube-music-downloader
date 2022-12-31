import { Server } from "socket.io";
const YoutubeMp3Downloader = require("youtube-mp3-downloader");
const path = require("path");
process.env.DOWNLOADS;
import which from "which";
let ffmpegPath = which.sync("ffmpeg");
const outputPath = path.join(process.cwd(), "mp3s");

// let outputPath = which.sync("downloads");

const YD = new YoutubeMp3Downloader({
  ffmpegPath, // FFmpeg binary location
  outputPath,
  youtubeVideoQuality: "highestaudio", // Desired video quality (default: highestaudio)
  queueParallelism: 1, // Download parallelism (default: 1)
  progressTimeout: 2000, // Interval in ms for the progress reports (default: 1000)
  allowWebm: false, // Enable download from WebM sources (default: false)
});

export default function handler(req, res) {
  // console.log(req);
  // const io = req.app.get("io");
  // const sockets = req.app.get("sockets");
  if (res.socket.server.io) {
    console.log("Socket is already running");
    res.end();
    return;
  }

  console.log("Socket is initializing");
  const io = new Server(res.socket.server);
  res.socket.server.io = io;

  if (req.method === "POST") {
    const { urls } = req.body;
    let songData = [];
    io.on("connection", async (socket) => {
      console.log(socket.id, "socketID");

      const sendProgress = async (msg) => {
        socket.emit("showProgress", msg);
      };
      // socket.on("sendProgress", sendProgress);
      urls.forEach((item) => {
        YD.download(item);
        YD.on("error", function (error) {
          console.log(error);
        });
        YD.on("progress", function (progress) {
          console.log(progress);
          sendProgress(progress);
        });
        YD.on("finished", function (err, data) {
          res.status(200).json(JSON.stringify(data));
        });
      });
    });
  } else {
    res.status(400).json({ status: "Bad request" });
  }
}
