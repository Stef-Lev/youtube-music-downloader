import React from "react";

function ItemStatus({ item }) {
  const calcPercentage = (num) => {
    return `${num.toFixed(2)}%`;
  };

  return (
    <div className="flex items-center justify-between">
      <div>{item.id}</div>
      <div className="my-4 w-[70%] h-5 bg-gray-200 rounded-full dark:bg-gray-600">
        <div
          className={`h-5 bg-teal-600 rounded-full dark:bg-teal-500`}
          style={{ width: calcPercentage(item.progress) }}
        ></div>
      </div>
    </div>
  );
}

export default ItemStatus;
