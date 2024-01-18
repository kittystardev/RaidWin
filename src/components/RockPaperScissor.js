import React, { useEffect, useState } from "react";
import paperscissors from "../assets/images/paperscissors.png";
import rockpolygon from "../assets/images/rockpolygon.svg";
import verified from "../assets/images/verified.svg";
import profilepic1 from "../assets/images/profilepic1.png";
import SVGComponent from "./Common/SVGComponent";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { handleImageError } from "../utils/utils";
import Lottie from "lottie-react";
import animation_optimized from "../json/animation_optimized.json";

import { ReactComponent as Paper } from "../assets/images/paperscissors.svg";

export default function RockPaperScissor() {
  // const [isLoading, setIsLoading] = useState(true);
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setIsLoading(false);
  //   }, 4000);
  //   return () => clearTimeout(timer); // Clean up the timer on component unmount
  // }, []);

  // if (isLoading)
  //   return (
  //     <Lottie
  //       animationData={animation_optimized}
  //       loop={true}
  //       className="flex justify-center items-center h-[50vh] w-full lg:w-1/3 mx-auto"
  //     />
  //   );

  return (
    <div className="block justify-between sm:block md:block lg:flex 2xl:flex">
      <div className="flex min-w-[50%] gap-6">
        <div>
          <div className="flex gap-2">
            <div className="text-gray font-black text-2xl tracking-wide">
              Rock Paper Scissors
            </div>
            <div className="flex items-end text-nouveau-main font-black text-sm leading-6 tracking-wider">
              1/2
            </div>
          </div>
          <div>
            <div className="flex mt-8">
              <div className="min-w-[50%]">
                <div
                  className={`min-w-[50%] bg-background rounded-[40px] shadow-2xl  `}
                >
                  {/* {isLoading ? (
                    <>Loading</>
                  ) : ( */}
                  {/* {!isLoading && ( */}
                  <div className="rock-paper-gradient rounded-3xl max-h-[376px]">
                    <Paper />
                    <div className="">
                      <div className="bg-chat-body-rgb bg-opacity-[0.32] h-20 sm:h-24 md:h-24 rounded-2xl w-4/5 mx-auto bottom-[-50px] flex justify-between">
                        <div className="cursor-pointer">
                          <SVGComponent className="relative right-[20px] bottom-[10px] w-24 sm:w-24 md:w-28 h-24 sm:h-24 md:h-28   " />
                        </div>
                        <div className="flex items-center font-normal text-[40px] leading-9 text-gray">
                          VS
                        </div>
                        <div className="relative cursor-pointer ">
                          <LazyLoadImage
                            src={profilepic1}
                            alt="profilepic1"
                            className=" relative left-[18px] top-[-8px] w-24 sm:w-24 md:w-28 h-24 sm:h-24 md:h-28  mask mask-hexagon-2 mask-repeat object-cover"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* )} */}
                  {/* )} */}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-28">
            <div className="text-gray text-sm leading-6 font-black tracking-wide">
              How It Works
            </div>
            <div className="text-space-gray font-semibold text-sm leading-6 tracking-wide mt-1">
              Rock beats Scissors; Paper beats Rock; Scissors beats Paper
            </div>
          </div>
        </div>
      </div>
      <div className="min-w-[50%]">
        <div className="flex gap-4 justify-between sm:justify-between md:justify-between lg:justify-end 2xl:justify-end  mt-10 sm:mt-10 md:mt-10 lg:mt-0 2xl:mt-0">
          <button className="bg-nouveau-main bg-opacity-[0.08] rounded-lg px-6 py-3 text-space-gray font-bold">
            Previous Rounds
          </button>
          <button className="bg-nouveau-main bg-opacity-[0.08] rounded-lg px-6 py-3 text-space-gray font-bold">
            Rules
          </button>
        </div>
        {/* {!isLoading && ( */}
          <div className="mt-8 ml-0 sm:ml-0 md:ml-0 lg:ml-6">
            {/* <div className='bg-yankees-blue p-8 rounded-3xl '>
                        <div className='flex gap-3 items-center'>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-space-gray-rgb" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <div className='text-gray font-black text-xl not-italic tracking-wide'>
                                Crypto Punks
                            </div>
                        </div>
                        <div className='mt-4 relative'>
                            <div className='flex gap-3 '>
                                <div className='h-12 w-12'>
                                    <div className='h-20 w-40 sm:w-40 md:w-20 lg:w-40 xl:w-24'>
                                        <img src={profilepic1} className='rounded-xl' />
                                    </div>
                                </div>
                                <div className='text-space-gray tracking-wide font-semibold leading-6 text-sm'>
                                    10,000 unique collectible characters with proof of ownership stored on the Ethereum blockchain. The ...
                                </div>
                            </div>
                        </div>
                    </div> */}
            <div className="bg-yankees-blue p-8 rounded-3xl">
              <div className="flex gap-3 items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-space-gray-rgb"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <div className="text-gray font-black text-xl not-italic tracking-wide">
                  Crypto Punks
                </div>
                <img src={verified} className="w-5 h-5" />
              </div>
              <div className="mt-4 relative">
                <div className="flex gap-3 ">
                  <div className="h-20 w-40 sm:w-40 md:w-20 lg:w-40 xl:w-24">
                    <img src={profilepic1} className="rounded-xl" />
                  </div>
                  <div className="text-space-gray tracking-wide font-semibold leading-6 text-sm">
                    10,000 unique collectible characters with proof of ownership
                    stored on the Ethereum blockchain. The ...
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-8">
              <div className="flex justify-between text-space-gray uppercase text-xs tracking-wider text-opacity-[0.56] font-bold">
                <div>PLAYER</div>
                <div>NFT</div>
              </div>
              <div className="flex justify-between text-space-gray text-sm leading-6 font-semibold tracking-wide mt-8">
                <div className="flex gap-4">
                  <div className="w-14 h-14">
                    <img src={profilepic1} className="rounded-xl" />
                  </div>
                  <div className="flex items-center">14tb ... f312sd</div>
                </div>
                <div className="flex items-center">MoonBird Bro #156</div>
              </div>
            </div>
          </div>
        {/* )} */}
      </div>
    </div>
  );
}
