import React from "react";

function ItemStatus({ item }) {
  const percentage = item.progress;
  console.log({ percentage });
  return (
    <div className="flex items-center justify-between">
      <div className="my-4 w-[35%] sm:w-[40%]">
        <span className="hidden sm:inline">{item.stage} </span>
        {item.id && (
          <span className="bg-[#ef4444] font-bold text-white rounded-md p-1 text-[14px]">
            {item.id}
          </span>
        )}
      </div>
      <div className="my-4 w-[65%] sm:w-[60%] h-5 rounded-full loadingBarBg">
        <div
          className={`h-5 rounded-full loadingBar`}
          style={{ width: `${item.progress || 0}%` }}
        ></div>
      </div>
    </div>
  );
}

export default ItemStatus;
