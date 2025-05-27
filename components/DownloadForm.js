import React from "react";
import c from "clsx";

function DownloadForm({
  downloadType,
  url,
  handleChange,
  onSubmit,
  progress,
  stage,
}) {
  const titlesPerType = {
    youtubeVideo: "YouTube Video Downloader",
    youtubeAudio: "YouTube Music Downloader",
    videoStream: "Video Stream Downloader",
    instagram: "Instagram Video Downloader",
  };
  const placeholderPerType = {
    youtubeVideo: "https://www.youtube.com/watch?v=9bZkp7q19f0",
    youtubeAudio: "https://www.youtube.com/watch?v=9bZkp7q19f0",
    videoStream:
      "https://live-hls-abr-cdn.livepush.io/live/bigbuckbunnyclip/index.m3u8",
    instagram: "https://www.instagram.com/jaycactusmusic/reel/DKILkxSMja3",
  };

  const title = titlesPerType[downloadType];
  const placeholder = placeholderPerType[downloadType];

  return (
    <div className="p-2 mb-[16px] w-full">
      <div
        className={c(
          "flex justify-center items-center",
          " w-full",
          "mb-[10px]"
        )}
      >
        <h1 className={c("font-bold", "text-2xl text-greenLight")}>{title}</h1>
      </div>
      <div
        className={c(
          "flex justify-center items-center",
          "w-full",
          "text-white"
        )}
      >
        <p>Please add a valid url</p>
      </div>

      <div className={c("flex justify-center items-center", "w-full", "py-1")}>
        <div
          className={c(
            "flex items-center justify-center",
            "w-[100%]",
            "gap-3 mb-[10px]"
          )}
        >
          <input
            placeholder={placeholder}
            className={c(
              "h-[40px] w-[70%] md:w-[500px]",
              "rounded-[30px]",
              "px-4",
              "text-sm md:text-lg"
            )}
            type="text"
            value={url}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="flex justify-center">
        <button
          disabled={!url || stage || progress}
          className={c(
            "py-2 px-4 my-[10px]",
            "w-[260px]",
            "text-xl font-bold text-[#1b212b]",
            "rounded-[30px]",
            "bg-greenLight",
            "disabled:opacity-50"
          )}
          onClick={onSubmit}
        >
          {stage ? stage : "Convert"}
          {progress && ` ${Math.round(progress)}%`}
        </button>
      </div>
    </div>
  );
}

export default DownloadForm;
