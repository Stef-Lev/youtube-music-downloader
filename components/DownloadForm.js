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
  const title = titlesPerType[downloadType];
  return (
    <div className="p-2 mb-[16px] w-full">
      <div className="flex justify-center items-center w-full mb-[10px]">
        <h1 className="font-bold text-2xl text-greenLight">{title}</h1>
      </div>
      <div className="flex justify-center items-center w-full text-white">
        <p>Please add a valid url</p>
      </div>

      <div className="flex justify-center items-center w-full py-1">
        <div className="flex items-center justify-center gap-3 w-[100%] mb-[10px]">
          <input
            placeholder="https://www.youtube.com/watch?v=9bZkp7q19f0"
            className="px-4 rounded-[30px] text-sm md:text-lg h-[40px] w-[70%] md:w-[500px] "
            type="text"
            value={url}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="flex justify-center">
        <button
          disabled={!url || stage || progress}
          className="bg-greenLight rounded-[30px] py-2 px-4 w-[260px] text-xl font-bold text-[#1b212b] my-[10px]  disabled:opacity-50"
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
