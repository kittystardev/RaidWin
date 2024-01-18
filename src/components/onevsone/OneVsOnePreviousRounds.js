import { Box } from "@mui/material";
import React from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { List } from "semantic-ui-react";
import eye from "../../assets/images/eye.svg";
import doge_2 from "../../assets/images/doge_2.svg";
import cheems_2 from "../../assets/images/cheems_2.png";
import { Link, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import {
  baseUrl,
  compressimagePath,
  getAddress,
  handleImageError,
  imagePath,
  parseWiningRound,
  replaceSlug,
  socket,
} from "../../utils/utils";
import { useState } from "react";
import InfoModal from "../modals/InfoModal";
import { useCallback } from "react";

export default function OneVsOnePreviousRounds() {
  const [searchParams] = useSearchParams();
  let collectionMint = searchParams.get("collectionId");
  let gameId = searchParams.get("gameId");

  const [open, setOpen] = useState(false);
  const [skip, setSkip] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const ConnectModal = () => setOpen(true);
  const CloseModal = () => setOpen(false);
  let [rounds, setRounds] = useState([]);
  const [total, setTotal] = useState(0);
  useEffect(() => {
    if (!collectionMint) return;
    (async function () {
      try {
        const resp = await fetch(
          `${baseUrl}/getPreviousGameCount/${collectionMint}`
        );
        const { total } = (await resp.json())[0];
        setTotal(total);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [collectionMint]);

  const fetchData = useCallback(async () => {
    try {
      const resp = await fetch(
        `${baseUrl}/getPreviousGame/${collectionMint}/${skip}/${
          skip === 0 ? `4` : skip === 4 ? `6` : `10`
        }`
      );
      const games = await resp.json();
      const parsedGame = parseWiningRound(games);
      if (rounds.length !== 0) setRounds([...rounds, ...parsedGame]);
      else setRounds(parsedGame);
    } catch (err) {
      console.log(err);
    }
  }, [collectionMint, rounds, skip]);

  const additem = useCallback(
    (newData) => {
      console.log("rounds", rounds);
      const _rounds = [newData, ...rounds.slice(0, -1)];
      console.log("_rounds", _rounds);
      setRounds(_rounds);
    },
    [rounds]
  );

  useEffect(() => {
    if (!collectionMint) return;
    socket.on("NewPreviousGame", async (newData) => {
      console.log("newData", newData);
      additem(parseWiningRound(newData)[0]);
    });
    socket.emit("JoinPreviousGame", collectionMint);
    return () => {
      socket.off("JoinPreviousGame");
    };
  }, [additem, collectionMint, rounds]);

  useEffect(() => {
    if (collectionMint !== "" && gameId !== "") fetchData();
  }, [collectionMint, fetchData, gameId, skip]);

  console.log("rounds", rounds);
  return (
    <>
      <div className="items-center justify-between block mb-8 sm:block md:flex lg:flex 2xl:flex">
        <div className="text-2xl font-black tracking-wide text-gray">
          Previous Rounds
        </div>
      </div>
      <Box
        sx={{
          display: { xs: "none", sm: "none", md: "block", lg: "block" },
          mt: 4,
        }}
      >
        <div className="table">
          <div className="column">
            <div className="hidden row table-heading sm:hidden xs:hidden md:flex lg:flex">
              Winner
            </div>
            <div className="row table-heading text-center !w-fit !pr-3">
              WON
            </div>
            <div className="w-1/4 text-center row table-heading">Winnings</div>
            <div className="row table-heading text-end">FloorPrice</div>
            <div className="text-center row table-heading">Total</div>
            <div className="m-auto table-heading text-center w-[70%]">ROI</div>
            <div className="w-2/5 m-auto table-heading text-end">-</div>
          </div>
        </div>
        <div>
          <List>
            <TransitionGroup>
              {rounds.map((ele, index) => (
                <CSSTransition timeout={500} classNames="item">
                  <div className="table">
                    <div className="py-[1px] column hover:bg-yankees-blue hover:rounded-3xl hover:px-6 ">
                      <div className="row table-body hover:cursor-default">
                        {/* <Link to={`/${ele.winner_pubkey}`}> */}
                        <Link
                          to={`/${
                            replaceSlug(ele.User_name) || ele.winner_pubkey
                          }`}
                          state={{
                            pubKey: ele.winner_pubkey,
                          }}
                        >
                          <div className="flex gap-4 cursor-pointer">
                            <div className="overflow-hidden bg-white rounded-xl">
                              {ele.User_name && ele.Winner_image ? (
                                <img
                                  src={`${imagePath}profile48/${ele.Winner_image}`}
                                  onError={handleImageError}
                                  className="w-10 h-10 cursor-pointer rounded-xl object-cover bg-yankees-blue"
                                  alt=""
                                />
                              ) : (
                                <img
                                  src={`${compressimagePath}${ele.winnerMintImage}.png`}
                                  onError={handleImageError}
                                  className="w-10 h-10 cursor-pointer rounded-xl object-cover bg-yankees-blue"
                                  alt=""
                                />
                              )}
                            </div>
                            <div className="flex items-center font-bold leading-6 cursor-pointer text-gray">
                              {/* {getAddress(ele.winner_pubkey)} */}
                              {ele.User_name
                                ? ele.User_name
                                : getAddress(ele.winner_pubkey)}
                            </div>
                          </div>
                        </Link>
                        {/* </Link> */}
                      </div>
                      <div className="m-auto table-body w-[30%] text-end cursor-default !pr-3">
                        {ele.winner_pubkey ===
                        ele.winningAllNFT[0].player_id ? (
                          <img
                            src={doge_2}
                            className="w-8 cursor-default h-7 lg:w-9 lg:h-8"
                            alt=""
                          />
                        ) : (
                          <img
                            src={cheems_2}
                            className="w-8 cursor-default h-7 lg:w-9 lg:h-8"
                            alt=""
                          />
                        )}
                      </div>
                      <div className="cursor-default row table-body">
                        <div className="flex items-center justify-center gap-1 cursor-default">
                          <img
                            src={`${compressimagePath}${ele.winnerMintImage}.png`}
                            onError={handleImageError}
                            className="w-8 cursor-default h-7 lg:w-9 lg:h-8 mask mask-hexagon-2 mask-repeat object-cover opacity-40"
                            alt=""
                          />
                          {ele.winningNFT.map((player) => {
                            return (
                              <img
                                src={`${compressimagePath}${player.mint}.png`}
                                onError={handleImageError}
                                className="w-8 cursor-default h-7 lg:w-9 lg:h-8 mask mask-hexagon-2 mask-repeat object-cover"
                                alt=""
                              />
                            );
                          })}
                        </div>
                      </div>
                      <div className="cursor-default row table-body text-end">
                        {ele.floorPrice && (
                          <div className="cursor-default text-space-gray">
                            {ele.floorPrice?.toFixed(2)} SOL
                          </div>
                        )}
                      </div>
                      <div className="text-center cursor-default row table-body">
                        <div className="cursor-default text-space-gray">
                          $ 100
                        </div>
                      </div>

                      <div className="m-auto w-[70%] table-body text-center cursor-default">
                        <div className="cursor-default text-space-gray">
                          600%
                        </div>
                      </div>
                      <div className="flex justify-end w-2/5 m-auto cursor-pointer table-body">
                        <img
                          src={eye}
                          onClick={() => {
                            setSelectedIndex(index);
                            ConnectModal();
                          }}
                          alt=""
                        />
                      </div>
                    </div>
                  </div>
                </CSSTransition>
              ))}
            </TransitionGroup>
          </List>
        </div>
      </Box>

      {/* Mobile screen */}

      <div>
        <List>
          <TransitionGroup>
            {rounds.map((ele, index) => (
              <CSSTransition timeout={500} classNames="item">
                <Box
                  sx={{
                    display: {
                      xs: "block",
                      sm: "block",
                      md: "none",
                      lg: "none",
                    },
                    mt: 3,
                  }}
                >
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
                                alt=""
                              />
                            ) : (
                              <img
                                src={`${compressimagePath}${ele.winnerMintImage}.png`}
                                onError={handleImageError}
                                className="w-10 h-10 rounded-xl"
                                alt=""
                              />
                            )}
                          </div>
                        </div>
                      </Link>
                      {/* <Link to={`/${ele.playerPubKey}`}> */}
                      <div className="flex justify-between">
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
                        <div className="font-bold text-xs tracking-wider uppercase text-opacity-[0.56] text-space-gray ">
                          WON
                        </div>
                      </div>
                      {/* </Link> */}
                      <div className="flex justify-between">
                        <div className="mt-4">
                          <div className="flex gap-1">
                            <img
                              src={`${compressimagePath}${ele.winnerMintImage}.png`}
                              onError={handleImageError}
                              className="w-8 h-7 lg:w-9 lg:h-8 mask mask-hexagon-2 mask-repeat object-cover opacity-40"
                              alt=""
                            />
                            {ele.winningNFT.map((player, i) => {
                              return (
                                <img
                                  src={`${compressimagePath}${player.mint}.png`}
                                  onError={handleImageError}
                                  key={i}
                                  className="w-8 h-7 lg:w-9 lg:h-8 mask mask-hexagon-2 mask-repeat object-cover"
                                  alt=""
                                />
                              );
                            })}
                          </div>
                        </div>
                        <div className="flex items-center">
                          {ele.winner_pubkey ===
                          ele.winningAllNFT[0].player_id ? (
                            <img
                              src={doge_2}
                              className="w-8 h-8 cursor-default"
                              alt=""
                            />
                          ) : (
                            <img
                              src={cheems_2}
                              className="w-8 h-8 cursor-default"
                              alt=""
                            />
                          )}
                        </div>
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
                            $ 400
                          </div>
                        </div>
                        <div
                          className="flex"
                          onClick={() => {
                            setSelectedIndex(index);
                            ConnectModal();
                          }}
                        >
                          <img src={eye} alt="" />
                        </div>
                      </div>
                    </Box>
                  </div>
                </Box>
              </CSSTransition>
            ))}
          </TransitionGroup>
        </List>
      </div>
      {rounds.length < total && (
        <div className="w-full my-12 text-center">
          <button
            className="p-4 text-base font-bold bg-opacity-50 rounded-lg bg-yankees-blue hover:bg-opacity-100 text-space-gray"
            onClick={() => {
              const newSkip = skip === 0 ? 4 : skip === 4 ? 10 : skip + 10;
              setSkip(newSkip);
            }}
          >
            Load More Results
          </button>
        </div>
      )}

      <InfoModal
        open={open}
        onClose={CloseModal}
        roundDetails={rounds[selectedIndex]}
      ></InfoModal>
    </>
  );
}
