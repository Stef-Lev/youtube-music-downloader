const pageData = {
  audio: {
    mediaKey: "audio",
    mediaType: "youtubeAudio",
    directory: "mp3s",
    convertApi: "convertAudio",
    socketEvent: "downloadAudio",
  },
  video: {
    mediaKey: "video",
    mediaType: "youtubeVideo",
    directory: "mp4s",
    convertApi: "convertVideo",
    socketEvent: "downloadVideo",
  },
  stream: {
    mediaKey: "stream",
    mediaType: "videoStream",
    directory: "mp4s",
    convertApi: "convertStream",
    socketEvent: "downloadStream",
  },
  instagram: {
    mediaKey: "instagram",
    mediaType: "instagram",
    directory: "mp4s",
    convertApi: "convertInstagram",
    socketEvent: "downloadInstagram",
  },
};

export default pageData;
