import React from "react";
import winner_text from "../../assets/images/winner_text.png";
import gold_star from "../../assets/images/gold_star.svg";
import hexagon from "../../assets/images/hexagon.svg";
import winner_text_mobile from "../../assets/images/winner_text_mobile.svg";
import { Box } from "@mui/system";
import VerifiedSection from "./VerifiedSection";

export default function WinnerHeroSection({ title, subTitle }) {
  return (
    <>
      <VerifiedSection />
      <div className="mb-8">
        <Box
          sx={{
            display: { xs: "none", sm: "none", md: "none", lg: "flex" },
            backgroundColor: "#1C2438",
            borderRadius: "24px",
            minHeight: "224px",
            color: "#D6DCEC",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div className="winner-section">
            <div className="relative justify-between block h-full sm:block md:block lg:flex">
              <div className="w-[35%] h-full flex">
                <div className="flex items-center pl-8">
                  <div className="">
                    <div className="font-extrabold text-[36px] tracking-tight leading-[48px] text-gray capitalize">
                      {title}
                    </div>
                    <div className="mt-1 text-sm font-black leading-6 tracking-wider uppercase text-space-gray">
                      {subTitle}
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative  ">
                <img
                  src={hexagon}
                  className="absolute top-[3px] right-[70px]"
                  alt=""
                />
                <img
                  src={winner_text}
                  className="relative right-[85px] top-[28px]"
                  alt=""
                />
                <img
                  src={gold_star}
                  className="absolute top-[90px] right-[258px]"
                  alt=""
                />
                {/* <img src={dogevscheemsbanner} className="h-64 mx-auto" /> */}
              </div>
            </div>
          </div>
        </Box>
        <Box
          sx={{
            display: { xs: "block", sm: "block", md: "block", lg: "none" },
            backgroundColor: "#1C2438",
            borderRadius: "24px",
            minHeight: "224px",
            color: "#D6DCEC",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div className="winner-gradient">
            <div className="winner-section-mobile">
              <div className="winner_hero_txt font-extrabold text-[36px] tracking-tight leading-[48px] text-gray capitalize text-center mt-8 m-3">
                {title}
              </div>
              <div className="mt-1 text-sm font-black leading-6 tracking-wider text-center uppercase text-space-gray">
                {subTitle}
              </div>
              <div className="relative">
                <img src={winner_text_mobile} className="mx-auto" alt="" />
                {/* <img src={dogevscheemsbanner} className="h-40 mx-auto" /> */}

                {/* <img src={winner_text} className='absolute right-[85px] top-[28px]' />
                    <img src={gold_star} className='absolute top-[90px] right-[258px]' /> */}
              </div>
            </div>
          </div>
        </Box>
      </div>
    </>
  );
}
