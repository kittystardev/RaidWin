import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Link, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { XIcon } from "@heroicons/react/outline";
import games from "../../assets/img/games.png";
import backarrow from "../../assets/img/backArrow.svg";
import star from "../../assets/img/star.svg";
import Lottie from "lottie-react";
import animation_optimized from "../../json/animation_optimized.json";
import star_color from "../../assets/img/star_color.svg";
import baseball_yellow from "../../assets/images/baseball.svg";
import baseball from "../../assets/images/baseball_yellow.svg";
import dropup from "../../assets/img/dropup.svg";
import dropdown from "../../assets/img/dropdown.svg";
import medal from "../../assets/img/medal.svg";
import medal_color from "../../assets/img/medal_color.svg";
import opensea from "../../assets/img/opensea.svg";
import mevector from "../../assets/img/mevector.svg";
import solana from "../../assets/img/solana.svg";
import solana_icon from "../../assets/images/solana_icon.svg";
import buy_button from "../../assets/images/buy_button.svg";
import dots from "../../assets/images/dots.svg";
import chaticon from "../../assets/images/chaticon.svg";
import correcticon from "../../assets/images/correcticon.svg";
import collections from "../../assets/images/collections.svg";
import collections_color from "../../assets/img/collections_color.svg";
import gift from "../../assets/images/gift.png";
import gift_color from "../../assets/images/gift-color.png";
import streams from "../../assets/images/streams.svg";
import streams_color from "../../assets/img/streams_color.svg";
import support from "../../assets/images/support.svg";
import support_color from "../../assets/img/support_color.svg";
import Header from "./Header";
import NFTPools from "../NFTPools";
import PreviousRounds from "../PreviousRounds";
import WinnersRound from "../WinnersRound";
import NFTPoolCardList from "../NFTPoolCardList";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import styled from "styled-components";
import ChatBox from "./ChatBox";
import { Avatar, Drawer, useMediaQuery } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setModalOpen } from "../../store/NFTModal.js";
import {
  setConnectModal,
  setDataLoaded,
  setFromGameJoin,
  setPubKey,
} from "../../store/TempSlice.js";
import PlayNFTModal from "../modals/PlayNFTModal";
import Winner from "../Winner";
import Games from "../Games";
import RockPaperScissor from "../RockPaperScissor";
import { baseUrl } from "../../utils/utils";
import logo from "../../assets/images/logo.svg";
import wallet from "../../assets/images/wallet.svg";
import ConnectionModal from "../modals/ConnectionModal";
import Connected from "./Connected";
import LastPlayed from "../LastPlayed";
import CollectionDetails from "../CollectionDetails";
import { isMobile } from "react-device-detect";
import TopPlayers from "../TopPlayers";
import HomeHeroSection from "./HomeHeroSection";
import WinnerHeroSection from "./WinnerHeroSection";
import LeaderHeroSection from "./LeaderHeroSection";
import ReferralProgram from "../ReferralProgram";
import AllCollections from "../AllCollections";
import Support from "../Support";
import RockHeroSection from "./RockHeroSection";
import StreamHeroSection from "../StreamHeroSection";
import Stream from "../Stream";
import ProfileSection from "../ProfileSection";
import FAQ from "../FAQ";
import PageNotFound from "./PageNotFound";
import Business from "../Business";
import Setting from "../Setting";
import LastPlayedTable from "../LastPlayedTable";
import { fetchUserData } from "../../store/UserSlice";
import VerifiedSection from "./VerifiedSection";
import { useRef } from "react";
import { setIsMuted } from "../../store/topplayer";
import FlipCoin from "../FlipCoin";
import CookieBanner from "react-cookie-banner/lib";
import NFTPoolCardList1vs1 from "../NFTPoolCardList1vs1";
import DogeVsCheemsHero from "./DogeVsCheemsHero";
import { faqData } from "../faqData";
import Footer from "../Footer";

const Hovertip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#27314B",
    color: "#6A7080",
    fontSize: 11,
    letterSpacing: "0.01em",
    borderRadius: "20px",
    padding: "16px",
    fontWeight: 700,
  },
}));

export default function SideBar() {
  const location = useLocation();
  const { pathname } = useLocation();

  useEffect(() => {
    dispatch(setIsMuted(true));
    if (pathname !== "/" && pathname !== "/winnertakesall") {
      dispatch(setDataLoaded(false));
    }
  }, [pathname]);

  let searchParams = new URLSearchParams(location.search);
  let referral = searchParams.get("ref");
  if (referral) localStorage.setItem("ref", referral);

  const dispatch = useDispatch();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pubKey = useSelector((state) => (state.Temp.pubKey ? state.Temp.pubKey.toString() : ""));
  let players = useSelector((state) => state.Players.players);
  const player = players.find((p) => p._id === pubKey);

  const [skeleton, setSkeleton] = useState(false);
  const [hovered, setHovered] = useState(null);
  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(true);
  const ulElement = useRef();
  const streamsElement = useRef();
  const supportElement = useRef();
  const collectionsElement = useRef();
  const airdropElement = useRef();
  const leaderboardElement = useRef();
  const winnerTakeAllElement = useRef();
  const flipCoinElement = useRef();
  const [showchatbox, setShowChatBox] = useState(true);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const profilemenuopen = Boolean(anchorEl);
  // console.log(profilemenuopen)
  const desktopView = useMediaQuery("(max-width:1536px)");

  useEffect(() => {
    if (desktopView) {
      setShowChatBox(false);
    } else {
      setShowChatBox(true);
    }
  }, [desktopView]);
  const scollToRef = useRef(null);
  const prevRoundRef = useRef(null);
  useEffect(() => {
    scollToRef.current.scrollTo(0, 0);
  }, [location]);
  const executeScroll = () => {
    const offset = prevRoundRef.current.offsetTop;
    // const height = prevRoundRef.current.getBoundingClientRect().height
    scollToRef.current.scrollTo(0, offset);
  };
  let getReferral = localStorage.getItem("ref");

  useEffect(() => {
    if (!pubKey) return;
    (async function () {
      try {
        const resp = await fetch(`${baseUrl}/createPlayer/${pubKey}`, {
          method: "POST",
          body:
            getReferral && !player
              ? JSON.stringify({ referral: getReferral })
              : JSON.stringify({ referral: "" }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        await resp.json();
        referral && navigate("/");
        localStorage.removeItem("ref");
        setSkeleton(false);
      } catch (error) {
        console.log("error", error);
      }
    })();
  }, [pubKey]);

  const getConnectedWallet = async () => {
    const provider = await window.solana;
    provider.connect({ onlyIfTrusted: true });
    if (provider) {
      localStorage.setItem("pubKey", provider.publicKey);
      dispatch(setPubKey(provider.publicKey.toString()));
    } else console.log("Try to connect again");
  };
  const connectWallet = async (onlyIfTrusted) => {
    try {
      const provider = await window.solana;
      if (provider) {
        provider.on("accountChanged", async (publicKey) => {
          if (publicKey) {
            await window.solana.connect({ onlyIfTrusted });
            localStorage.setItem("pubKey", provider.publicKey);
            dispatch(setPubKey(provider.publicKey.toString()));
            console.log(`Switched to account ${publicKey.toBase58()}`);
          }
        });
        await window.solana.connect({ onlyIfTrusted });
        // window.solana.on("connect", async () => {

        // });
        getConnectedWallet();
      } else window.open("https://phantom.app/", "_blank");
    } catch (error) {
      if (error.code === 4001) {
        setSkeleton(false);
      }
    } finally {
      setSkeleton(false);
    }
    // debugger;
  };
  const [upDown, setUpDown] = useState(ulElement?.current?.hidden);

  const HideAndShow = () => {
    setUpDown(!ulElement.current.hidden);
    ulElement.current.hidden = !ulElement.current.hidden;
  };

  const handleClick = async (event) => {
    setAnchorEl(event.currentTarget);
    connectWallet(false);
  };

  useEffect(() => {
    const pubKey = localStorage.getItem("pubKey");
    if (pubKey) {
      setSkeleton(true);
      setTimeout(() => {
        connectWallet(true);
      }, 2000);
    }
  }, []);
  let modalopen = useSelector((state) => state.Index.nftmodal);
  const modalhandleClose = () => {
    dispatch(setModalOpen(false));
  };
  const pageNavigate = (page) => {
    navigate(`/${page}`);
  };
  let alertmessage = useSelector((state) => state.Index.alertdata);

  const openConnect = useSelector((state) => state.Temp.modalOpen);

  const ConnectModal = () => {
    dispatch(setFromGameJoin(false));
    dispatch(setConnectModal(true));
  };
  const CloseModal = () => dispatch(setConnectModal(false));

  useEffect(() => {
    if (pubKey !== "") {
      dispatch(setConnectModal(false));
    }
  }, [pubKey]);

  const isGame = location.pathname.split("/").length == 3;

  useEffect(() => {
    if (pubKey === "") return;
    dispatch(fetchUserData(pubKey.toString()));
  }, [pubKey]);

  const dataLoaded = useSelector((state) => state.Temp.dataLoaded);

  return (
    <>
      <div className={`sm:h-screen  h-fit ${dataLoaded ? `hidden` : `flex font-Montserrat`} `}>
        <Drawer
          variant="permanent"
          open={open}
          anchor="left"
          onClose={() => {
            setOpen(false);
          }}
          sx={{
            "& .MuiPaper-root": {
              transition: "500ms cubic-bezier(0, 0, 0.2, 1) 0ms",
              width: open ? "240px" : "80px",
              background:
                "radial-gradient(93.14% 50% at 50% 100%, #29334A 0%, rgba(19, 24, 38, 0) 100%)",
              borderRight: "0px",
              zIndex: 30,
            },
          }}
          className={`${
            open ? "min-w-[240px]" : "w-20"
          } hidden min-h-screen max-h-screen md:block relative`}
        >
          {/* <div className={`${open ? 'min-w-[240px]' : 'w-20'} hidden min-h-screen max-h-screen sidebar-gradient md:block  relative`}> */}
          <div className="scroll_hide scrollY flex flex-col w-full h-full px-6 overflow-visible mt-[7px]">
            <div
              className={`flex-shrink-0 mt-[1.3rem] flex w-full ${
                open ? "justify-between" : "justify-center"
              } items-center text-gray font-black tracking-wide text-md uppercase`}
            >
              <div
                className={`${!open && "hidden"} float-left cursor-pointer`}
                onClick={() => pageNavigate("")}
              >
                <Link to="/">
                  {" "}
                  <img src={logo} alt="logo" width={135} height={135} />{" "}
                </Link>
              </div>
              {open ? (
                <img
                  className={`cursor-pointer float-right duration-150 mt-1`}
                  src={backarrow}
                  alt="Workflow"
                  onClick={() => setOpen(!open)}
                />
              ) : (
                <div className="mt-1.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6 cursor-pointer text-space-gray"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                    onClick={() => setOpen(!open)}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </div>
              )}
            </div>
            <div
              className={`mt-16 mb-8 w-full flex items-center  ${
                !open && "justify-center"
              } text-space-gray-rgb font-bold tracking-wider text-xs uppercase`}
            >
              <div>play</div>
            </div>
            <ul className="px-px">
              <li className="container flex items-center w-full mb-6 cursor-pointer text-gray sidebar-item">
                {/* <Link > */}
                {location.pathname === "/" && <div className="vertical-stripe" />}
                <div className="flex items-center justify-center w-full">
                  <div>
                    {!open ? (
                      <Hovertip title="Games" placement="right">
                        <img
                          src={games}
                          className="flex items-center min-w-[22px] h-[22px]"
                          onClick={() => HideAndShow()}
                          alt=""
                        />
                      </Hovertip>
                    ) : (
                      <img
                        src={games}
                        className="flex items-center min-w-[22px] h-[22px]"
                        onClick={() => HideAndShow()}
                        alt=""
                      />
                    )}
                  </div>

                  <button
                    type="button"
                    className={`flex items-center w-full ${!open && "hidden"} ${
                      location.pathname === "/" ? "text-gray" : "text-space-gray"
                    }`}
                    alt="Games"
                  >
                    <span
                      className="ml-3 text-sm font-bold tracking-wide text-left uppercase whitespace-nowrap grow"
                      onClick={() => HideAndShow()}
                    >
                      games
                    </span>
                    {upDown ? (
                      <div onClick={() => HideAndShow()}>
                        <img src={dropdown} className="flex items-center" alt="" />
                      </div>
                    ) : (
                      <div onClick={() => HideAndShow()}>
                        <img src={dropup} className="flex items-center" alt="" />
                      </div>
                    )}
                  </button>
                </div>
                {/* </Link> */}
              </li>
              <ul ref={ulElement} className={`${open && "pl-1"} translate-y-1`}>
                <li
                  onMouseEnter={() => (winnerTakeAllElement.current.src = star_color)}
                  onMouseLeave={() =>
                    !location.pathname.startsWith("/winnertakesall")
                      ? (winnerTakeAllElement.current.src = star)
                      : ""
                  }
                  className={`flex items-center ${
                    !open && "justify-center"
                  } mb-6 cursor-pointer h-[20px] sidebar-item container`}
                >
                  {/* <a href='#main'> */}
                  {location.pathname.startsWith("/winnertakesall") && (
                    <div className="vertical-stripe" />
                  )}
                  <Link to="/winnertakesall">
                    {!open ? (
                      <Hovertip title="Winner Takes All" placement="right">
                        <img
                          ref={winnerTakeAllElement}
                          src={location.pathname.startsWith("/winnertakesall") ? star_color : star}
                          className={`flex items-center `}
                          alt=""
                        />
                      </Hovertip>
                    ) : (
                      <img
                        ref={winnerTakeAllElement}
                        src={location.pathname.startsWith("/winnertakesall") ? star_color : star}
                        className={`flex items-center `}
                        alt=""
                      />
                    )}
                  </Link>

                  {/* </a> */}
                  <Link
                    to="/winnertakesall"
                    className={`text-sm ml-3 flex items-center font-bold ${
                      location.pathname.startsWith("/winnertakesall")
                        ? "text-gray"
                        : "text-space-gray"
                    }  tracking-wide capitalize whitespace-nowrap ${!open && "hidden"}`}
                  >
                    Winner Takes All
                  </Link>
                </li>
                {/* <Link to="/rockpaperscissors">
                  <li
                    onMouseEnter={() =>
                      (rockPaperElement.current.src = scissor_color)
                    }
                    onMouseLeave={() =>
                      location.pathname !== "/rockpaperscissors"
                        ? (rockPaperElement.current.src = scissor)
                        : ""
                    }
                    className={`flex items-center ${
                      !open && "justify-center"
                    } mb-6 h-[20px] sidebar-item container`}
                  >
                    {location.pathname === "/rockpaperscissors" && (
                      <div className="vertical-stripe" />
                    )}
                    {!open ? (
                      <Hovertip title="Rock Paper Scissors" placement="right">
                        <img
                          ref={rockPaperElement}
                          src={
                            location.pathname === "/rockpaperscissors"
                              ? scissor_color
                              : scissor
                          }
                          className={`flex items-center `}
                        ></img>
                      </Hovertip>
                    ) : (
                      <img
                        ref={rockPaperElement}
                        src={
                          location.pathname === "/rockpaperscissors"
                            ? scissor_color
                            : scissor
                        }
                        // src={
                        //     hovered === "rockpaperscissors" ||
                        //         location.pathname === "/rockpaperscissors"
                        //         ? scissor_color
                        //         : scissor
                        // }
                        className={`flex items-center `}
                      ></img>
                    )}
                    <span
                      className={`text-sm ml-3 flex items-center font-bold ${
                        location.pathname === "/rockpaperscissors"
                          ? "text-gray"
                          : "text-space-gray"
                      } tracking-wide capitalize whitespace-nowrap ${
                        !open && "hidden"
                      }`}
                    >
                      Rock Paper Scissors
                    </span>
                  </li>
                </Link> */}
                <Link to="/dogevscheems">
                  <li
                    onMouseEnter={() => (flipCoinElement.current.src = baseball)}
                    onMouseLeave={() =>
                      !location.pathname.startsWith("/dogevscheems")
                        ? (flipCoinElement.current.src = baseball_yellow)
                        : ""
                    }
                    className={`flex items-center ${
                      !open && "justify-center"
                    } mb-6 h-[20px] sidebar-item container`}
                  >
                    {location.pathname.startsWith("/dogevscheems") && (
                      <div className="vertical-stripe" />
                    )}
                    {!open ? (
                      <Hovertip title="Doge Vs Cheems" placement="right">
                        <img
                          ref={flipCoinElement}
                          src={
                            location.pathname.startsWith("/dogevscheems")
                              ? baseball
                              : baseball_yellow
                          }
                          className={`flex items-center w-5 h-5 `}
                          alt=""
                        />
                      </Hovertip>
                    ) : (
                      <img
                        ref={flipCoinElement}
                        src={
                          location.pathname.startsWith("/dogevscheems") ? baseball : baseball_yellow
                        }
                        // src={
                        //     hovered === "rockpaperscissors" ||
                        //         location.pathname === "/rockpaperscissors"
                        //         ? baseball_bat
                        //         : scissor
                        // }
                        className={`flex items-center w-4 h-4 `}
                        alt=""
                      />
                    )}
                    {/* </a> */}
                    <span
                      className={`text-sm ml-3 flex items-center font-bold ${
                        location.pathname.startsWith("/dogevscheems")
                          ? "text-gray"
                          : "text-space-gray"
                      } tracking-wide capitalize whitespace-nowrap ${!open && "hidden"}`}
                    >
                      Doge vs Cheems
                    </span>
                  </li>
                </Link>
              </ul>
            </ul>
            <div
              className={`mt-16 mb-8 w-full flex items-center ${
                !open && "justify-center"
              } text-space-gray-rgb font-bold tracking-wider text-xs uppercase`}
            >
              <div>others</div>
            </div>
            <ul className="px-px">
              <li
                onMouseEnter={() => (leaderboardElement.current.src = medal_color)}
                onMouseLeave={() =>
                  location.pathname !== "/leaderboard"
                    ? (leaderboardElement.current.src = medal)
                    : ""
                }
                className="container flex items-center justify-between w-full cursor-pointer text-space-gray sidebar-item"
              >
                {location.pathname === "/leaderboard" && <div className="vertical-stripe" />}
                <Link to="/leaderboard" className="flex items-center justify-center w-full">
                  {/* <span className="ml-2 text-sm uppercase">games</span> */}
                  <div>
                    {!open ? (
                      <Hovertip title="Leaderboard" placement="right">
                        <img
                          ref={leaderboardElement}
                          src={location.pathname === "/leaderboard" ? medal_color : medal}
                          className="min-w-[16px] w-[16px] h-[22px]"
                          alt=""
                        />
                      </Hovertip>
                    ) : (
                      <img
                        ref={leaderboardElement}
                        src={location.pathname === "/leaderboard" ? medal_color : medal}
                        className="min-w-[16px] w-[16px] h-[22px]"
                        alt=""
                      />
                    )}
                  </div>
                  <button
                    type="button"
                    className={`flex items-center w-full ${!open && "hidden"} ${
                      location.pathname === "/leaderboard" ? "text-gray" : "text-space-gray"
                    }`}
                  >
                    <span className="ml-3 text-sm font-bold tracking-wide text-left whitespace-nowrap grow">
                      LeaderBoard
                    </span>
                  </button>
                </Link>
              </li>
              <li
                onMouseEnter={() => (collectionsElement.current.src = collections_color)}
                onMouseLeave={() =>
                  !location.pathname.startsWith("/games")
                    ? (collectionsElement.current.src = collections)
                    : ""
                }
                className="container flex items-center justify-between w-full mt-8 cursor-pointer text-space-gray sidebar-item"
              >
                {location.pathname.startsWith("/games") && <div className="vertical-stripe" />}
                <Link to="/games" className="flex items-center justify-center w-full">
                  {/* <span className="ml-2 text-sm">games</span> */}
                  <div>
                    {!open ? (
                      <Hovertip title="Collections" placement="right">
                        <img
                          ref={collectionsElement}
                          src={
                            location.pathname.startsWith("/games") ? collections_color : collections
                          }
                          className="min-w-[16px] w-[16px] h-[22px]"
                          alt=""
                        />
                      </Hovertip>
                    ) : (
                      <img
                        ref={collectionsElement}
                        src={
                          location.pathname.startsWith("/games") ? collections_color : collections
                        }
                        className="min-w-[16px] w-[16px] h-[22px]"
                        alt=""
                      />
                    )}
                  </div>
                  <button
                    type="button"
                    className={`flex items-center w-full ${!open && "hidden"} ${
                      location.pathname.startsWith("/games") ? "text-gray" : "text-space-gray"
                    }`}
                  >
                    <span className="ml-3 text-sm font-bold tracking-wide text-left whitespace-nowrap grow">
                      Collections
                    </span>
                  </button>
                </Link>
              </li>

              <li
                onMouseEnter={() => (airdropElement.current.src = gift_color)}
                onMouseLeave={() =>
                  !location.pathname.startsWith("/airdrop")
                    ? (airdropElement.current.src = gift)
                    : ""
                }
                className="container flex items-center justify-between w-full mt-8 cursor-pointer text-space-gray sidebar-item"
              >
                {location.pathname.startsWith("/airdrop") && <div className="vertical-stripe" />}
                <Link to="/airdrop" className="flex items-center justify-center w-full">
                  {/* <span className="ml-2 text-sm">games</span> */}
                  <div>
                    {!open ? (
                      <Hovertip title="Airdrop" placement="right">
                        <img
                          ref={airdropElement}
                          src={location.pathname.startsWith("/airdrop") ? gift_color : gift}
                          className="min-w-[16px] w-[16px] h-[16px]"
                          alt=""
                        />
                      </Hovertip>
                    ) : (
                      <img
                        ref={airdropElement}
                        src={location.pathname.startsWith("/airdrop") ? gift_color : gift}
                        className="min-w-[16px] w-[16px] h-[16px]"
                        alt=""
                      />
                    )}
                  </div>
                  <button
                    type="button"
                    className={`flex items-center w-full ${!open && "hidden"} ${
                      location.pathname.startsWith("/airdrop") ? "text-gray" : "text-space-gray"
                    }`}
                  >
                    <span className="ml-3 text-sm font-bold tracking-wide text-left whitespace-nowrap grow">
                      Airdrop
                    </span>
                  </button>
                </Link>
              </li>

              <li
                onMouseEnter={() => (streamsElement.current.src = streams_color)}
                onMouseLeave={() =>
                  location.pathname !== "/streams" ? (streamsElement.current.src = streams) : ""
                }
                className="container flex items-center justify-between w-full mt-8 cursor-pointer text-space-gray sidebar-item"
              >
                {location.pathname === "/streams" && <div className="vertical-stripe" />}
                <Link to="/streams" className="flex items-center justify-center w-full">
                  {/* <span className="ml-2 text-sm">games</span> */}
                  <div>
                    {!open ? (
                      <Hovertip title="Streams" placement="right">
                        <img
                          ref={streamsElement}
                          src={location.pathname === "/streams" ? streams_color : streams}
                          className="min-w-[16px] w-[16px] h-[22px]"
                          alt=""
                        />
                      </Hovertip>
                    ) : (
                      <img
                        ref={streamsElement}
                        src={location.pathname === "/streams" ? streams_color : streams}
                        className="min-w-[16px] w-[16px] h-[22px]"
                        alt=""
                      />
                    )}
                  </div>
                  <button
                    type="button"
                    className={`flex items-center w-full ${!open && "hidden"} ${
                      location.pathname === "/streams" ? "text-gray" : "text-space-gray"
                    }`}
                  >
                    <span className="ml-3 text-sm font-bold tracking-wide text-left whitespace-nowrap grow">
                      Streams
                    </span>
                  </button>
                </Link>
              </li>
              <li
                onMouseEnter={() => (supportElement.current.src = support_color)}
                onMouseLeave={() =>
                  location.pathname !== "/support" &&
                  location.pathname !== "/getting-started" &&
                  location.pathname !== "/Myaccount" &&
                  location.pathname !== "/prabablyfair" &&
                  location.pathname !== "/deposits" &&
                  location.pathname !== "/faq" &&
                  location.pathname !== "/business"
                    ? (supportElement.current.src = support)
                    : ""
                }
                className="container flex items-center justify-between w-full mt-8 cursor-pointer text-space-gray sidebar-item"
              >
                {(location.pathname === "/support" ||
                  location.pathname === "/getting-started" ||
                  location.pathname === "/Myaccount" ||
                  location.pathname === "/prabablyfair" ||
                  location.pathname === "/deposits" ||
                  location.pathname === "/faq" ||
                  location.pathname === "/business") && <div className="vertical-stripe" />}
                <Link to="/support" className="flex items-center justify-center w-full">
                  {/* <span className="ml-2 text-sm">games</span> */}
                  <div>
                    {!open ? (
                      <Hovertip title="Support" placement="right">
                        <img
                          ref={supportElement}
                          src={
                            (location.pathname === "/support" ||
                              location.pathname === "/getting-started" ||
                              location.pathname === "/Myaccount" ||
                              location.pathname === "/prabablyfair" ||
                              location.pathname === "/deposits" ||
                              location.pathname === "/faq" ||
                              location.pathname === "/business") && (
                              <div className="vertical-stripe" />
                            )
                              ? support_color
                              : support
                          }
                          className="min-w-[16px] w-[16px] h-[22px]"
                          alt=""
                        />
                      </Hovertip>
                    ) : (
                      <img
                        ref={supportElement}
                        src={
                          (location.pathname === "/support" ||
                            location.pathname === "/getting-started" ||
                            location.pathname === "/Myaccount" ||
                            location.pathname === "/prabablyfair" ||
                            location.pathname === "/deposits" ||
                            location.pathname === "/faq" ||
                            location.pathname === "/business") && (
                            <div className="vertical-stripe" />
                          )
                            ? support_color
                            : support
                        }
                        className="min-w-[16px] w-[16px] h-[22px]"
                        alt=""
                      />
                    )}
                  </div>
                  <button
                    type="button"
                    className={`flex items-center w-full ${!open && "hidden"} ${
                      (location.pathname === "/support" ||
                        location.pathname === "/getting-started" ||
                        location.pathname === "/Myaccount" ||
                        location.pathname === "/prabablyfair" ||
                        location.pathname === "/deposits" ||
                        location.pathname === "/faq" ||
                        location.pathname === "/business") && <div className="vertical-stripe" />
                        ? "text-gray"
                        : "text-space-gray"
                    }`}
                  >
                    <span className="ml-3 text-sm font-bold tracking-wide text-left whitespace-nowrap grow">
                      Support
                    </span>
                  </button>
                </Link>
              </li>
            </ul>
            <div className="grow"></div>
            <div className={`mb-11 w-full left-0 bottom-0 mt-24`}>
              <div className="flex items-center justify-center w-full">
                <div className="block text-center">
                  <div
                    className={`text-xs font-bold text-space-gray-rgb mb-4 tracking-wider ${
                      !open && "hidden"
                    }`}
                  >
                    Powered By
                  </div>

                  {open ? <img src={solana} alt="" /> : <img src={solana_icon} alt="" />}
                </div>
              </div>
              <div className="flex items-center justify-center w-full mt-8 mb-11 ">
                {open ? (
                  <>
                    <button
                      className={`w-full h-12 text-sm rounded-lg tracking-wide font-bold text-light-blue bg-light-blue-rgb hover:bg-light-blue hover:text-yankees-blue ${
                        !open && "hidden"
                      }`}
                    >
                      Buy SOL NFTs
                    </button>
                  </>
                ) : (
                  <>
                    <img src={buy_button} alt="" />
                  </>
                )}
              </div>
              {open ? (
                <>
                  <div className={`flex items-center justify-center w-full`}>
                    <img src={opensea} className="hover:text-gray" alt="" />
                    <img src={mevector} className="ml-5 hover:text-gray" alt="" />
                  </div>
                </>
              ) : (
                <>
                  <Hovertip
                    title={
                      <div className={`flex items-center justify-center w-full`}>
                        <img src={opensea} className="hover:text-gray" alt="" />
                        <img src={mevector} className="ml-5 hover:text-gray" alt="" />
                      </div>
                    }
                    placement="right"
                  >
                    <div className={`flex items-center justify-center w-full`}>
                      <img src={dots} alt="" />
                    </div>
                  </Hovertip>
                </>
              )}
            </div>
          </div>
          {/* </div> */}
        </Drawer>

        {/* Mobile menu */}
        <Transition.Root show={mobileMenuOpen} as={Fragment}>
          <Dialog as="div" className="relative z-20 md:hidden " onClose={setMobileMenuOpen}>
            <div className="fixed inset-0 z-40 flex ">
              <Transition.Child
                as={Fragment}
                enter="transition-opacity ease-linear duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity ease-linear duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Dialog.Panel className="relative max-w-xs w-full backdrop-blur-xl bg-background bg-opacity-[0.6] pt-5 flex-1 flex flex-col">
                  <div className="flex-1 h-0 px-2 mt-5 overflow-y-auto ">
                    <nav className="flex flex-col h-full">
                      <div className="space-y-1">
                        <div className="flex-1 w-full px-2">
                          <div className="flex items-center flex-shrink-0 w-full gap-4 font-black tracking-wide uppercase text-gray text-md">
                            <button
                              type="button"
                              className="flex items-center justify-center w-12 h-12 rounded-full focus:outline-none focus:ring-0 focus:ring-white"
                              onClick={() => {
                                setMobileMenuOpen(false);
                              }}
                            >
                              <XIcon className="w-6 h-6 text-space-gray" aria-hidden="true" />
                              <span className="sr-only">Close sidebar</span>
                            </button>

                            <div
                              className={`float-left cursor-pointer`}
                              onClick={() => pageNavigate("")}
                            >
                              <Link to="/">
                                {" "}
                                <img src={logo} alt="logo" width={135} height={135} />{" "}
                              </Link>
                            </div>
                          </div>
                          <div
                            className={`mb-8 w-full flex items-center text-space-gray-rgb font-bold tracking-wider text-xs uppercase`}
                          >
                            <div className={` mt-12`}>play</div>
                          </div>
                          <ul className="px-px">
                            <li
                              onMouseEnter={() => setHovered("games")}
                              onMouseLeave={() => setHovered(null)}
                              className="flex items-center justify-between w-full cursor-pointer text-gray sidebar-item"
                            >
                              {location.pathname === "/" && <div className="vertical-stripe" />}
                              <div
                                onClick={() => HideAndShow()}
                                className="flex items-center w-full"
                              >
                                <div>
                                  <img src={games} alt="" />
                                </div>
                                <button
                                  type="button"
                                  className={`flex items-center w-full ${
                                    location.pathname === "/" ? "text-gray" : "text-space-gray"
                                  }`}
                                >
                                  <span className="ml-3 text-sm font-bold tracking-wide text-left uppercase whitespace-nowrap grow">
                                    games
                                  </span>
                                  <img
                                    src={ulElement.current?.hidden ? dropdown : dropup}
                                    className="flex items-center"
                                    onClick={() => HideAndShow()}
                                    alt=""
                                  />
                                </button>
                              </div>
                            </li>
                            <ul
                              ref={ulElement}
                              className={`pl-1`}
                              onClick={() => {
                                setMobileMenuOpen(false);
                              }}
                            >
                              <Link to="/winnertakesall">
                                <li
                                  className={`flex items-center mt-6 sidebar-item`}
                                  onClick={() => {
                                    setMobileMenuOpen(false);
                                  }}
                                >
                                  {location.pathname === "/winnertakesall" && (
                                    <div className="vertical-stripe" />
                                  )}
                                  <img
                                    src={
                                      location.pathname === "/winnertakesall" ? star_color : star
                                    }
                                    alt=""
                                  />
                                  <span
                                    className={`text-sm ml-3 flex items-center font-bold ${
                                      location.pathname === "/winnertakesall"
                                        ? "text-gray"
                                        : "text-space-gray"
                                    } tracking-wide capitalize whitespace-nowrap`}
                                  >
                                    Winner Takes All
                                  </span>
                                </li>
                              </Link>
                              {/* <Link to="/rockpaperscissors">
                                <li
                                  className={`flex items-center mt-6 sidebar-item`}
                                  onClick={() => {
                                    setMobileMenuOpen(false);
                                  }}
                                >
                                  {location.pathname ===
                                    "/rockpaperscissors" && (
                                    <div className="vertical-stripe" />
                                  )}
                                  <img
                                    src={
                                      location.pathname === "/rockpaperscissors"
                                        ? scissor_color
                                        : scissor
                                    }
                                  ></img>
                                  <span
                                    className={`text-sm ml-3 flex items-center font-bold ${
                                      location.pathname === "/rockpaperscissors"
                                        ? "text-gray"
                                        : "text-space-gray"
                                    } tracking-wide capitalize whitespace-nowrap`}
                                  >
                                    Rock Paper Scissors
                                  </span>
                                </li>
                              </Link> */}
                              <Link to="/dogevscheems">
                                <li
                                  className={`flex items-center mt-6 sidebar-item`}
                                  onClick={() => {
                                    setMobileMenuOpen(false);
                                  }}
                                >
                                  {location.pathname === "/dogevscheems" && (
                                    <div className="vertical-stripe" />
                                  )}
                                  <img
                                    className="w-4 h-6"
                                    src={
                                      location.pathname === "/dogevscheems"
                                        ? baseball
                                        : baseball_yellow
                                    }
                                    alt=""
                                  />
                                  <span
                                    className={`text-sm ml-3 flex items-center font-bold ${
                                      location.pathname === "/dogevscheems"
                                        ? "text-gray"
                                        : "text-space-gray"
                                    } tracking-wide capitalize whitespace-nowrap`}
                                  >
                                    Doge vs Cheems
                                  </span>
                                </li>
                              </Link>
                            </ul>
                          </ul>
                          <div
                            className={`mt-16 mb-8 w-full flex items-center text-space-gray-rgb font-bold tracking-wider text-xs uppercase`}
                          >
                            <div>others</div>
                          </div>
                          <ul
                            className="px-px"
                            onClick={() => {
                              setMobileMenuOpen(false);
                            }}
                          >
                            <li
                              onMouseEnter={() => setHovered("leaderboard")}
                              onMouseLeave={() => setHovered(null)}
                              className="flex items-center justify-between w-full cursor-pointer text-space-gray sidebar-item"
                            >
                              {location.pathname === "/leaderboard" && (
                                <div className="vertical-stripe" />
                              )}
                              <Link to="/leaderboard" className="flex items-center w-full">
                                {/* <span className="ml-2 text-sm uppercase">games</span> */}
                                <div>
                                  <img
                                    src={
                                      hovered === "leaderboard" ||
                                      location.pathname === "/leaderboard"
                                        ? medal_color
                                        : medal
                                    }
                                    alt=""
                                  />
                                </div>
                                <button
                                  type="button"
                                  className={`flex items-center w-full ${
                                    location.pathname === "/leaderboard"
                                      ? "text-gray"
                                      : "text-space-gray"
                                  }`}
                                >
                                  <span className="ml-3 text-sm font-bold tracking-wide text-left whitespace-nowrap grow">
                                    LeaderBoard
                                  </span>
                                </button>
                              </Link>
                            </li>
                            <li
                              onMouseEnter={() => setHovered("collections")}
                              onMouseLeave={() => setHovered(null)}
                              className="flex items-center justify-between w-full mt-8 cursor-pointer text-space-gray sidebar-item"
                            >
                              {location.pathname === "/games" && (
                                <div className="vertical-stripe" />
                              )}
                              <Link to="/games" className="flex items-center justify-center w-full">
                                {/* <span className="ml-2 text-sm uppercase">games</span> */}
                                <div>
                                  {!open ? (
                                    <Hovertip title="Collections" placement="right">
                                      <img
                                        src={
                                          hovered === "collections" ||
                                          location.pathname === "/games"
                                            ? collections_color
                                            : collections
                                        }
                                        className="min-w-[16px] w-[16px] h-[22px]"
                                        alt=""
                                      />
                                    </Hovertip>
                                  ) : (
                                    <img
                                      src={
                                        hovered === "collections" || location.pathname === "/games"
                                          ? collections_color
                                          : collections
                                      }
                                      className="min-w-[16px] w-[16px] h-[22px]"
                                      alt=""
                                    />
                                  )}
                                </div>
                                <button
                                  type="button"
                                  className={`flex items-center w-full ${!open && "hidden"} ${
                                    location.pathname === "/games" ? "text-gray" : "text-space-gray"
                                  }`}
                                >
                                  <span className="ml-3 text-sm font-bold tracking-wide text-left whitespace-nowrap grow">
                                    Collections
                                  </span>
                                </button>
                              </Link>
                            </li>

                            <li
                              onMouseEnter={() => setHovered("airdrop")}
                              onMouseLeave={() => setHovered(null)}
                              className="flex items-center justify-between w-full mt-8 cursor-pointer text-space-gray sidebar-item"
                            >
                              {location.pathname === "/airdrop" && (
                                <div className="vertical-stripe" />
                              )}
                              <Link
                                to="/airdrop"
                                className="flex items-center justify-center w-full"
                              >
                                {/* <span className="ml-2 text-sm uppercase">games</span> */}
                                <div>
                                  {!open ? (
                                    <Hovertip title="Airdrop" placement="right">
                                      <img
                                        src={
                                          hovered === "airdrop" || location.pathname === "/airdrop"
                                            ? gift_color
                                            : gift
                                        }
                                        className="min-w-[16px] w-[16px] h-[16px]"
                                        alt=""
                                      />
                                    </Hovertip>
                                  ) : (
                                    <img
                                      src={
                                        hovered === "airdrop" || location.pathname === "/airdrop"
                                          ? gift_color
                                          : gift
                                      }
                                      className="min-w-[16px] w-[16px] h-[16px]"
                                      alt=""
                                    />
                                  )}
                                </div>
                                <button
                                  type="button"
                                  className={`flex items-center w-full ${!open && "hidden"} ${
                                    location.pathname === "/airdrop"
                                      ? "text-gray"
                                      : "text-space-gray"
                                  }`}
                                >
                                  <span className="ml-3 text-sm font-bold tracking-wide text-left whitespace-nowrap grow">
                                    Airdrop
                                  </span>
                                </button>
                              </Link>
                            </li>

                            <li
                              onMouseEnter={() => setHovered("streams")}
                              onMouseLeave={() => setHovered(null)}
                              className="flex items-center justify-between w-full mt-8 cursor-pointer text-space-gray sidebar-item"
                            >
                              {location.pathname === "/streams" && (
                                <div className="vertical-stripe" />
                              )}
                              <Link
                                to="/streams"
                                className="flex items-center justify-center w-full"
                              >
                                {/* <span className="ml-2 text-sm">games</span> */}
                                <div>
                                  {!open ? (
                                    <Hovertip title="Streams" placement="right">
                                      <img
                                        src={
                                          hovered === "streams" || location.pathname === "/streams"
                                            ? streams_color
                                            : streams
                                        }
                                        className="min-w-[16px] w-[16px] h-[22px]"
                                        alt=""
                                      />
                                    </Hovertip>
                                  ) : (
                                    <img
                                      src={
                                        hovered === "streams" || location.pathname === "/streams"
                                          ? streams_color
                                          : streams
                                      }
                                      className="min-w-[16px] w-[16px] h-[22px]"
                                      alt=""
                                    />
                                  )}
                                </div>
                                <button
                                  type="button"
                                  className={`flex items-center w-full ${!open && "hidden"} ${
                                    location.pathname === "/streams"
                                      ? "text-gray"
                                      : "text-space-gray"
                                  }`}
                                >
                                  <span className="ml-3 text-sm font-bold tracking-wide text-left whitespace-nowrap grow">
                                    Streams
                                  </span>
                                </button>
                              </Link>
                            </li>
                            <li
                              onMouseEnter={() => setHovered("support")}
                              onMouseLeave={() => setHovered(null)}
                              className="flex items-center justify-between w-full mt-8 cursor-pointer text-space-gray sidebar-item"
                            >
                              {location.pathname === "/support" && (
                                <div className="vertical-stripe" />
                              )}
                              <Link
                                to="/support"
                                className="flex items-center justify-center w-full"
                              >
                                {/* <span className="ml-2 text-sm">games</span> */}
                                <div>
                                  {!open ? (
                                    <Hovertip title="Support" placement="right">
                                      <img
                                        src={
                                          hovered === "support" || location.pathname === "/support"
                                            ? support_color
                                            : support
                                        }
                                        className="min-w-[16px] w-[16px] h-[22px]"
                                        alt=""
                                      />
                                    </Hovertip>
                                  ) : (
                                    <img
                                      src={
                                        hovered === "support" || location.pathname === "/support"
                                          ? support_color
                                          : support
                                      }
                                      className="min-w-[16px] w-[16px] h-[22px]"
                                      alt=""
                                    />
                                  )}
                                </div>
                                <button
                                  type="button"
                                  className={`flex items-center w-full ${!open && "hidden"} ${
                                    location.pathname === "/support"
                                      ? "text-gray"
                                      : "text-space-gray"
                                  }`}
                                >
                                  <span className="ml-3 text-sm font-bold tracking-wide text-left whitespace-nowrap grow">
                                    Support
                                  </span>
                                </button>
                              </Link>
                            </li>
                          </ul>
                          {/* <div className="grow"></div> */}
                          <div className={`mb-11 w-full px-6 left-0 bottom-0 mt-24`}>
                            <div className="flex items-center justify-center w-full">
                              <div className="block text-center">
                                <div className="mb-4 text-xs font-bold tracking-wider text-space-gray-rgb">
                                  Powered By
                                </div>
                                <img src={solana} alt="" />
                              </div>
                            </div>
                            <div className="flex items-center justify-center w-full mt-8 mb-11 ">
                              <button className="w-full h-12 text-sm font-bold tracking-wide rounded-lg text-light-blue bg-light-blue-rgb hover:bg-light-blue hover:text-yankees-blue">
                                Buy SOL NFTs
                              </button>
                            </div>
                            <div className="flex items-center justify-center w-full">
                              <img src={opensea} className="hover:text-gray" alt=""></img>
                              <img src={mevector} className="ml-5 hover:text-gray" alt=""></img>
                            </div>
                          </div>
                        </div>
                      </div>
                    </nav>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
              <div className="flex-shrink-0 w-14" aria-hidden="true">
                {/* Dummy element to force sidebar to shrink to fit close icon */}
              </div>
            </div>
          </Dialog>
        </Transition.Root>
        {alertmessage.open && alertmessage.info !== "" && (
          <div
            className={`absolute z-50 bottom-4 left-4 ${
              alertmessage?.response === "success" ? "bg-light-green" : "bg-light-blue"
            } text-xs font-bold text-yankees-blue flex items-center p-4 h-12 rounded-[43px] gap-2`}
          >
            <div>{alertmessage?.info}</div>{" "}
            {alertmessage?.response === "success" ? (
              <img src={correcticon} alt="" />
            ) : (
              <svg
                className="animate-spin"
                width="18"
                height="18"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  opacity="0.24"
                  d="M10 1C14.9706 1 19 5.02944 19 10C19 14.9706 14.9706 19 10 19C5.02944 19 1 14.9706 1 10C1 5.02944 5.02944 1 10 1Z"
                  stroke="#1C2438"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M10 1C14.9706 1 19 5.02944 19 10"
                  stroke="#1C2438"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </div>
        )}

        {/* Content area */}
        <div
          className={`flex-1 flex flex-col sm:overflow-hidden overflow-visible ${
            location.pathname === "/" || isGame ? "pl-0 sm:pl-0 md:pl-6" : "pl-0"
          } ${location.pathname === "/support" && "support-gradient-1"} ${
            location.pathname === "/faq" && "support-gradient-1"
          }`}
        >
          <header className="w-full sm:relative fixed sm:z-0 z-10 sm:bg-transparent bg-[#131826]">
            <div
              className={`flex-1 relative z-10 flex-shrink-0 shadow-sm flex md:hidden items-start min-h-[85px] ${
                location.pathname === "/" || isGame
                  ? "xs:px-6 px-3"
                  : pubKey
                  ? "xs:pl-6 pl-3 pr-0"
                  : "xs:px-6 px-3"
              }`}
            >
              <button
                type="button"
                className="pl-0 pr-4 m-auto text-gray focus:outline-none md:hidden"
                onClick={() => {
                  setMobileMenuOpen(true);
                }}
              >
                <span className="sr-only">Open sidebar</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 text-space-gray"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              <div className="flex flex-1 m-auto">
                <div
                  className={`w-full items-center text-gray font-black tracking-wide text-lg uppercase flex md:hidden gap-[10px]`}
                >
                  <div className="flex justify-center w-full cursor-pointer">
                    <Link to="/">
                      {" "}
                      <img src={logo} alt="logo" width={100} height={100} />{" "}
                    </Link>
                  </div>
                  <div className="flex items-center gap-4">
                    <div
                      id="demo-customized-button"
                      aria-controls={profilemenuopen ? "demo-customized-menu" : undefined}
                      aria-haspopup="true"
                      aria-expanded={profilemenuopen ? "true" : undefined}
                      sx={{
                        "&:hover": {
                          background: "none",
                        },
                        pr: 2,
                      }}
                    >
                      <div
                        className={`${
                          !pubKey && "sm:bg-yankees-blue sm:rounded-lg "
                        }  items-center ${
                          pubKey ? "block mr-2" : "flex"
                        } cursor-pointer w-max sm:mr-0 md:hidden `}
                      >
                        {pubKey ? (
                          <div className="hidden pl-5 pr-6 font-bold sm:flex text-space-gray hover:text-gray"></div>
                        ) : (
                          <div
                            className="hidden pl-5 pr-6 font-bold uppercase sm:flex text-space-gray hover:text-gray"
                            onClick={() => !pubKey && ConnectModal()}
                          >
                            Click to connect
                          </div>
                        )}

                        <div
                          className="flex sm:flex md:hidden"
                          onClick={() => !pubKey && ConnectModal()}
                        >
                          {pubKey ? (
                            <>
                              <div className="flex">
                                <Connected></Connected>
                              </div>
                            </>
                          ) : (
                            <img src={wallet} className="" alt="" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Desktop Header */}
            <div className="hidden md:block">
              <Header
                anchorEl={anchorEl}
                setAnchorEl={setAnchorEl}
                handleClick={handleClick}
                profilemenuopen={profilemenuopen}
                skeleton={skeleton}
              ></Header>
            </div>
          </header>

          {/* Main content */}
          <div className="flex-1 flex items-stretch sm:overflow-hidden overflow-visible sm:h-[90vh] h-fit sm:pt-0 pt-[85px]">
            <main
              ref={scollToRef}
              className="flex-1 sm:max-h-screen max-h-fit sm:overflow-scroll overflow-visible scrollbar-width sm:max-h-screen scrollbar-none"
            >
              {/* Primary column */}
              <div className="md:hidden">
                {isMobile && (
                  <Header
                    anchorEl={anchorEl}
                    setAnchorEl={setAnchorEl}
                    handleClick={handleClick}
                    profilemenuopen={profilemenuopen}
                  ></Header>
                )}
              </div>
              <div className="sm:max-h-screen max-h-fit mx-auto">
                <div
                  className={`pt-0 sm:pt-0 md:pt-8 max-w-[1280px] w-full pb-12 mt-0 mx-auto sm:pr-6 ${
                    location.pathname === "/" || isGame ? "xs:px-6 px-3" : "xs:px-6 px-3"
                  }`}
                >
                  {!showchatbox && (
                    <>
                      <div className="fixed bottom-0 right-0 z-40 flex justify-end pb-4 pr-4 mt-2 sm:absolute md:absolute lg:absolute">
                        <Avatar
                          onClick={() => {
                            setShowChatBox(!showchatbox);
                          }}
                          sx={{
                            cursor: "pointer",
                            width: "48px",
                            height: "48px",
                            bgcolor: "#5A88FF",
                          }}
                        >
                          <img src={chaticon} className="w-5 h-5" alt="" />
                        </Avatar>
                      </div>
                    </>
                  )}

                  <div
                    className={`pl-0 pr-0 sm:pl-0 sm:pr-0 lg:pl-0 lg:pr-6 ${
                      location.pathname === "/" || isGame ? "sm:pr-0 md:pr-6" : "sm:pr-6"
                    }`}
                  >
                    <Routes>
                      <Route
                        path="/"
                        element={
                          <>
                            <HomeHeroSection />
                            <Games setLoading={setLoading} />
                            <LastPlayed />
                            <LastPlayedTable
                              countUrl={`${baseUrl}/getPreviousAllGameCount`}
                              url={`${baseUrl}/getPreviousAllGame`}
                            ></LastPlayedTable>
                            <Footer />
                          </>
                        }
                      />
                      {/* <Route
                        path="/"
                        element={
                          <>
                            <HomeHeroSection />
                            <Games setLoading={setLoading} />
                            <LastPlayed />
                          </>
                        }
                      /> */}
                      <Route
                        path="/games/:slug"
                        element={
                          <>
                            <CollectionDetails setLoading={setLoading} />
                            {/* <GameInfo />
                            <Games setLoading={setLoading} />
                            <LastPlayed />
                            */}

                            {/* <LastPlayedTable
                              countUrl={`${baseUrl}/getPreviousAllGameCount`}
                              url={`${baseUrl}/getPreviousGame`}
                            ></LastPlayedTable> */}
                            {/* <AllPreviousGames /> */}
                          </>
                        }
                      />
                      <Route
                        path="/winnertakesall"
                        element={
                          <>
                            <WinnerHeroSection
                              title={"Winner Takes All"}
                              subTitle={"6 PLAYERS - 1 WINNER"}
                            />
                            <NFTPools setLoading={setLoading} />
                            {loading ? (
                              <Lottie animationData={animation_optimized} loop={true} />
                            ) : (
                              <NFTPoolCardList />
                            )}
                          </>
                        }
                      />
                      <Route
                        exact
                        path="/winnertakesall/:collectionMint"
                        element={
                          <>
                            <WinnersRound
                              executeScroll={executeScroll}
                              prevRoundRef={prevRoundRef}
                              skeleton={skeleton}
                            ></WinnersRound>
                          </>
                        }
                      />
                      <Route
                        path="/previousrounds/:collectionMint"
                        element={
                          <>
                            <HomeHeroSection />
                            <PreviousRounds></PreviousRounds>
                          </>
                        }
                      />
                      <Route path="/winner" element={<Winner></Winner>} />
                      <Route
                        path="/rockpaperscissors"
                        element={
                          <>
                            <VerifiedSection />
                            <RockHeroSection />
                            <RockPaperScissor></RockPaperScissor>
                          </>
                        }
                      />
                      <Route
                        path="/leaderboard"
                        element={
                          <>
                            <LeaderHeroSection />
                            <TopPlayers setLoading={setLoading} />
                          </>
                        }
                      />
                      <Route
                        path="/streams"
                        element={
                          <>
                            <StreamHeroSection />
                            <Stream />
                          </>
                        }
                      />
                      <Route path="/referral-program" element={<ReferralProgram />} />
                      <Route path="/games" element={<AllCollections setLoading={setLoading} />} />
                      <Route path="/support" element={<Support />} />

                      <Route path="/:pubKeyParam" element={<ProfileSection />} />
                      <Route path="/business" element={<Business />} />
                      <Route path="/setting" element={<Setting />} />
                      <Route path="/faq" element={<FAQ title={"FAQ"} data={faqData["/faq"]} />} />
                      <Route
                        path="/Myaccount"
                        element={<FAQ title={"My Account"} data={faqData["/Myaccount"]} />}
                      />
                      <Route
                        path="/prabablyfair"
                        element={<FAQ title={"Provably Fair"} data={faqData["/prabablyfair"]} />}
                      />
                      <Route
                        path="/deposits"
                        element={
                          <FAQ title={"Deposits & Withdrawals"} data={faqData["/deposits"]} />
                        }
                      />
                      <Route
                        path="/getting-started"
                        element={
                          <FAQ title={"Getting Started"} data={faqData["/getting-started"]} />
                        }
                      />
                      <Route
                        path="/dogevscheems"
                        element={
                          <>
                            {/* <WinnerHeroSection
                              title={"Doge Vs. Cheems"}
                              subTitle={"1v1 heads-up game"}
                            /> */}
                            <DogeVsCheemsHero
                              title={"Doge Vs. Cheems"}
                              subTitle={"1v1 heads-up game"}
                            />
                            <NFTPools setLoading={setLoading} />
                            <NFTPoolCardList1vs1 />
                          </>
                        }
                      />
                      <Route
                        path="/dogevscheems/:collectionMint"
                        element={
                          <>
                            <VerifiedSection />
                            <FlipCoin />
                          </>
                        }
                      />
                      <Route path="*" element={<PageNotFound />} />
                    </Routes>
                  </div>
                </div>
                <div className="flex justify-center">
                  <CookieBanner
                    message="raidwin.com is using cookies to provide better service for every user."
                    onAccept={() => {}}
                    cookie="user-has-accepted-cookies"
                    className={` cookie text-gray `}
                    buttonMessage="Accept"
                    disableStyle={true}
                  ></CookieBanner>
                </div>
              </div>
            </main>

            {showchatbox && (
              <div
                className={`flex overflow-hidden fixed z-50 right-0 bottom-0 md:pt-[76px] 2xl:pt-0 w-full md:w-auto top-0 md:top-0 md:h-full 2xl:relative`}
              >
                <div className="md:max-w-[100%] w-full md:w-80 md:pt-8 mt-0 mx-auto">
                  <ChatBox setShowChatBox={setShowChatBox}></ChatBox>
                </div>
              </div>
            )}
          </div>

          {/* <CookieConsent
            location="bottom"
            buttonText="Accept"
            // containerClasses="CookieConsent"
            cookieName="SolwinCookie"
            buttonClasses="buttonAccept"
            expires={150}
          >
            <div className="font-black text-space-gray">Cookies Policy</div>
            <div className="block mt-2 sm:flex text-space-gray">
              raidwin.com is using cookies to provide better service for every
              user. By using our site you agree to the use of cookies. Kindly
              check Privacy Policy and Terms of Service.
            </div>
          </CookieConsent> */}
        </div>
        <PlayNFTModal open={modalopen} handleClose={modalhandleClose}></PlayNFTModal>
        <ConnectionModal
          open={openConnect}
          onClose={CloseModal}
          handleClick={handleClick}
        ></ConnectionModal>
      </div>
    </>
  );
}
