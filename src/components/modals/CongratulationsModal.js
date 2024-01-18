import { Box, CircularProgress, IconButton, Modal } from "@mui/material";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import CloseIcon from "@mui/icons-material/Close";
import starleft from "../../assets/images/starleft.svg";
import starright from "../../assets/images/starright.svg";
import solana_icon from "../../assets/images/solana_icon.svg";
import eye from "../../assets/images/eye.svg";
import {
  baseUrl,
  compressimagePath,
  getAddress,
  handleImageError,
  imagePath,
} from "../../utils/utils";
import { useSelector, useDispatch } from "react-redux";
import { claim_nft } from "../../utils/claim_nft";
import { Link } from "react-router-dom";
import confetti from "canvas-confetti";
import { CheckIcon } from "@heroicons/react/outline";
import victory from "../../assets/audio/victory.mp3";
import { PublicKey } from "@solana/web3.js";
import { setFloorPrice } from "../../store/SolanaPrice";
import { connectionString } from "../../utils/connection";
import { toBlob, toPng } from "html-to-image";
import { Menu } from "@headlessui/react";
import ShareWinnerOption from "../ShareWinnerOption";

export default function CongratulationsModal({
  open,
  onClose,
  result,
  setIsAlreadyWithdraw,
  collections,
  duration,
  is1v1,
  gamePlayers,
  title,
  slug,
}) {
  const { userInfo } = useSelector((state) => state.userInfo);
  const gameResultRef = useRef(null);
  let dispatch = useDispatch();
  const [stateDetails, setStateDetails] = useState([]);
  // const [loosers, setLoosers] = useState([]);
  // console.log("result", result);

  const [loadedImages, setLoadedImages] = useState(0);
  const totalImages = is1v1 ? 2 : 6;

  const handleImageLoad = () => {
    setLoadedImages((prev) => prev + 1);
  };

  const pubKey = useSelector((state) =>
    state.Temp.pubKey ? state.Temp.pubKey.toString() : ""
  );
  const penaltyFees = useSelector((state) => state.platformSlice.penalty_fees);
  const isMute = useSelector((state) => state.topplayer.isMuted);
  const SOLPrice = useSelector((state) => state.solanaprice.priceUsdt);
  const onMute = localStorage.getItem("mute") ?? "false";
  const [claimState, setClaimState] = useState(-1);
  useEffect(() => {
    setClaimState(result?.isWithdraw ? 1 : 0);
  }, [result?.isWithdraw]);

  const fetchFloorPriceData = async () => {
    try {
      // console.log("collectionMint", collectionMint);
      const resp = await fetch(`${baseUrl}/getCollectionStatsDetails/${slug}`);
      let data = await resp.json();
      const formattedTotalSupply = new Intl.NumberFormat("en-US", {
        maximumFractionDigits: 1,
        notation: "compact",
        compactDisplay: "short",
      }).format(data.totalSupply);
      data.formattedTotalSupply = formattedTotalSupply;
      setStateDetails(data);
      dispatch(setFloorPrice(data.floorPrice));
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    if (title) fetchFloorPriceData();
  }, [title]);

  const sendWithdrawRequest = async (gamId, signature) => {
    try {
      const resp = await fetch(`${baseUrl}/withdrawn/${gamId}/${signature}`);
      await resp.json();
    } catch (error) {
      console.log(error);
    }
  };
  const TreasuryAccount = useSelector(
    (state) => new PublicKey(state.platformSlice.treasury_pubkey)
  );
  const [signature, setTxSignature] = useState();
  const claim = async () => {
    if (pubKey !== "") {
      try {
        setClaimState(-1);
        const signature = await claim_nft(
          pubKey,
          result.collection_mint,
          result.account,
          TreasuryAccount,
          is1v1,
          stateDetails?.floorPrice
        );
        setTxSignature(signature);
        sendWithdrawRequest(result.account, signature);
        setIsAlreadyWithdraw(true);
        setClaimState(1);
      } catch (error) {
        console.log(error);
        setClaimState(0);
      }
    }
  };

  const playAgain = async () => {
    try {
      const resp = await fetch(
        `${baseUrl}/gameState/${result.collection_mint}/2/false`
      );
      const obj = await resp.json();
      if (obj.msg === "created") {
        window.location.href = `${window.location.protocol}//${window.location.host}/winnertakesall/${slug}?gameId=${obj.data.account}`;
      } else if (obj.msg === "creating") {
        this();
      }
    } catch (err) {
      console.log(err);
    }
  };
  const start = useCallback(() => {
    let audio = new Audio(victory);
    if (onMute == "false") {
      return;
    } else {
      audio.play();
    }
  }, [onMute]);

  const Play1vs1Game = async () => {
    try {
      const resp = await fetch(
        `${baseUrl}/gameState/${result.collection_mint}/2/true`
      );
      const obj = await resp.json();
      // console.log("objjjjjjj", result);
      if (obj.msg === "created") {
        window.location.href = `/dogevscheems/${slug}?gameId=${obj.data.account}`;
      } else if (obj.msg === "creating") {
        this();
      }
    } catch (err) {
      console.log(err);
    }
  };

  // const uploadImageAndGetURL = async (image) => {
  //   try {
  //     const resp = await fetch(`${baseUrl}/generateShareImage`, {
  //       method: "POST",
  //       body: JSON.stringify({ image }),
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     });
  //     let data = await resp.json();
  //     let imageUrl = data?.imageUrl;
  //     return imageUrl;
  //   } catch (error) {
  //     console.log("error :>> ", error);
  //   }
  // };

  // useEffect(() => {
  //   const filteredPlayers = gamePlayers.filter((item) => item.player_id !== result?.winner_pubkey)
  //     .map((item) => item.player_id);
  //   setLoosers(filteredPlayers);
  // }, [gamePlayers, result?.winner_pubkey]);

  useEffect(() => {
    if (open) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        zIndex: "99999",
      });
      start();

      //   const generateAndAskForPlatform = async () => {
      //     if (loadedImages === totalImages) {
      //       // Assuming you want to wait for all images to load
      //       try {
      //         // Create and style a new div for the extra information.
      //         const extraInfo = document.createElement("div");
      //         extraInfo.innerHTML =
      //           "This is extra information only for the image";
      //         extraInfo.style.color = "white";
      //         extraInfo.style.fontSize = "20px";
      //         extraInfo.style.backgroundSize = "cover";
      //         extraInfo.style.margin = "10px";
      //         extraInfo.style.padding = "20px";
      //         extraInfo.style.textAlign = "center";
      //         extraInfo.style.width = "300px";
      //         extraInfo.style.height = "200px";

      //         // Create a container for the extra information and position it off-screen.
      //         const container = document.createElement("div");
      //         container.style.position = "absolute";
      //         container.style.left = "-9999px";
      //         container.appendChild(extraInfo);

      //         // Append the container to the body temporarily.
      //         document.body.appendChild(container);

      //         // Capture the PNG image.
      //         const blob = await toPng(extraInfo);

      //         // Remove the container from the body.
      //         document.body.removeChild(container);

      //         // Upload the image and get the URL.
      //         const uploadedImageURL = await uploadImageAndGetURL(blob);

      //         // Set the image URL in your state or wherever you need it.
      //         setImageDataUrl(`${imagePath}${uploadedImageURL.split("/").pop()}`);
      //       } catch (error) {
      //         console.error("Error generating or uploading image:", error);
      //       }
      //     }
      //   };

      //   // Call the function to generate and upload the image.
      //   generateAndAskForPlatform();
      // }
      // console.log("SOLPrice", SOLPrice);
      //     console.log("loosers", loosers);

      //     const generateAndAskForPlatform = async () => {
      //       if (loadedImages === totalImages) {
      //         // Your HTML string, add as much complexity as you want here
      //         let loosersNames;
      //         if (is1v1) {
      //           loosersNames = loosers[0].userName;
      //         } else {
      //           loosersNames = loosers.map((user) => user.userName).join(", ");
      //         }

      //         const loosersHTML = loosers
      //           .map(
      //             (loser) => `
      //     <div className="text-center">
      //       <img
      //         src="${imagePath}${loser.profileImage}"
      //         className="h-10 object-cover mask mask-hexagon-2 opacity-40 mask-repeat w-10"
      //         alt=""
      //       >
      //       <p className="text-base font-normal">${loser.userName}</p>
      //     </div>
      //   `
      //           )
      //           .join("");
      //         const extraInfoHTML = `
      //           <div className="text-white rounded shadow-md bg-background mx-auto w-1/2 p-5 text-center text-5xl">
      //           <div className="flex justify-center gap-1 mb-2">
      //             <div className="text-center">
      //               <img
      //                 src="${imagePath}${userInfo.profileImage}"
      //                 className="h-10 object-cover mask mask-hexagon-2 mask-repeat w-10"
      //                 alt=""
      //               >
      //               <p className="text-base font-normal">${userInfo.userName}</p>
      //             </div>
      //             ${loosersHTML}
      //           </div>
      //           <h1 className="text-lg font-normal">
      //           Player ${userInfo.userName} won this round of
      //           ${
      //             is1v1 ? "Doge vs cheems" : "Winner Takes All"
      //           } against ${loosersNames} and won
      //           ${is1v1 ? "1" : "5"} NFTs valued at
      //           ${result?.floorPrice?.toFixed(2)} SOL ($ ${
      //           SOLPrice === 0
      //             ? "-"
      //             : (
      //                 result?.floorPrice *
      //                 result?.winningNFT.length *
      //                 SOLPrice.data?.priceUsdt
      //               ).toFixed(2)
      //         }
      //         )
      //         </h1>
      //           </div>
      //         `;

      //         // Create a container for the extra information
      //         const container = document.createElement("div");
      //         container.innerHTML = extraInfoHTML;

      //         // Optionally, append the container to the DOM if your HTML-to-image library needs it
      //         document.body.appendChild(container);

      //         // Convert to image (assuming 'toPng' is your HTML-to-image function)
      //         const blob = await toPng(container);

      //         // Remove the container from the DOM to clean up
      //         document.body.removeChild(container);

      //         // Upload and set image URL
      //         const uploadedImageURL = await uploadImageAndGetURL(blob);
      //         setImageDataUrl(`${imagePath}${uploadedImageURL.split("/").pop()}`);
      //       }
      //     };

      //     generateAndAskForPlatform();
    }
  }, [open, start]);

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "#1C2438",
            boxShadow: 24,
            borderRadius: "24px",
            width: { xs: "300px", sm: "450px", md: "500px", lg: "540px" },
            overflow: { xs: "auto", sm: "auto", md: "auto", lg: "auto" },
            maxHeight: { xs: "90vh", sm: "500px", md: "650px", lg: "750px" },
            "&:focus": {
              outline: "none",
            },
          }}
          className="bg-image"
        >
          <div className="p-6">
            <div className="flex justify-between">
              <div></div>
              <div className="w-24 pl-8">
                <img
                  src={`${imagePath}profile400/${userInfo?.profileImage}`}
                  onError={handleImageError}
                  className="mask mask-hexagon-2 mask-repeat object-cover"
                  alt=""
                />
              </div>
              <div>
                <IconButton aria-label="close" size="medium" onClick={onClose}>
                  <CloseIcon sx={{ color: "#6A707F" }} />
                </IconButton>
              </div>
            </div>

            <div className="flex justify-center gap-2 mt-6">
              <div>
                <img src={starleft} alt="" />
              </div>
              <div className="flex items-center font-extrabold text-2xl sm:text-4xl leading-[48px] text-gray">
                Congratulations!
              </div>
              <div>
                <img src={starright} alt="" />
              </div>
            </div>
            <div className="mt-2">
              <div className="flex items-center justify-center text-xl font-black leading-8 text-gray">
                {userInfo.userName ? (
                  <div>{userInfo.userName}</div>
                ) : (
                  getAddress(result?.winner_pubkey)
                )}
              </div>
            </div>
            <div className="mt-6">
              <div className="flex items-center justify-center">
                <div className="text-sm font-semibold leading-6 tracking-wider text-center text-space-gray">
                  You won {is1v1 ? "1" : "5"} NFTs from the
                  <Link to={`/games/${collections.slug}`}>
                    <span className="text-lighter-blue">
                      {" "}
                      {collections.title} <br />
                    </span>
                  </Link>
                  collection by playing
                  {is1v1 ? (
                    <Link to={`/flipcoin`}>
                      <span className="capitalize text-lighter-blue">
                        {" "}
                        Doge vs cheems
                      </span>
                    </Link>
                  ) : (
                    <Link to={`/winnertakesall`}>
                      <span className="text-lighter-blue">
                        {" "}
                        Winner Takes All
                      </span>
                    </Link>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-10">
              <div ref={gameResultRef}>
                <div className="w-full p-8 m-auto sm:w-4/6 bg-midnight-express rounded-3xl">
                  {!is1v1 ? (
                    <div className="flex justify-center gap-1">
                      <div>
                        <img
                          src={`${compressimagePath}${result?.winnerMintImage}.png`}
                          onError={handleImageError}
                          onLoad={handleImageLoad}
                          className="h-8 object-cover mask mask-hexagon-2 mask-repeat  w-9 opacity-40"
                          alt=""
                        />
                      </div>

                      <div>
                        <img
                          src={`${compressimagePath}${result?.winningNFT[0].mint}.png`}
                          onError={handleImageError}
                          onLoad={handleImageLoad}
                          className="h-8 object-cover w-9 mask mask-hexagon-2 mask-repeat"
                          alt=""
                        />
                      </div>
                      <div>
                        <img
                          src={`${compressimagePath}${result?.winningNFT[1].mint}.png`}
                          onError={handleImageError}
                          onLoad={handleImageLoad}
                          className="h-8 object-cover w-9 mask mask-hexagon-2 mask-repeat"
                          alt=""
                        />
                      </div>
                      <div>
                        <img
                          src={`${compressimagePath}${result?.winningNFT[2].mint}.png`}
                          onError={handleImageError}
                          onLoad={handleImageLoad}
                          className="h-8 object-cover w-9 mask mask-hexagon-2 mask-repeat"
                          alt=""
                        />
                      </div>
                      <div>
                        <img
                          src={`${compressimagePath}${result?.winningNFT[3].mint}.png`}
                          onError={handleImageError}
                          onLoad={handleImageLoad}
                          className="h-8 object-cover w-9 mask mask-hexagon-2 mask-repeat"
                          alt=""
                        />
                      </div>
                      <div>
                        <img
                          src={`${compressimagePath}${result?.winningNFT[4].mint}.png`}
                          onError={handleImageError}
                          onLoad={handleImageLoad}
                          className="h-8 object-cover w-9 mask mask-hexagon-2 mask-repeat"
                          alt=""
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-center gap-1">
                      <div>
                        <img
                          src={`${compressimagePath}${result?.winnerMintImage}.png`}
                          onError={handleImageError}
                          onLoad={handleImageLoad}
                          className="h-8 object-cover mask mask-hexagon-2 mask-repeat w-9 opacity-40"
                          alt=""
                        />
                      </div>

                      <div>
                        <img
                          src={`${compressimagePath}${result?.winningNFT[0].mint}.png`}
                          onError={handleImageError}
                          onLoad={handleImageLoad}
                          className="h-8 w-9 object-cover mask mask-hexagon-2 mask-repeat"
                          alt=""
                        />
                      </div>
                    </div>
                  )}
                  <div className="mt-8 ">
                    <div className="flex justify-between text-space-gray uppercase text-xs tracking-wider text-opacity-[0.56] font-bold">
                      <div>FLOORPrice</div>
                      <div>ROI</div>
                    </div>
                    <div className="flex justify-between mt-4 text-sm font-semibold leading-6 tracking-wide text-gray">
                      <div className="flex gap-4">
                        <div className="flex items-center ">
                          {result?.floorPrice?.toFixed(2)} SOL
                        </div>
                      </div>
                      <div className="flex items-center">
                        {" "}
                        {result?.winningNFT.length * 100} %
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => {
                    is1v1 ? Play1vs1Game() : playAgain();
                  }}
                  className="px-5 py-2 text-sm font-bold leading-6 tracking-wider capitalize rounded-lg bg-light-green text-yankees-blue hover:bg-hover-light-green"
                >
                  Play Again
                </button>
                {duration && duration?.asSeconds() > 0 ? (
                  <button
                    // disabled={claimState !== 0}
                    onClick={claim}
                    className="px-5 py-2 text-sm font-bold leading-6 tracking-wider capitalize rounded-lg bg-light-blue bg-opacity-8 disabled:bg-light-blue-rgb text-light-blue "
                  >
                    {claimState === -1 ? (
                      <>
                        <div className="flex gap-2">
                          <div>Claiming</div>
                          <CircularProgress
                            sx={{ color: "#44C6E2" }}
                            size={20}
                          />
                        </div>
                      </>
                    ) : claimState === 1 ? (
                      <a
                        target="_blank"
                        rel="noreferrer"
                        href={`https://solscan.io/tx/${signature}?cluster=${connectionString}`}
                        className="flex gap-2"
                      >
                        <h1>View Tx</h1>
                        <CheckIcon className="w-5 h-5 text-light-blue" />
                      </a>
                    ) : (
                      `Claim Prizes`
                    )}
                  </button>
                ) : (
                  <button className="px-5 py-2 text-sm font-bold leading-6 tracking-wider capitalize rounded-lg cursor-not-allowed bg-gray bg-opacity-8 text-space-gray">
                    Claim Prizes
                  </button>
                )}
              </div>
            </div>
            <div className="flex justify-end mt-2 px-4 min-[600px]:px-20 min-[900px]:px-[6.5rem] lg:px-32">
              <p></p>
              <p className="text-sm font-medium">
                <span>Fee : </span>
                {(
                  ((result?.floorPrice *
                    result?.winningNFT.length *
                    penaltyFees) /
                    100) *
                  (is1v1 ? 2 : 6)
                ).toFixed(2)}{" "}
                SOL
              </p>
            </div>
          </div>
          <div className="justify-between flow-root mt-10 modal-footer sm:flex md:flex lg:flex xl:flex">
            <div className="py-4 pl-6">
              <div className="text-space-gray text-opacity-[0.64] uppercase font-bold text-xs tracking-wider">
                Total Value Won
              </div>
              <div className="flex gap-2 mt-1">
                <div className="flex">
                  <img src={solana_icon} width={21} height={18} alt="" />
                </div>
                <div>
                  <div className="text-xl font-black tracking-wide text-gray">
                    {(result?.floorPrice * result?.winningNFT.length).toFixed(
                      2
                    )}
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="text-xs font-black leading-6 tracking-wider text-space-gray ">
                    ( ${"  "}
                    {SOLPrice === 0
                      ? "-"
                      : (
                          result?.floorPrice *
                          result?.winningNFT.length *
                          SOLPrice.data?.priceUsdt
                        ).toFixed(2)}
                    )
                  </div>
                </div>
              </div>
            </div>
            <div className="py-[18px] px-6">
              <div className="flex gap-6">
                <div className="flex">
                  <Menu as="div" className="relative inline-block text-left">
                    <div>
                      <Menu.Button className="flex gap-4 px-4 py-2 text-sm font-bold leading-6 tracking-wide capitalize rounded-lg bg-nouveau-main bg-opacity-8 text-space-gray">
                        Share Results
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
                          />
                        </svg>
                      </Menu.Button>
                    </div>
                    {/* <ShareWinnerOption
                      imageDataUrl={imageDataUrl}
                    ></ShareWinnerOption> */}
                  </Menu>
                </div>
                <div className="flex">
                  <img src={eye} alt="" />
                </div>
              </div>
            </div>
          </div>
        </Box>
      </Modal>
    </>
  );
}
