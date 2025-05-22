import React from "react";

function DownloadForm({
  downloadType,
  url,
  handleChange,
  onSubmit,
  progress,
  stage,
}) {
  return (
    <div className="p-2 mb-[16px] w-full">
      <div className="flex justify-center items-center w-full mb-[10px]">
        <h1 className="font-bold text-2xl text-[#7DF5A5]">
          YouTube {downloadType === "audio" ? "Music" : "Video"} Downloader
        </h1>
      </div>
      <div className="flex justify-center items-center w-full text-white">
        <p>Please add a valid YouTube url</p>
      </div>

      <div className="flex justify-center items-center w-full py-1">
        <div className="flex items-center justify-center gap-3 w-[100%] mb-[10px]">
          <input
            placeholder="https://www.youtube.com/watch?v=9bZkp7q19f0"
            className="px-2 rounded-[30px] text-sm md:text-lg h-[40px] w-[70%] md:w-[500px] "
            type="text"
            value={url}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="flex justify-center">
        <button
          disabled={!url || stage || progress}
          className="bg-[#7DF5A5] rounded-[30px] py-2 px-4 w-[260px] text-xl font-bold text-[#1b212b] my-[10px]  disabled:opacity-50"
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
