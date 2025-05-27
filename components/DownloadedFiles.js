import React from "react";
import c from "clsx";

function DownloadedFiles({ storedItems }) {
  return (
    <div
      className={c(
        "flex justify-center",
        "w-full",
        " bg-[#11141a]",
        "pt-[10px]"
      )}
    >
      <div className="w-full md:w-[600px]">
        <h3
          className={c(
            "text-center text-xl text-white",
            "font-bold",
            "mb-[10px]"
          )}
        >
          Downloaded files
        </h3>
        <div className="px-[10px] pb-[80px]">
          {storedItems.map((item, idx) => (
            <div className="w-full" key={idx + 1}>
              <p
                className={c(
                  "px-[5px] py-[2px] mb-[5px]",
                  "truncate text-[12px] md:text-[14px]",
                  "rounded-md",
                  "border-[1px] border-greenDark",
                  "text-greenDark"
                )}
                title={item}
              >
                {item}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DownloadedFiles;
