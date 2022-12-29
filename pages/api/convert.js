// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const YoutubeMp3Downloader = require("youtube-mp3-downloader");

const YD = new YoutubeMp3Downloader({
  ffmpegPath: "/ffmpeg", // FFmpeg binary location
  outputPath: "/mp3s", // Output file location (default: the home directory)
  youtubeVideoQuality: "highestaudio", // Desired video quality (default: highestaudio)
  queueParallelism: 2, // Download parallelism (default: 1)
  progressTimeout: 2000, // Interval in ms for the progress reports (default: 1000)
  allowWebm: false, // Enable download from WebM sources (default: false)
});

export default function handler(req, res) {
  if (req.method === "POST") {
    const { urls } = req.body;
    urls.forEach((item) => {
      YD.download(item);
      YD.on("error", function (error) {
        console.log(error);
      });
      YD.on("finished", function (err, data) {
        console.log(JSON.stringify(data));
      });
    });
    res.status(200).json({ videos: urls });
  } else {
    res.status(400).json({ status: "Bad request" });
  }
}
