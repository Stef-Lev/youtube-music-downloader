import React from "react";

function UrlTabs({ urls }) {
  return (
    <>
      {urls.length > 0 && (
        <>
          <h5 className="font-bold">Video IDs</h5>
          <div className="p-2 flex justify-center items-center w-full">
            <div className="flex flex-wrap gap-1 p-1 w-full md:w-[620px] text-center">
              {urls.length > 0 &&
                urls.map((item, idx) => (
                  <div
                    className="bg-[#ef4444] font-bold text-white rounded-md p-1 text-[14px]"
                    key={`${item}_${idx + 1}`}
                  >
                    {item}
                  </div>
                ))}
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default UrlTabs;
