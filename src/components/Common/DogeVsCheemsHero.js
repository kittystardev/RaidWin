import React from "react";
import dogevscheemsbanner from "../../assets/images/dogevscheemsbanner.png";
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
              <div className="relative  w-[65%] ">
                <img src={dogevscheemsbanner} className="h-64 mx-auto" alt="" />
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
                <img src={dogevscheemsbanner} className="h-40 mx-auto" alt="" />
              </div>
            </div>
          </div>
        </Box>
      </div>
    </>
  );
}
