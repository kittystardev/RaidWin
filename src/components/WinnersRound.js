import React, { useEffect, useRef, useState } from "react";
import verified from "../assets/images/verified.svg";
import plus_button from "../assets/images/plus_button.svg";
import add_new_nft from "../assets/images/add_new_nft.svg";
import dotshover from "../assets/images/dotshover.svg";
import winner from "../assets/images/winner.svg";
import { setFloorPrice } from "../store/SolanaPrice";
import star from "../assets/images/star.svg";
import {
  Link,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setAlertIdx, setModalIdx } from "../store/NFTModal.js";
import { Menu, Skeleton } from "@mui/material";
import { setGameId } from "../store/PlayersSlice";
import { decodeMintsState } from "../utils/joinGame";
import { connection } from "../utils/connection";
import {
  baseUrl,
  decodeMetadata,
  DummyPubKey,
  getAddress,
  getCreator,
  getMetadataAccount,
  getPlayerImages,
  handleImageError,
  imagePath,
  parseWiningRound,
  replaceSlug,
  socket,
} from "../utils/utils";
import { PublicKey } from "@solana/web3.js";
import { disjoin_game } from "../utils/disjoin_game";
import {
  resetNftList,
  setCollectionMintForModal,
  setConnectModal,
  setFromGameJoin,
} from "../store/TempSlice";
import styled from "styled-components";
import CongratulationsModal from "./modals/CongratulationsModal";
import SVGComponent from "./Common/SVGComponent";
import { isMobileOnly } from "react-device-detect";
import { claim_nft } from "../utils/claim_nft";
import Color from "color-thief-react";
import PreviousRounds from "./PreviousRounds";
import WithdrawModal from "./modals/WithdrawModal";
import FirstJoin from "./FirstJoin";
import { waitForFinalized } from "../utils/externalwallet";
import roundwin from "../assets/audio/roundwin.wav";
import mute_icn from "../assets/images/mute_icon.svg";
import speaker_icn from "../assets/images/speaker_icn.svg";
import spin from "../assets/audio/spin.wav";
import player_join from "../assets/audio/player_join.wav";
import { setIsMuted } from "../store/topplayer";
import { setNumberOfJoined } from "../store/collectionSlice";
import moment from "moment/moment";
import PageNotFound from "./Common/PageNotFound";
import WinnerHeroSection from "./Common/WinnerHeroSection";
import Lottie from "lottie-react";
import animation_optimized from "../json/animation_optimized.json";
import { getCollectionMintByName } from "../utils/collections";
import { Helmet } from "react-helmet";
const spots = [
  {
    spotPosition: `top-[24px] left-[0px]`,
    youTextPostion: `bottom-[113px] right-[22px]`,
    wonTextPostion: ` top-[14px] left-[87px] rotate-[60deg]`,
  },
  {
    spotPosition: `top-[82px] left-[97px]`,
    youTextPostion: `top-[15px] left-[90px] rotate-[60deg]`,
    wonTextPostion: `bottom-[113px] left-[32px] rotate-[0deg]`,
  },
  {
    spotPosition: `top-[196px] left-[97px]`,
    youTextPostion: `top-[15px] left-[90px] rotate-[60deg]`,
    wonTextPostion: `top-[119px] left-[29px] rotate-[0deg]`,
  },
  {
    spotPosition: `top-[248px]`,
    youTextPostion: `top-[118px] left-[30px]`,
    wonTextPostion: `top-[84px] right-[86px] rotate-[60deg]`,
  },
  {
    spotPosition: `top-[196px] right-[97px]`,
    responsive: 'max-[551px]:top-[196px] max-[551px]:right-[122px]',
    youTextPostion: `top-[12px] right-[83px] rotate-[-60deg]`,
    wonTextPostion: ` top-[84px] right-[86px] rotate-[60deg]`,
  },
  {
    spotPosition: `top-[82px] right-[97px]`,
    responsive: 'max-[551px]:top-[82px] max-[551px]:right-[122px]',
    youTextPostion: `top-[12px] right-[83px] rotate-[-60deg]`,
    wonTextPostion: `bottom-[115px] left-[28px] rotate-[0deg]`,
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
    mintImage: plus_button,
    playerImage: "",
    playerName: "",
    userName: "",
    playerPubKey: "",
  },
  {
    id: 1,
    mintImage: plus_button,
    playerImage: "",
    playerName: "",
    userName: "",
    playerPubKey: "",
  },
  {
    id: 2,
    mintImage: plus_button,
    playerImage: "",
    playerName: "",
    userName: "",
    playerPubKey: "",
  },
  {
    id: 3,
    mintImage: plus_button,
    playerImage: "",
    playerName: "",
    userName: "",
    playerPubKey: "",
  },
  {
    id: 4,
    mintImage: plus_button,
    playerImage: "",
    playerName: "",
    userName: "",
    playerPubKey: "",
  },
  {
    id: 5,
    mintImage: plus_button,
    playerImage: "",
    playerName: "",
    userName: "",
    playerPubKey: "",
  },
];

const map = new Map();
let SpinAudio = new Audio(spin);
let playerJoinAudio = new Audio(player_join);
let audio = new Audio(roundwin);

//rendering component
export default function WinnersRound({
  executeScroll,
  prevRoundRef,
  skeleton,
}) {
  const player1Ref = useRef(null);
  const player2Ref = useRef(null);
  const player3Ref = useRef(null);
  const player4Ref = useRef(null);
  const player5Ref = useRef(null);
  const player6Ref = useRef(null);
  const playersRef = [
    player1Ref,
    player2Ref,
    player3Ref,
    player4Ref,
    player5Ref,
    player6Ref,
  ];
  const [pageNotFound, setPageNotFound] = useState(false);
  const [loading, setLoading] = useState(true);
  const [claimState, setClaimState] = useState(-1);
  let dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  let { collectionMint: collectionMintName } = useParams();
  let [collectionMint, setCollectionMint] = useState("");
  useEffect(() => {
    getCollectionMintByName(collectionMintName).then((resp) => {
      setCollectionMint(resp);
      // console.log("collection_name", resp);
    });
  }, [collectionMintName]);

  let gameId = searchParams.get("gameId");
  const pubKey = useSelector((state) =>
    state.Temp.pubKey ? state.Temp.pubKey.toString() : ""
  );
  let [currentActive, setCurrentActive] = useState(0);
  let [finalWinner, setFinalWinner] = useState(-1);
  const [countDown, setCountDown] = useState(null);
  // let players = useSelector((state) => state.Players.players)
  let [players, setPlayers] = useState(_players);
  const [mintJoined, setMintJoined] = useState("");
  const [started, setstarted] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [isWithdrawWinning, setIsWithdrawWinning] = useState(false);
  const [isIntervalSet, setIsIntervalSet] = useState(false);
  const [isAlreadyWithdraw, setIsAlreadyWithdraw] = useState(false);
  const fromGammeJoin = useSelector((state) => state.Temp.fromGammeJoin);
  const [stateDetails, setStateDetails] = useState([]);
  const status = useRef(2);
  const winnerAnnounce = useRef(false);
  const lock = useRef(true);
  const joiningLock = useRef(false);
  const creators = useRef([]);
  const [NumOfJoin, setNumOfJoin] = useState(0);
  const isMuted = useSelector((state) => state.topplayer.isMuted);
  const [timeDiff, setTimeDiff] = useState();
  const toggle = () => {
    dispatch(setCollectionMintForModal(collectionMint));
    dispatch(setFromGameJoin(true));
    dispatch(setConnectModal(true));
  };

  const joining = useSelector((state) => state.Index.alertdata);
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

  const TreasuryAccount = useSelector(
    (state) => new PublicKey(state.platformSlice.treasury_pubkey)
  );

  useEffect(() => {
    (async function () {
      // if (!gameId || gameId === "") {
      //   setPageNotFound(true);
      //   setLoading(false);
      //   return;
      // }
      // console.log("collection_mint", collectionMint);

      if (collectionMint != "" && gameId != "") {
        try {
          const data = await getCreator(collectionMint);
          // console.log("datysgdaskd", data);
          if (!data.creators) {
            // debugger;
            setPageNotFound(true);
            return;
          }
          setLoading(false);
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
    socket.on("gameCountDown", (resp) => {
      startGame(resp);
    });
    socket.on("GameState", (resp) => {
      // setPlayers(
      //   players.map((ele, index) => {
      //     if (ele.playerPubKey == DummyPubKey) {
      //       ele.mintImage = plus_button;
      //     }
      //     return { ...players[index], mintImage: ele.mintImage };
      //   })
      // );
      playerSelect(resp);
    });
    return () => {
      socket.off("gameCountDown");
      socket.off("GameState");
    };
  }, [pubKey, players, isMuted]);

  useEffect(() => {
    if (pubKey != "") dispatch(setConnectModal(false));

    setTimeout(() => {
      if (gameId == "")
        socket.emit("GetCurrentGameState", {
          collection_mint: collectionMint,
          status: 2,
        });
      else socket.emit("GetGameStateById", gameId);
    }, [500]);
    announceWinner(false);

    return () => {
      console.log("Off....");
    };
  }, [pubKey]);

  useEffect(() => {
    if (collectionMint)
      dispatch(
        setNumberOfJoined({
          collection_mint: collectionMint,
          joined: NumOfJoin,
        })
      );
  }, [NumOfJoin, collectionMint]);

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
  const accessToken = useSelector((state) => state.Temp.accessToken);
  const leaveGame = async () => {
    try {
      setClaimState(0);
      // console.log(
      //   "firstasdas",
      //   pubKey,
      //   mintJoined,
      //   collectionMint,
      //   TreasuryAccount
      // );
      const signature = await disjoin_game(
        pubKey,
        mintJoined,
        collectionMint,
        TreasuryAccount,
        false,
        stateDetails.floorPrice
      );
      modalClose();
      // localStorage.removeItem("hasAudioPlayed");
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
        socket.emit("GetGameStateById", gameId);
        socket.emit("NewOrDisjoinedJoined", { accessToken, gameId });
        handleClose();
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

  const [pre_winner, setPer_Winner] = useState([]);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");

  let display;
  const announceWinner = async (openCongratsDialog) => {
    const resp = await fetch(`${baseUrl}/gameBytId/${gameId}`);
    const obj = (await resp.json())[0];
    if (!obj) {
      setPageNotFound(false);
      if (loading) setLoading(false);
      return;
    }
    setTitle(obj.title);
    setSlug(obj.slug);

    const winnerPub = obj.games[0].winner_pubkey;
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
      case obj.games[0].players[2].player_id:
        finalWinner = 3;
        break;
      case obj.games[0].players[3].player_id:
        finalWinner = 4;
        break;
      case obj.games[0].players[4].player_id:
        finalWinner = 5;
        break;
      case obj.games[0].players[5].player_id:
        finalWinner = 6;
        break;
    }
    setCurrentActive(finalWinner);
    setFinalWinner(finalWinner);
    setCompleted(true);
    winnerAnnounce.current = true;
    setIsAlreadyWithdraw(obj.games[0].isWithdraw);
    const result = parseWiningRound([{ games: obj.games }])[0];
    // console.log("AnnouseWinnnnnerrr...",result);
    Winner_DATA[0].floorPrice = result.floorPrice;
    Winner_DATA[0].winningNFT = result.winningNFT;
    Winner_DATA[0].total = result.total;
    Winner_DATA[0].ROI = result.ROI;
    Winner_DATA[0].updatedAt = result.updatedAt;
    Winner_DATA[0].is1v1 = false;
    Winner_DATA[0].title = result.title;
    Winner_DATA[0].slug = result.slug;

    setPer_Winner(Winner_DATA);
    // console.log("AnnouseWinnnnnerrrDATTTTAA...", Winner_DATA);
    if (openCongratsDialog && pubKey === winnerPub) {
      // console.log("AnnouseWinnnnnerrrDATTTTAAINSIDEEE...", Winner_DATA);
      const result = parseWiningRound([{ games: obj.games }])[0];
      if (result.winner_pubkey != DummyPubKey && !obj.games[0].isWithdraw) {
        WinnerModal();
        document.getElementById("rules").click();
      }
      setResult(result);
    }
    setCountDown("");
  };
  useEffect(() => {
    // console.log("pre_winner", pre_winner);
    if (pre_winner.length > 0) {
      if (!isIntervalSet) {
        setIsIntervalSet(true);
      }
    }
  }, [pre_winner]);

  useEffect(() => {
    let interval;
    if (isIntervalSet) {
      // console.log("dateString", "Interval set");
      interval = setInterval(() => {
        const updateDate = moment(pre_winner[0]?.updatedAt);
        // const newUpdatedDate = updateDate.clone().add({ minutes: 20160 });
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

  const [result, setResult] = useState({
    winner_pubkey: DummyPubKey,
  });

  const [winneropen, setWinnerOpen] = React.useState(false);

  const WinnerModal = () => {
    setTimeout(() => {
      display = setWinnerOpen(true);
    }, 2500);

    if (display) clearTimeout(display);
  };
  const modalClose = () => {
    setWinnerOpen(false);
  };

  const startAudio = () => {
    // if (isMuted === "true") {
    //   return;
    // } else {
    //   if (SpinAudio.networkState === 2) {
    //     console.log("ready");
    //   }
    //   SpinAudio.preservesPitch = true;
    //   SpinAudio.currentTime = 0;
    //   SpinAudio.play();
    // }
  };

  const PlayAudioTest = async () => {
    const context = new (window.AudioContext || window.webkitAudioContext)();

    const buffer = await fetch(spin).then(
      (resp) => resp.ok && resp.arrayBuffer()
    );

    const audiobuffer = await context.decodeAudioData(buffer);

    const buffersource = context.createBufferSource();
    buffersource.buffer = audiobuffer;
    buffersource.connect(context.destination);
    const starttime = context.currentTime;
    buffersource.start(starttime, 0, 0.1);
  };

  let isfinished;
  const [isGameStarted, setIsGameStarted] = useState(false);
  const startGame = ({ countdown, currentActive, finished }) => {
    setIsGameStarted(true);
    if (winnerAnnounce.current) return;
    if (countdown == 1) {
      setTimeout(() => {
        audioStart();
      }, 1000);
      setCountDown("Go");
      setIsGameStarted(false);
    }
    if (finished) {
      // let display = setTimeout(()=>{
      announceWinner(true);
      // }, 10000)
      isfinished = finished;
      return;
    }
    setCountDown(countdown);
    if (currentActive !== 0 && onMute != "false") {
      // startAudio();
      PlayAudioTest();
    }
    setCurrentActive(currentActive);
  };

  let winnerIndex;
  useEffect(() => {
    const afterWinnerState = [];
    for (let i = 0; i < 6; i++) {
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
    setAfterCompelete(afterWinnerState);
    if (players[winnerIndex] === undefined || players[winnerIndex] === "")
      return;
    Winner_DATA[0].User_name = players[winnerIndex].userName;
    Winner_DATA[0].Winner_image = players[winnerIndex].playerImage;
    // console.log("data_winnner", Winner_DATA[0].User_name);
  }, [finalWinner, pubKey, players]);

  const modalOpen = () => {
    dispatch(
      setModalIdx({
        modal: true,
        collectionMint: collectionMint,
        gameId: gameId,
        creators: creators.current,
        is1v1: false,
      })
    );
  };
  const navigate = useNavigate();
  const location = useLocation();
  const pageNavigate = (page) => {
    navigate(`/${page}`);
  };
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
    if (players[index].mintImage != add_new_nft) return;
    if (pubKey == "") {
      toggle();
      return;
    }
    joiningLock.current = false;
    dispatch(resetNftList());
    setTimeout(() => {
      modalOpen();
    }, [1000]);
  };

  // console.log("isMuted", isMuted);

  const audioStart = () => {
    // console.log("djnvjknjksv", isMuted);

    if (onMute == "false") {
      return;
    } else {
      playerJoinAudio.play();
    }
  };
  const playerSelect = async (temp) => {
    try {
      if (temp.msg === "No Game found") {
        return;
      }
      const game = temp.data;
      const game_state_account = game.account;
      dispatch(setGameId(game_state_account));
      const obj = await decodeMintsState(game_state_account);
      const mintAddress = [
        obj.mint1.toString(),
        obj.mint2.toString(),
        obj.mint3.toString(),
        obj.mint4.toString(),
        obj.mint5.toString(),
        obj.mint6.toString(),
      ];

      let mints = await Promise.all(
        mintAddress.map((ele) => getMetadataAccount(ele))
      );
      let mintPubkeys = mints.map((m) => new PublicKey(m));

      let multipleAccounts = await connection.getMultipleAccountsInfo(
        mintPubkeys
      );
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
                console.log("data.mint_image", data.mint_image);
                mintImage =
                  `${imagePath}smNft400/${nft.mint}.png` ?? data.mint_image;
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
          } else mintImage = plus_button;

          return {
            playerName: nft.data.name,
            mint: nft.mint,
            mintImage,
          };
        })
      );
      const keys = Object.keys(game);
      let players_ = [];
      for (let i = 0; i < 6; i++) {
        players_[i] = {
          playerName: "",
          mint: "",
          mintImage: plus_button,
          playerPubKey: "",
        };
      }
      let hasSeen = false;
      nftData.forEach((ele, index) => {
        if (pubKey && game[keys[3 + index * 2]] === pubKey) {
          hasSeen = true;
          setMintJoined(ele.mint);
        }

        players_[index] = {
          ...ele,
          playerPubKey: game[keys[3 + index * 2]],
        };
      });
      if (!hasSeen) {
        setMintJoined("");
      }
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
          const { profileImage: playerImage, userName } = map.get(
            ele.playerPubKey
          );
          obj = { ...obj, playerImage, userName };
        }
        return obj;
      });
      if (game.winner_pubkey === DummyPubKey) {
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
      lock.current = true;
    } catch (err) {
      console.log(err);
    }
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event, index) => {
    if (
      players[index].playerPubKey === pubKey &&
      (NumOfJoin !== 6 || finalWinner != -1)
    ) {
      if (finalWinner != -1) {
        if (afterComplete[index].text !== "WON" || isAlreadyWithdraw) return;
        setIsWithdrawWinning(true);
      }
      setAnchorEl(event.currentTarget);
    }
    participant(index);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [collections, setCollections] = useState([]);
  const fetchData = async () => {
    try {
      const resp = await fetch(
        `${baseUrl}/collectionByCollectionMint/${collectionMint}`
      );
      let data = await resp.json();

      setCollections(data);
    } catch (error) {
      console.log(error);
    }
  };

  // useEffect(() => {
  //   let currentActive = 0;
  //   const interval = setInterval(() => {
  //     currentActive = (currentActive + 1) % 6;
  //     startGame({ countdown: "GO", currentActive, finished: false });
  //   }, 100);
  //   return () => {
  //     clearInterval(interval);
  //   };
  // }, [isMuted]);
  useEffect(() => {
    if (collectionMint) fetchData();
  }, [collectionMint]);

  useEffect(() => {
    getCollectionMintByName(collectionMintName);
  }, [collectionMintName]);
  const sendWithdrawRequest = async (gamId, signature) => {
    try {
      const resp = await fetch(`${baseUrl}/withdrawn/${gamId}/${signature}`);
      await resp.json();
    } catch (error) {
      console.log(error);
    }
  };

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

  const claim = async () => {
    if (pubKey != "") {
      try {
        setAnchorEl(null);
        const signature = await claim_nft(
          pubKey,
          collectionMint,
          gameId,
          TreasuryAccount,
          stateDetails.floorPrice
        );
        sendWithdrawRequest(gameId, signature);
        setIsAlreadyWithdraw(true);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const [withdrawopen, setWithdrawOpen] = useState(false);
  const handleWithdraw = () => setWithdrawOpen(true);
  const CloseModal = () => setWithdrawOpen(false);
  const PlayGame = async () => {
    if (collections.slug === undefined) {
      setPageNotFound(true);
      return;
    } else {
      try {
        const resp = await fetch(
          `${baseUrl}/gameState/${collectionMint}/2/false`
        );
        const obj = await resp.json();
        setPageNotFound(false);
        if (obj.msg === "created") {
          navigate(
            `/winnertakesall/${collections.slug}?gameId=${obj.data.account}`
          );
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
        const resp = await fetch(
          `${baseUrl}/gameState/${collectionMint}/2/false`
        );
        const obj = await resp.json();
        setPageNotFound(false);

        if (
          gameId === obj.data.account ||
          window.location.href.endsWith("#game")
        )
          return;

        if (obj.msg === "created") {
          navigate(
            `/winnertakesall/${collections.slug}?gameId=${obj.data.account}`
          );
          window.location.reload();
        } else if (obj.msg === "creating") {
          console.log("creating");
        }
      } catch (err) {
        console.log(err);
      }
    };
    Redirect();
  }, [collectionMint, collections, gameId]);

  let [isAlreadyPlayed, setIsAlreadyPlayed] = useState(false);
  useEffect(() => {
    let timeOut;
    if (isAlreadyPlayed) return; //if it's there it will let audio play only once..
    if (finalWinner !== -1) {
      playersRef.forEach((ref, index) => {
        ref.current.classList.add(`transition-setup`);
        ref.current.classList.add(`translate-${index + 1}-${finalWinner}`);
      });
      // const classAnimation = `${
      //     ? `transition-setup translate-${
      //         index + 1
      //       }-${finalWinner}`
      //     : ``
      // }`;

      setIsAlreadyPlayed(true); //For Playing once only winner audio
      if (onMute == "false") {
        return;
      } else {
        timeOut = setTimeout(() => {
          audio.play();
        }, 4500);
      }
    }
    return () => {
      // if (timeOut) clearTimeout(timeOut);
    };
  }, [finalWinner, isMuted]);

  const [onMute, setOnMute] = useState(
    localStorage.getItem("mute") ? localStorage.getItem("mute") : "false"
  );
  // console.log("jdkfnkjdfhbdkfgkj", localStorage.getItem("mute"));
  const handleMute = () => {
    // setToLocalStorage(!toLocalStorage);
    // localStorage.setItem("mute", toLocalStorage);
    setOnMute(onMute === "true" ? "false" : "true");
  };

  const winnerRef = useRef();

  // useEffect(() => {
  //   // if (winnerRef) {
  //   //   winnerRef?.current?.click();
  //   // }
  //   // let fromLocalStorage = localStorage.getItem("mute");
  //   // dispatch(setIsMuted(fromLocalStorage === "true" ? false : true));
  //   // // console.log("FromLocal", fromLocalStorage, isMuted);
  // }, [isMuted, toLocalStorage]);

  useEffect(() => {
    if (winnerRef) {
      winnerRef?.current?.click();
    }
    localStorage.setItem("mute", onMute);
    dispatch(setIsMuted(onMute));
  }, [onMute]);

  // console.log("timeDiff?.days()", timeDiff?.minutes());

  const ogImageUrl = `https://wnrs.tools/0kKb0Tv_1689160981954.png`;

  return (
    <>
      {pageNotFound ? (
        <PageNotFound />
      ) : (
        <>
          {title ? (
            <Helmet>
              <title>{title}</title>
              <meta property="og:title" content="Your Website Title" />
              <meta
                property="og:description"
                content={`Description for ${collectionMint}`}
              />
              <meta property="og:image" content={ogImageUrl} />{" "}
              {/* Dynamic og:image */}
              <meta
                property="og:url"
                content={`URL_TO_YOUR_WINNERS_ROUND_PAGE/${collectionMint}`}
              />{" "}
              {/* Replace with the actual URL of the WinnersRound page */}
              <meta property="og:type" content="website" />
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
          <WinnerHeroSection
            title={"Winner Takes All"}
            subTitle={"6 PLAYERS - 1 WINNER"}
          />
          <div
            id="game"
            className="justify-between block sm:block md:block lg:flex 2xl:flex"
          >
            <div className="flex min-w-[50%] justify-between">
              {/* <audio id="player" autoPlay controls>
                        <source src={roundwin} type="audio/wav"></source>
                    </audio> */}

              <div>
                <div className="flex gap-2">
                  <div
                    className="text-2xl font-black tracking-wide text-gray"
                    ref={winnerRef}
                    // onClick={() => console.log("firstClicked")}
                  >
                    Winner Take All
                  </div>
                  <div className="flex items-center text-sm font-black leading-6 tracking-wider text-nouveau-main">
                    {NumOfJoin}/6
                  </div>
                </div>
                <div className="text-space-gray text-opacity-[0.8] tracking-wide font-semibold text-sm leading-6">
                  {NumOfJoin <= 5 ? (
                    <>
                      Waiting for{" "}
                      <span className="text-light-green">
                        {" "}
                        {6 - NumOfJoin}{" "}
                      </span>{" "}
                      more player{6 - NumOfJoin !== 1 && "s"}...
                    </>
                  ) : countDown !== "GO" && finalWinner === -1 ? (
                    <>
                      Game starting in{" "}
                      <span className="text-light-green"> {countDown}</span>{" "}
                      seconds
                    </>
                  ) : finalWinner === -1 && countDown === "GO" ? (
                    <>Game started</>
                  ) : (
                    <>Game ended</>
                  )}
                </div>

                <div>
                  <div className="flex mt-8">
                    <div className="min-w-[50%]">
                      {finalWinner !== -1 && (
                        <div className="relative">
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
                                    onClick={() => PlayGame()}
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

                      <div
                        className={`min-w-[50%] flex justify-center h-96 md:ml-5`}
                      >
                        <div className="relative">
                          {players.map((player, index) => {
                            const spot = spots[index];
                            return (
                              <>
                                <div className="hover:cursor-pointer w-28 h-28">
                                  {finalWinner !== -1 &&
                                    finalWinner !== index + 1 && (
                                      <div
                                        className={`hex absolute  ${spot.spotPosition}`}
                                      >
                                        <div
                                          className={`hex-background  mask mask-hexagon-2 mask-repeat object-cover opacity-100`}
                                        >
                                          <img
                                            src={plus_button}
                                            onError={handleImageError}
                                            className={`hover:cursor-pointer w-28 h-28 mask mask-hexagon-2 mask-repeat object-cover absolute top-[3px] right-[2.5px]`}
                                          />
                                        </div>
                                      </div>
                                    )}
                                  <div
                                    ref={playersRef[index]}
                                    className={`hex absolute ${spot.responsive} ${
                                      spot.spotPosition
                                    } ${
                                      finalWinner == index + 1 ? "winner" : ""
                                    }`}
                                    // onClick={() => console.log("indexing", index) }

                                    onClick={(e) =>
                                      index !== 6 &&
                                      !skeleton &&
                                      handleClick(e, index)
                                    }
                                    aria-controls={
                                      open ? "account-menu" : undefined
                                    }
                                    aria-haspopup="true"
                                    aria-expanded={open ? "true" : undefined}
                                  >
                                    {afterComplete[index].display && (
                                      <>
                                        <div
                                          className={`flex ${afterComplete[index].bgcolor} text-yankees-blue gap-2 justify-center rounded-xl py-1 px-2 w-16 absolute ${spot.youTextPostion}`}
                                        >
                                          <img
                                            src={afterComplete[index].image}
                                            onError={handleImageError}
                                          />
                                          <div className="text-xs font-bold tracking-wide uppercase">
                                            {afterComplete[index].text}
                                          </div>
                                        </div>
                                      </>
                                    )}
                                    {afterComplete[index].isBoth && (
                                      <div
                                        className={`flex bg-dark-purple text-yankees-blue gap-2 justify-center rounded-xl py-1 px-2 w-16 absolute ${spot.wonTextPostion}`}
                                      >
                                        <img
                                          src={winner}
                                          onError={handleImageError}
                                        />
                                        <div className="text-xs font-bold tracking-wide uppercase">
                                          WON
                                        </div>
                                      </div>
                                    )}
                                    {players[index].mintImage !== add_new_nft &&
                                      players[index].mintImage !==
                                        plus_button && (
                                        <Color
                                          src={players[index].mintImage}
                                          crossOrigin="anonymous"
                                          format="hex"
                                        >
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
                                      className={`hex-background-winnersRound  mask mask-hexagon-2 mask-repeat object-cover ${
                                        currentActive === index + 1
                                          ? classes.active
                                          : afterComplete[index].display &&
                                            countDown === ""
                                          ? classes[afterComplete[index].text]
                                          : currentActive === 0 &&
                                            countDown === null
                                          ? classes.pending
                                          : classes.begin
                                      } ${
                                        afterComplete[index].display &&
                                        afterComplete[index].text === "YOU" &&
                                        `container-img ${classes.WON}`
                                      }`}
                                    >
                                      {players[index].mintImage ===
                                      add_new_nft ? (
                                        <>
                                          {!joining.open ? (
                                            <SVGComponent
                                              className={`hover:cursor-pointer  w-28 h-28 mask mask-hexagon-2 absolute top-[3px] right-[2.5px] mask-repeat`}
                                            />
                                          ) : (
                                            <div
                                              className={`hex-background  mask mask-hexagon-2 mask-repeat object-cover opacity-100`}
                                            >
                                              <img
                                                src={plus_button}
                                                onError={handleImageError}
                                                className={`hover:cursor-pointer w-28 h-28 mask mask-hexagon-2 mask-repeat object-cover absolute top-[3px] right-[2.5px]`}
                                              />
                                            </div>
                                          )}
                                        </>
                                      ) : (
                                        <img
                                          src={players[index].mintImage}
                                          onError={handleImageError}
                                          className={`hover:cursor-pointer w-28 h-28 mask mask-hexagon-2 absolute top-[3px] right-[2.5px] mask-repeat object-cover`}
                                        />
                                      )}
                                      {pubKey === player.playerPubKey &&
                                        (NumOfJoin !== 6 ||
                                          finalWinner != -1) && (
                                          <>
                                            <span className="overlay">
                                              <img
                                                src={dotshover}
                                                onError={handleImageError}
                                                className="dots-hover icon"
                                              />
                                            </span>
                                          </>
                                        )}
                                    </div>
                                  </div>
                                </div>

                                {index === 1 && !skeleton && (
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
                                      className={`py-5 -ml-3 cursor-pointer hover:text-gray `}
                                      onClick={() =>
                                        isWithdrawWinning
                                          ? WinnerModal()
                                          : handleWithdraw()
                                      }
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

                                        <div className="">
                                          Withdraw{" "}
                                          {isWithdrawWinning && "Winnings"}
                                        </div>
                                      </div>
                                    </div>
                                  </StyledMenu>
                                )}
                                {index === 2 && (
                                  <>
                                    {countDown !== null && (
                                      <>
                                        <div
                                          className={`hex absolute top-[138px]`}
                                        >
                                          <div
                                            className={`hex-background mask mask-hexagon-2 mask-repeat object-cover`}
                                          >
                                            <img
                                              src={plus_button}
                                              onError={handleImageError}
                                              className={`hover:cursor-pointer w-28 h-28`}
                                            />
                                          </div>
                                        </div>
                                        {countDown <= 9 ? (
                                          <div
                                            className={`absolute top-[177px] ${
                                              countDown === null
                                                ? "left-[34px]"
                                                : countDown != "10"
                                                ? "left-[47px]"
                                                : "left-[37px]"
                                            } text-gray text-4xl`}
                                          >
                                            {countDown}
                                          </div>
                                        ) : (
                                          <div
                                            className={`absolute top-[177px] ${
                                              countDown === null
                                                ? "left-[34px]"
                                                : countDown !== "10" &&
                                                  countDown !== "GO"
                                                ? "left-[40px]"
                                                : countDown == "Go"
                                                ? "left-[34px]"
                                                : "left-[32px]"
                                            } text-gray text-4xl`}
                                          >
                                            {countDown}
                                          </div>
                                        )}
                                      </>
                                    )}
                                  </>
                                )}
                              </>
                            );
                          })}
                        </div>
                      </div>

                      {/* {finalWinner !== -1 && (
                    <button onClick={claimbyAdmin}>Claim by Admin</button>
                  )} */}

                      {/* {timeDiff?.days() && timeDiff?.days() <= 1 ? (
                        <>
                          {result.winner_pubkey !== DummyPubKey && (
                            <div className="flex gap-5">
                              <div>
                                <span className="text-4xl countdown">
                                  <span
                                    style={{
                                      "--value":
                                        timeDiff?.days() && timeDiff?.days() > 0
                                          ? timeDiff?.days()
                                          : 0,
                                    }}
                                  ></span>
                                </span>
                                days
                              </div>
                              <div>
                                <span className="text-4xl countdown">
                                  <span
                                    style={{
                                      "--value":
                                        timeDiff?.hours() &&
                                        timeDiff?.hours() > 0
                                          ? timeDiff?.hours()
                                          : 0,
                                    }}
                                  ></span>
                                </span>
                                hours
                              </div>
                              <div>
                                <span className="text-4xl countdown">
                                  <span
                                    style={{
                                      "--value":
                                        timeDiff?.minutes() &&
                                        timeDiff?.minutes() > 0
                                          ? timeDiff?.minutes()
                                          : 0,
                                    }}
                                  ></span>
                                </span>
                                min
                              </div>
                              <div>
                                <span className="text-4xl countdown">
                                  <span
                                    style={{
                                      "--value":
                                        timeDiff?.seconds() &&
                                        timeDiff?.seconds() > 0
                                          ? timeDiff?.seconds()
                                          : 0,
                                    }}
                                  ></span>
                                </span>
                                sec
                              </div>
                            </div>
                          )}
                        </>
                      ) : (
                        timeDiff?.days() &&
                        timeDiff?.days() >= 1 && (
                          <>
                            <div className="flex gap-5">
                              <div>
                                <span className="text-4xl countdown">
                                  <span
                                    style={{
                                      "--value":
                                        timeDiff?.days() && timeDiff?.days() > 0
                                          ? timeDiff?.days()
                                          : 0,
                                    }}
                                  ></span>
                                </span>
                                days
                              </div>
                            </div>
                          </>
                        )
                      )} */}
                      {timeDiff?.days() && timeDiff?.days() > 1 ? (
                        <>
                          <div className="flex gap-5">
                            <div>
                              <span className="text-4xl countdown">
                                <span
                                  style={{
                                    "--value":
                                      timeDiff?.days() && timeDiff?.days() > 0
                                        ? timeDiff?.days()
                                        : 0,
                                  }}
                                ></span>
                              </span>
                              days
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          {result.winner_pubkey !== DummyPubKey && (
                            <div className="flex gap-5">
                              <div>
                                <span className="text-4xl countdown">
                                  <span
                                    style={{
                                      "--value":
                                        timeDiff?.days() && timeDiff?.days() > 0
                                          ? timeDiff?.days()
                                          : 0,
                                    }}
                                  ></span>
                                </span>
                                days
                              </div>
                              <div>
                                <span className="text-4xl countdown">
                                  <span
                                    style={{
                                      "--value":
                                        timeDiff?.hours() &&
                                        timeDiff?.hours() > 0
                                          ? timeDiff?.hours()
                                          : 0,
                                    }}
                                  ></span>
                                </span>
                                hours
                              </div>
                              <div>
                                <span className="text-4xl countdown">
                                  <span
                                    style={{
                                      "--value":
                                        timeDiff?.minutes() &&
                                        timeDiff?.minutes() > 0
                                          ? timeDiff?.minutes()
                                          : 0,
                                    }}
                                  ></span>
                                </span>
                                min
                              </div>
                              <div>
                                <span className="text-4xl countdown">
                                  <span
                                    style={{
                                      "--value":
                                        timeDiff?.seconds() &&
                                        timeDiff?.seconds() > 0
                                          ? timeDiff?.seconds()
                                          : 0,
                                    }}
                                  ></span>
                                </span>
                                sec
                              </div>
                            </div>
                          )}
                        </>
                      )}

                      <div className="mt-10">
                        <div className="text-sm font-black leading-6 tracking-wide text-gray">
                          How It Works
                        </div>
                        <div className="mt-1 text-sm font-semibold leading-6 tracking-wide text-space-gray">
                          6 Players, 6 NFTs, 1 random winner gets selected,{" "}
                          <br /> winner take all
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="min-w-[50%]">
              <div className="flex justify-between gap-4 mt-10 sm:justify-between md:justify-between lg:justify-end 2xl:justify-end sm:mt-10 md:mt-10 lg:mt-0 2xl:mt-0">
                <div className="flex gap-2 mt-6 sm:mt-6 md:mt-6 lg:mt-0">
                  <div
                    className="bg-nouveau-main bg-opacity-[0.08] rounded-lg px-6 py-3 text-space-gray font-bold h-fit hover:cursor-pointer"
                    onClick={() => {
                      handleMute();
                    }}
                  >
                    {onMute == "true" ? (
                      <img
                        src={speaker_icn}
                        className="w-6 h-6"
                        onError={handleImageError}
                      />
                    ) : (
                      <img
                        src={mute_icn}
                        className="w-6 h-6"
                        onError={handleImageError}
                      />
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
              <div className="mt-8">
                <Link to={`/games/${collections.slug || "collections"}`}>
                  <div className="p-8 bg-yankees-blue rounded-3xl">
                    <div className="flex items-center gap-3">
                      {collections.collectionName ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-5 h-5 text-space-gray-rgb"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ) : (
                        <Skeleton
                          variant="circular"
                          sx={{ borderRadius: "0.75rem" }}
                          animation="wave"
                        />
                      )}
                      {collections.collectionName ? (
                        <div className="text-xl not-italic font-black tracking-wide text-gray">
                          {collections.collectionName}
                        </div>
                      ) : (
                        <Skeleton
                          variant="text"
                          sx={{ fontSize: "1rem" }}
                          width={56}
                          animation="wave"
                        />
                      )}

                      <img
                        src={verified}
                        className="w-5 h-5"
                        onError={handleImageError}
                      />
                    </div>
                    <div className="relative mt-4">
                      <div className="block gap-3 sm:flex ">
                        {collections.collectionName ? (
                          <img
                            src={`${imagePath}profile400/${collections.profilePath}`}
                            onError={handleImageError}
                            // src={`${imagePath}smNft400/${collections.collection_mint}`}
                            className="w-20 h-20 rounded-xl"
                          />
                        ) : (
                          <Skeleton
                            variant="rectangular"
                            width={96}
                            height={60}
                            sx={{ borderRadius: "0.75rem" }}
                          />
                        )}
                        {collections.collectionName ? (
                          <div className="text-sm font-semibold leading-6 tracking-wide text-space-gray">
                            {collections.desc}
                          </div>
                        ) : (
                          <Skeleton
                            variant="rectangular"
                            width={300}
                            height={60}
                            sx={{ borderRadius: "0.75rem" }}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </Link>

                <div className="mt-8">
                  <div className="flex justify-between text-space-gray uppercase text-xs tracking-wider text-opacity-[0.56] font-bold">
                    <div>PLAYER</div>
                    <div>NFT</div>
                  </div>

                  {/* NFT list */}

                  {NumOfJoin === 0 && <FirstJoin />}

                  {players.map((player, index) => {
                    if (
                      player.playerName === "" ||
                      player.playerPubKey === DummyPubKey
                    ) {
                      if (isMobileOnly) return <div key={index}></div>;
                      else
                        return (
                          <div
                            key={index}
                            className="flex justify-between mt-8 text-sm font-semibold leading-6 tracking-wide text-space-gray"
                          >
                            <div className="flex gap-4">
                              <div className="w-14 h-14">
                                <Skeleton
                                  variant="rectangular"
                                  sx={{ borderRadius: "0.75rem" }}
                                  width={56}
                                  height={56}
                                  animation="wave"
                                />
                              </div>
                              <div className="flex items-center ">
                                <Skeleton
                                  variant="rectangular"
                                  width={120}
                                  animation="wave"
                                />
                              </div>
                            </div>
                            <div className="flex items-center">
                              <Skeleton
                                animation="wave"
                                variant="rectangular"
                                width={100}
                              />
                            </div>
                          </div>
                        );
                    }

                    return (
                      <div
                        key={index}
                        className="flex justify-between py-2 mt-8 text-sm font-semibold leading-6 tracking-wide cursor-pointer hover:bg-yankees-blue hover:rounded-3xl hover:px-6 text-space-gray"
                      >
                        <div className="flex gap-4">
                          {player.playerImage ? (
                            <Link
                              to={`/${
                                replaceSlug(player.userName) ||
                                player.playerPubKey
                              }`}
                              state={{
                                pubKey: player.playerPubKey,
                              }}
                            >
                              <div className="overflow-hidden w-14 h-14 rounded-xl">
                                <img
                                  src={`${imagePath}profile400/${player.playerImage}`}
                                  onError={handleImageError}
                                  className="rounded-xl w-14 h-14 object-cover bg-chat-bg bg-opacity-95"
                                />
                              </div>
                            </Link>
                          ) : (
                            <img
                              src={player.mintImage}
                              onError={handleImageError}
                              className="rounded-xl w-14 h-14 object-cover"
                            />
                          )}
                          <div className="flex items-center gap-5">
                            {player.userName ? (
                              <Link
                                to={`/${
                                  replaceSlug(player.userName) ||
                                  player.playerPubKey
                                }`}
                                state={{
                                  pubKey: player.playerPubKey,
                                }}
                              >
                                {player.userName}
                              </Link>
                            ) : (
                              <div>{getAddress(player.playerPubKey)}</div>
                            )}
                            {afterComplete[index].text === "WON" && (
                              <div
                                className={`flex bg-dark-purple text-yankees-blue gap-2 justify-center rounded-xl py-1 px-2 w-16`}
                              >
                                <img src={winner} onError={handleImageError} />
                                <div className="text-xs font-bold tracking-wide uppercase">
                                  WON
                                </div>
                              </div>
                            )}
                          </div>
                          {/* {afterComplete[index].text} */}
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="hidden nft_name">
                            {player.playerName}
                          </div>
                          {/* <img src={`${imagePath}${player.playerImage}`} className='w-12 h-12 rounded-xl mask mask-hexagon-2' /> */}
                          <img
                            src={player.mintImage}
                            onError={handleImageError}
                            className="rounded-xl w-12 h-[43.2px] mask mask-hexagon-2 mask-repeat object-cover"
                          />
                        </div>
                      </div>
                    );
                  })}

                  {isMobileOnly && NumOfJoin !== 6 && (
                    <div className="flex justify-between mt-8 text-sm font-semibold leading-6 tracking-wide text-space-gray">
                      <div className="flex gap-4">
                        <div className="w-14 h-14">
                          <Skeleton
                            variant="rectangular"
                            sx={{ borderRadius: "0.75rem" }}
                            width={56}
                            height={56}
                            animation="wave"
                          />
                        </div>
                        <div className="flex items-center ">
                          <Skeleton
                            variant="rectangular"
                            width={120}
                            animation="wave"
                          />
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Skeleton
                          animation="wave"
                          variant="rectangular"
                          width={100}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div ref={prevRoundRef} className="mt-14">
            <PreviousRounds finalWinner={pre_winner} />
          </div>

          <WithdrawModal
            open={withdrawopen}
            onClose={CloseModal}
            leaveGame={leaveGame}
            claimState={claimState}
            setClaimState={setClaimState}
            title={title}
            slug={slug}
          ></WithdrawModal>
          {result.winner_pubkey != DummyPubKey && (
            <CongratulationsModal
              duration={timeDiff}
              open={winneropen}
              onClose={modalClose}
              setIsAlreadyWithdraw={setIsAlreadyWithdraw}
              result={result}
              collections={collections}
              is1v1={false}
              title={title}
              slug={slug}
            ></CongratulationsModal>
          )}
        </>
      )}
    </>
  );
}
