import React, { useEffect, useState } from "react";
import { useLocation, useParams, useSearchParams } from "react-router-dom";
import hero1 from "../assets/images/hero1.svg";
import hero2 from "../assets/images/hero2.svg";
import hero3 from "../assets/images/hero3.svg";
import shiledcorrect from "../assets/images/shiledcorrect.svg";
import percentage from "../assets/images/percentage.svg";
import decentraland_seq from "../assets/images/decentraland_seq.svg";
import leaderboard_blue from "../assets/images/leaderboard_blue.svg";
import leaderstar_blue from "../assets/images/leaderstar_blue.svg";
import winner_stand from "../assets/images/winner_stand.svg";
import gold_star from "../assets/images/gold_star.svg";
import silver_star from "../assets/images/silver_star.svg";
import bronze_star from "../assets/images/bronze_star.svg";
import leaderstar_pink from "../assets/images/leaderstar_pink.svg";
import winner1 from "../assets/images/winner1.svg";
import winner2 from "../assets/images/winner2.svg";
import winner3 from "../assets/images/winner3.svg";
import winners from "../assets/images/winners.svg";
import leaderboard_mobile from "../assets/images/leaderboard_mobile.svg";
import { Desktop } from "./Media";
import CollectionDetails from "./CollectionDetails";
import { Box } from "@mui/system";
import SideBar from "./Common/SideBar";
import { Link } from "react-router-dom";

export default function HeroSection() {
  const [searchParams] = useSearchParams();
  // let { collectionMint } = useParams();
  let collectionMint = searchParams.get("collectionId");
  const location = useLocation();
  // console.log(`${location.pathname}`)
  const isGame = location.pathname.split("/").length == 3;
  console.log("locationPath", location.pathname)
  return (
    <>
      {/* <SideBar></SideBar> */}
      {location.pathname == "/winner" ||
      location.pathname == `/games` ||
      isGame ||
      location.pathname === "/leaderboard" ? (
        ""
      ) : (
        <>
          {location.pathname !== "/" && (
            <>
              <div className="w-[35%] ml-auto sm:ml-11 md:ml-16 lg:ml-[424px] xl:ml-[558px] 2xl:ml-auto mr-2 px-0 sm:px-6 sm:pl-0 lg:px-0 lg:pr-52 max-w-[100%]">
                <div className="hidden xl:flex gap-10 py-4 px-8 header-fair-gradient tracking-wide font-bold text-space-gray rounded-[63px] absolute top-[21px] ">
                  <div className="flex items-center gap-4 text-xs uppercase">
                    <img src={shiledcorrect} className="w-5 h-5" />
                    THIS GAME IS PROVABLY fair
                  </div>
                  <div className="flex items-center text-sm text-light-blue">
                    Verify Fairness
                  </div>
                </div>
              </div>
            </>
          )}

          <div className=" bg-yankees-blue rounded-3xl block lg:flex xl:flex 2xl:flex py-8 px-8 min-h-[224px] text-gray justify-center sm:justify-between relative overflow-hidden herosection-width">
            <div className="flex md:mt-[10px] ">
              <div>
                <div className="h-20 mb-4 ">
                  <img src={percentage} />
                </div>

                <div className="z-10 text-2xl font-extrabold sm:text-4xl">
                  Playing Fee
                </div>
              </div>
              <div className="from-cyan-500 to-blue-500"></div>
              <div className="relative flex items-center justify-center mt-10 xl:hidden 2xl:hidden lg:mt-0 xl:mt-0 2xl:mt-0">
                <div className="relative">
                  <div className="absolute top-0 bg-image-gradient-top w-36 h-16 blur-[80px] opacity-80"></div>
                  <img
                    src={hero2}
                    className="relative left-[14px] bottom-[16px] "
                  />

                  <div className="absolute bottom-0 right-0 bg-image-gradient-bottom w-36 h-16 blur-[80px] opacity-80"></div>
                </div>
              </div>
            </div>

            <div className="relative hidden xl:flex 2xl:flex items-center mt-10 lg:mt-0 2xl:mt-0 max-h-40 -ml-[45px]">
              <Desktop>
                <img src={hero1} className="relative right-2" />
                <div className="absolute top-0 left-20 bg-image-gradient-top w-36 h-16 blur-[80px] opacity-80 overflow-hidden"></div>
                <img src={hero2} className="absolute left-20" />
                <img src={hero3} className="relative right-8" />
                <div className="absolute bottom-0 right-8 bg-image-gradient-bottom w-36 h-16 blur-[80px] opacity-80 "></div>
              </Desktop>
            </div>

            <div className="relative flex flex-col text-left lg:text-right 2xl:text-right mt-11 lg:mt-0 xl:mt-0 2xl:mt-0">
              <div className="text-xl font-black tracking-wide sm:text-2xl md:text-2xl lg:text-2xl 2xl:text-2xl">
                Utilize Your SOL NFTs
              </div>
              <div className="pt-2 text-base font-black leading-8 tracking-wider text-space-gray">
                PLAY WITH THEM TO WIN OTHER NFTS
              </div>
              <div className="grow"></div>
              <div className="relative">
                <button className="bottom-0 right-0 px-6 py-3 font-bold rounded-lg bg-blue-chaos text-blue hover:bg-lighter-blue hover:text-yankees-blue">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {location.pathname == `/games` && (
        <>{/* <CollectionDetails></CollectionDetails> */}</>
      )}

      {location.pathname == "/leaderboard" && (
        <>
          <div>
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
              <div className=" pl-[48px]">
                <div className="mt-[61px] font-extrabold text-[56px] tracking-tight leading-[71px] text-gray">
                  LeaderBoard
                </div>
                <div className="mt-1 text-sm font-black leading-6 tracking-wider text-space-gray">
                  Top Players
                </div>
              </div>
              <div>
                <img
                  src={leaderboard_blue}
                  className="absolute right-[0px] rounded-3xl height-leaderboard-image"
                />
              </div>
              <div>
                <img src={leaderstar_blue} />
              </div>
              <div>
                <img src={winner_stand} className="absolute right-[124px]" />
              </div>
              <div>
                <img
                  src={winner1}
                  className="w-[80px] h-[80px]  hex-green-border rounded-xl absolute top-[26px] right-[308px]"
                />
              </div>
              <div>
                <img
                  src={gold_star}
                  className="absolute top-[60px] right-[309px]"
                />
              </div>
              <div>
                <img
                  src={winner2}
                  className="w-[80px] h-[80px]  hex-green-border rounded-xl absolute top-[88px] right-[458px]"
                />
              </div>
              <div>
                <img
                  src={silver_star}
                  className="absolute top-[123px] right-[429px]"
                />
              </div>
              <div>
                <img
                  src={winner3}
                  className="w-[80px] h-[80px]  hex-green-border rounded-xl absolute top-[111px] right-[170px] "
                />
              </div>
              <div>
                <img
                  src={bronze_star}
                  className="absolute top-[146px] right-[187px]"
                />
              </div>
              <div>
                <img src={leaderstar_pink} className="absolute right-0" />
              </div>
            </Box>
            <Box
              sx={{
                display: { xs: "block", sm: "block", md: "block", lg: "none" },
                backgroundColor: "#1C2438",
                borderRadius: "42px",
                color: "#D6DCEC",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* <div className='relative'>
                                <div className='absolute w-full'>
                                    <div className='absolute w-full'>
                                        <img src={leaderboard_mobile} className='object-cover w-full' />
                                    </div>
                                    <div className='text-center font-extrabold text-[36px] absolute  leading-[48px] text-gray pt-12'>
                                        LeaderBoard
                                    </div>
                                    <div className='mt-1 text-sm font-black leading-6 tracking-wider text-center uppercase text-space-gray'>
                                        Top Players
                                    </div>
                                    <div className='relative'>
                                        <div>
                                            <img src={winner_stand} className='m-auto ' />
                                        </div>
                                        <div className=''>
                                            <img src={gold_star} className='' />
                                        </div>
                                    </div>

                                    <div>
                                        <img src={CryptoPunk5} className='w-[80px] h-[80px]  hex-green-border rounded-xl absolute top-[26px] right-[308px]' />
                                    </div>
                                </div>
                            </div> */}

              {/* <div>   
                                <img src={leaderboard_mobile} className='absolute w-full rounded-3xl' />
                            </div>
                            <div className='text-center font-extrabold text-[36px] absolute  leading-[48px] text-gray pt-12'>
                                LeaderBoard
                            </div>
                            <div className='mt-1 text-sm font-black leading-6 tracking-wider text-center uppercase text-space-gray'>
                                Top Players
                            </div>
                            <div>
                                <img src={winner_stand} className='absolute' />
                            </div>
                            <div>
                                <img src={CryptoPunk5} className='w-[80px] h-[80px]  hex-green-border rounded-xl absolute top-[26px] right-[308px]' />
                            </div>
                            <div>
                                <img src={gold_star} className='absolute top-[60px] right-[309px]' />
                            </div>
                            <div>
                                <img src={CryptoPunk5} className='w-[80px] h-[80px]  hex-green-border rounded-xl absolute top-[88px] right-[458px] -rotate-[25deg]' />
                            </div>
                            <div>
                                <img src={silver_star} className='absolute top-[123px] right-[429px]' />
                            </div>
                            <div>
                                <img src={CryptoPunk5} className='w-[80px] h-[80px]  hex-green-border rounded-xl absolute top-[111px] right-[170px] rotate-[25deg]' />
                            </div>
                            <div>
                                <img src={bronze_star} className='absolute top-[146px] right-[187px]' />
                            </div> */}

              <div className="leaderboard_mobile">
                {/* <img src={leaderboard_mobile} className='object-cover w-full max-h-[300px]' /> */}
                <div className="text-center font-extrabold text-[36px] leading-[48px] text-gray pt-5">
                  LeaderBoard
                </div>
                <div className="text-sm font-black leading-6 tracking-wider text-center uppercase text-space-gray">
                  Top Players
                </div>
                <div className="flex justify-center">
                  <img src={winners} className="absolute -bottom-[30px]" />
                </div>
                {/* <div className='relative'>
                                    <img src={winner_stand} className='' />
                                    <div>
                                        <img src={CryptoPunk5} className='w-[80px] h-[80px]  hex-green-border rounded-xl' />
                                    </div>
                                    <div>
                                        <img src={gold_star} className='' />
                                    </div>
                                </div> */}
              </div>
            </Box>
          </div>
        </>
      )}
    </>
  );
}
