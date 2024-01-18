import { Box } from "@mui/material";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import eye from "../assets/images/eye.svg";
import NoDataFound from "../assets/images/no-data-found.svg";
import {
  baseUrl,
  compressimagePath,
  DummyPubKey,
  getAddress,
  handleImageError,
  imagePath,
  replaceSlug,
  socket,
} from "../utils/utils";
import InfoModal from "./modals/InfoModal";
import { useDispatch, useSelector } from "react-redux";
import { setDataLoaded } from "../store/TempSlice";
import { List } from "@mui/material";
import { CSSTransition, TransitionGroup } from "react-transition-group";
// import Compressor from "compressorjs";
import { type } from "@testing-library/user-event/dist/type";

export default function LastPlayedTable({ url, countUrl }) {
  // console.log("urls", url);
  const [lastPlayed, setLastPlayed] = useState([]);
  // const [allRecord, setAllRecord] = useState([])
  const [skip, setSkip] = React.useState(0);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const ConnectModal = () => setOpen(true);
  const CloseModal = () => setOpen(false);
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  // console.log("lastPlayed", lastPlayed);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    (async function () {
      try {
        const resp = await fetch(`${countUrl}`);
        const { total } = (await resp.json())[0];
        setTotal(total);
        // console.log("total", total);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  const fetchData = async () => {
    if (isLoading) return;
    try {
      setIsLoading(true);
      const resp = await fetch(
        `${url}/${skip}/${skip == 0 ? `4` : skip === 4 ? `6` : `10`}`
      );
      let data = await resp.json();
      // console.log("Fetchdata", data);
      dispatch(setDataLoaded(false));
      if (lastPlayed.length != 0) setLastPlayed([...lastPlayed, ...data]);
      else setLastPlayed(data);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMoreData = async () => {
    if (isLoadingMore) return;
    try {
      setIsLoadingMore(true);
      const newSkip = skip === 0 ? 4 : skip === 4 ? 10 : skip + 10;
      setSkip(newSkip);
      const resp = await fetch(
        `${url}/${newSkip}/${newSkip == 0 ? `4` : newSkip === 4 ? `6` : `10`}`
      );
      let data = await resp.json();
      // console.log("Fetchdata", data);
      dispatch(setDataLoaded(false));
      if (lastPlayed.length != 0) setLastPlayed([...lastPlayed, ...data]);
      else setLastPlayed(data);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // console.log("lastPlayedddd", lastPlayed);
  useEffect(() => {
    socket.on("NewLastPlayed", async (newData) => {
      console.log("newData", newData);
      additm(newData[0]);
    });
    socket.emit("JoinLastPlayed");
    return () => {
      socket.off("JoinLastPlayed");
    };
  }, [lastPlayed]);

  useEffect(() => {
    fetchData();
  }, [url]);
  const location = useLocation();

  const additm = (newData) => {
    console.log("lastPlayed", lastPlayed);
    const _lastPlayed = [newData, ...lastPlayed.slice(0, -1)];
    console.log("_lastPlayed", _lastPlayed);
    setLastPlayed(_lastPlayed);
  };
  const SOLPrice = useSelector((state) => state.solanaprice.priceUsdt);

  // console.log("setLastPlayed", lastPlayed);

  if (isLoading)
    return (
      <div className="mt-8 text-center">
        <span className="w-12 h-12 rounded-full inline-flex items-center justify-center animate-spin">
          <span className="border-4 border-white rounded-full w-12 h-12 animate-prixClipFix"></span>
        </span>
      </div>
    );

  if (lastPlayed.length <= 0) {
    return (
      <div className="mt-8 flex flex-col items-center justify-center">
        <img src={NoDataFound} className="h-60 w-60" alt="No data found" />
        <h1 className="text-3xl font-bold mb-4">No Data to Display</h1>
        <p className="text-light-gray">
          There is no data available to show at the moment.
        </p>
      </div>
    );
  }

  return (
    <div
      className={`mt-8  ${
        location.pathname === "/" ? "px-0" : "px-6 sm:px-6 md:px-0 lg:px-0"
      }`}
    >
      {/* Desktop */}

      <Box
        sx={{
          display: { xs: "none", sm: "none", md: "none", lg: "block" },
          mt: 4,
        }}
      >
        <div className="table w-full">
          <div className="column">
            <div className="hidden row table-heading sm:hidden xs:hidden md:hidden lg:flex min-w-[10%]">
              Winner
            </div>
            <div className="w-1/4 row table-heading min-w-[28%]">Winnings</div>
            <div className="row table-heading max-w-[11rem]">Game</div>
            <div className="row table-heading text-end max-w-[11%]">
              FloorPrice
            </div>
            <div className="row table-heading text-end max-w-[11%]">Total</div>
            <div className="m-auto table-heading text-end w-[70%] max-w-[11%]">
              ROI
            </div>
            <div className="w-2/5 m-auto table-heading text-end">-</div>
          </div>
        </div>

        <div>
          <List>
            <TransitionGroup>
              {lastPlayed.map((ele, index) => (
                <CSSTransition
                  key={ele.account}
                  timeout={500}
                  classNames="item"
                >
                  <div className="table w-full">
                    {ele.winner_pubkey[0]._id === DummyPubKey ? (
                      <></>
                    ) : (
                      <div className="column hover:bg-yankees-blue hover:rounded-3xl hover:px-3">
                        <div className="row table-body min-w-[10%]">
                          <Link
                            to={`/${
                              replaceSlug(ele.winner_pubkey[0].userName) ||
                              ele.winner_pubkey[0]._id
                            }`}
                            state={{
                              pubKey: ele.winner_pubkey[0]._id,
                            }}
                          >
                            <div className="flex gap-4">
                              <div className="overflow-hidden  rounded-xl">
                                {ele.winner_pubkey[0].userName &&
                                ele.winner_pubkey[0].profileImage ? (
                                  <img
                                    src={`${imagePath}profile48/${ele.winner_pubkey[0].profileImage}`}
                                    onError={handleImageError}
                                    className="object-cover w-10 h-10 rounded-xl bg-chat-bg bg-opacity-95"
                                    loading="lazy"
                                    alt=""
                                  />
                                ) : (
                                  <img
                                    src={`${
                                      ele.winner_mint_image?._id
                                        ? `${compressimagePath}${ele.winner_mint_image._id}.png`
                                        : ele.winner_mint_image.mint_image
                                    }`}
                                    onError={handleImageError}
                                    alt=""
                                    className="object-cover w-10 h-10 rounded-xl bg-yankees-blue"
                                  />
                                )}
                              </div>
                              <div className="flex items-center font-bold leading-6 text-gray">
                                {ele.winner_pubkey[0].userName
                                  ? ele.winner_pubkey[0].userName
                                  : getAddress(ele.winner_pubkey[0]._id)}
                              </div>
                            </div>
                          </Link>
                        </div>
                        <div className="row table-body min-w-[28%]">
                          <div className="flex items-center gap-1 cursor-default w-max">
                            <img
                              src={`${
                                ele.winner_mint_image._id
                                  ? `${compressimagePath}${ele.winner_mint_image._id}.png`
                                  : ele.winner_mint_image.mint_image
                              }`}
                              alt=""
                              onError={handleImageError}
                              className="w-8 h-7 lg:w-9 lg:h-8 mask mask-hexagon-2 mask-repeat object-cover opacity-40 imag_resize"
                            />

                            {ele.losers.map((looser, index) => {
                              return (
                                <img
                                  src={`${
                                    looser._id
                                      ? `${compressimagePath}${looser._id}.png`
                                      : looser.mint_image
                                  }`}
                                  onError={handleImageError}
                                  key={index}
                                  alt=""
                                  className="w-8 h-7 lg:w-9 lg:h-8 mask mask-hexagon-2 mask-repeat object-cover imag_resize"
                                />
                              );
                            })}
                            {/* <img
                              src={`${compressimagePath}${ele.losers[1]}.png`}
                              className="w-8 h-7 lg:w-9 lg:h-8 mask mask-hexagon-2 mask-repeat"
                            />
                            <img
                              src={`${compressimagePath}${ele.losers[2]}.png`}
                              className="w-8 h-7 lg:w-9 lg:h-8 mask mask-hexagon-2 mask-repeat"
                            />
                            <img
                              src={`${compressimagePath}${ele.losers[3]}.png`}
                              className="w-8 h-7 lg:w-9 lg:h-8 mask mask-hexagon-2 mask-repeat"
                            />
                            <img
                              src={`${compressimagePath}${ele.losers[4]}.png`}
                              className="w-8 h-7 lg:w-9 lg:h-8 mask mask-hexagon-2 mask-repeat"
                            /> */}
                          </div>
                        </div>
                        <div className="flex items-center justify-start gap-2 row table-body text-end max-w-[11rem]">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="#F5C64B"
                            viewBox="0 0 24 24"
                            className="w-4 h-4 cursor-pointer"
                            strokeWidth=""
                            stroke="#F5C64B"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                            />
                          </svg>

                          <Link
                            to={`${
                              ele.losers.length === 1
                                ? "../dogevscheems"
                                : "../winnertakesall"
                            }`}
                          >
                            <span className="text-sm font-semibold truncate leading-6 tracking-wide text-space-gray">
                              {ele.losers.length === 1
                                ? "Doge vs Cheems"
                                : "Winner Takes all"}
                            </span>
                          </Link>
                        </div>
                        <div className="cursor-default row table-body text-end max-w-[11%]">
                          {ele.floorPrice && (
                            <div className="cursor-default text-space-gray">
                              {ele.floorPrice?.toFixed(2)} SOL
                            </div>
                          )}
                        </div>
                        <div className="cursor-default row table-body text-end max-w-[11%]">
                          <div className="text-[#b3e95a] cursor-default">
                            ${"  "}
                            {SOLPrice === 0
                              ? "-"
                              : (
                                  ele.floorPrice *
                                  SOLPrice.data?.priceUsdt *
                                  ele.losers.length
                                ).toFixed(2)}
                          </div>
                        </div>
                        <div className="m-auto w-[70%] table-body text-end cursor-default max-w-[11%]">
                          <div className="cursor-default text-space-gray">
                            {ele.losers.length * 100}%{" "}
                          </div>
                        </div>
                        <div
                          className="flex justify-end w-2/5 m-auto cursor-pointer table-body"
                          onClick={() => {
                            setSelectedIndex(index);
                            ConnectModal();
                          }}
                        >
                          <img src={eye} onError={handleImageError} />
                        </div>
                      </div>
                    )}
                  </div>
                </CSSTransition>
              ))}
            </TransitionGroup>
          </List>
        </div>
      </Box>

      {/* Mobile View */}

      {lastPlayed.map((ele, index) => {
        return (
          <Box
            key={ele.account}
            sx={{
              display: { xs: "block", sm: "block", md: "block", lg: "none" },
              mt: 3,
              mb: 5,
            }}
          >
            {ele.winner_pubkey[0]._id === DummyPubKey ? (
              <></>
            ) : (
              <div className="bg-yankees-blue rounded-3xl" key={index}>
                <div className="px-8">
                  <div className="flex justify-between">
                    <Link
                      to={`/${
                        replaceSlug(ele.winner_pubkey[0].userName) ||
                        ele.winner_pubkey[0]._id
                      }`}
                      state={{
                        pubKey: ele.winner_pubkey[0]._id,
                      }}
                    >
                      <div>
                        {/* <img src={chaticon1} className='relative bottom-[6px]' /> */}
                        {/* <img
                          src={`${imagePath}${ele.winner_pubkey[0].profileImage}`}
                          className="relative bottom-[6px] w-10 h-10 rounded-xl object-cover"
                        /> */}
                        {ele.winner_pubkey[0].userName &&
                        ele.winner_pubkey[0].profileImage ? (
                          <div className="relative bottom-[6px] w-10 h-10 rounded-xl overflow-hidden">
                            <img
                              src={`${imagePath}profile48/${ele.winner_pubkey[0].profileImage}`}
                              onError={handleImageError}
                              alt=""
                              className="object-cover w-10 h-10 rounded-xl bg-yankees-blue"
                            />
                          </div>
                        ) : (
                          <img
                            src={`${
                              ele.winner_mint_image._id
                                ? `${compressimagePath}${ele.winner_mint_image._id}.png`
                                : ele.winner_mint_image.mint_image
                            }`}
                            onError={handleImageError}
                            alt=""
                            className="relative bottom-[6px] w-10 h-10 rounded-xl object-cover"
                          />
                        )}
                      </div>
                    </Link>
                    <div className="flex items-end gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="#F5C64B"
                        viewBox="0 0 24 24"
                        className="w-5 h-5"
                        strokeWidth=""
                        stroke="#F5C64B"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                        />
                      </svg>

                      <span className="text-sm font-semibold tracking-wide text-space-gray">
                        {ele.losers.length === 1
                          ? "Doge vs Cheems"
                          : "Winner Takes all"}
                      </span>
                    </div>
                  </div>
                  <Link
                    to={`/${
                      replaceSlug(ele.winner_pubkey[0].userName) ||
                      ele.winner_pubkey[0]._id
                    }`}
                    state={{
                      pubKey: ele.winner_pubkey[0]._id,
                    }}
                  >
                    <div className="mt-6">
                      <div className="text-sm font-black leading-6 tracking-wide text-gray">
                        {ele.winner_pubkey[0].userName
                          ? ele.winner_pubkey[0].userName
                          : getAddress(ele.winner_pubkey[0]._id)}
                      </div>
                    </div>
                  </Link>
                  <div className="mt-4">
                    <div className="flex gap-1">
                      <img
                        src={`${
                          ele.winner_mint_image._id
                            ? `${compressimagePath}${ele.winner_mint_image._id}.png`
                            : ele.winner_mint_image.mint_image
                        }`}
                        onError={handleImageError}
                        alt=""
                        className="w-8 h-7 lg:w-9 lg:h-8 mask mask-hexagon-2 mask-repeat object-cover opacity-40 imag_resize"
                      />

                      {ele.losers.map((looser, index) => (
                        <img
                          src={`${
                            looser._id
                              ? `${compressimagePath}${looser._id}.png`
                              : looser.mint_image
                          }`}
                          onError={handleImageError}
                          key={index}
                          alt=""
                          className="w-8 h-7 lg:w-9 lg:h-8 mask mask-hexagon-2 mask-repeat object-cover imag_resize"
                        />
                      ))}
                    </div>
                  </div>
                  <div className="mt-6">
                    <div className="flex justify-between text-space-gray uppercase text-xs tracking-wider text-opacity-[0.56] font-bold">
                      <div>FloorPrice</div>
                      <div>ROI</div>
                    </div>
                    <div className="flex justify-between mt-2 text-sm font-semibold leading-6 tracking-wide text-gray">
                      <div>{ele.floorPrice?.toFixed(2)} SOL</div>
                      <div>{ele.losers.length * 100}% </div>
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
                      <div className="mt-1 text-2xl font-black tracking-wider text-light-green">
                        ${"  "}
                        {SOLPrice === 0
                          ? "-"
                          : (
                              ele.floorPrice *
                              SOLPrice.data?.priceUsdt *
                              ele.losers.length
                            ).toFixed(2)}
                      </div>
                    </div>
                    <div
                      className="flex"
                      onClick={() => {
                        setSelectedIndex(index);
                        ConnectModal();
                      }}
                    >
                      <img src={eye} onError={handleImageError} />
                    </div>
                  </div>
                </Box>
              </div>
            )}
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
        lastPlayed.length < total && (
          <div className="w-full my-12 text-center">
            <button
              className="p-4 text-base font-bold bg-opacity-50 rounded-lg bg-yankees-blue hover:bg-opacity-100 text-space-gray"
              onClick={loadMoreData}
            >
              Load More Results
            </button>
          </div>
        )
      )}
      <InfoModal
        open={open}
        onClose={CloseModal}
        roundDetails={lastPlayed[selectedIndex]}
      ></InfoModal>
    </div>
  );
}
