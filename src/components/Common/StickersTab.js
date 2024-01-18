import React from "react";
import choms1 from "../../assets/stickers/choms1.svg";
import catnod1 from "../../assets/stickers/catnod1.svg";
import lel1 from "../../assets/stickers/lel1.svg";
import pinkguy1 from "../../assets/stickers/pinkguy1.svg";
import panik1 from "../../assets/stickers/panik1.svg";
import pepehmm1 from "../../assets/stickers/pepehmm1.svg";
import recent from "../../assets/stickers/recent.svg";
import { stickers } from "../../utils/Stickers";

export default function StickersTab({ sendSticker }) {
  return (
    <>
      <div className="p-2 max-h-[367px] overflow-auto">
        <div className="font-bold text-xs tracking-wider text-space-gray pl-2 pt-2">
          Recently used
        </div>
        <div className="mt-4">
          <div className="grid grid-cols-5 gap-2">
            {stickers.slice(0, 3).map((recent, index) => (
              <div>
                <img
                  src={recent}
                  index={index}
                  onClick={() => sendSticker(index)}
                  className="w-14 h-14"
                  alt=""
                />
              </div>
            ))}
          </div>
          <div className="font-bold text-xs tracking-wider text-space-gray pl-2 pt-4">
            Pepe Frog
          </div>
          <div className="grid grid-cols-5 gap-2 mt-4">
            {stickers.map((frog, index) => (
              <div>
                <img
                  src={frog}
                  index={index}
                  onClick={() => sendSticker(index)}
                  className="w-14 h-14"
                  alt=""
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div>
        <div className="stickers-footer">
          <div className="pl-5 py-4 pr-5">
            <div className="flex justify-between">
              <div className="flex gap-3 max-w-[195px] overflow-auto">
                <img src={recent} className="w-6 h-6" alt="" />
                <img src={pepehmm1} className="w-6 h-6" alt="" />
                <img src={choms1} className="w-6 h-6" alt="" />
                <img src={lel1} className="w-6 h-6" alt="" />
                <img src={catnod1} className="w-6 h-6" alt="" />
                <img src={panik1} className="w-6 h-6" alt="" />
                <img src={pinkguy1} className="w-6 h-6" alt="" />
              </div>
              <svg
                className="w-5 h-5 text-space-gray dark:text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
