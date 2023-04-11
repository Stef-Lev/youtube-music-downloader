import React from "react";

function DownloadForm({
  downloadType,
  url,
  handleChange,
  handleAddUrl,
  onSubmit,
  downloading,
}) {
  return (
    <div className="p-2 mb-[16px] w-full">
      <div className="flex justify-center items-center w-full mb-[10px]">
        <h1 className="font-bold text-2xl">
          YouTube {downloadType === "audio" ? "Music" : "Video"} Downloader
        </h1>
      </div>
      <div className="flex justify-center items-center w-full">
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
          <button
            className="bg-[#7DF5A5] rounded-[30px] px-2 font-bold h-[40px] w-[30%] md:w-[160px]"
            onClick={handleAddUrl}
          >
            Add url
          </button>
        </div>
      </div>
      <div className="flex justify-center">
        <button
          disabled={downloading || !url}
          className="bg-red-500 rounded-[30px] py-2 w-[200px] text-xl font-bold text-white mb-[10px]  disabled:opacity-50"
          onClick={onSubmit}
        >
          {downloading ? "Downloading" : "Convert"}
        </button>
      </div>
    </div>
  );
}

export default DownloadForm;
