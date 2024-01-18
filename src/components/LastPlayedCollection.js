import React from "react";
import { useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import InfoModal from "./modals/InfoModal";
import doge_2 from "../assets/images/doge_2.svg";
import cheems_2 from "../assets/images/cheems_2.png";
import eye from "../assets/images/eye.svg";
import NoDataFound from "../assets/images/no-data-found.svg";
import { Box, List } from "@mui/material";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import {
  baseUrl,
  compressimagePath,
  getAddress,
  getCollectionMint,
  handleImageError,
  imagePath,
  parseWiningRound,
  replaceSlug,
  socket,
} from "../utils/utils";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { getCollectionMintByName } from "../utils/collections";

export default function LastPlayedCollection({ from1v1 = false, gameState }) {
  const [searchParams] = useSearchParams();

  let gameId = searchParams.get("gameId");
  let { slug: collectionMintName } = useParams();
  let [collectionMint, setCollectionMint] = useState("");
  useEffect(() => {
    if (!collectionMintName) return;
    getCollectionMintByName(collectionMintName, from1v1).then((resp) => {
      setCollectionMint(resp);
    });
  }, [collectionMintName, from1v1]);

  // console.log("collectionMint", collectionMintName);

  const [open, setOpen] = useState(false);
  const [skip, setSkip] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const ConnectModal = () => setOpen(true);
  const CloseModal = () => setOpen(false);
  let [rounds, setRounds] = useState([]);
  const pubKey = useSelector((state) =>
    state.Temp.pubKey ? state.Temp.pubKey.toString() : ""
  );
  const [total, setTotal] = useState(0);
  useEffect(() => {
    if (!collectionMintName) return;
    (async function () {
      try {
        const resp = await fetch(
          `${baseUrl}/getPreviousAllGameByTitleCount/${collectionMintName}`
        );
        const { total } = (await resp.json())[0];
        setTotal(total);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [collectionMintName]);

  const fetchData = async () => {
    if (isLoading) return;
    try {
      setIsLoading(true);
      const resp = await fetch(
        `${baseUrl}/getPreviousAllGameByTitle/${collectionMintName}/${skip}/${
          skip == 0 ? `4` : skip === 4 ? `6` : `10`
        }`
      );
      const games = await resp.json();

      // console.log("games", games);
      const parsedGame = parseWiningRound(games);
      if (rounds.length != 0) setRounds([...rounds, ...parsedGame]);
      else setRounds(parsedGame);
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
        `${baseUrl}/getPreviousAllGameByTitle/${collectionMintName}/${newSkip}/${
          newSkip == 0 ? `4` : newSkip === 4 ? `6` : `10`
        }`
      );
      const games = await resp.json();

      // console.log("games", games);
      const parsedGame = parseWiningRound(games);
      if (rounds.length != 0) setRounds([...rounds, ...parsedGame]);
      else setRounds(parsedGame);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    if (!collectionMint) return;
    socket.on("NewPreviousGame", async (newData) => {
      console.log(newData);
      additem(parseWiningRound(newData)[0]);
    });
    socket.emit("JoinPreviousGame", getCollectionMint(gameState, true));
    socket.emit("JoinPreviousGame", getCollectionMint(gameState, false));
    return () => {
      socket.off("JoinPreviousGame");
    };
  }, [collectionMintName, rounds, collectionMint]);

  const additem = (newData) => {
    console.log("rounds", rounds);
    const _rounds = [newData, ...rounds.slice(0, -1)];
    console.log("_rounds", _rounds);
    setRounds(_rounds);
  };

  // console.log("roundsss", rounds);

  useEffect(() => {
    if (collectionMintName != "" && gameId != "") fetchData();
  }, [collectionMintName, gameId, collectionMint]);

  const navigate = useNavigate();
  const pageNavigate = (page) => {
    navigate(`/${page}`);
  };

  const SOLPrice = useSelector((state) => state.solanaprice.priceUsdt);

  if (isLoading)
    return (
      <div className="mt-8 text-center">
        <span className="w-12 h-12 rounded-full inline-flex items-center justify-center animate-spin">
          <span className="border-4 border-white rounded-full w-12 h-12 animate-prixClipFix"></span>
        </span>
      </div>
    );

  if (rounds.length <= 0) {
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
    <>
      {/* Desktop View table list */}

      <div
        // sx={{
        //   display: { xs: "none", sm: "none", md: "block", lg: "block" },
        //   mt: 4,
        // }}
        className="hidden mt-4 lg:block"
      >
        <div className="table">
          <div className="column">
            <div className="hidden w-[135%] row table-heading sm:hidden xs:hidden md:hidden lg:flex">
              Winner
            </div>
            <div className="row table-heading w-[170%]">Winnings</div>
            {from1v1 && (
              <div className="w-[80%] font-bold table-heading text-xs tracking-wider uppercase text-opacity-[0.56] text-space-gray text-end">
                WON
              </div>
            )}
            <div className="!pr-8 row table-heading text-end">FloorPrice</div>
            <div className="row table-heading text-end">Total</div>
            <div className="m-auto table-heading text-end w-[70%]">ROI</div>
            <div className="w-2/5 m-auto table-heading text-end">-</div>
          </div>
        </div>
        <div>
          <List>
            <TransitionGroup>
              {rounds.map((ele, index) => (
                <CSSTransition
                  key={ele.account}
                  timeout={500}
                  classNames="item"
                >
                  <div className="table">
                    <div className="py-[1px] column hover:bg-yankees-blue hover:rounded-3xl hover:px-6 ">
                      <div className="w-[110%] table-body hover:cursor-default">
                        <Link
                          to={`/${
                            replaceSlug(ele.User_name) || ele.winner_pubkey
                          }`}
                          state={{
                            pubKey: ele.winner_pubkey,
                          }}
                        >
                          <div className="flex gap-4 cursor-pointer">
                            <div className="overflow-hidden rounded-xl ">
                              {ele.User_name && ele.Winner_image ? (
                                <img
                                  src={`${imagePath}profile48/${ele.Winner_image}`}
                                  onError={handleImageError}
                                  className="w-10 h-10 cursor-pointer rounded-xl object-cover bg-yankees-blue"
                                />
                              ) : (
                                <img
                                  src={`${
                                    ele.winnerMintImage
                                      ? `${compressimagePath}${ele.winnerMintImage}.png`
                                      : `${ele.winningNFT[0].mint_image}`
                                  }`}
                                  onError={handleImageError}
                                  className="w-10 h-10 cursor-pointer rounded-xl object-cover bg-yankees-blue"
                                />
                              )}
                            </div>
                            <div className="flex items-center font-bold leading-6 cursor-pointer text-gray overflow_text overflow-ellipsis">
                              {/* {getAddress(ele.winner_pubkey)} */}
                              {ele.User_name
                                ? ele.User_name
                                : getAddress(ele.winner_pubkey)}
                            </div>
                          </div>
                        </Link>
                      </div>
                      <div className="cursor-default row table-body w-[170%]">
                        <div className="flex items-center gap-1 cursor-default">
                          <img
                            src={`${
                              ele.winnerMintImage
                                ? `${compressimagePath}${ele.winnerMintImage}.png`
                                : `${ele.winningNFT[0].mint_image}`
                            }`}
                            onError={handleImageError}
                            className="w-8 cursor-default h-7 lg:w-9 lg:h-8 mask mask-hexagon-2 mask-repeat object-cover opacity-40"
                          />
                          {ele.winningNFT.map((player) => {
                            return (
                              <img
                                src={`${
                                  player.mint
                                    ? `${compressimagePath}${player.mint}.png`
                                    : `${player?.mint_image}`
                                }`}
                                onError={handleImageError}
                                // src={player.mint_image}
                                className="w-8 cursor-default h-7 lg:w-9 lg:h-8 mask mask-hexagon-2 mask-repeat object-cover"
                              />
                            );
                          })}
                        </div>
                      </div>
                      {from1v1 && (
                        <div className="m-auto table-body w-[30%] text-end cursor-default !pr-3">
                          {ele.winner_pubkey ===
                          ele.winningAllNFT[0].player_id ? (
                            <img
                              src={doge_2}
                              className="w-8 cursor-default h-7 lg:w-9 lg:h-8"
                            />
                          ) : (
                            <img
                              src={cheems_2}
                              className="w-8 cursor-default h-7 lg:w-9 lg:h-8"
                            />
                          )}
                        </div>
                      )}
                      <div className="text-center cursor-default row table-body">
                        <div className="cursor-default text-space-gray">
                          {ele.floorPrice?.toFixed(2)} SOL
                        </div>
                      </div>
                      <div className="cursor-default row table-body text-end !w-[80%]">
                        <div className="cursor-default text-space-gray">
                          ${"  "}
                          {SOLPrice === 0
                            ? "-"
                            : (
                                ele.total *
                                SOLPrice.data?.priceUsdt *
                                ele.winningNFT.length
                              ).toFixed(2)}
                        </div>
                      </div>
                      <div className="m-auto w-[70%] table-body text-end cursor-default">
                        <div className="pr-5 cursor-default text-space-gray">
                          {ele.ROI}%
                        </div>
                      </div>
                      <div className="flex justify-end w-[20%] m-auto cursor-pointer table-body">
                        <img
                          src={eye}
                          onClick={() => {
                            setSelectedIndex(index);
                            ConnectModal();
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </CSSTransition>
              ))}
            </TransitionGroup>
          </List>
        </div>
      </div>

      {/* Mobile View table list */}
      <div>
        <List>
          <TransitionGroup>
            {rounds.map((ele, index) => (
              <CSSTransition key={ele.account} timeout={500} classNames="item">
                <div className="block mt-3 lg:hidden">
                  <div className="bg-yankees-blue rounded-3xl">
                    <div className="px-8">
                      <Link
                        to={`/${
                          replaceSlug(ele.User_name) || ele.playerPubKey
                        }`}
                        state={{
                          pubKey: ele.playerPubKey,
                        }}
                      >
                        <div className="flex justify-between">
                          <div className="relative bottom-[6px] w-10 h-10 overflow-hidden rounded-xl">
                            {ele.User_name && ele.Winner_image ? (
                              <img
                                src={`${imagePath}profile48/${ele.Winner_image}`}
                                onError={handleImageError}
                                className="w-10 h-10 rounded-xl"
                              />
                            ) : (
                              <img
                                src={`${
                                  ele.winnerMintImage
                                    ? `${compressimagePath}${ele.winnerMintImage}.png`
                                    : `${ele.winningNFT[0].mint_image}`
                                }`}
                                onError={handleImageError}
                                className="w-10 h-10 rounded-xl"
                              />
                            )}
                          </div>
                        </div>
                      </Link>
                      <Link
                        to={`/${
                          replaceSlug(ele.User_name) || ele.playerPubKey
                        }`}
                        state={{
                          pubKey: ele.playerPubKey,
                        }}
                      >
                        <div className="flex items-center font-bold leading-6 text-gray">
                          {ele.User_name
                            ? ele.User_name
                            : getAddress(ele.winner_pubkey)}
                        </div>
                      </Link>
                      <div className="flex justify-between">
                        <div className="mt-4">
                          <div className="flex gap-1">
                            <img
                              src={`${
                                ele.winnerMintImage
                                  ? `${compressimagePath}${ele.winnerMintImage}.png`
                                  : `${ele.winningNFT[0].mint_image}`
                              }`}
                              onError={handleImageError}
                              className="w-8 h-7 lg:w-9 lg:h-8 mask mask-hexagon-2 mask-repeat object-cover opacity-40"
                            />
                            {ele.winningNFT.map((player) => {
                              return (
                                <img
                                  src={`${
                                    player.mint
                                      ? `${compressimagePath}${player.mint}.png`
                                      : `${player?.mint_image}`
                                  }`}
                                  onError={handleImageError}
                                  className="w-8 h-7 lg:w-9 lg:h-8 mask mask-hexagon-2 mask-repeat object-cover"
                                />
                              );
                            })}
                          </div>
                        </div>

                        {from1v1 && (
                          <div className="flex items-center">
                            {ele.winner_pubkey ===
                            ele.winningAllNFT[0].player_id ? (
                              <img
                                src={doge_2}
                                className="w-8 h-8 cursor-default"
                              />
                            ) : (
                              <img
                                src={cheems_2}
                                className="w-8 h-8 cursor-default"
                              />
                            )}
                          </div>
                        )}
                      </div>

                      <div className="mt-6">
                        <div className="flex justify-between text-space-gray uppercase text-xs tracking-wider text-opacity-[0.56] font-bold">
                          <div>FloorPrice</div>
                          <div>ROI</div>
                        </div>
                        <div className="flex justify-between mt-2 text-sm font-semibold leading-6 tracking-wide text-gray">
                          <div>{ele.floorPrice?.toFixed(2)} SOL</div>
                          <div>{ele.ROI}%</div>
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
                            ${"  "}
                            {SOLPrice === 0
                              ? "-"
                              : (ele.total * SOLPrice.data?.priceUsdt).toFixed(
                                  2
                                )}
                          </div>
                        </div>
                        <div
                          className="flex"
                          onClick={() => {
                            setSelectedIndex(index);
                            ConnectModal();
                          }}
                        >
                          <img src={eye} />
                        </div>
                      </div>
                    </Box>
                  </div>
                </div>
              </CSSTransition>
            ))}
          </TransitionGroup>
        </List>
      </div>
      {isLoadingMore ? (
        <div className="mt-8 text-center">
          <span className="w-12 h-12 rounded-full inline-flex items-center justify-center animate-spin">
            <span className="border-4 border-white rounded-full w-12 h-12 animate-prixClipFix"></span>
          </span>
        </div>
      ) : (
        rounds.length < total && (
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
        roundDetails={rounds[selectedIndex]}
      ></InfoModal>
    </>
  );
}
