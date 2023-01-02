import { Server } from "socket.io";
import which from "which";

const YoutubeMp3Downloader = require("youtube-mp3-downloader");
const path = require("path");
const ffmpegPath = which.sync("ffmpeg");
const outputPath = path.join(process.cwd(), "mp3s");

const YD = new YoutubeMp3Downloader({
  ffmpegPath,
  outputPath,
  youtubeVideoQuality: "highestaudio",
  queueParallelism: 3,
  progressTimeout: 2000,
  allowWebm: false,
});

export default function handler(req, res) {
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

    const sendProgress = async (data) => {
      const formattedData = {
        id: data.videoId,
        progress: data.progress.percentage,
      };
      socket.emit("showProgress", formattedData);
    };
    const sendComplete = async (msg) => {
      socket.emit("showComplete", msg);
    };

    const downloadVideos = async (list) => {
      list.forEach((item) => {
        YD.download(item);
        YD.on("error", function (error) {
          sendError({
            status: "error",
            message: error,
          });
        });
        YD.on("progress", function (progress) {
          sendProgress(progress);
        });
        YD.on("finished", function (err, data) {
          if (err) {
            sendError({
              status: "error",
              message: err,
            });
          } else {
            sendComplete({
              status: "success",
              data,
            });
          }
        });
      });
    };
    socket.on("downloadVideos", downloadVideos);
  });
  res.end();
}
