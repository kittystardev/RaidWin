import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import mute_icn from "../assets/images/mute_icon.svg";
import speaker_icn from "../assets/images/speaker_icn.svg";
import { setIsMuted } from "../store/topplayer";
import OnevsOneGamePlay from "./OnevsOneGamePlay";

export default function FlipCoin() {
  let dispatch = useDispatch();

  const [toLocalStorage, setToLocalStorage] = useState(false);
  const isMuted = useSelector((state) => state.topplayer.isMuted);

  const handleMute = () => {
    setToLocalStorage(!toLocalStorage);
    localStorage.setItem("mute", toLocalStorage);
  };

  useEffect(() => {
    let fromLocalStorage = localStorage.getItem("mute");
    dispatch(setIsMuted(fromLocalStorage === "true" ? false : true));
    // console.log("FromLocal", fromLocalStorage, isMuted);
  }, [isMuted, toLocalStorage]);
  return (
    <>
      <div>
        {/* <div className="block sm:block md:block lg:flex justify-between">
          <div className="">
            <div className="flex gap-2 font-black">
              <p className=" text-2xl tracking-wide text-gray">Bank</p>
              <p className="text-sm leading-6 tracking-wider text-nouveau-main flex items-end">
                DeGods - 5/6
              </p>
            </div>
            <div className="mt-2">
              <div className="text-space-gray text-opacity-[0.8] tracking-wide font-semibold text-sm leading-6">
                Waiting for <span className="text-light-green">1</span> more
                player...
              </div>
            </div>
          </div>
          <div className="flex gap-2 mt-6 sm:mt-6 md:mt-6 lg:mt-0">
            <div
              className="bg-nouveau-main bg-opacity-[0.08] rounded-lg px-6 py-3 text-space-gray font-bold h-fit hover:cursor-pointer"
              onClick={() => {
                handleMute();
              }}
            >
              {isMuted ? (
                <img src={mute_icn} className="w-6 h-6" />
              ) : (
                <img src={speaker_icn} className="w-6 h-6" />
              )}
            </div>
            <button
              id="rules"
              className="bg-nouveau-main bg-opacity-[0.08] h-fit rounded-lg px-6 py-3 text-space-gray font-bold"
            >
              Rules
            </button>
          </div>
        </div> */}
        <div className=" ">
          <OnevsOneGamePlay></OnevsOneGamePlay>
        </div>
      </div>
    </>
  );
}
