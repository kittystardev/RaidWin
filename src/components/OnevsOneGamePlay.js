/* eslint-disable jsx-a11y/alt-text */
import React, { Fragment, useMemo } from "react";
import solana_icon from "../assets/images/solana_icon.svg";
import player_1_stand from "../assets/images/player_1_stand.svg";
import player_2_stand from "../assets/images/player_2_stand.svg";
import winner from "../assets/images/winner.svg";
import doge_2 from "../assets/images/doge_2.svg";
import cheems from "../assets/images/cheems.svg";
import SVGComponent from "./Common/SVGComponent";
import { Menu, Tooltip } from "@mui/material";
import { InformationCircleIcon } from "@heroicons/react/outline";
import CollectionDescription from "./onevsone/CollectionDescription";
import PlayerInformation from "./onevsone/PlayerInformation";
import OneVsOnePreviousRounds from "./onevsone/OneVsOnePreviousRounds";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setAlertIdx, setModalIdx } from "../store/NFTModal";
import { useRef } from "react";
import {
  resetNftList,
  setCollectionMintForModal,
  setConnectModal,
  setFromGameJoin,
} from "../store/TempSlice";
import { useState } from "react";
import plus_button from "../assets/images/plus_button.svg";
import add_new_nft from "../assets/images/add_new_nft.svg";
import {
  baseUrl,
  decodeMetadata,
  getCreator,
  getMetadataAccount,
  handleImageError,
  imagePath,
  parseWiningRound,
  socket,
} from "../utils/utils";
import { useEffect } from "react";
import { decodeMintsState } from "../utils/joinGame";
import { PublicKey } from "@solana/web3.js";
import { connection } from "../utils/connection";
import { DummyPubKey } from "../utils/utils";
import { getPlayerImages } from "../utils/utils";
import dotshover from "../assets/images/dotshover.svg";
import WithdrawModal from "./modals/WithdrawModal";
import { waitForFinalized } from "../utils/externalwallet";
import { disjoin_game } from "../utils/disjoin_game";
import star from "../assets/images/star.svg";
import { useCallback } from "react";
import CongratulationsModal from "./modals/CongratulationsModal";
import moment from "moment/moment";
import Color from "color-thief-react";
import styled from "styled-components";
import { setFloorPrice } from "../store/SolanaPrice";
import PreviousRounds from "./PreviousRounds";
import { setIsMuted } from "../store/topplayer";
import mute_icn from "../assets/images/mute_icon.svg";
import speaker_icn from "../assets/images/speaker_icn.svg";
import PageNotFound from "./Common/PageNotFound";
import { Vortex } from "react-loader-spinner";

import Lottie from "lottie-react";
import animation_optimized from "../json/animation_optimized.json";
import { getCollectionMintByName } from "../utils/collections";
import { animated, useSpring } from "@react-spring/web";

import spin from "../assets/audio/spin.wav";
import player_join from "../assets/audio/player_join.wav";
import roundwin from "../assets/audio/roundwin.wav";
import { Helmet } from "react-helmet";

const map = new Map();

export const classes = {
  pending: "opacity-100",
  begin: "opacity-20",
  active: "hex-green opacity-100 container-img",
  WON: "bg-lighter-blue opacity-100",
  YOU: "bg-lighter-blue opacity-20",
};

const _players = [
  {
    id: 0,
    mintImage: add_new_nft,
    playerImage: "",
    playerName: "",
    userName: "",
    playerPubKey: "",
    mintAddress: "",
  },
  {
    id: 1,
    mintImage: add_new_nft,
    playerImage: "",
    playerName: "",
    userName: "",
    playerPubKey: "",
    mintAddress: "",
  },
];

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    backgroundColor: "#27314B",
    borderRadius: "24px",
    // marginTop: theme.spacing(1),
    paddingLeft: "24px",
    paddingRight: "24px",
    minWidth: 240,
  },
  "&:hover": {
    background: "transparent",
  },
}));

let SpinAudio = new Audio(spin);
let playerJoinAudio = new Audio(player_join);
let audio = new Audio(roundwin);

export default function OnevsOneGamePlay() {
  let dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // const [toLocalStorage, setToLocalStorage] = useState(false);

  const isMuted = useSelector((state) => state.topplayer.isMuted);
  const [onMute, setOnMute] = useState(
    localStorage.getItem("mute") ? localStorage.getItem("mute") : "false"
  );
  const [loading, setLoading] = useState(true);
  const [stateDetails, setStateDetails] = useState([]);
  const [side, setSide] = useState(0); // 0 for front side, 1 for back side
  const [flipping, setFlipping] = useState(true);
  const [isAnimating, setIsAnimating] = useState(true);
  const [speed, setSpeed] = useState(0.3);

  const handleMute = () => {
    // setToLocalStorage(!toLocalStorage);
    // localStorage.setItem("mute", toLocalStorage);
    setOnMute(onMute === "true" ? "false" : "true");
  };

  // useEffect(() => {
  //   let fromLocalStorage = localStorage.getItem("mute");
  //   dispatch(setIsMuted(fromLocalStorage === "true" ? false : true));
  // }, [isMuted, toLocalStorage]);

  useEffect(() => {
    localStorage.setItem("mute", onMute);
    dispatch(setIsMuted(onMute));
  }, [onMute]);

  const [searchParams] = useSearchParams();

  let { collectionMint: collectionMintName } = useParams();
  let [collectionMint, setCollectionMint] = useState("");
  useEffect(() => {
    getCollectionMintByName(collectionMintName, true).then((resp) => {
      setCollectionMint(resp);
    });
  }, [collectionMintName]);

  let gameId = searchParams.get("gameId");

  const pubKey = useSelector((state) => (state.Temp.pubKey ? state.Temp.pubKey.toString() : ""));
  const creators = useRef([]);
  const joiningLock = useRef(false);
  let [players, setPlayers] = useState(_players);

  const toggle = () => {
    dispatch(setCollectionMintForModal(collectionMint));
    dispatch(setFromGameJoin(true));
    dispatch(setConnectModal(true));
  };

  const joining = useSelector((state) => state.Index.alertdata);
  const [withdrawopen, setWithdrawOpen] = useState(false);
  const handleWithdraw = () => setWithdrawOpen(true);
  const CloseModal = () => setWithdrawOpen(false);
  const [claimState, setClaimState] = useState(-1);
  const [mintJoined, setMintJoined] = useState("");
  const [finalWinner, setFinalWinner] = useState(-1);
  const [gameResult, setGameResult] = useState(null);
  const accessToken = useSelector((state) => state.Temp.accessToken);
  const [isAlreadyWithdraw, setIsAlreadyWithdraw] = useState(false);
  const [timeDiff, setTimeDiff] = useState(0);
  const [NumOfJoin, setNumOfJoin] = useState(0);
  const [countDown, setCountDown] = useState(null);
  const [gamePlayers, setGamelayers] = useState([]);
  const winnerAnnounce = useRef(false);
  const [completed, setCompleted] = useState(false);
  let [currentActive, setCurrentActive] = useState(0);
  const [isIntervalSet, setIsIntervalSet] = useState(false);
  const [isWithdrawWinning, setIsWithdrawWinning] = useState(false);
  const fromGammeJoin = useSelector((state) => state.Temp.fromGammeJoin);
  const [pageNotFound, setPageNotFound] = useState(false);
  const player1Ref = useRef(null);
  const player2Ref = useRef(null);
  const playersRef = [player1Ref, player2Ref];

  let [isAlreadyPlayed, setIsAlreadyPlayed] = useState(false);
  useEffect(() => {
    let timeOut;
    if (isAlreadyPlayed) return; //if it's there it will let audio play only once..
    if (finalWinner !== -1) {
      setIsAlreadyPlayed(true); //For Playing once only winner audio
    }
    return () => {
      if (timeOut) clearTimeout(timeOut);
    };
  }, [finalWinner, isMuted]);

  const TreasuryAccount = useSelector(
    (state) => new PublicKey(state.platformSlice.treasury_pubkey)
  );

  const [afterComplete, setAfterCompelete] = useState([
    {
      display: false,
      image: "",
      bgcolor: "",
      text: "",
      isBoth: false,
    },
    {
      display: false,
      image: "",
      bgcolor: "",
      text: "",
      isBoth: false,
    },
  ]);

  const Winner_DATA = [
    {
      Winner_image: "",
      User_name: "",
      winningNFT: [],
      floorPrice: 0,
      total: 0,
      ROI: 0,
      updatedAt: "",
    },
  ];

  const leaveGameCallBack = useCallback(() => {
    leaveGame();
  }, [mintJoined, pubKey, collectionMint]);

  const leaveGame = async () => {
    try {
      setClaimState(0);
      const signature = await disjoin_game(
        pubKey,
        mintJoined,
        collectionMint,
        TreasuryAccount,
        true,
        stateDetails.floorPrice
      );
      // console.log("TreasuryAccount", TreasuryAccount);
      //   modalClose();

      //   localStorage.removeItem("hasAudioPlayed");
      dispatch(
        setAlertIdx({
          info: "Confirming Transaction",
          open: true,
          response: "",
        })
      );

      await waitForFinalized(signature);
      dispatch(
        setAlertIdx({
          info: "Transaction Confirmed",
          open: true,
          response: "success",
        })
      );

      setTimeout(() => {
        dispatch(setAlertIdx({ info: "", open: false, response: "success" }));
      }, 3000);

      setTimeout(() => {
        socket.emit("GetGameStateById1v1", gameId);
        socket.emit("NewOrDisjoinedJoined1v1", { accessToken, gameId });
        // handleClose();
        CloseModal();
      }, [1000]);
      setClaimState(1);
    } catch (err) {
      console.log(err);
      setClaimState(-1);
      dispatch(setAlertIdx({ info: "Failed", open: true, response: "" }));
      setTimeout(() => {
        dispatch(setAlertIdx({ info: "", open: false, response: "Failed" }));
      }, 2000);
    }
  };

  useEffect(() => {
    (async function () {
      try {
        const resp = await fetch(`${baseUrl}/gameBytId/${gameId}`);
        // console.log("response", await resp.json());
        // alert("response gotten");
        if ((await resp.json()).length === 0) {
          setPageNotFound(false);
          if (loading) setLoading(false);
          return;
        }
        const obj = (await resp.json())[0];
        const winnerPub = obj.games[0]?.winner_pubkey;
        let finalWinner = -1;
        if (winnerPub === DummyPubKey) {
          setLoading(false);
          return;
        }
        switch (winnerPub) {
          case obj.games[0].players[0].player_id:
            finalWinner = 1;
            break;

          case obj.games[0].players[1].player_id:
            finalWinner = 2;
            break;
        }
        if (finalWinner === -1) {
          setLoading(false);
          return;
        }
        setGameResult(obj.games);
        setFinalWinner(finalWinner);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
        // alert("Something went wrong");
      }
    })();
  }, [gameId]);

  let winnerIndex;
  useEffect(() => {
    const afterWinnerState = [];
    for (let i = 0; i < 2; i++) {
      if (pubKey == players[i].playerPubKey && finalWinner === -1) {
        if (players[i].playerPubKey === "" && pubKey === "") {
          afterWinnerState.push({
            display: false,
            image: "",
            bgcolor: "",
            text: "",
            isBoth: false,
          });
        } else {
          afterWinnerState.push({
            display: true,
            image: star,
            bgcolor: "bg-lighter-blue",
            text: "YOU",
            isBoth: i == finalWinner - 1,
          });
        }
      } else if (i == finalWinner - 1) {
        winnerIndex = i;
        afterWinnerState.push({
          display: true,
          image: winner,
          bgcolor: "bg-dark-purple",
          text: "WON",
          isBoth: false,
        });
      } else {
        afterWinnerState.push({
          display: false,
          image: "",
          bgcolor: "",
          text: "",
          isBoth: false,
        });
      }
    }
    // console.log("afterWinnerState", afterWinnerState);
    setAfterCompelete(afterWinnerState);
    if (players[winnerIndex] === undefined || players[winnerIndex] === "") return;
    Winner_DATA[0].User_name = players[winnerIndex].userName;
    Winner_DATA[0].Winner_image = players[winnerIndex].playerImage;
    // console.log("data_winnner", Winner_DATA[0].Winner_image);
    setIsAnimating(false);
  }, [finalWinner, pubKey, players]);

  const modalOpen = (side) => {
    dispatch(
      setModalIdx({
        modal: true,
        collectionMint: collectionMint,
        gameId: gameId,
        creators: creators.current,
        is1v1: true,
        side: side,
      })
    );
  };

  useEffect(() => {
    let count = 0;
    let NumOfJoin = 0;
    players.forEach((ele) => {
      if (ele.mint == "") {
        count++;
      }
      if (ele.playerName != "") {
        NumOfJoin++;
      }
    });
    setNumOfJoin(NumOfJoin);
  }, [players]);

  const { x } = useSpring({
    from: { x: side },
    to: { x: isAnimating ? (side === 0 ? 1 : 0) : side },
    config: { duration: 1000 / speed },
    onRest: () => {
      if (isAnimating) {
        if (side === 0) {
          setSide(1);
        } else {
          setSide(0);
        }
      }
    },
  });

  // useEffect(() => {
  //   let currentActive = 0;
  //   setNumOfJoin(2)
  //   const interval = setInterval(() => {
  //     currentActive = (currentActive + 1) % 6;
  //     startGame({ countdown: "GO", currentActive, finished: true });
  //   }, 100);
  //   return () => {
  //     clearInterval(interval);
  //   };
  // }, [isMuted]);

  const [isGameStarted, setIsGameStarted] = useState(true);
  let currentActiveChanges = 0;
  const startGame = ({ countdown, currentActive, finished }) => {
    if (winnerAnnounce.current) return;
    if (countdown == 1) {
      setIsGameStarted(false);
      setTimeout(() => {
        audioStart();
      }, 1000);
      setCountDown("Go");
      setSpeed(2);
    }

    console.log("finished", isGameStarted);
    if (finished) {
      setSide(currentActive === 1 ? 0 : 1);
      // setSpeed(0);
      // setFinalWinner(currentActive);

      setIsAnimating(false);

      setTimeout(() => {
        announceWinner(true);
      }, 2000);
      return;
    }
    setCountDown(countdown);
    if (currentActive !== 0 && onMute != "false") {
      // startAudio();
      PlayAudioTest();
      currentActiveChanges += 1;
    }
    setCurrentActive(currentActive);

    // Changing the speed of rotation on totalCount.
    if (currentActiveChanges === 15) {
      setSpeed(1.5);
    } else if (currentActiveChanges === 20) {
      setSpeed(1);
    } else if (currentActiveChanges === 25) {
      setSpeed(0.8);
    } else if (currentActiveChanges === 30) {
      setSpeed(0.6);
    } else if (currentActiveChanges === 35) {
      setSpeed(0.4);
    } else if (currentActiveChanges === 36) {
      setSpeed(0.3);
    } else if (currentActiveChanges === 37) {
      setSpeed(0.2);
    } else if (currentActiveChanges === 38) {
      setSpeed(0.1);
    }
  };

  const audioStart = () => {
    if (onMute == "false") {
      return;
    } else {
      playerJoinAudio.play();
      console.log("playingg");
    }
  };

  const PlayAudioTest = async () => {
    // console.log("playingg");
    const context = new (window.AudioContext || window.webkitAudioContext)();

    const buffer = await fetch(spin).then((resp) => resp.ok && resp.arrayBuffer());

    const audiobuffer = await context.decodeAudioData(buffer);

    const buffersource = context.createBufferSource();
    buffersource.buffer = audiobuffer;
    buffersource.connect(context.destination);
    const starttime = context.currentTime;
    buffersource.start(starttime, 0, 0.1);
  };

  useEffect(() => {
    if (pubKey != "") dispatch(setConnectModal(false));

    setTimeout(() => {
      if (gameId == "" || !gameId) {
        setPageNotFound(false);
        socket.emit("GetCurrentGameState", {
          collection_mint: collectionMint,
          status: 2,
        });
      } else socket.emit("GetGameStateById", gameId);
    }, [500]);
    announceWinner(false);

    return () => {
      console.log("Off....");
    };
  }, [pubKey]);

  const coin_static = useRef();

  useEffect(() => {
    socket.on("gameCountDown1v1", (resp) => {
      // console.log("gameCountDown1v1", resp);
      setIsGameStarted(true);
      setTimeout(() => {
        startGame(resp);
      }, 2000);
    });
    socket.on("GameState1v1", (resp) => {
      // console.log("GameState1v1", resp);
      playerSelect(resp);
    });
    return () => {
      socket.off("gameCountDown1v1");
      socket.off("GameState1v1");
    };
  }, [pubKey, players, isMuted]);

  useEffect(() => {
    if (gameId != "") socket.emit("GetGameStateById1v1", gameId);
  }, [gameId]);

  useEffect(() => {
    (async function () {
      // console.log("collection_mint", collectionMint);
      if (collectionMint != "" && gameId != "") {
        try {
          const data = await getCreator(collectionMint);
          if (!data.creators) {
            setPageNotFound(true);
            return;
          }
          creators.current = data.creators;
          if (pageNotFound) setPageNotFound(false);
        } catch (error) {
          console.log(error);
        }

        await announceWinner(true);
        socket.on("connect", () => {
          console.log("connect");
        });

        socket.on("disconnect", () => {
          console.log("disconnect");
        });

        socket.emit("join", gameId);
      } else {
        return;

        // setPageNotFound(true);
      }
    })();
    dispatch(setCollectionMintForModal(collectionMint));

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.emit("disjoin", gameId);
    };
  }, [collectionMint, gameId, pubKey]);

  useEffect(() => {
    if (!pubKey) return;
    for (let i = 0; i < players.length; i++) {
      if (players[i].playerPubKey === pubKey) {
        setMintJoined(players[i].mintAddress);
        return;
      }
    }
  }, [pubKey, players]);

  const playerSelect = async (temp) => {
    try {
      if (temp.msg === "No Game found") {
        return;
      }
      const game = temp.data;
      const game_state_account = game.account;
      const obj = await decodeMintsState(game_state_account, true);
      const mintAddress = [obj.mint1.toString(), obj.mint2.toString()];

      let mints = await Promise.all(mintAddress.map((ele) => getMetadataAccount(ele)));
      let mintPubkeys = mints.map((m) => new PublicKey(m));

      let multipleAccounts = await connection.getMultipleAccountsInfo(mintPubkeys);
      const nftMetadata = multipleAccounts.map((account) =>
        account !== null
          ? decodeMetadata(account.data)
          : { data: { name: "", uri: "" }, mint: "", mintImage: "" }
      );
      const nftData = await Promise.all(
        nftMetadata.map(async (nft) => {
          let res;
          let mintImage;
          if (nft.data.uri !== "") {
            try {
              const resp = await fetch(`${baseUrl}/mint/${nft.mint}`);
              const { data } = await resp.json();
              if (data != null) {
                mintImage = `${imagePath}smNft400/${nft.mint}.png` ?? data.mint_image;
                // mintImage = `${data.mint_image}`;
              } else {
                res = await fetch(nft.data.uri);
                const data = await res.json();
                mintImage = data.image;
              }
            } catch (error) {
              res = await fetch(nft.data.uri);
              const data = await res.json();
              mintImage = data.image;
            }
          } else mintImage = add_new_nft;

          return {
            playerName: nft.data.name,
            mint: nft.mint,
            mintImage,
          };
        })
      );
      const keys = Object.keys(game);
      let players_ = [];
      for (let i = 0; i < 2; i++) {
        players_[i] = {
          playerName: "",
          mint: "",
          mintImage: add_new_nft,
          playerPubKey: "",
        };
      }
      let hasSeen = false;
      nftData.forEach((ele, index) => {
        if (pubKey && game[keys[3 + index * 2]] === pubKey) {
          hasSeen = true;
        }

        players_[index] = {
          ...ele,
          playerPubKey: game[keys[3 + index * 2]],
        };
      });
      let flag = true;
      const pubKeys = players_
        .map(({ playerPubKey }) => playerPubKey)
        .filter((pubKey) => pubKey !== DummyPubKey && !map.has(pubKey));
      const playersDetails = await getPlayerImages(pubKeys);
      playersDetails.forEach(({ userName, profileImage, _id }) => {
        map.set(_id, { profileImage, userName });
      });
      const _players = players_.map((ele, index) => {
        if (ele.playerPubKey == DummyPubKey && !hasSeen && flag) {
          flag = false;
          ele.mintImage = add_new_nft;
        }
        let obj = { ...players_[index], mintImage: ele.mintImage };
        if (map.has(ele.playerPubKey)) {
          const { profileImage: playerImage, userName } = map.get(ele.playerPubKey);
          obj = {
            ...obj,
            playerImage,
            userName,
            mintAddress: mintAddress[index],
          };
        }
        return obj;
      });
      if (game?.winner_pubkey === DummyPubKey) {
        for (let i = 0; i < _players.length; i++) {
          if (
            players[i].playerPubKey != "" &&
            players[i].playerPubKey != _players[i].playerPubKey &&
            _players[i].playerPubKey !== DummyPubKey
          ) {
            audioStart();
            break;
          }
        }
      }
      setPlayers(_players);
    } catch (err) {
      console.log(err);
    }
  };

  const getMintImage = (img) => (img == add_new_nft || img === plus_button ? "" : img);

  const mintImage1 = useMemo(() => {
    return getMintImage(players[0].mintImage);
  }, [players]);
  const mintImage2 = useMemo(() => {
    return getMintImage(players[1].mintImage);
  }, [players]);

  // Fetching NFT collections
  const [collections, setCollections] = useState([]);
  const fetchData = async () => {
    try {
      const resp = await fetch(`${baseUrl}/collectionByCollectionMint/${collectionMint}`);
      let data = await resp.json();
      // console.log("datass", data);
      setCollections(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (collectionMint) fetchData();
  }, [collectionMint]);

  const [pre_winner, setPer_Winner] = useState([]);

  const [result, setResult] = useState({
    winner_pubkey: DummyPubKey,
  });

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");

  let display;
  const announceWinner = async (openCongratsDialog) => {
    const resp = await fetch(`${baseUrl}/gameBytId/${gameId}`);
    const obj = (await resp.json())[0];
    if (!obj) {
      setPageNotFound(false);
      return;
    }
    // console.log("objobjobjobj", obj);
    setTitle(obj.title);
    setSlug(obj.slug);
    const result = parseWiningRound([{ games: obj.games }])[0];
    setResult(result);
    // console.log("objWinner", obj);
    const winnerPub = obj.games[0]?.winner_pubkey;
    // console.log("objWinner", winnerPub);
    let finalWinner = -1;
    if (winnerPub === DummyPubKey) {
      return;
    }
    switch (winnerPub) {
      case obj.games[0].players[0].player_id:
        finalWinner = 1;
        break;
      case obj.games[0].players[1].player_id:
        finalWinner = 2;
        break;
    }
    // const result = parseWiningRound([{ games: obj.games }])[0];
    // console.log("objWinner", finalWinner);
    setCurrentActive(finalWinner);
    setFinalWinner(finalWinner);
    setCompleted(true);
    winnerAnnounce.current = true;
    setIsAlreadyWithdraw(obj.games[0].isWithdraw);

    // console.log("AnnouseWinnnnnerrr...", result);
    Winner_DATA[0].floorPrice = result.floorPrice;
    Winner_DATA[0].winningNFT = result.winningNFT;
    Winner_DATA[0].total = result.total;
    Winner_DATA[0].ROI = result.ROI;
    Winner_DATA[0].updatedAt = result.updatedAt;
    Winner_DATA[0].is1v1 = true;
    Winner_DATA[0].title = result.title;
    Winner_DATA[0].slug = result.slug;

    setPer_Winner(Winner_DATA);

    if (openCongratsDialog && pubKey === winnerPub) {
      if (result?.winner_pubkey != DummyPubKey && !obj.games[0].isWithdraw) {
        document.getElementById("rules").click();
      }
      WinnerModal();
    }
    setCountDown("");
  };

  const [winneropen, setWinnerOpen] = useState(false);

  // console.log("resulttttt", result);
  // if (result.isWithdraw) {
  //   return;
  // }
  const WinnerModal = () => {
    setTimeout(() => {
      display = setWinnerOpen(true);
    }, 2500);

    if (display) clearTimeout(display);
  };
  const modalClose = () => {
    setWinnerOpen(false);
  };

  useEffect(() => {
    const getPlayersById = async () => {
      const response = await fetch(`${baseUrl}/gameByUser/${gameId}`);
      const data = await response.json();
      setGamelayers(data[0].players);
    };
    getPlayersById();
  }, [gameId]);

  useEffect(() => {
    if (pre_winner.length > 0) {
      if (!isIntervalSet) {
        setIsIntervalSet(true);
      }
    }
  }, [pre_winner]);

  useEffect(() => {
    if (pubKey.toString() != "" && fromGammeJoin && joiningLock.current) {
      joiningLock.current = false;
      for (let i = 0; i < players.length; i++) {
        if (players[i].playerPubKey == pubKey.toString()) {
          return;
        }
      }
      dispatch(resetNftList());
      setTimeout(() => {
        modalOpen();
      }, [1000]);
    }
  }, [pubKey, fromGammeJoin]);

  const participant = (index) => {
    joiningLock.current = true;
    // debugger
    if (players[index].mintImage != add_new_nft) return;
    if (pubKey == "") {
      toggle();
      return;
    }
    joiningLock.current = false;
    dispatch(resetNftList());
    // let timeout = setTimeout(() => {
    modalOpen(index);
    // }, [100]);

    // return () => {
    //   clearTimeout(timeout)
    // }
  };

  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);

  const [joinLocation, setJoinLocation] = useState();
  const handleClick = (event, index) => {
    console.log("index", index);

    if (index === 1) {
      if (players[0].playerPubKey === pubKey) {
        return;
      }
    } else if (index === 0) {
      if (players[1].playerPubKey === pubKey) {
        return;
      }
    }

    // setJoinLocation(index);
    if (players[index].playerPubKey === pubKey && (NumOfJoin !== 2 || finalWinner != -1)) {
      if (finalWinner != -1) {
        if (afterComplete[index].text !== "YOU" || isAlreadyWithdraw) return;
        setIsWithdrawWinning(true);
      }
      setAnchorEl(event.currentTarget);
    }
    participant(index);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    let interval;
    if (isIntervalSet) {
      // console.log("dateString", "Interval set");
      interval = setInterval(() => {
        const updateDate = moment(pre_winner[0]?.updatedAt);
        const newUpdatedDate = updateDate.clone().add({ minutes: 4 });
        const currentDate = moment();
        const duration = moment.duration(newUpdatedDate.diff(currentDate));
        setTimeDiff(duration);
        // console.log("dateString", duration.days(), duration.hours(), duration.minutes(), duration.seconds())
      }, 1000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [isIntervalSet]);

  const Play1vs1Game = async () => {
    // console.log("collection1v1", collections);
    if (collections.slug === undefined) {
      setPageNotFound(true);
      return;
    } else {
      try {
        const resp = await fetch(`${baseUrl}/gameState/${collectionMint}/2/true`);
        const obj = await resp.json();
        setPageNotFound(false);
        if (obj.msg === "created") {
          navigate(`/dogevscheems/${collections.slug}?gameId=${obj.data.account}`);
          window.location.reload();
        } else if (obj.msg === "creating") {
          this();
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  useEffect(() => {
    const Redirect = async () => {
      if (!collectionMint && !collections) return;

      setPageNotFound(false);
      if (!collections?.slug || location.search) return;
      try {
        const resp = await fetch(`${baseUrl}/gameState/${collectionMint}/2/true`);
        const obj = await resp.json();

        if (obj.msg === "created") {
          navigate(`/dogevscheems/${collections.slug}?gameId=${obj.data.account}`);
        } else if (obj.msg === "creating") {
          console.log("creating");
        }
      } catch (err) {
        console.log(err);
      }
    };
    Redirect();
  }, [collections, gameId]);

  // console.log("playerssafsdfsdf", players);
  // console.log("playerssafsdfsdf", result);

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

  // console.log("resultsdsdsdsd", result);

  return (
    <>
      {pageNotFound ? (
        <PageNotFound />
      ) : (
        <>
          {title ? (
            <Helmet>
              <title>{title}</title>
            </Helmet>
          ) : (
            <Helmet>
              <title>RaidWin</title>
            </Helmet>
          )}
          {loading && (
            <div className="fixed inset-0 flex w-screen h-screen justify-center items-center bg-background bg-opacity-90 z-[80] ">
              <Lottie
                animationData={animation_optimized}
                loop={true}
                className="flex items-center justify-center w-full lg:w-1/3 h-screen mx-auto"
              />
            </div>
          )}

          <div className="justify-between block sm:block md:block lg:flex">
            <div className="">
              <div className="md:flex md:gap-2 font-black">
                <p className="text-2xl tracking-wide text-gray">Dogs vs Cheems</p>
                <p className="flex items-end text-sm leading-6 tracking-wider text-nouveau-main">
                  {collections.title} - {NumOfJoin}/2
                </p>
              </div>
              <div className="mt-2">
                <div className="text-space-gray text-opacity-[0.8] tracking-wide font-semibold text-sm leading-6">
                  {NumOfJoin === 0 ? (
                    <>
                      {" "}
                      Waiting for <span className="text-light-green"> 2 </span>
                      Players{" "}
                    </>
                  ) : NumOfJoin === 1 ? (
                    <>
                      Waiting for <span className="text-light-green">1</span> more player...{" "}
                    </>
                  ) : countDown !== "GO" && finalWinner === -1 ? (
                    <>
                      Game starting in&nbsp;
                      <span className="text-light-green">{countDown}</span>
                      &nbsp; seconds
                    </>
                  ) : finalWinner === -1 && countDown === "GO" ? (
                    <>Game started</>
                  ) : (
                    <>Game ended</>
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-6 sm:mt-6 md:mt-6 lg:mt-0">
              <div
                className="bg-nouveau-main bg-opacity-[0.08] rounded-lg px-6 py-3 text-space-gray font-bold h-fit hover:cursor-pointer"
                onClick={() => {
                  handleMute();
                }}
              >
                {onMute == "true" ? (
                  <img src={speaker_icn} className="w-6 h-6" />
                ) : (
                  <img src={mute_icn} className="w-6 h-6" />
                )}
              </div>
              <button
                id="rules"
                className="bg-nouveau-main bg-opacity-[0.08] h-fit rounded-lg px-6 py-3 text-space-gray font-bold"
              >
                Rules
              </button>
            </div>
          </div>
          <div className="mt-6">
            <div className="bg-pastel bg-opacity-[0.64] rounded-[40px] backdrop-blur-[20px] background-bg">
              <PlayerInformation afterComplete={afterComplete} players={players} />
              <div className="flex justify-center mt-8 text-2xl text-gray"> {countDown} </div>

              {finalWinner !== -1 && (
                <div className="relative w-3/4 ml-10 sm:w-2/4">
                  <div
                    className="bg-chat-header-rgba bg-opacity-80 rounded-3xl backdrop-blur-md p-6 w-full top-5 absolute z-[999] "
                    role="alert"
                  >
                    <div className="flex ">
                      <div>
                        <p className="text-sm font-semibold tracking-wide text-space-gray">
                          This round has ended,{" "}
                          <span
                            className="cursor-pointer text-chat-tag"
                            onClick={() => Play1vs1Game()}
                          >
                            Click Here{" "}
                          </span>{" "}
                          <br />
                          to go to the new round
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="p-6 mt-6">
                <div className="flex justify-around">
                  <div className="relative hidden sm:hidden md:hidden lg:flex">
                    <div className="absolute z-20 left-1/2 top-[5%] transform-translate-doge w-[104px] h-[104px]">
                      <img src={doge_2} alt="doge" />
                    </div>
                    <div>
                      <img
                        src={player_1_stand}
                        className="relative z-10 transform-translate-stand"
                      />
                    </div>
                  </div>
                  <div className="flex-col items-center hidden sm:hidden md:hidden lg:flex">
                    <div className="hover:cursor-pointer w-28 h-28">
                      {finalWinner !== -1 && finalWinner !== 1 && (
                        <div className={`hex absolute `}>
                          <div
                            className={`hex-background  mask mask-hexagon-2 mask-repeat object-cover opacity-100`}
                          >
                            <img
                              src={plus_button}
                              className={`hover:cursor-pointer w-28 h-28 mask mask-hexagon-2 mask-repeat object-cover absolute top-[3px] right-[2.5px]`}
                            />
                          </div>
                        </div>
                      )}
                      <div
                        ref={playersRef[0]}
                        className={`hex absolute  ${finalWinner == 1 ? "winner" : ""}`}
                        onClick={(e) => {
                          console.log(
                            "pubKey#",
                            players[0].playerPubKey,
                            pubKey,
                            joining.open,
                            players[1].playerPubKey,
                            DummyPubKey
                          );
                          if (
                            // players[0].playerPubKey === pubKey ||
                            joining.open &&
                            (players[1].playerPubKey === pubKey ||
                              players[1].playerPubKey === DummyPubKey)
                          )
                            return;
                          else return handleClick(e, 0);
                        }}
                        aria-controls={open ? "account-menu" : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? "true" : undefined}
                      >
                        {afterComplete[0].display && (
                          <>
                            <div
                              className={`flex ${
                                afterComplete[0].bgcolor
                              } text-yankees-blue gap-2 justify-center rounded-xl py-1 px-2 w-16 absolute ${
                                afterComplete[0].text === "YOU"
                                  ? "-top-[22px] left-[30px]"
                                  : "top-[77px] left-[91px] -rotate-[60deg] "
                              } `}
                            >
                              <img src={afterComplete[0].image} />
                              <div className="text-xs font-bold tracking-wide uppercase">
                                {afterComplete[0].text}
                              </div>
                            </div>
                          </>
                        )}

                        {result?.winner_pubkey !== DummyPubKey &&
                          players[0].playerPubKey === pubKey && (
                            <>
                              <div
                                className={`flex bg-blue text-yankees-blue gap-2 justify-center rounded-xl py-1 px-2 w-16 absolute  top-[77px] -left-[33px] rotate-[60deg] `}
                              >
                                <img src={star} />
                                <div className="text-xs font-bold tracking-wide uppercase">
                                  {/* {afterComplete[0].text} */}
                                  YOU
                                </div>
                              </div>
                            </>
                          )}
                        {afterComplete[0].isBoth && (
                          <div
                            className={`flex bg-dark-purple text-yankees-blue gap-2 justify-center rounded-xl py-1 px-2 w-16 absolute `}
                          >
                            <img src={winner} />
                            <div className="text-xs font-bold tracking-wide uppercase">WON</div>
                          </div>
                        )}
                        {players[0].mintImage !== add_new_nft &&
                          players[0].mintImage !== plus_button && (
                            <Color src={players[0].mintImage} crossOrigin="anonymous" format="hex">
                              {({ data }) => {
                                return (
                                  <div
                                    className="w-[120px] h-[120px] absolute blur-md opacity-30 rounded-full"
                                    style={{
                                      background: `radial-gradient(${data}, rgba(0,0,0,0))`,
                                    }}
                                  ></div>
                                );
                              }}
                            </Color>
                          )}

                        <div
                          className={`hex-background  mask mask-hexagon-2 mask-repeat object-cover ${
                            currentActive === 1
                              ? classes.active
                              : afterComplete[0].display && countDown === ""
                              ? classes[afterComplete[0].text]
                              : currentActive === 0 && countDown === null
                              ? classes.pending
                              : classes.begin
                          }  ${
                            afterComplete[0].display &&
                            afterComplete[0].text === "YOU" &&
                            `container-img ${classes.WON}`
                          } `}
                        >
                          {players[0].mintImage === add_new_nft ? (
                            <>
                              {!joining.open &&
                              (players[1].playerPubKey !== pubKey ||
                                players[1].playerPubKey === DummyPubKey) ? (
                                <SVGComponent
                                  className={`hover:cursor-pointer  w-28 h-28 mask mask-hexagon-2 absolute top-[3px] right-[2.5px] mask-repeat`}
                                />
                              ) : (
                                // <></>
                                <div
                                  className={`hex-background  mask mask-hexagon-2 mask-repeat object-cover opacity-100`}
                                >
                                  <img
                                    src={plus_button}
                                    className={`hover:cursor-pointer w-28 h-28 mask mask-hexagon-2 mask-repeat object-cover absolute top-[3px] right-[2.5px]`}
                                  />
                                </div>
                              )}
                            </>
                          ) : (
                            <div className="bg-onevsoneplay">
                              <img
                                src={players[0].mintImage}
                                onError={handleImageError}
                                className={`hover:cursor-pointer w-28 h-28 mask mask-hexagon-2 absolute top-[3px] right-[2.5px] mask-repeat object-cover bg-yankees-blue`}
                              />
                            </div>
                          )}
                          {pubKey === players[0].playerPubKey &&
                            (NumOfJoin !== 2 || finalWinner != -1) && (
                              <>
                                <span className="z-20 overlay">
                                  <img src={dotshover} className="dots-hover icon" />
                                </span>
                              </>
                            )}
                        </div>
                      </div>
                    </div>
                    <p className="mt-2 text-sm font-semibold leading-6 text-center text-space-gray">
                      {players[0].playerName ? players[0].playerName : "Join Now!"}
                    </p>
                    <div className="flex gap-2 mt-4">
                      {mintImage1 ? (
                        <div className="border-[1.5px] border-nouveau-main rounded-lg border-opacity-20 w-32 py-4 ">
                          <div className="flex gap-3">
                            <img src={solana_icon} className="w-4 ml-4" />
                            <p className="text-sm font-semibold leading-4 tracking-wide text-gray">
                              {stateDetails.floorPrice?.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="border-[1.5px] border-nouveau-main rounded-lg border-opacity-20 w-32 py-3 ">
                          <div className="flex items-center justify-center">-</div>
                        </div>
                      )}
                      <div className="flex items-center cursor-pointer">
                        <Tooltip title="Information">
                          <InformationCircleIcon className="w-5 h-5 text-nouveau-main " />
                        </Tooltip>
                      </div>
                    </div>
                  </div>
                  <div className="relative hidden w-10 h-10 sm:w-10 sm:h-10 md:w-auto md:h-auto sm:hidden md:hidden lg:flex">
                    <div className="coin" ref={coin_static}>
                      <animated.div
                        style={{
                          perspective: "1000px",
                          transformStyle: "preserve-3d",
                          transform: x
                            .to({
                              range: [0, 0.25, 0.5, 0.75, 1],
                              output: [0, 180, 360, 180, 0],
                            })
                            .to((x) => `rotateY(${x}deg)`),
                        }}
                      >
                        <div className="coin__front">
                          <div className="flex items-center justify-center w-full h-full">
                            {finalWinner === -1 ? (
                              <img
                                src={mintImage1}
                                className="flex items-center justify-center w-2/3 mask mask-hexagon-2 mask-repeat object-cover"
                              />
                            ) : (
                              <img
                                src={
                                  currentActive === 1 ? mintImage1 : mintImage2
                                  // side === 0 && mintImage1
                                }
                                onError={handleImageError}
                                className="flex items-center justify-center w-2/3 mask mask-hexagon-2 mask-repeat object-cover"
                              />
                            )}
                          </div>
                        </div>

                        <div className="coin__back">
                          <div className="flex items-center justify-center w-full h-full">
                            {finalWinner === -1 ? (
                              <img
                                src={mintImage2}
                                className="flex items-center justify-center w-2/3 mask mask-hexagon-2 mask-repeat object-cover"
                              />
                            ) : (
                              <img
                                src={
                                  currentActive === 2 ? mintImage2 : mintImage1
                                  // side === 1 && mintImage2
                                }
                                onError={handleImageError}
                                className="flex items-center justify-center w-2/3 mask mask-hexagon-2 mask-repeat object-cover"
                              />
                            )}
                          </div>
                        </div>
                      </animated.div>

                      <div className="coin__shadow"></div>
                    </div>
                  </div>
                  <div className="flex-col items-center hidden sm:hidden md:hidden lg:flex">
                    <div className="hover:cursor-pointer w-28 h-28">
                      {finalWinner !== -1 && finalWinner !== 1 && (
                        <div className={`hex absolute `}>
                          <div
                            className={`hex-background  mask mask-hexagon-2 mask-repeat object-cover opacity-100`}
                          >
                            <img
                              src={plus_button}
                              className={`hover:cursor-pointer w-28 h-28 mask mask-hexagon-2 mask-repeat object-cover absolute top-[3px] right-[2.5px]`}
                            />
                          </div>
                        </div>
                      )}
                      <div
                        ref={playersRef[1]}
                        className={`hex absolute  ${finalWinner == 1 ? "winner" : ""}`}
                        onClick={(e) => {
                          // console.log(
                          //   "pubKeyy",
                          //   players[1].playerPubKey,
                          //   pubKey,
                          //   joining.open,
                          //   players[0].playerPubKey
                          // );
                          if (
                            // players[1].playerPubKey === pubKey ||
                            joining.open &&
                            (players[0].playerPubKey === pubKey ||
                              players[0].playerPubKey === DummyPubKey)
                          )
                            return;
                          else return handleClick(e, 1);
                        }}
                        aria-controls={open ? "account-menu" : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? "true" : undefined}
                      >
                        {afterComplete[1].display && (
                          <>
                            <div
                              className={`flex ${afterComplete[1].bgcolor} text-yankees-blue gap-2 justify-center rounded-xl py-1 px-2 w-16 absolute -top-[22px] left-[30px]`}
                            >
                              <img src={afterComplete[1].image} />
                              <div className="text-xs font-bold tracking-wide uppercase">
                                {afterComplete[1].text}
                              </div>
                            </div>
                          </>
                        )}

                        {result?.winner_pubkey !== DummyPubKey &&
                          players[1].playerPubKey === pubKey && (
                            <>
                              <div
                                className={`flex bg-blue text-yankees-blue gap-2 justify-center rounded-xl py-1 px-2 w-16 absolute  top-[77px] -left-[33px] rotate-[60deg] `}
                              >
                                <img src={star} />
                                <div className="text-xs font-bold tracking-wide uppercase">
                                  {/* {afterComplete[0].text} */}
                                  YOU
                                </div>
                              </div>
                            </>
                          )}
                        {afterComplete[1].isBoth && (
                          <div
                            className={`flex bg-dark-purple text-yankees-blue gap-2 justify-center rounded-xl py-1 px-2 w-16 absolute `}
                          >
                            <img src={winner} />
                            <div className="text-xs font-bold tracking-wide uppercase">WON</div>
                          </div>
                        )}
                        {players[1].mintImage !== add_new_nft &&
                          players[1].mintImage !== plus_button && (
                            <Color src={players[1].mintImage} crossOrigin="anonymous" format="hex">
                              {({ data, loading }) => {
                                //   if (loading) return <Loading />;
                                return (
                                  <div
                                    className="w-[120px] h-[120px] absolute blur-md opacity-30 rounded-full"
                                    style={{
                                      background: `radial-gradient(${data}, rgba(0,0,0,0))`,
                                    }}
                                  ></div>
                                );
                              }}
                            </Color>
                          )}

                        <div
                          className={`hex-background  mask mask-hexagon-2 mask-repeat object-cover ${
                            currentActive === 2
                              ? classes.active
                              : afterComplete[1].display && countDown === ""
                              ? classes[afterComplete[1].text]
                              : currentActive === 0 && countDown === null
                              ? classes.pending
                              : classes.begin
                          }  ${
                            afterComplete[1].display &&
                            afterComplete[1].text === "YOU" &&
                            `container-img ${classes.WON}`
                          } `}
                        >
                          {players[1].mintImage === add_new_nft ? (
                            <>
                              {!joining.open &&
                              (players[0].playerPubKey !== pubKey ||
                                players[0].playerPubKey === DummyPubKey) ? (
                                <SVGComponent
                                  className={`hover:cursor-pointer  w-28 h-28 mask mask-hexagon-2 absolute top-[3px] right-[2.5px] mask-repeat`}
                                />
                              ) : (
                                <div
                                  className={`hex-background  mask mask-hexagon-2 mask-repeat  object-cover opacity-100`}
                                >
                                  <img
                                    src={plus_button}
                                    className={`hover:cursor-pointer w-28 h-28 mask mask-hexagon-2 mask-repeat object-cover absolute top-[3px] right-[2.5px]`}
                                  />
                                </div>
                              )}
                            </>
                          ) : (
                            <img
                              src={players[1].mintImage}
                              onError={handleImageError}
                              className={`hover:cursor-pointer w-28 h-28 mask mask-hexagon-2 absolute top-[3px] right-[2.5px] mask-repeat object-cover`}
                            />
                          )}
                          {pubKey === players[1].playerPubKey &&
                            (NumOfJoin !== 2 || finalWinner != -1) && (
                              <>
                                <span className="overlay">
                                  <img src={dotshover} className="dots-hover icon" />
                                </span>
                              </>
                            )}
                        </div>
                      </div>
                    </div>

                    {/* {index === 1 && ( */}
                    <StyledMenu
                      anchorEl={anchorEl}
                      id="account-menu"
                      open={open}
                      onClose={handleClose}
                      transformOrigin={{
                        horizontal: "right",
                        vertical: "top",
                      }}
                      anchorOrigin={{
                        horizontal: "right",
                        vertical: "bottom",
                      }}
                    >
                      <div
                        className="py-5 -ml-3 cursor-pointer hover:text-gray"
                        onClick={() => {
                          isWithdrawWinning ? WinnerModal() : handleWithdraw();
                          handleClose();
                        }}
                      >
                        <div className="flex gap-2 ml-3 text-space-gray">
                          <svg
                            width="20"
                            height="22"
                            viewBox="0 0 20 22"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M16 14V21M16 21L19 18M16 21L13 18M1 4V10C1 10 1 13 8 13C15 13 15 10 15 10V4"
                              stroke="#6A7080"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M8 19C1 19 1 16 1 16V10M8 1C15 1 15 4 15 4C15 4 15 7 8 7C1 7 1 4 1 4C1 4 1 1 8 1Z"
                              stroke="#6A7080"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>

                          <div className="">Withdraw {isWithdrawWinning && "Winnings"}</div>
                        </div>
                      </div>
                    </StyledMenu>
                    {/* )} */}
                    <p className="mt-2 text-sm font-semibold leading-6 text-center text-space-gray">
                      {players[1].playerName ? players[1].playerName : "Join now!"}
                    </p>
                    <div className="flex gap-2 mt-4">
                      {mintImage2 ? (
                        <div className="border-[1.5px] border-nouveau-main rounded-lg border-opacity-20 w-32 py-4 ">
                          <div className="flex gap-3">
                            <img src={solana_icon} className="w-4 ml-4" />
                            <p className="text-sm font-semibold leading-4 tracking-wide text-gray">
                              {stateDetails.floorPrice?.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="border-[1.5px] border-nouveau-main rounded-lg border-opacity-20 w-32 py-3 ">
                          <div className="flex items-center justify-center">-</div>
                        </div>
                      )}
                      <div className="flex items-center cursor-pointer">
                        <Tooltip title="Information">
                          <InformationCircleIcon className="w-5 h-5 text-nouveau-main " />
                        </Tooltip>
                      </div>
                    </div>
                  </div>
                  <div className="relative hidden sm:hidden md:hidden lg:flex">
                    <div className="absolute z-20 left-1/2 top-[3%] transform-translate-doge w-[104px] h-[104px]">
                      <img src={cheems} />
                    </div>
                    <div>
                      <img
                        src={player_2_stand}
                        className="relative z-10 transform-translate-stand"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-around gap-2 sm:flex md:flex lg:hidden">
                  <div className="flex flex-col items-center justify-center mt-9">
                    <div className="hover:cursor-pointer w-28 h-28 min-[375px]:w-24 max-[550px]:w-24">
                      {finalWinner !== -1 && finalWinner !== 1 && (
                        <div className={`hex absolute `}>
                          <div
                            className={`hex-background  mask mask-hexagon-2 mask-repeat object-cover opacity-100`}
                          >
                            <img
                              src={plus_button}
                              className={`hover:cursor-pointer w-[85px] h-[87px] sm:w-28 sm:h-28 mask mask-hexagon-2 mask-repeat object-cover absolute top-[3px] right-[2.5px]`}
                            />
                          </div>
                        </div>
                      )}
                      <div
                        ref={playersRef[0]}
                        className={`hex absolute ${finalWinner == 1 ? "winner" : ""}`}
                        onClick={(e) => {
                          // console.log("pubKey",players[0].playerPubKey === DummyPubKey);
                          if (
                            joining.open &&
                            (players[1].playerPubKey === pubKey ||
                              players[1].playerPubKey === DummyPubKey)
                          )
                            return;
                          else return handleClick(e, 0);
                        }}
                        aria-controls={open ? "account-menu" : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? "true" : undefined}
                      >
                        {afterComplete[0].display && (
                          <>
                            <div
                              className={`flex ${afterComplete[0].bgcolor} text-yankees-blue gap-2 rounded-xl py-1 px-2 w-16 absolute -top-[22px] min-[320px]:left-3 min-[551px]:left-7 left-[30px] flex justify-center`}
                            >
                              <img src={afterComplete[0].image} />
                              <div className="text-xs font-bold tracking-wide uppercase">
                                {afterComplete[0].text}
                              </div>
                            </div>
                          </>
                        )}
                        {afterComplete[0].isBoth && (
                          <div
                            className={`flex bg-dark-purple text-yankees-blue gap-2 justify-center rounded-xl py-1 px-2 w-16 absolute `}
                          >
                            <img src={winner} />
                            <div className="text-xs font-bold tracking-wide uppercase">WON</div>
                          </div>
                        )}
                        {players[0].mintImage !== add_new_nft &&
                          players[0].mintImage !== plus_button && (
                            <Color src={players[0].mintImage} crossOrigin="anonymous" format="hex">
                              {({ data, loading }) => {
                                //   if (loading) return <Loading />;
                                return (
                                  <div
                                    className="w-[120px] h-[120px] absolute blur-md opacity-30 rounded-full backgroud_glow"
                                    style={{
                                      background: `radial-gradient(${data}, rgba(0,0,0,0))`,
                                    }}
                                  ></div>
                                );
                              }}
                            </Color>
                          )}

                        <div
                          className={`hex-background  mask mask-hexagon-2 mask-repeat object-cover ${
                            currentActive === 1
                              ? classes.active
                              : afterComplete[0].display && countDown === ""
                              ? classes[afterComplete[0].text]
                              : currentActive === 0 && countDown === null
                              ? classes.pending
                              : classes.begin
                          }  ${
                            afterComplete[0].display &&
                            afterComplete[0].text === "YOU" &&
                            `container-img ${classes.WON}`
                          } `}
                        >
                          {players[0].mintImage === add_new_nft ? (
                            <>
                              {!joining.open &&
                              (players[1].playerPubKey !== pubKey ||
                                players[1].playerPubKey === DummyPubKey) ? (
                                <SVGComponent
                                  className={`hover:cursor-pointer w-[85px] h-[87px] sm:w-28 sm:h-28 mask mask-hexagon-2 absolute top-[3px] right-[2.5px] mask-repeat`}
                                />
                              ) : (
                                <div
                                  className={`hex-background  mask mask-hexagon-2 mask-repeat object-cover opacity-100`}
                                >
                                  <img
                                    src={plus_button}
                                    className={`hover:cursor-pointer w-[85px] h-[87px] sm:w-28 sm:h-28 mask mask-hexagon-2 mask-repeat object-cover absolute top-[3px] right-[2.5px]`}
                                  />
                                </div>
                              )}
                            </>
                          ) : (
                            <img
                              src={players[0].mintImage}
                              onError={handleImageError}
                              className={`hover:cursor-pointer sm:w-28 sm:h-28 mask mask-hexagon-2 absolute top-[3px] right-[2.5px] mask-repeat image_size`}
                            />
                          )}
                          {pubKey === players[0].playerPubKey &&
                            (NumOfJoin !== 2 || finalWinner != -1) && (
                              <>
                                <span className="z-20 overlay">
                                  <img src={dotshover} className="dots-hover icon" />
                                </span>
                              </>
                            )}
                        </div>
                      </div>
                    </div>
                    <p className="mt-2 text-sm font-semibold leading-6 text-center text-space-gray">
                      {players[0].playerName ? players[0].playerName : "Join Now!"}
                    </p>
                    <div className="hidden gap-2 mt-4 sm:flex">
                      <div className="border-[1.5px] border-nouveau-main rounded-lg border-opacity-20 w-32 py-4 ">
                        {/* <div className="flex gap-3"> */}
                        {/* <img src={solana_icon} className="w-4 ml-4" /> */}
                        {mintImage1 ? (
                          <div className="flex gap-3">
                            <img src={solana_icon} className="w-4 ml-4" />
                            <p className="text-sm font-semibold leading-4 tracking-wide text-gray">
                              {stateDetails.floorPrice?.toFixed(2)}
                            </p>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center">-</div>
                        )}
                        {/* <p className="text-sm font-semibold leading-4 tracking-wide text-gray">
                            {stateDetails.floorPrice?.toFixed(2)}
                          </p> */}
                        {/* </div> */}
                      </div>
                      <div className="flex items-center cursor-pointer">
                        <Tooltip title="Information">
                          <InformationCircleIcon className="w-5 h-5 text-nouveau-main " />
                        </Tooltip>
                      </div>
                    </div>
                  </div>
                  <div className="relative max-w-1/3">
                    <div className="coin" ref={coin_static}>
                      <animated.div
                        style={{
                          perspective: "1000px",
                          transformStyle: "preserve-3d",
                          transform: x
                            .to({
                              range: [0, 0.25, 0.5, 0.75, 1],
                              output: [0, 180, 360, 180, 0],
                            })
                            .to((x) => `rotateY(${x}deg)`),
                        }}
                      >
                        <div className="coin__front">
                          {/* <div className="flex items-center justify-center w-full h-full">
                            <img
                              src={mintImage1}
                              className="flex items-center justify-center w-2/3 mask mask-hexagon-2 mask-repeat"
                            />
                          </div> */}
                          <div className="flex !items-center !justify-center w-full h-full">
                            {finalWinner === -1 ? (
                              <img
                                src={mintImage1}
                                className="flex items-center justify-center w-2/3 mask mask-hexagon-2 mask-repeat object-cover"
                              />
                            ) : (
                              <img
                                src={
                                  currentActive === 1 ? mintImage1 : mintImage2
                                  // side === 0 && mintImage1
                                }
                                onError={handleImageError}
                                className="flex items-center justify-center w-2/3 mask mask-hexagon-2 mask-repeat object-cover"
                              />
                            )}
                          </div>
                        </div>

                        <div className="coin__back">
                          {/* <div className="flex items-center justify-center w-full h-full">
                            <img
                              src={mintImage2}
                              className="flex items-center justify-center w-2/3 mask mask-hexagon-2 mask-repeat"
                            />
                          </div> */}
                          <div className="flex items-center justify-center w-full h-full">
                            {finalWinner === -1 ? (
                              <img
                                src={mintImage2}
                                className="flex items-center justify-center w-2/3 mask mask-hexagon-2 mask-repeat object-cover"
                              />
                            ) : (
                              <img
                                src={
                                  currentActive === 2 ? mintImage2 : mintImage1
                                  // side === 1 && mintImage2
                                }
                                onError={handleImageError}
                                className="flex items-center justify-center w-2/3 mask mask-hexagon-2 mask-repeat object-cover"
                              />
                            )}
                          </div>
                        </div>
                      </animated.div>
                      <div className="coin__shadow"></div>
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-center max-w-1/3 mt-9">
                    <div className="hover:cursor-pointer w-28 h-28 min-[375px]:w-24 max-[550px]:w-24">
                      {finalWinner !== -1 && finalWinner !== 1 && (
                        <div className={`hex absolute `}>
                          <div
                            className={`hex-background  mask mask-hexagon-2 mask-repeat object-cover opacity-100`}
                          >
                            <img
                              src={plus_button}
                              className={`hover:cursor-pointer w-[85px] h-[87px] sm:w-28 sm:h-28 mask mask-hexagon-2 mask-repeat object-cover absolute top-[3px] right-[2.5px]`}
                            />
                          </div>
                        </div>
                      )}
                      <div
                        ref={playersRef[1]}
                        className={`hex absolute  ${finalWinner == 1 ? "winner" : ""}`}
                        onClick={(e) => {
                          // console.log(
                          //   "pubKeyy",
                          //   players[1].playerPubKey,
                          //   pubKey,
                          //   joining.open,
                          //   players[0].playerPubKey
                          // );
                          if (
                            // players[1].playerPubKey === pubKey ||
                            joining.open &&
                            (players[0].playerPubKey === pubKey ||
                              players[0].playerPubKey === DummyPubKey)
                          )
                            return;
                          else return handleClick(e, 1);
                        }}
                        aria-controls={open ? "account-menu" : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? "true" : undefined}
                      >
                        {afterComplete[1].display && (
                          <>
                            <div
                              className={`flex ${afterComplete[1].bgcolor} text-yankees-blue gap-2 justify-center rounded-xl py-1 px-2 w-16 absolute -top-[22px] left-[30px] min-[320px]:left-3 min-[551px]:left-7`}
                            >
                              <img src={afterComplete[1].image} />
                              <div className="text-xs font-bold tracking-wide uppercase">
                                {afterComplete[1].text}
                              </div>
                            </div>
                          </>
                        )}

                        {result?.winner_pubkey !== DummyPubKey &&
                          players[1].playerPubKey === pubKey && (
                            <>
                              <div
                                className={`flex bg-blue text-yankees-blue gap-2 justify-center rounded-xl py-1 px-2 w-16 absolute  top-[62px] left-[55px] -rotate-[60deg] `}
                              >
                                <img src={star} />
                                <div className="text-xs font-bold tracking-wide uppercase">
                                  {/* {afterComplete[0].text} */}
                                  YOU
                                </div>
                              </div>
                            </>
                          )}
                        {afterComplete[1].isBoth && (
                          <div
                            className={`flex bg-dark-purple text-yankees-blue gap-2 justify-center rounded-xl py-1 px-2 w-16 absolute `}
                          >
                            <img src={winner} />
                            <div className="text-xs font-bold tracking-wide uppercase">WON</div>
                          </div>
                        )}
                        {players[1].mintImage !== add_new_nft &&
                          players[1].mintImage !== plus_button && (
                            <Color src={players[1].mintImage} crossOrigin="anonymous" format="hex">
                              {({ data, loading }) => {
                                //   if (loading) return <Loading />;
                                return (
                                  <div
                                    className="w-[120px] h-[120px] absolute blur-md opacity-30 rounded-full"
                                    style={{
                                      background: `radial-gradient(${data}, rgba(0,0,0,0))`,
                                    }}
                                  ></div>
                                );
                              }}
                            </Color>
                          )}

                        <div
                          className={`hex-background  mask mask-hexagon-2 mask-repeat object-cover ${
                            currentActive === 2
                              ? classes.active
                              : afterComplete[1].display && countDown === ""
                              ? classes[afterComplete[1].text]
                              : currentActive === 0 && countDown === null
                              ? classes.pending
                              : classes.begin
                          }  ${
                            afterComplete[1].display &&
                            afterComplete[1].text === "YOU" &&
                            `container-img ${classes.WON}`
                          } `}
                        >
                          {players[1].mintImage === add_new_nft ? (
                            <>
                              {!joining.open &&
                              (players[0].playerPubKey !== pubKey ||
                                players[0].playerPubKey === DummyPubKey) ? (
                                <SVGComponent
                                  className={`hover:cursor-pointer  w-[85px] h-[87px] sm:w-28 sm:h-28 mask mask-hexagon-2 absolute top-[3px] right-[2.5px] mask-repeat`}
                                />
                              ) : (
                                <div
                                  className={`hex-background  mask mask-hexagon-2 mask-repeat  object-cover opacity-100`}
                                >
                                  <img
                                    src={plus_button}
                                    className={`hover:cursor-pointer w-[85px] h-[87px] sm:w-28 sm:h-28 mask mask-hexagon-2 mask-repeat object-cover absolute top-[3px] right-[2.5px]`}
                                  />
                                </div>
                              )}
                            </>
                          ) : (
                            <img
                              src={players[1].mintImage}
                              onError={handleImageError}
                              className={`hover:cursor-pointer sm:w-28 sm:h-28 mask mask-hexagon-2 absolute top-[3px] right-[2.5px] mask-repeat image_size`}
                            />
                          )}
                          {pubKey === players[1].playerPubKey &&
                            (NumOfJoin !== 2 || finalWinner != -1) && (
                              <>
                                <span className="overlay">
                                  <img src={dotshover} className="dots-hover icon" />
                                </span>
                              </>
                            )}
                        </div>
                      </div>
                    </div>
                    <p className="mt-2 font-semibold text-[13px] leading-6 text-space-gray text-center">
                      {players[1].playerName ? players[1].playerName : "Join Now!"}
                    </p>
                    <div className="hidden gap-2 mt-4 sm:flex">
                      <div className="border-[1.5px] border-nouveau-main rounded-lg border-opacity-20 w-32 py-3 ">
                        {/* <div className="flex items-center justify-center">
                          -
                        </div> */}
                        {mintImage2 ? (
                          <div className="flex gap-3">
                            <img src={solana_icon} className="w-4 ml-4" />
                            <p className="text-sm font-semibold leading-4 tracking-wide text-gray">
                              {stateDetails.floorPrice?.toFixed(2)}
                            </p>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center">-</div>
                        )}
                      </div>
                      <div className="flex items-center cursor-pointer">
                        <Tooltip title="Information">
                          <InformationCircleIcon className="w-5 h-5 text-nouveau-main " />
                        </Tooltip>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between gap-3 sm:hidden">
                  <div className="gap-2 mt-4">
                    <div className="border-[1.5px] border-nouveau-main rounded-lg border-opacity-20 w-[7rem] sm:w-32 py-3  max-h-[42px]">
                      {mintImage1 ? (
                        <div className="flex gap-3">
                          <img src={solana_icon} className="w-4 ml-4" />
                          <p className="text-sm font-semibold leading-4 tracking-wide text-gray">
                            {stateDetails.floorPrice?.toFixed(2)}
                          </p>
                        </div>
                      ) : (
                        <div className="flex items-start justify-center text-xs scale-150">-</div>
                      )}
                    </div>
                    <div className="flex items-center cursor-pointer">
                      <Tooltip title="Information">
                        <InformationCircleIcon className="w-5 h-5 text-nouveau-main " />
                      </Tooltip>
                    </div>
                  </div>
                  <div className="gap-2 mt-4">
                    <div className="border-[1.5px] border-nouveau-main rounded-lg border-opacity-20 w-[7rem] sm:w-32 py-3  max-h-[42px]">
                      {mintImage2 ? (
                        <div className="flex gap-3">
                          <img src={solana_icon} className="w-4 ml-4" />
                          <p className="text-sm font-semibold leading-4 tracking-wide text-gray">
                            {stateDetails.floorPrice?.toFixed(2)}
                          </p>
                        </div>
                      ) : (
                        <div className="flex items-start justify-center text-xs scale-150">-</div>
                      )}
                    </div>
                    <div className="flex items-center cursor-pointer">
                      <Tooltip title="Information">
                        <InformationCircleIcon className="w-5 h-5 text-nouveau-main " />
                      </Tooltip>
                    </div>
                  </div>
                </div>
                <div className="flex justify-around gap-5 my-3">
                  <div className="relative block sm:block md:block lg:hidden">
                    <div className="absolute z-20 left-1/2 transform-translate-doge top-[10%] sm:top-[5%] w-[80px] h-[80px] sm:w-[104px] sm:h-[104px]">
                      <img src={doge_2} />
                    </div>
                    <div>
                      <img
                        src={player_1_stand}
                        className="relative z-10 transform-translate-stand"
                      />
                    </div>
                  </div>
                  <div className="relative block sm:block md:block lg:hidden">
                    <div className="absolute z-20 left-1/2 transform-translate-doge top-[10%] sm:top-[3%] w-[80px] h-[80px] sm:w-[104px] sm:h-[104px]">
                      <img src={cheems} />
                    </div>
                    <div>
                      <img
                        src={player_2_stand}
                        className="relative z-10 transform-translate-stand"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <CollectionDescription />
                </div>
              </div>
            </div>
          </div>
          <div className="mt-10">
            {/* <OneVsOnePreviousRounds /> */}
            <PreviousRounds from1v1={true} />
          </div>
          <WithdrawModal
            open={withdrawopen}
            onClose={CloseModal}
            leaveGame={leaveGameCallBack}
            claimState={claimState}
            setClaimState={setClaimState}
            title={title}
            slug={slug}
          ></WithdrawModal>

          {/* {result?.winner_pubkey != DummyPubKey && ( */}
          {result?.winner_pubkey != DummyPubKey && result?.isWithdraw === false && (
            <CongratulationsModal
              duration={timeDiff}
              open={winneropen}
              onClose={modalClose}
              setIsAlreadyWithdraw={setIsAlreadyWithdraw}
              result={result}
              collections={collections}
              gamePlayers={gamePlayers}
              is1v1={true}
              title={title}
              slug={slug}
            ></CongratulationsModal>
          )}
        </>
      )}
    </>
  );
}
