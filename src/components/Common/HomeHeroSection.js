import React, { memo } from "react";
import percentage from "../../assets/images/percentage.svg";
import hero2 from "../../assets/images/hero2.svg";
import hero1 from "../../assets/images/hero1.svg";
import hero3 from "../../assets/images/hero3.svg";

import { Desktop } from "../Media";

function HomeHeroSection() {
  // console.log("HomeHeroSection");
  return (
    <>
      {/* <VerifiedSection /> */}
      <div className="mb-8">
        <div className=" bg-yankees-blue rounded-3xl block lg:flex xl:flex 2xl:flex py-8 px-8 min-h-[224px] text-gray justify-center sm:justify-between relative overflow-hidden herosection-width">
          <div className="flex md:mt-[10px] ">
            <div>
              <div className=" h-20 mb-4">
                <img src={percentage} alt="" />
              </div>

              <div className=" text-2xl sm:text-4xl z-10 font-extrabold">
                Playing Fee
              </div>
            </div>
            <div className="from-cyan-500 to-blue-500"></div>
            <div className="relative flex items-center xl:hidden 2xl:hidden  mt-10 lg:mt-0 xl:mt-0 2xl:mt-0 justify-center">
              <div className="relative">
                <div className="absolute top-0 bg-image-gradient-top w-36 h-16 blur-[80px] opacity-80"></div>
                <img
                  src={hero2}
                  className="relative left-[14px] bottom-[16px] "
                  alt=""
                />

                <div className="absolute bottom-0 right-0 bg-image-gradient-bottom w-36 h-16 blur-[80px] opacity-80"></div>
              </div>
            </div>
          </div>

          <div className="relative hidden xl:flex 2xl:flex items-center mt-10 lg:mt-0 2xl:mt-0 max-h-40 -ml-[45px]">
            <Desktop>
              <img src={hero1} className="relative right-2" alt="" />
              <div className="absolute top-0 left-20 bg-image-gradient-top w-36 h-16 blur-[80px] opacity-80 overflow-hidden"></div>
              <img src={hero2} className="absolute left-20" alt="" />
              <img src={hero3} className="relative right-8" alt="" />
              <div className="absolute bottom-0 right-8 bg-image-gradient-bottom w-36 h-16 blur-[80px] opacity-80 "></div>
            </Desktop>
          </div>

          <div className="text-left  lg:text-right 2xl:text-right relative flex flex-col mt-11 lg:mt-0 xl:mt-0 2xl:mt-0">
            <div className="text-xl sm:text-2xl md:text-2xl lg:text-2xl 2xl:text-2xl font-black tracking-wide capitalize">
              Play & Win
            </div>
            <div className="text-base text-space-gray font-black tracking-wider leading-8 pt-2 uppercase lg:w-[372px] ">
              WITH YOUR DIGITAL COLLECTIBLES
            </div>
            <div className="grow"></div>
            <div className="relative">
              <button className="bg-blue-chaos text-blue hover:bg-lighter-blue hover:text-yankees-blue rounded-lg px-6 py-3 bottom-0 right-0 font-bold">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default memo(HomeHeroSection);
