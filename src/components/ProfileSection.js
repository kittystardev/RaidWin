import React from "react";
import discord from "../assets/images/discord.svg";
import twitter from "../assets/images/twitter.svg";
import opensea from "../assets/images/opensea.svg";
import profiledot from "../assets/images/profiledot.svg";
import { Box, Tab } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import Items from "./Items";
import Won from "./Won";
import { useSelector } from "react-redux";
import DoneIcon from "@mui/icons-material/Done";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import { useState } from "react";
import { baseUrl, getAddress, handleImageError, imagePath } from "../utils/utils";
import { useEffect } from "react";
import Played from "./Played";
import { Link, useNavigate, useParams } from "react-router-dom";
import usePlayer from "../hook/usePlayer";
import PageNotFound from "./Common/PageNotFound";
import Lottie from "lottie-react";
import animation_optimized from "../json/animation_optimized.json";
import { Helmet } from "react-helmet";
import ShareOption from "./ShareOption";
import { Menu } from "@headlessui/react";

export default function ProfileSection() {
  let navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [pageNotFound, setPageNotFound] = useState(false);
  const [userData, setUserData] = useState({});

  let { pubKeyParam: pathname } = useParams();
  let pathPubKey, username;
  pathname.length >= 40 ? (pathPubKey = pathname) : (username = pathname);

  const infoForPubkey = usePlayer(pathPubKey);

  useEffect(() => {
    if (infoForPubkey?.userName && infoForPubkey?.userName !== "") {
      navigate(`/${infoForPubkey?.userName}`);
    } else if (infoForPubkey?._id && infoForPubkey?._id !== "") {
      navigate(`/${infoForPubkey?._id}`);
    }
  }, [infoForPubkey]);

  const [value, setValue] = useState("1");

  const [copied, setCopied] = useState(false);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const pubKey = useSelector((state) => (state.Temp.pubKey ? state.Temp.pubKey.toString() : ""));

  useEffect(() => {
    const getPlayerByName = async (name) => {
      try {
        const resp = await fetch(`${baseUrl}/playerByName/${name}`);
        const data = await resp.json();
        setUserData(data[0]);
      } catch (error) {
        console.log("error", error);
      } finally {
        setLoading(false); // Move setLoading(false) inside the finally block
      }
    };

    // Move setLoading(true) inside the useEffect
    setLoading(true); // Set loading to true when the effect starts.
    getPlayerByName(username);
  }, [baseUrl, setPageNotFound, setUserData, setLoading, username]);

  useEffect(() => {
    const isInfoError = !infoForPubkey || infoForPubkey?.msg === "resource not found";
    const isUserDataError = !userData || userData === "";

    if (isInfoError && isUserDataError) {
      setPageNotFound(true);
    }
  }, [userData, infoForPubkey]);

  // console.log("infoForPubkey", userData?.userName, infoForPubkey?._id);

  return (
    <>
      {loading ? (
        <div className="fixed inset-0 flex w-screen h-screen justify-center items-center bg-background bg-opacity-90 z-[80] ">
          <Lottie
            animationData={animation_optimized}
            loop={true}
            className="flex justify-center items-center h-screen w-full lg:w-1/3 mx-auto"
          />
        </div>
      ) : pageNotFound ? (
        <PageNotFound />
      ) : (
        <>
          <Helmet>
            <title>Profile</title>
          </Helmet>
          <div className="block sm:block md:block lg:flex justify-between">
            <div className="block sm:block md:block lg:flex gap-6">
              <div className="flex justify-center items-center">
                {/* <img src={chaticon1} className="w-[88px] h-[88px] mx-auto" /> */}
                {(userData?.userName && userData?.profileImage) ||
                (infoForPubkey?.userName && infoForPubkey?.profileImage) ? (
                  <div className="w-max overflow-hidden rounded-xl ">
                    <img
                      src={`${imagePath}profile400/${
                        userData?.profileImage || infoForPubkey?.profileImage
                      }`}
                      onError={handleImageError}
                      alt=""
                      className="w-[88px] h-[88px] mx-auto rounded-xl object-cover bg-chat-bg bg-opacity-95"
                    />
                  </div>
                ) : (
                  <div className="w-[88px] h-[88px] mx-auto rounded-xl object-cover bg-chat-bg bg-opacity-95"></div>
                )}
              </div>
              <div className="flex sm:flex md:flex lg:block flex-col sm:flex-col md:flex-col lg:flex-col items-center sm:items-center md:items-center lg:items-start">
                <div className="font-black text-2xl tracking-wide text-gray mb-1 mt-4 sm:mt-4 md:mt-4 lg:mt-0 text-left">
                  {userData?.userName || infoForPubkey?.userName}
                </div>
                <div className="flex">
                  {(userData?._id || infoForPubkey?._id) && (
                    <>
                      <div className="flex gap-5 items-center">
                        <div className="font-semibold text-sm leading-6 tracking-wider text-space-gray mb-1 break-words mt-3 sm:mt-3 md:mt-3 lg:mt-0">
                          {/* {pubKeyParam.toString()} */}
                          {getAddress(userData?._id.toString() || infoForPubkey?._id.toString())}
                        </div>
                        {!copied ? (
                          <>
                            <ContentCopyRoundedIcon
                              onClick={() => {
                                navigator.clipboard.writeText(
                                  `${userData?._id.toString() || infoForPubkey?._id.toString()}`
                                );
                                setCopied(true);
                                setTimeout(() => {
                                  setCopied(false);
                                }, 500);
                              }}
                              sx={{ cursor: "pointer", color: "#6A7080" }}
                            ></ContentCopyRoundedIcon>
                          </>
                        ) : (
                          <DoneIcon></DoneIcon>
                        )}
                      </div>
                    </>
                  )}
                </div>

                <div className="font-semibold text-sm text-left leading-6 tracking-wider text-space-gray uppercase text-opacity-[0.56] mb-1  mt-6 sm:mt-6 md:mt-6 lg:mt-0">
                  joined oct. 2022
                </div>
              </div>

              {/* {pubKey === (userData?._id || infoForPubkey?._id !== "") && ( */}
              <div className="lg:w-3/6 w-32 lg:w-full mx-auto">
                <Link to="/setting">
                  <div className="border border-space-gray rounded-md py-1 px-4 text-space-gray cursor-pointer">
                    Edit Profile
                  </div>
                </Link>
              </div>
              {/* )} */}
            </div>
            <div className="flex items-center gap-6 justify-center  mt-11 sm:mt-11 md:mt-11 lg:mt-0">
              {userData?.discord && (
                <div>
                  <img src={discord} className="w-5 h-5" alt="" />
                </div>
              )}
              {(userData?.twitter || infoForPubkey?.twitter) && (
                <div>
                  <img src={twitter} className="w-5 h-5" alt="" />
                </div>
              )}
              {userData?.opensea && (
                <div>
                  <img src={opensea} className="w-5 h-5" alt="" />
                </div>
              )}
              <div className="">
                <Menu as="div" className="relative inline-block text-left">
                  <div>
                    <Menu.Button className="mt-3 cursor-pointer">
                      <img src={profiledot} className="w-5 h-5" alt="" />
                    </Menu.Button>
                  </div>
                  <ShareOption></ShareOption>
                </Menu>
              </div>
            </div>
          </div>

          <div className="mt-10 flex gap-4 justify-center sm:justify-center md:justify-center lg:justify-start flex-wrap">
            <Box sx={{ width: "100%" }}>
              <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: "#6A707F", mb: 2 }}>
                  <TabList
                    className="[&>div>div>button]:xs:p-[12px_24px] [&>div>div>button]:p-[12px_16px] [&>div>div]:xs:max-w-[360px] [&>div>div]:max-w-[340px] [&>div>div]:w-full [&>div>div]:justify-between [&>div>div]:lg:mx-0 [&>div>div]:mx-auto"
                    onChange={handleChange}
                    sx={{
                      mb: 4,
                      borderBottom: "0px",
                      fontFamily: "inherit",
                      "& button": {
                        borderRadius: 2,
                        background: "#6a707f14",
                        color: "#6A7080",
                        fontSize: "15px",
                        textTransform: "capitalize",
                        letterSpacing: "0.01em",
                        fontFamily: "montserrat",
                      },
                      "& button:hover": { background: "#6a707f3d" },
                      "& button:active": {
                        background: "#6a707f3d",
                        color: "#6A7080",
                      },
                      "& button.Mui-selected ": {
                        background: "#5a88ff17",
                        color: "#5A88FF",
                      },
                      "& .MuiTabs-indicator": {
                        backgroundColor: "transparent",
                      },
                    }}
                  >
                    <Tab label="Played" value="1" />
                    <Tab label="Collected" value="2" />
                    <Tab label="Won" value="3" />
                  </TabList>
                </Box>
                <TabPanel value="1">
                  <Played
                    pubKeyParam={userData?._id || infoForPubkey?._id}
                    userData={userData?.userName}
                    userPubkey={infoForPubkey?._id}
                  />
                </TabPanel>
                <TabPanel value="2">
                  <Items pubKeyParam={userData?._id || infoForPubkey?._id} />
                </TabPanel>
                <TabPanel value="3">
                  <Won pubKeyParam={userData?._id || infoForPubkey?._id} />
                </TabPanel>
              </TabContext>
            </Box>
          </div>
          {/* <div className='border-b-2 mt-6 sm:mt-6 md:mt-6 lg:mt-10 border-nouveau-main rounded-sm border-opacity-[0.24]'>
            </div> */}
        </>
      )}
    </>
  );
}
