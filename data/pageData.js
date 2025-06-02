const pageData = {
  audio: {
    mediaType: "youtubeAudio",
    directory: "mp3s",
    socketEvent: "downloadAudio",
  },
  video: {
    mediaType: "youtubeVideo",
    directory: "mp4s",
    socketEvent: "downloadVideo",
  },
  stream: {
    mediaType: "videoStream",
    directory: "mp4s",
    socketEvent: "downloadStream",
  },
  instagram: {
    mediaType: "instagram",
    directory: "mp4s",
    socketEvent: "downloadInstagram",
  },
};

export default pageData;
