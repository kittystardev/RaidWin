import { Box } from "@mui/material";
import React, { useEffect } from "react";
import { useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
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
import winner_star from "../assets/images/winner_star.svg";

export default function Played({ pubKeyParam, userData, userPubkey }) {
  // const pubKey = useSelec  tor((state) =>
  //     state.Temp.pubKey ? state.Temp.pubKey.toString() : ""
  // );
  const navigate = useNavigate();

  const [totalPlayed, setTotalPlayed] = useState([]);
  const [skip, setSkip] = React.useState(0);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [searchParams] = useSearchParams();
  const [check, setCheck] = useState(false);
  // let { collectionMint } = useParams();
  let collectionMint = searchParams.get("collectionId");

  useEffect(() => {
    if (!pubKeyParam) return;
    (async function () {
      try {
        const resp = await fetch(`${baseUrl}/getPlayerGameCount/${pubKeyParam}`);
        const { total } = (await resp.json())[0];
        setTotal(total);
        // console.log("total", total);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [pubKeyParam]);

  const fetchData = async () => {
    if (isLoading) return;
    try {
      setIsLoading(true);
      // setTotalPlayed([])
      const resp = await fetch(
        `${baseUrl}/getPlayerGame/${pubKeyParam}/${skip}/${
          skip == 0 ? `4` : skip === 4 ? `6` : `10`
        }`
      );
      let data = await resp.json();
      data = data[0].games;
      // console.log("dataaaasdasfdas", data);
      // console.log("data.length", data.length === 0);
      if (totalPlayed.length !== 0) {
        setTotalPlayed([...totalPlayed, ...data]);
      } else if (data.length === 0) {
        setCheck(true);
      } else {
        setTotalPlayed(data);
      }
    } catch (error) {
      console.log(error);
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
      // setTotalPlayed([])
      const resp = await fetch(
        `${baseUrl}/getPlayerGame/${pubKeyParam}/${newSkip}/${
          newSkip == 0 ? `4` : newSkip === 4 ? `6` : `10`
        }`
      );
      let data = await resp.json();
      data = data[0].games;
      // console.log("dataaaasdasfdas", data);
      // console.log("data.length", data.length === 0);
      if (totalPlayed.length !== 0) setTotalPlayed([...totalPlayed, ...data]);
      else setTotalPlayed(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // console.log("totalPlayed", pubKeyParam);

  const additm = (newData) => {
    let _totalPlayed = [];
    if (newData.account === totalPlayed[0]?.account) {
      _totalPlayed = [...totalPlayed];
      _totalPlayed[0] = newData;
    } else {
      _totalPlayed = [newData, ...totalPlayed.slice(0, -1)];
    }
    // _lastPlayed.splice(0, 0, newData);
    console.log("_totalPlayed", _totalPlayed);
    setTotalPlayed(_totalPlayed);
  };

  const removeFirst = (newData) => {
    setTotalPlayed([...totalPlayed.slice(1), newData]);
  };

  useEffect(() => {
    if (pubKeyParam) {
      socket.on("NewPlayerGame", async (newData) => {
        if (newData.length == 1 && newData[0].games.length === 1) additm(newData[0].games[0]);
      });
      socket.on("DisjointPlayerGame", async (newData) => {
        if (newData.length === 1 && newData[0].games.length === 1) removeFirst(newData[0].games[0]);
      });
      socket.emit("JoinPlayerGame", pubKeyParam);
    }
    return () => {
      socket.off("JoinPlayerGame");
    };
  }, [totalPlayed, pubKeyParam]);

  useEffect(() => {
    if (pubKeyParam === "") return;
    fetchData();
  }, [pubKeyParam]);

  const [open, setOpen] = React.useState(false);

  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const ConnectModal = () => setOpen(true);
  const CloseModal = () => setOpen(false);
  // console.log("collectionMint", totalPlayed);

  const PlayGame = async () => {
    console.log("yuahsdk", totalPlayed[0].collection_mint);
    try {
      const resp = await fetch(`${baseUrl}/gameState/${totalPlayed[0].collection_mint}/2/false`);
      const obj = await resp.json();
      if (obj.msg === "created") {
        console.log(
          "Navigate",
          totalPlayed[0].collection_mint,
          totalPlayed[0],
          "account",
          obj.data.account,
          obj.data
        );
        navigate(
          `/winnertakesall/${totalPlayed[0].slug}?gameId=${obj.data?.account}`
          // `/winnertakesall/collection?collectionId=${totalPlayed[0].collection_mint}$gameId=${obj.data.account}`
        );
      } else if (obj.msg === "creating") {
        this();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const Play1vs1Game = async () => {
    try {
      // debugger
      console.log("totalPlayed", totalPlayed);
      const resp = await fetch(`${baseUrl}/gameState/${totalPlayed[0].collection_mint}/2/true`);
      const obj = await resp.json();
      if (obj.msg === "created") {
        navigate(`/dogevscheems/${totalPlayed[0].slug}?gameId=${obj.data?.account}`);
        window.location.reload();
      } else if (obj.msg === "creating") {
        this();
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div>
      <div className="items-center justify-between block mb-8 sm:block md:flex lg:flex 2xl:flex">
        <div className="text-2xl font-black tracking-wide text-gray">Played</div>
        <div className="flex gap-4 mt-8 md:mt-0">
          <button className="bg-nouveau-main bg-opacity-[0.08] rounded-lg px-6 py-3 text-space-gray font-bold">
            LeaderBoard
          </button>
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
          <img src={NoDataFound} className="h-24 w-24" alt="No data found" />
          <h1 className="xs:text-3xl text-2xl font-bold mb-4">No Data to Display</h1>
          <p className="text-light-gray">There is no data available to show at the moment.</p>
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
                <div className="hidden row table-heading sm:hidden xs:hidden md:hidden lg:flex">
                  Winner
                </div>
                <div className="w-1/4 row table-heading">Players</div>
                <div className="text-center row table-heading">Game</div>
                <div className="text-center row table-heading">collection</div>
                <div className="w-2/5 m-auto table-heading text-end">-</div>
              </div>
            </div>
            {totalPlayed.map((ele, index) => {
              return (
                <div className="table" key={index}>
                  <div className="column hover:bg-yankees-blue hover:rounded-3xl hover:px-3 ">
                    <div className="cursor-default row table-body">
                      {ele.winner_pubkey?._id === DummyPubKey ? (
                        <div className="flex gap-4 cursor-pointer">
                          <div className="overflow-hidden rounded-xl">
                            {ele.winner_pubkey?._id === DummyPubKey ? (
                              <></>
                            ) : (
                              <>
                                {ele.winner_pubkey?.userName && ele.winner_pubkey.profileImage ? (
                                  <img
                                    src={`${imagePath}profile48/${ele.winner_pubkey.profileImage}`}
                                    className="w-10 h-10 rounded-xl cursor-pointer bg-chat-bg bg-opacity-95 scale-[1.4]"
                                    onError={handleImageError}
                                  />
                                ) : (
                                  <img
                                    src={`${
                                      ele.players[0].mint?._id
                                        ? `${compressimagePath}${ele.players[0].mint?._id}.png`
                                        : `${ele.players[0].mint?.mint_image}`
                                    }`}
                                    onError={handleImageError}
                                    className="w-10 h-10 cursor-pointer rounded-xl object-cover bg-yankees-blue"
                                  />
                                )}
                              </>
                            )}
                          </div>
                          <div className="flex items-center font-bold leading-6 cursor-pointer text-gray">
                            {ele.winner_pubkey?.userName && ele.winner_pubkey?.userName !== "" ? (
                              ele.winner_pubkey?.userName
                            ) : ele.winner_pubkey?._id === DummyPubKey ? (
                              <>-</>
                            ) : (
                              getAddress(ele.winner_pubkey?._id)
                            )}
                          </div>
                        </div>
                      ) : (
                        <a
                          href={`/${
                            replaceSlug(ele.winner_pubkey?.userName) || ele.winner_pubkey?._id
                          }`}
                          state={{
                            pubKey: ele.winner_pubkey?._id,
                          }}
                        >
                          <div className="flex gap-4 cursor-pointer">
                            <div className="overflow-hidden  rounded-xl">
                              {ele.winner_pubkey?._id === DummyPubKey ? (
                                <></>
                              ) : (
                                <>
                                  {ele.winner_pubkey?.userName && ele.winner_pubkey.profileImage ? (
                                    <img
                                      src={`${imagePath}profile48/${ele.winner_pubkey.profileImage}`}
                                      onError={handleImageError}
                                      className="w-10 h-10 cursor-pointer rounded-xl object-cover bg-chat-bg"
                                    />
                                  ) : (
                                    <img
                                      src={`${
                                        ele.players[0].mint?._id
                                          ? `${compressimagePath}${ele.players[0].mint?._id}.png`
                                          : `${ele.players[0].mint?.mint_image}`
                                      }`}
                                      onError={handleImageError}
                                      className="w-10 h-10 cursor-pointer rounded-xl object-cover bg-yankees-blue"
                                    />
                                  )}
                                </>
                              )}
                            </div>
                            <div className="flex items-center font-bold leading-6 cursor-pointer text-gray">
                              {ele.winner_pubkey?.userName && ele.winner_pubkey?.userName !== "" ? (
                                ele.winner_pubkey?.userName
                              ) : ele.winner_pubkey?._id === DummyPubKey ? (
                                <>-</>
                              ) : (
                                getAddress(ele.winner_pubkey?._id)
                              )}
                            </div>
                          </div>
                        </a>
                      )}
                    </div>
                    <div className="cursor-default row table-body">
                      <div className="flex items-center gap-1 cursor-default">
                        {ele.players.map((playerImage, index) => {
                          return (
                            <img
                              src={`${
                                playerImage.mint?._id
                                  ? `${compressimagePath}${playerImage.mint?._id}.png`
                                  : `${playerImage.mint?.mint_image}`
                              }`}
                              onError={handleImageError}
                              className="w-8 cursor-default h-7 lg:w-9 lg:h-8 mask mask-hexagon-2 mask-repeat object-cover"
                              key={index}
                            />
                          );
                        })}
                      </div>
                    </div>
                    {ele.winner_pubkey?._id === DummyPubKey ? (
                      <div
                        className="flex items-center justify-center gap-2 cursor-default row table-body text-end"
                        onClick={() => {
                          if (ele.players.length === 2) {
                            Play1vs1Game();
                          } else {
                            PlayGame();
                          }
                        }}
                      >
                        <img src={winner_star} alt="winner_star" className="cursor-pointer" />
                        <span className="text-sm font-semibold leading-6 tracking-wide cursor-pointer text-space-gray">
                          {ele.players.length === 2 ? "doge vs Cheems" : "Winner Takes all"}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2 cursor-default row table-body text-end">
                        <img src={winner_star} alt="winner_star" className="cursor-default" />
                        <span className="text-sm font-semibold leading-6 tracking-wide cursor-default text-space-gray">
                          {ele.players.length === 2 ? "doge vs Cheems" : "Winner Takes all"}
                        </span>
                      </div>
                    )}
                    <div className="text-center cursor-default row table-body">
                      <div className="cursor-default text-space-gray">{ele.title}</div>
                    </div>

                    <div className="flex justify-end w-2/5 m-auto cursor-pointer table-body">
                      {ele.winner_pubkey?._id === DummyPubKey ? (
                        <img src={eye} onClick={() => PlayGame()} />
                      ) : (
                        <img
                          src={eye}
                          onClick={() => {
                            setSelectedIndex(index);
                            ConnectModal();
                          }}
                        />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </Box>

          {/* Mobile View table list */}

          {totalPlayed.map((ele, index) => {
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
                  mb: 5,
                }}
                key={index}
              >
                <div className="bg-yankees-blue rounded-3xl">
                  <div className="px-8">
                    <div className="flex justify-between">
                      <Link
                        to={`/${
                          replaceSlug(ele.winner_pubkey?.userName) || ele.winner_pubkey?._id
                        }`}
                        state={{
                          pubKey: ele.winner_pubkey?._id,
                        }}
                      >
                        <div>
                          {ele.winner_pubkey?._id === DummyPubKey ? (
                            <></>
                          ) : // (
                          //   <img
                          //     src={`${imagePath}${ele.winner_pubkey.profileImage}`}
                          //     className="w-10 h-10 rounded-xl"
                          //   />
                          // )
                          ele.winner_pubkey?.userName && ele.winner_pubkey.profileImage ? (
                            <div className="overflow-hidden  rounded-xl">
                              <img
                                src={`${imagePath}${ele.winner_pubkey.profileImage}`}
                                onError={handleImageError}
                                className="w-10 h-10 rounded-xl"
                              />
                            </div>
                          ) : (
                            <img
                              src={ele.players[0].mint?.mint_image}
                              onError={handleImageError}
                              className="w-10 h-10 rounded-xl"
                            />
                          )}
                        </div>
                      </Link>
                      {/* {ele.winner_pubkey._id === DummyPubKey && (
                    <div className="flex items-end gap-2">
                      <img src={winner_star} alt="winner_star" />

                      <span className="text-sm font-semibold tracking-wide text-space-gray">
                        Winner Take all
                      </span>
                    </div>
                  )} */}
                      <div className="flex items-center gap-2">
                        <img src={winner_star} alt="winner_star" />

                        <span className="text-sm font-semibold tracking-wide text-space-gray">
                          Winner Take all
                        </span>
                      </div>
                    </div>
                    <div className="mt-6">
                      <Link
                        to={`/${
                          replaceSlug(ele.winner_pubkey?.userName) || ele.winner_pubkey?._id
                        }`}
                        state={{
                          pubKey: ele.winner_pubkey?._id,
                        }}
                      >
                        <div className="text-sm font-black leading-6 tracking-wide text-gray">
                          {ele.winner_pubkey?.userName && ele.winner_pubkey?.userName !== "" ? (
                            ele.winner_pubkey?.userName
                          ) : ele.winner_pubkey?._id === DummyPubKey ? (
                            <>-</>
                          ) : (
                            getAddress(ele.winner_pubkey?._id)
                          )}
                        </div>
                      </Link>
                    </div>
                    <div className="mt-4">
                      <div className="flex gap-1">
                        {ele.players.map((playerImage, index) => {
                          return (
                            <img
                              src={`${
                                playerImage.mint?._id
                                  ? `${compressimagePath}${playerImage.mint?._id}.png`
                                  : `${playerImage.mint?.mint_image}`
                              }`}
                              onError={handleImageError}
                              className="w-8 h-7 lg:w-9 lg:h-8 mask mask-hexagon-2 mask-repeat object-cover"
                              key={index}
                            />
                          );
                        })}
                      </div>
                    </div>
                    <div className="mt-6">
                      <div className="flex justify-between text-space-gray uppercase text-xs tracking-wider text-opacity-[0.56] font-bold">
                        <div>FloorPrice</div>
                        <div>ROI</div>
                      </div>
                      <div className="flex justify-between mt-2 text-sm font-semibold leading-6 tracking-wide text-gray">
                        <div>430.00 SOL</div>
                        <div>400%</div>
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
                        <div className="mt-1 text-2xl font-black tracking-wide text-gray">
                          $ 19.75
                        </div>
                      </div>
                      {ele.winner_pubkey?._id === DummyPubKey ? (
                        <></>
                      ) : (
                        <div className="flex">
                          <img src={eye} />
                        </div>
                      )}
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
            totalPlayed.length < total && (
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
            roundDetails={totalPlayed[selectedIndex]}
            pubKeyParam={pubKeyParam}
            userData={userData}
            userPubkey={userPubkey}
          ></InfoModal>
        </>
      )}
    </div>
  );
}
