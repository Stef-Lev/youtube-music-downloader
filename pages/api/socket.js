import { Server as SocketIOServer } from "socket.io";
import convertVideo from "socketEvents/convertVideo";
import convertAudio from "socketEvents/convertAudio";
import convertStream from "socketEvents/convertStream";
import convertInstagram from "socketEvents/convertInstagram";

const ytdlPath = "C:\\ytdl\\yt-dlp.exe";
const ffmpegPath = "C:\\ffmpeg\\bin\\ffmpeg.exe";

const initializeSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    const sendProgress = (msg) => socket.emit("showProgress", msg);
    const sendError = (msg) => socket.emit("showError", msg);
    const sendComplete = (msg) => socket.emit("showComplete", msg);

    socket.on("downloadVideo", async (videoUrl) =>
      convertVideo({
        videoUrl,
        sendProgress,
        sendError,
        sendComplete,
        ytdlPath,
        ffmpegPath,
      })
    );

    socket.on("downloadAudio", async (videoUrl) => {
      convertAudio({
        videoUrl,
        sendProgress,
        sendError,
        sendComplete,
        ytdlPath,
        ffmpegPath,
      });
    });

    socket.on("downloadStream", async (videoUrl) => {
      convertStream({
        videoUrl,
        sendProgress,
        sendError,
        sendComplete,
      });
    });

    socket.on("downloadInstagram", async (videoUrl) => {
      convertInstagram({
        videoUrl,
        sendProgress,
        sendError,
        sendComplete,
        ytdlPath,
      });
    });
  });
};

let io;

export default async function handler(req, res) {
  if (!res.socket.server.io) {
    console.log("Initializing Socket.IO server...");
    io = new SocketIOServer(res.socket.server);
    res.socket.server.io = io;
    initializeSocket(io);
  } else {
    console.log("Socket.IO already initialized");
  }

  res.end();
}
