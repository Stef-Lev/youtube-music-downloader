import React from "react";

function Library({ storedItems }) {
  return (
    <div className="w-full flex justify-center bg-[#11141a] pt-[10px]">
      <div className="w-full md:w-[600px]">
        <h3 className="text-center text-xl font-bold mb-[10px] text-white">
          Downloaded files
        </h3>
        <div className="px-[10px] pb-[80px]">
          {storedItems.map((item, idx) => (
            <div className="w-full">
              <p
                className="truncate text-[12px] md:text-[14px] rounded-md px-[5px] py-[2px] mb-[5px] border-[1px] border-[#488f5f] text-[#488f5f]"
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

export default Library;
