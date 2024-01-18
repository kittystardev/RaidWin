import React from "react";
import { useState } from "react";
import MyPreviousGames from "./MyPreviousGames";
import AllPreviousGames from "./AllPreviousGames";

export default function PreviousRounds({ finalWinner, from1v1 }) {
  // console.log("LAStWinner", finalWinner)
  const [activeTab, setActiveTab] = useState("allgames");

  return (
    <div className="justify-between block px-0 sm:px-6 lg:px-0 lg:pr-6">
      <div className="items-center justify-between block mb-8 sm:block md:flex lg:flex 2xl:flex">
        <div className="text-2xl font-black tracking-wide text-gray">
          Previous Rounds
        </div>
      </div>

      <div className="flex gap-16 text-sm font-bold tracking-wide uppercase">
        {/* <div
          className={`${
            activeTab === "mygames"
              ? "border-chat-tag border-b-2 text-gray cursor-pointer"
              : "text-space-gray cursor-pointer"
          }`}
          onClick={() => setActiveTab("mygames")}
        >
          My Games
        </div>
        <div
          className={`${
            activeTab === "allgames"
              ? "border-chat-tag border-b-2 text-gray cursor-pointer"
              : "text-space-gray cursor-pointer"
          }`}
          onClick={() => setActiveTab("allgames")}
        >
          All Games
        </div> */}
      </div>

      {activeTab === "mygames" ? <MyPreviousGames /> : <AllPreviousGames from1v1={from1v1}/>}
    </div>
  );
}
