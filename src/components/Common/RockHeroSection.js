import { Box } from "@mui/material";
import React from "react";
import rockpaperhero from "../../assets/images/rockpaperhero.png";
import rockpapermobile from "../../assets/images/rockpapermobile.png";

export default function RockHeroSection() {
  return (
    <div className="mb-8">
      <Box
        sx={{
          display: { xs: "none", sm: "none", md: "flex", lg: "flex" },
          backgroundColor: "#1C2438",
          borderRadius: "24px",
          minHeight: "224px",
          color: "#D6DCEC",
          position: "relative",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        <div className="block sm:block md:block lg:flex justify-between h-full relative w-1/2">
          <div className="h-full flex">
            <div className="pl-8 flex items-center">
              <div className="">
                <div className="font-extrabold text-[56px] tracking-tight leading-[64px] text-gray capitalize">
                  Rock Paper Scissors
                </div>
              </div>
            </div>
          </div>
          <div className="relative"></div>
        </div>
        <div>
          <img
            src={rockpaperhero}
            className="absolute top-[-137px] right-[-118px] w-[772px]"
            alt=""
          />
        </div>
      </Box>
      <Box
        sx={{
          display: { xs: "block", sm: "block", md: "none", lg: "none" },
          backgroundColor: "#1C2438",
          borderRadius: "24px",
          minHeight: "224px",
          color: "#D6DCEC",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div className="font-extrabold text-[36px] tracking-tight leading-[48px] text-gray capitalize text-center mt-8">
          Rock Paper Scissors
        </div>

        {/* <div className='relative'> */}
        <div>
          <img
            src={rockpapermobile}
            className="mx-auto sm:h-[250px] md:h-[250px]"
            alt=""
          />
        </div>
        {/* </div> */}
      </Box>
    </div>
  );
}
