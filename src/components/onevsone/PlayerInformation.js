import React from "react";
import winner from "../../assets/images/winner.svg";

import { Skeleton } from "@mui/material";
import {
  DummyPubKey,
  getAddress,
  handleImageError,
  imagePath,
} from "../../utils/utils";

export default function PlayerInformation({ players, afterComplete }) {
  return (
    <>
      <div className="flex justify-between gap-6">
        <div className="bg-cloud-burst bg-opacity-[0.72] w-2/4 sm:w-2/4 md:w-2/4 lg:w-2/6 rounded-br-[40px] rounded-tl-[40px] border-b-2 border-[#EA4FEA] ">
          <div className="flex flex-wrap gap-[15px] p-4 sm:p-4 md:p-4 lg:p-6 onevs1-player-name ">
            {players[0].playerImage ? (
              <img
                src={`${imagePath}profile48/${players[0].playerImage}`}
                onError={handleImageError}
                className="object-cover w-10 h-10 rounded-xl bg-yankees-blue"
                alt=""
              />
            ) : players[0].mint && players[0].mintImage ? (
              <img
                src={players[0].mintImage}
                onError={handleImageError}
                className="object-cover w-10 h-10 rounded-xl bg-yankees-blue"
                alt=""
              />
            ) : (
              <div className="object-cover h-8 w-8 rounded-xl bg-chat-bg bg-opacity-95"></div>
            )}
            <div className="flex items-center max-sm:mt-2 gap-3 text-sm font-semibold leading-6 text-gray">
              {players[0].playerPubKey === DummyPubKey ? (
                <Skeleton
                  variant="rectangular"
                  width={80}
                  height={25}
                  sx={{ borderRadius: "1.5rem" }}
                />
              ) : players[0].userName ? (
                players[0].userName
              ) : (
                getAddress(players[0].playerPubKey.toString())
              )}
            </div>
            {afterComplete[0].text === "WON" && (
              <div className="flex items-center">
                <div
                  className={`flex bg-dark-purple text-yankees-blue gap-2 justify-center max-sm:py-2 max-sm:w-16  rounded-xl 1 px-2 items-center py-1`}
                >
                  <img src={winner} alt="" />
                  <div className="text-xs font-bold tracking-wide uppercase">
                    WON
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="items-center hidden gap-4 sm:hidden md:hidden lg:flex">
          <div className="text-xl font-black leading-8 tracking-wide text-gray">
            Doge
          </div>
          <div className="font-Comforter text-[64px] leading-3 text-gray ">
            vs
          </div>
          <div className="text-xl font-black leading-8 tracking-wide text-gray">
            {" "}
            Cheems
          </div>
        </div>
        <div className="bg-cloud-burst bg-opacity-[0.72] w-2/4 sm:w-2/4 md:w-2/4 lg:w-2/6 rounded-bl-[40px] rounded-tr-[40px] border-b-2 border-[#5A88FF] ">
          <div className="flex flex-wrap flex-row-reverse gap-[15px] p-4 sm:p-4 md:p-4 lg:p-6 onevs1-player-name">
            {players[1].playerImage ? (
              <img
                src={`${imagePath}profile48/${players[1].playerImage}`}
                onError={handleImageError}
                className="object-cover w-10 h-10 rounded-xl bg-yankees-blue"
                alt=""
              />
            ) : players[1].mint && players[1].mintImage ? (
              <img
                src={players[1].mintImage}
                onError={handleImageError}
                className="object-cover w-10 h-10 rounded-xl bg-yankees-blue"
                alt=""
              />
            ) : (
              <div className="object-cover h-8 w-8 rounded-xl bg-chat-bg bg-opacity-95"></div>
            )}
            <p className="flex items-center max-sm:mt-2  text-sm font-semibold leading-6 text-gray">
              {players[1].playerPubKey === DummyPubKey ? (
                <Skeleton
                  variant="rectangular"
                  width={80}
                  height={25}
                  sx={{ borderRadius: "1.5rem" }}
                />
              ) : players[1].userName ? (
                players[1].userName
              ) : (
                getAddress(players[1].playerPubKey.toString())
              )}
            </p>
            {afterComplete[1].text === "WON" && (
              <div className="flex items-center ">
                <div
                  className={`flex bg-dark-purple text-yankees-blue gap-2 justify-center rounded-xl  px-2 items-center py-1 max-sm:w-16  `}
                >
                  <img src={winner} alt="" />
                  <div className="text-xs font-bold tracking-wide uppercase">
                    WON
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-end justify-center gap-4 mt-6 sm:flex md:flex lg:hidden">
        <div className="text-xl font-black leading-8 tracking-wide text-gray">
          Doge
        </div>
        <div className="font-Comforter text-[64px] leading-3 text-gray ">
          vs
        </div>
        <div className="text-xl font-black leading-8 tracking-wide text-gray">
          {" "}
          Cheems
        </div>
      </div>
    </>
  );
}
