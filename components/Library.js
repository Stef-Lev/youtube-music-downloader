import React from "react";

function Library({ storedItems }) {
  return (
    <div className="w-full flex justify-center bg-[#fca668] pt-[10px]">
      <div>
        <h3 className="text-center text-xl font-bold mb-[10px]">Library</h3>
        <div className="px-[10px] pb-[80px]">
          {storedItems.map((item, idx) => (
            <p
              className="text-[12px] md:text-[14px] bg-white rounded-md px-[5px] py-[2px] mb-[5px] shadow-lg"
              key={idx + 1}
            >
              {item}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Library;
