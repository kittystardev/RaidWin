import { Box } from "@mui/material";
import React, { useCallback } from "react";
import { useEffect } from "react";
import { useState } from "react";
import eye from "../assets/images/eye.svg";
import NoDataFound from "../assets/images/no-data-found.svg";
import {
  baseUrl,
  compressimagePath,
  getAddress,
  handleImageError,
  imagePath,
  replaceSlug,
} from "../utils/utils";
import { setDataLoaded } from "../store/TempSlice";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { setTopPlayer } from "../store/topplayer";
import DropdownSearch from "./Common/DropdownSearch";
import { fetchPageTitles } from "../store/pageTitleSlice";
import { useMemo } from "react";
import { Helmet } from "react-helmet";

export default function TopPlayers({ setLoading }) {
  const [topPlayers, setTopPlayers] = useState([]);
  const [skip, setSkip] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [check, setCheck] = useState(false);
  const location = useLocation();

  const dispatch = useDispatch();

  const [total, setTotal] = useState(0);
  useEffect(() => {
    (async function () {
      try {
        const resp = await fetch(`${baseUrl}/leaderBoardCount`);
        const total = await resp.json();
        setTotal(total.total);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  const [isAlreadySet, setIsAlreadySet] = useState(false);
  const fetchData = async () => {
    if (isLoading) return;
    try {
      setIsLoading(true);
      const resp = await fetch(
        `${baseUrl}/leaderBoard/${skip}/${
          skip == 0 ? `4` : skip === 4 ? `6` : `10`
        }`
      );
      let data = await resp.json();
      dispatch(setDataLoaded(false));
      // console.log("TopPlayer", data);
      if (!isAlreadySet) {
        dispatch(setTopPlayer(data));
        setIsAlreadySet(true);
      }
      if (topPlayers.length !== 0) {
        setTopPlayers([...topPlayers, ...data]);
      } else if (data.length === 0) {
        setCheck(true);
      } else setTopPlayers(data);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  // console.log("TopPlayer",topPlayers)
  useEffect(() => {
    fetchData();
  }, []);

  const loadMoreData = async () => {
    if (isLoadingMore) return;

    try {
      setIsLoadingMore(true);
      const newSkip = skip === 0 ? 4 : skip === 4 ? 10 : skip + 10;
      setSkip(newSkip);
      const resp = await fetch(
        `${baseUrl}/leaderBoard/${newSkip}/${
          newSkip == 0 ? `4` : newSkip === 4 ? `6` : `10`
        }`
      );
      let data = await resp.json();
      dispatch(setDataLoaded(false));
      // console.log("TopPlayer", data);
      if (!isAlreadySet) {
        dispatch(setTopPlayer(data));
        setIsAlreadySet(true);
      }
      if (topPlayers.length !== 0) setTopPlayers([...topPlayers, ...data]);
      else setTopPlayers(data);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const pageTitles = useSelector((state) => state.pageTitle.entities);
  useEffect(() => {
    dispatch(fetchPageTitles());
  }, [dispatch]);

  const pageTitle = useMemo(() => {
    if (location && pageTitles) {
      const page = pageTitles.find(
        (ele) => ele.page === location.pathname.substring(1)
      );
      return page ? page.title : "RaidWin";
    }
    return "RaidWin";
  }, [pageTitles, location]);

  const SOLPrice = useSelector((state) => state.solanaprice.priceUsdt);

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>
      <div className="justify-between hidden sm:hidden md:flex lg:flex xl:flex 2xl:flex">
        <div className="flex gap-10">
          <div className="text-gray font-black text-2xl tracking-wide flex items-center">
            Top Players
          </div>
          <div className="text-gray">
            <DropdownSearch
              _mostpopuler={false}
              _collection={false}
              _byUsername={true}
              setLoading={setLoading}
            ></DropdownSearch>
          </div>
        </div>
        {/* <div>
          <button className="bg-nouveau-main bg-opacity-8 rounded-lg p-4">
            <FilterAltOutlinedIcon />
          </button>
        </div> */}
      </div>
      <div className="justify-between block sm:block md:hidden lg:hidden xl:hidden 2xl:hidden">
        <div className="flex justify-between">
          <div className="text-gray font-black text-2xl tracking-wide flex items-center">
            Top Players
          </div>
          <div>
            <button className="bg-nouveau-main bg-opacity-8 rounded-lg p-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z"
                />
              </svg>
            </button>
          </div>
        </div>
        <div className="text-gray">
          <form>
            <div className="relative  mt-4 sm:mt-4 md:mt-0 lg:mt-0 xl:mt-0 2xl:mt-0">
              <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
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
              <input
                type="search"
                id="default-search"
                className="block p-2.5 pl-10 w-full sm:w-64 md:w-80 lg:80 xl:80 2xl:80 text-sm text-space-gray bg-background border-b border-nouveau focus:ring-background"
                placeholder="Search people by username ..."
              />
            </div>
          </form>
        </div>
      </div>
      {isLoading ? (
        <div className="mt-8 text-center">
          <span className="w-12 h-12 rounded-full inline-flex items-center justify-center animate-spin">
            <span className="border-4 border-white rounded-full w-12 h-12 animate-prixClipFix"></span>
          </span>
        </div>
      ) : check ? (
        <div className="mt-8 flex flex-col items-center justify-center">
          <img src={NoDataFound} className="h-60 w-60" alt="No data found" />
          <h1 className="text-3xl font-bold mb-4">No Data to Display</h1>
          <p className="text-light-gray">
            There is no data available to show at the moment.
          </p>
        </div>
      ) : (
        <>
          <Box
            sx={{
              display: { xs: "none", sm: "none", md: "none", lg: "block" },
              mt: 4,
            }}
          >
            <div className="table">
              <div className="column">
                <div className=" w-[20%] m-auto table-heading">#</div>
                <div className="m-auto w-full table-heading ">Player</div>
                <div className="m-auto table-heading w-full">Winnings</div>
                <div className="m-auto w-full table-heading text-end">
                  Games Won
                </div>
                <div className="m-auto w-full table-heading text-end">
                  Total
                </div>
                <div className="m-auto table-heading text-end w-2/5">-</div>
              </div>
            </div>

            {topPlayers.map((ele, index) => {
              return (
                <div className="table cursor-default" key={index}>
                  <div className="column hover:bg-yankees-blue hover:rounded-3xl hover:px-3 cursor-default">
                    <div className=" w-[20%] m-auto table-body cursor-default">
                      {index === 0 || index === 1 || index === 2 ? (
                        <>
                          {index === 0 && (
                            <div className="text-white bg-gold rounded-full inline px-[5px] font-bold text-sm tracking-wide">
                              {index + 1}
                            </div>
                          )}

                          {index === 1 && (
                            <div className="text-white bg-silver rounded-full inline px-[5px] font-bold text-sm tracking-wide">
                              {index + 1}
                            </div>
                          )}
                          {index === 2 && (
                            <div className="text-white bg-bronze rounded-full inline px-[5px] font-bold text-sm tracking-wide">
                              {index + 1}
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="text-space-gray  inline px-[5px] font-bold text-sm tracking-wide">
                          {index + 1}
                        </div>
                      )}
                    </div>
                    <div className="m-auto w-full table-body">
                      <Link
                        to={`/${
                          replaceSlug(ele._id[0].userName) || ele._id[0]._id
                        }`}
                        state={{
                          pubKey: ele._id[0]._id,
                        }}
                      >
                        <div className="flex gap-4 cursor-pointer">
                          {ele._id[0].profileImage ? (
                            <div className="overflow-hidden rounded-xl ">
                              <img
                                src={`${imagePath}profile48/${ele._id[0].profileImage}`}
                                onError={handleImageError}
                                className="w-12 h-12 rounded-xl bg-chat-bg bg-opacity-95"
                                alt=""
                              />
                            </div>
                          ) : (
                            <div className="w-12 h-12 rounded-xl bg-chat-bg bg-opacity-95 object-cover"></div>
                          )}

                          <div className="flex items-center text-gray font-bold leading-6">
                            {ele._id[0].userName
                              ? ele._id[0].userName
                              : getAddress(ele._id[0]._id)}
                          </div>
                        </div>
                      </Link>
                    </div>
                    <div className="m-auto w-full table-body cursor-default">
                      <div className="flex gap-2 items-center cursor-default">
                        <div className="flex gap-1 cursor-default">
                          {/* {ele.games.map((game) => {
                        console.log("game", game);
                        return (
                          <img
                            src={`${compressimagePath}${game.games[game]}.png`}
                            className="w-8 h-7 lg:w-9 lg:h-8 mask mask-hexagon-2 mask-repeat"
                          />
                        );
                      })} */}
                          {ele.games[0] && (
                            <img
                              src={`${
                                ele.games[0]._id
                                  ? `${compressimagePath}${ele.games[0]._id}.png`
                                  : ele.games[0].mint_image
                              }`}
                              onError={handleImageError}
                              className="w-8 h-7 lg:w-9 lg:h-8 mask mask-hexagon-2 mask-repeat object-cover"
                              alt=""
                            />
                          )}
                          {ele.games[1] && (
                            <img
                              src={`${
                                ele.games[1]._id
                                  ? `${compressimagePath}${ele.games[1]._id}.png`
                                  : ele.games[1].mint_image
                              }`}
                              onError={handleImageError}
                              className="w-8 h-7 lg:w-9 lg:h-8 mask mask-hexagon-2 mask-repeat object-cover"
                              alt=""
                            />
                          )}
                          {ele.games[2] && (
                            <img
                              src={`${
                                ele.games[2]._id
                                  ? `${compressimagePath}${ele.games[2]._id}.png`
                                  : ele.games[2].mint_image
                              }`}
                              onError={handleImageError}
                              className="w-8 h-7 lg:w-9 lg:h-8 mask mask-hexagon-2 mask-repeat object-cover"
                              alt=""
                            />
                          )}

                          {ele.games[3] && (
                            <img
                              src={`${
                                ele.games[3]._id
                                  ? `${compressimagePath}${ele.games[3]?._id}.png`
                                  : ele.games[3]?.mint_image
                              }`}
                              onError={handleImageError}
                              className="w-8 h-7 lg:w-9 lg:h-8 mask mask-hexagon-2 mask-repeat object-cover"
                              alt=""
                            />
                          )}
                        </div>
                        <div className="text-space-gray">
                          {ele.games.length - 4 > 0 && (
                            <>+ {ele.games.length - 4} NFTs</>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="m-auto w-full table-body text-end cursor-default">
                      <div className="text-space-gray cursor-default">
                        {ele.count}
                      </div>
                    </div>
                    <div className="m-auto w-full table-body text-end cursor-default">
                      <div className="text-space-gray cursor-default">
                        ${" "}
                        {SOLPrice === 0
                          ? "-"
                          : (
                              ele?.floorPrice * SOLPrice.data?.priceUsdt
                            ).toFixed(2)}
                      </div>
                    </div>
                    <Link
                      to={`/${
                        replaceSlug(ele._id[0].userName) || ele._id[0]._id
                      }`}
                      state={{
                        pubKey: ele._id[0]._id,
                      }}
                      className="m-auto w-2/5 table-body flex justify-end cursor-pointer"
                    >
                      <img src={eye} className="cursor-pointer" alt="" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </Box>

          {/* Mobile responsive */}
          {topPlayers.map((ele, index) => {
            return (
              <Box
                sx={{
                  display: {
                    xs: "block",
                    sm: "block",
                    md: "block",
                    lg: "none",
                  },
                  mt: 3,
                }}
                key={index}
              >
                <div className="bg-yankees-blue rounded-3xl ">
                  <div className="px-8">
                    <div className="flex justify-between">
                      <div className="relative">
                        <div>
                          {/* <img
                        src={`${imagePath}${ele._id[0].profileImage}`}
                        className="relative bottom-[6px] w-12 h-12 rounded-xl"
                      /> */}
                          {ele._id[0].profileImage ? (
                            <div className="relative bottom-[6px] w-12 h-12 overflow-hidden rounded-xl bg-white">
                              <img
                                src={`${imagePath}profile48/${ele._id[0].profileImage}`}
                                onError={handleImageError}
                                className=" w-12 h-12 rounded-xl bg-yankees-blue"
                                alt=""
                              />
                            </div>
                          ) : (
                            // <img src={chaticon1} className="w-10 h-10 rounded-xl" />
                            // <div className="custom-character relative bottom-[6px] w-12 h-12 rounded-xl">
                            //   {ele._id[0].userName
                            //     ? ele._id[0].userName[0]
                            //     : ele._id[0]._id[0]}
                            // </div>
                            <div className="w-12 h-12 rounded-xl bg-chat-bg bg-opacity-95 object-cover"></div>
                          )}
                        </div>
                        <div className=" w-[20%] absolute top-[24px] right-[5px]">
                          {index === 0 || index === 1 || index === 2 ? (
                            <>
                              {index === 0 && (
                                <div className="text-white bg-gold rounded-full inline px-[5px] font-bold text-sm tracking-wide">
                                  {index + 1}
                                </div>
                              )}

                              {index === 1 && (
                                <div className="text-white bg-silver rounded-full inline px-[5px] font-bold text-sm tracking-wide">
                                  {index + 1}
                                </div>
                              )}
                              {index === 2 && (
                                <div className="text-white bg-bronze rounded-full inline px-[5px] font-bold text-sm tracking-wide">
                                  {index + 1}
                                </div>
                              )}
                            </>
                          ) : (
                            <div className="text-white bg-yankees-blue rounded-full  inline px-[5px] font-bold text-sm tracking-wide">
                              {index + 1}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <div className="mt-6">
                        <div className="text-gray font-black leading-6 text-sm tracking-wide">
                          {ele._id[0].userName
                            ? ele._id[0].userName
                            : getAddress(ele._id[0]._id)}
                        </div>
                      </div>

                      <div>
                        <div className="font-bold text-xs tracking-wider text-space-gray text-opacity-[0.56] uppercase">
                          Games Won
                        </div>
                        <div className="text-end font-semibold text-sm leading-6 tracking-wide text-gray">
                          {ele.count}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="font-bold text-xs tracking-wider text-space-gray text-opacity-[0.56] uppercase">
                        Winnings:
                      </div>
                      <div className="flex justify-between mt-4">
                        <div className="flex gap-1 ">
                          {ele.games[0] && (
                            <img
                              src={`${
                                ele.games[0]._id
                                  ? `${compressimagePath}${ele.games[0]._id}.png`
                                  : ele.games[0].mint_image
                              }`}
                              onError={handleImageError}
                              className="w-8 h-7 lg:w-9 lg:h-8 mask mask-hexagon-2 mask-repeat object-cover"
                              alt=""
                            />
                          )}
                          {ele.games[1] && (
                            <img
                              src={`${
                                ele.games[1]._id
                                  ? `${compressimagePath}${ele.games[1]._id}.png`
                                  : ele.games[1].mint_image
                              }`}
                              onError={handleImageError}
                              className="w-8 h-7 lg:w-9 lg:h-8 mask mask-hexagon-2 mask-repeat object-cover"
                              alt=""
                            />
                          )}
                          {ele.games[2] && (
                            <img
                              src={`${
                                ele.games[2]._id
                                  ? `${compressimagePath}${ele.games[2]._id}.png`
                                  : ele.games[2].mint_image
                              }`}
                              onError={handleImageError}
                              className="w-8 h-7 lg:w-9 lg:h-8 mask mask-hexagon-2 mask-repeat object-cover"
                              alt=""
                            />
                          )}

                          {ele.games[3] && (
                            <img
                              src={`${
                                ele.games[3]._id
                                  ? `${compressimagePath}${ele.games[3]?._id}.png`
                                  : ele.games[3]?.mint_image
                              }`}
                              onError={handleImageError}
                              className="w-8 h-7 lg:w-9 lg:h-8 mask mask-hexagon-2 mask-repeat object-cover"
                              alt=""
                            />
                          )}
                        </div>

                        <div className="text-end text-space-gray">
                          {ele.games.length - 4 > 0 && (
                            <>+ {ele.games.length - 4} NFTs</>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <Box
                    sx={{
                      backgroundColor: " rgba(39, 49, 75, 0.4)",
                      borderRadius: "0px 0px 24px 24px",
                      backdropFilter: "blur(40px)",
                      px: 3,
                      py: 2,
                      display: "block",
                      mt: 2,
                    }}
                  >
                    <div className="flex justify-between">
                      <div>
                        <div className="text-space-gray font-bold text-xs uppercase text-opacity-[0.64] tracking-wider">
                          TOTAL
                        </div>
                        <div className="text-gray font-black text-2xl tracking-wide mt-1">
                          ${" "}
                          {SOLPrice === 0
                            ? "-"
                            : (
                                ele?.floorPrice * SOLPrice.data?.priceUsdt
                              ).toFixed(2)}
                        </div>
                      </div>
                      <Link
                        className="flex items-center"
                        to={`/${
                          replaceSlug(ele._id[0].userName) || ele._id[0]._id
                        }`}
                        state={{
                          pubKey: ele._id[0]._id,
                        }}
                      >
                        <div>
                          <img src={eye} alt="" />
                        </div>
                      </Link>
                    </div>
                  </Box>
                </div>
              </Box>
            );
          })}
          {isLoadingMore ? (
            <div className="mt-8 text-center">
              <span className="w-12 h-12 rounded-full inline-flex items-center justify-center animate-spin">
                <span className="border-4 border-white rounded-full w-12 h-12 animate-prixClipFix"></span>
              </span>
            </div>
          ) : (
            topPlayers.length < total && (
              <div className="w-full text-center my-10">
                <button
                  className="bg-yankees-blue bg-opacity-50 hover:bg-opacity-100 p-4 rounded-lg text-space-gray font-bold text-base"
                  onClick={loadMoreData}
                >
                  Load More Results
                </button>
              </div>
            )
          )}
        </>
      )}
    </>
  );
}
