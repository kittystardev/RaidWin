import React, { useEffect, useState } from "react";
import winners_medal from "../assets/images/winners_medal.png";
import quemark from "../assets/images/quemark.png";
import cheems_bonk from "../assets/images/cheems_bonk.png";
import Animate from "react-smooth";
import {
  Link,
  useNavigate,
  useParams,
  useHistory,
  useSearchParams,
  useNavigation,
} from "react-router-dom";
import { baseUrl, getCollectionMint } from "../utils/utils";
import { memo } from "react";
import { Tooltip } from "@mui/material";
import { fetchCollections } from "../store/collectionSlice";
import { useDispatch, useSelector } from "react-redux";

function GamesSection({ collectionMint, title, gameState }) {
  const [searchParams] = useSearchParams();
  // let { collectionMint } = useParams();
  // let collectionMint = searchParams.get("collectionId");
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { collections } = useSelector((state) => state.collections);

  // useEffect(() => {
  //   dispatch(fetchCollections());
  // }, []);

  // console.log("collectionskjghakjhdfjsaklfkasf", gameState)

  const PlayGame = async (game) => {
    try {
      if (collectionMint && collectionMint !== "") {
        let gameMint = getCollectionMint(
          gameState.gamesState,
          game === "dogevscheems" ? true : false
        );
        // debugger;
        // console.log("gameMint",gameMint)
        const resp = await fetch(
          `${baseUrl}/gameState/${gameMint}/2/${game === "dogevscheems" ? true : false}`
        );
        const obj = await resp.json();
        console.log("obj", obj);
        if (obj.msg === "created") {
          navigate(`/${game}/${title}?gameId=${obj.data.account}`);
        } else if (obj.msg === "creating") {
          this();
        }
      } else {
        navigate(`${game === "dogevscheems" ? "dogevscheems" : "winnertakesall"}`);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className="mt-10">
        <div className="xs:gap-4 gap-2 flex flex-wrap xl:[&>div]:min-w-[0] [&>div]:min-w-[calc(50%-16px)] ">
          <Animate to="1" from="0" attributeName="opacity" easing="ease-in" duration={100}>
            <div className="flex-1 cursor-pointer" onClick={() => PlayGame("winnertakesall")}>
              <div className="rounded-3xl winners flex justify-between aspect-square">
                <div className="flex flex-col justify-between">
                  <div className="xl:lg:xs:text-xl lg:xs:text-3xl xs:text-xl text-base font-extrabold tracking-wide uppercase sm:pl-9 pl-4 pt-9 text-gray">
                    Winner <br />
                    Take all
                  </div>
                  <div className="pt-5 xs:mb-8 mb-6 sm:pl-9 pl-4 ">
                    <button className="xs:px-4 px-2 xs:py-2 py-1 xs:text-sm text-xs font-bold leading-6 uppercase rounded-lg bg-light-green hover:bg-hover-light-green text-yankees-blue no-wrap">
                      Play Now
                    </button>
                  </div>
                </div>
                <div className="pt-4">
                  <img src={winners_medal} alt="winners" />
                </div>
              </div>
              <div className="flex justify-between mt-2">
                <div className="text-sm font-semibold leading-6 tracking-wide capitalize text-space-gray">
                  Winner takes all
                </div>
                <Tooltip
                  title="6 Players, 1 winner, Winner Takes All !"
                  className="hover:cursor-pointer"
                  enterTouchDelay={0}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="#6A707F"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                    />
                  </svg>
                </Tooltip>
              </div>
            </div>
          </Animate>
          <Animate to="1" from="0" attributeName="opacity" easing="ease-in" duration={100}>
            <div className="flex-1 cursor-pointer" onClick={() => PlayGame("dogevscheems")}>
              <div className="rounded-3xl rocks flex justify-between overflow-hidden aspect-square">
                <div className="flex flex-col justify-between">
                  <div className="xl:lg:xs:text-xl lg:xs:text-3xl xs:text-xl text-base font-extrabold tracking-wide uppercase sm:pl-9 pl-4 pt-9 text-gray">
                    Doge vs. <br />
                    cheems
                  </div>
                  <div className="pt-5 mb-8 sm:pl-9 pl-4 ">
                    <button className="xs:px-4 px-2 xs:py-2 py-1 xs:text-sm text-xs font-bold leading-6 uppercase rounded-lg bg-light-green hover:bg-hover-light-green text-yankees-blue no-wrap">
                      Play Now
                    </button>
                  </div>
                </div>
                <div className="flex items-end justify-center pt-4">
                  <img src={cheems_bonk} alt="winners" className="w-full md:w-96 xl:w-full" />
                </div>
              </div>
              <div className="flex justify-between mt-2">
                <div className="text-sm font-semibold leading-6 tracking-wide capitalize text-space-gray">
                  Doge Vs. Cheems
                </div>
                <Tooltip
                  title="2 players , 1v1 heads-up game"
                  className="hover:cursor-pointer"
                  enterTouchDelay={0}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="#6A707F"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                    />
                  </svg>
                </Tooltip>
              </div>
            </div>
          </Animate>
          <Animate to="1" from="0" attributeName="opacity" easing="ease-in" duration={100}>
            <div className="flex-1 mt-5 sm:mt-4 md:mt-3 lg:mt-2 xl:mt-0 gap-4">
              <div className="rounded-3xl coin-flip relative aspect-square">
                <div className="absolute w-full h-full left-0 top-0 flex justify-center items-center">
                  <img src={quemark} alt="question mark" className="xl:scale-100 scale-75" />
                </div>
                <div className="absolute w-full h-full left-0 top-0 flex justify-center items-center px-6">
                  <div className="xs:text-2xl text-xl font-extrabold tracking-wide uppercase text-gray text-center">
                    Coming Soon...
                  </div>
                </div>
              </div>
              <div className="flex justify-between mt-2">
                <div className="text-sm font-semibold leading-6 tracking-wide capitalize text-space-gray">
                  Coin Flip
                </div>
                <Tooltip title="Coming Soon !" className="hover:cursor-pointer" enterTouchDelay={0}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="#6A707F"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                    />
                  </svg>
                </Tooltip>
              </div>
            </div>
          </Animate>
          <Animate to="1" from="0" attributeName="opacity" easing="ease-in" duration={100}>
            <div className="flex-1 mt-5 sm:mt-4 md:mt-3 lg:mt-2 xl:mt-0 gap-4">
              <div className="rounded-3xl coin-flip relative aspect-square ">
                <div className="absolute w-full h-full left-0 top-0 flex justify-center items-center">
                  <img src={quemark} alt="question mark" className="xs:scale-100 scale-75" />
                </div>
                <div className="absolute w-full h-full left-0 top-0 flex justify-center items-center px-6">
                  <div className="xs:text-2xl text-xl font-extrabold tracking-wide uppercase text-gray text-center">
                    Coming Soon...
                  </div>
                </div>
              </div>
              <div className="flex justify-between mt-2">
                <div className="text-sm font-semibold leading-6 tracking-wide capitalize text-space-gray">
                  Coming Soon
                </div>
                <Tooltip title="Coming Soon !" className="hover:cursor-pointer" enterTouchDelay={0}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="#6A707F"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                    />
                  </svg>
                </Tooltip>
              </div>
            </div>
          </Animate>
        </div>
      </div>
    </>
  );
}
export default memo(GamesSection);
