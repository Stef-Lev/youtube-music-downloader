const pageData = {
  audio: {
    mediaType: "youtubeAudio",
    directory: "mp3s",
    convertApi: "convertAudio",
    socketEvent: "downloadAudio",
  },
  video: {
    mediaType: "youtubeVideo",
    directory: "mp4s",
    convertApi: "convertVideo",
    socketEvent: "downloadVideo",
  },
  stream: {
    mediaType: "videoStream",
    directory: "mp4s",
    convertApi: "convertStream",
    socketEvent: "downloadStream",
  },
  instagram: {
    mediaType: "instagram",
    directory: "mp4s",
    convertApi: "convertInstagram",
    socketEvent: "downloadInstagram",
  },
};

export default pageData;
