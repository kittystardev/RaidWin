import React, { useState } from "react";
import stream_image from "../assets/images/stream_image.svg";
import chaticon1 from "../assets/images/chaticon1.svg";
import chaticon3 from "../assets/images/chaticon3.svg";
import twitch from "../assets/images/twitch.svg";
import youtube from "../assets/images/youtube.svg";
import { Link } from "react-router-dom";
import VideoPlayerModal from "./modals/VideoPlayerModal";
import { stepClasses } from "@mui/material";
// import ReactPlayer from "react-player";

export default function StreamCard() {
  const streams = [
    {
      description:
        "Streamers who lost all their money live - Gambling Compilation",
      avatar: chaticon1,
      CreatedUser: "54sHs ... Ftee",
      platform: youtube,
      link: "https://www.youtube.com/embed/uocETPj4Jx4",
    },
    {
      description:
        "SLOTS LIVE 🔴 BIG WINS & BONUS BUYS at SOL - STREAM with mrBigSpin!",
      avatar: chaticon3,
      CreatedUser: "Elonmusk69",
      platform: twitch,
      link: "https://kick.com/jaidefinichon?clip=clip_01H6W3E0ZDGRXNDWW0FHTKV7RZ",
    },
  ];

  return (
    <>
      {streams.map((stream, index) => (
        <div className="bg-yankees-blue rounded-3xl flex flex-col" key={index}>
          {/* <a href={`${stream.link}`} target="_blank">
            <div className=" flex justify-center items-center rounded-t-3xl overflow-hidden cursor-pointer relative">
              <img
                src={stream.thumbnailImage}
                className="rounded-t-3xl w-full bg-no-repeat bg-contain"
                style={{ aspectRatio: "16/9" }}
              />
              {stream.TotlaTime && (
                <div className="absolute bg-black py-1 px-2 text-white rounded-lg bg-opacity-80 text-base bottom-[2px] right-[8px]">
                  {stream.TotlaTime}
                </div>
              )}

              {stream.LiveWatching && (
                <div className="absolute bg-black py-1 px-2 text-white rounded-lg bg-opacity-80 text-base bottom-[2px] left-[8px]">
                  {stream.LiveWatching}
                </div>
              )}
              {stream.LiveTag && (
                <div className="absolute bg-red-dark font-bold uppercase py-1 px-2 text-white rounded-lg text-base top-[8px] left-[8px]">
                  {stream.LiveTag}
                </div>
              )}
            </div>
          </a> */}
          {/* <ReactPlayer url="https://www.twitch.tv/videos/457018078" controls /> */}
          {/* {stream.platform === youtube ? ( */}
          <a>
            <iframe
              className="w-full aspect-video h-full rounded-t-3xl"
              src={stream.link}
            ></iframe>
          </a>
          {/* ) : (
             <img src={stream.link} onClick={() => setIsOpen(true)} />
           )} */}

          <div className="p-8">
            <div className="text-xl leading-8 text-gray tracking-wide break-words stream-description-2">
              {stream.description}
            </div>
            <div className="mt-2 flex justify-between items-center">
              <div className="flex gap-3 capitalize text-space-gray text-opacity-80 tracking-wide font-semibold text-sm leading-8">
                <div className="created-by">Created By:</div>
                <div>
                  <img src={stream.avatar} className="w-8 h-8 rounded-xl" />
                </div>
                <div>{stream.CreatedUser}</div>
              </div>
              <div>
                <img src={stream.platform} className="w-6 h-5" />
              </div>
            </div>
          </div>
        </div>
      ))}
      {/* <VideoPlayerModal isOpen={isOpen} closeModal={() => setIsOpen(false)} /> */}
    </>
  );
}
