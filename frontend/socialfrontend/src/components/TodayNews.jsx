import React from "react";

function TodayNews() {
  return (
    <div className="border-gray-200 p-4 rounded-3xl border mt-10">
      <h1 className="font-bold my-4 text-[22px]">Today's News</h1>

      <div className="flex flex-col">
        <p className="truncate font-bold mb-2">
          new accident just happend in Auston caused traffic crises
        </p>

        <div className="flex items-center">
          <img className="w-10" src="/avatar.png" alt="" />
          <span className="text-gray-400">1 hour Left</span>
        </div>
      </div>
    </div>
  );
}

export default TodayNews;
