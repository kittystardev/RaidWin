import React from "react";
import twitter_blue from "../assets/images/twitter_blue.svg";
import discordSVG from "../assets/images/discord-color.svg";
import { CheckIcon, InformationCircleIcon } from "@heroicons/react/outline";
import { baseUrl, fetchPlayerById, handleImageError, imagePath } from "../utils/utils";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import DoneIcon from "@mui/icons-material/Done";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { setAlertIdx } from "../store/NFTModal";
import { useState } from "react";
import { fetchUserData } from "../store/UserSlice";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { useWallet } from "../WalletContext";
import TwitterLogin from "react-twitter-login";
// import Jimp from 'jimp/browser/lib/jimp.js';
// const Jimp = require("jimp");

export default function UserProfile() {
  const pubKey = useSelector((state) => state.Temp.pubKey);
  const { userInfo } = useSelector((state) => state.userInfo);
  const players = useSelector((state) => state.Players.players);
  const [profileImage, setProfileImage] = useState("");
  const [userName, setuserName] = useState("");
  const [email, setEmail] = useState("");
  const [websiteLink, setwebsiteLink] = useState("");
  const [bio, setBio] = useState("");
  const [profileURL, setProfileURL] = useState("");
  const [copied, setCopied] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [errMsg, setErrMsg] = useState("");
  const dispatch = useDispatch();
  const accessToken = useSelector((state) => state.Temp.accessToken);

  const { discord, setDiscord, twitter, setTwitter } = useWallet();

  useEffect(() => {
    if (pubKey === "") return;
    (async function () {
      const { bio, email, userName, websiteLink, profileImage } = await fetchPlayerById(pubKey);
      setuserName(userName ? userName : "");
      setEmail(email ? email : "");
      setwebsiteLink(websiteLink ? websiteLink : "");
      setBio(bio ? bio : "");
      setProfileURL(profileImage ? `${imagePath}profile400/${profileImage}` : "");
    })();
  }, [pubKey]);

  const {
    handleSubmit,
    register,
    setError,
    formState: { errors },
  } = useForm();

  function handleChange(e) {
    console.log(e.target.files);
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 1000000) {
      alert("File is larger than 1MB, Upload valid file!");
      return;
    }
    if (isValidFileFormat(file)) {
      setDisabled(false);
      setProfileURL(URL.createObjectURL(file));
      setProfileImage(file);
      const newName = Date.now() + "profile." + e.target.files[0]?.type?.split("/")[1];
      const files = new File([profileImage], newName);
      console.log("newfile", files);
    } else {
      e.target.files = "";
      setProfileImage("");
      setProfileURL("");
      alert("upload jpg / jpeg / png file only.");
    }
  }

  const isValidFileFormat = (file) => {
    if (file) {
      const fileName = file.name;
      const fileExtension = fileName.split(".").pop().toLowerCase();
      return fileExtension === "jpg" || fileExtension === "jpeg" || fileExtension === "png";
    }
    return false;
  };

  const onSubmit = async () => {
    let timeOut;
    try {
      if (userName === "" || userName === undefined) {
        setErrMsg("Username Required..");
        return;
      }
      const fd = new FormData();
      let isUserExist = players.some(
        (player) => player.userName === userName && player.playerId !== pubKey
      );
      if (profileImage !== "") fd.append("profileImage", profileImage);
      if (isUserExist) {
        setError("userName", {
          type: "custom",
          message: "User name is already exist",
        });
        return;
      }
      fd.append("userName", userName);
      fd.append("email", email);
      fd.append("websiteLink", websiteLink);
      fd.append("bio", bio);
      fd.append("profileUrl", profileURL);
      fd.append("twitter", twitter);
      fd.append("discord", discord);
      fd.append("_id", pubKey);
      // const toastId = toast.loading('Loading...');

      dispatch(setAlertIdx({ info: "Saving", open: true, response: "" }));
      setDisabled(true);
      const resp = await fetch(`${baseUrl}/player`, {
        method: "POST",
        body: fd,
        headers: {
          authorization: accessToken,
        },
      });
      const data = await resp.json();
      console.log("saving_player", data);
      if (data.msg === "Successful") {
        dispatch(fetchUserData(pubKey));
        updateUserName();
        timeOut = setTimeout(() => {
          dispatch(setAlertIdx({ info: "", open: false }));
          dispatch(setAlertIdx({ info: "Saved", open: true, response: "success" }));
        }, 5000);
        timeOut = setTimeout(() => {
          dispatch(setAlertIdx({ info: "", open: false, response: "success" }));
        }, 8000);
      } else if (data.msg === "Somthing went wrong") {
        dispatch(setAlertIdx({ info: "Failed", open: true, response: "" }));
        timeOut = setTimeout(() => {
          dispatch(setAlertIdx({ info: "", open: false, response: "Failed" }));
        }, 2000);
      } else if (data.msg === "User name is already exist") {
        setError("userName", {
          type: "custom",
          message: "User name is already exist",
        });
        dispatch(setAlertIdx({ info: "Failed", open: true, response: "" }));
        timeOut = setTimeout(() => {
          dispatch(setAlertIdx({ info: "", open: false, response: "Failed" }));
        }, 2000);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong.");
      dispatch(setAlertIdx({ info: "Failed", open: true, response: "" }));
      timeOut = setTimeout(() => {
        dispatch(setAlertIdx({ info: "", open: false, response: "Failed" }));
      }, 2000);
    }

    return () => {
      clearTimeout(timeOut);
    };
  };

  const updateUserName = async () => {
    try {
      const response = await fetch(`${baseUrl}/updateUserName`, {
        method: "POST",
        body: JSON.stringify({ pubKey, userName: `@${userName}` }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      console.log("data :>> ", data);
    } catch (error) {
      console.log("error :>> ", error);
    }
  };

  const handleReset = () => {
    setuserName("");
    setProfileImage("");
    setEmail("");
    setwebsiteLink("");
    setBio("");
  };

  const location = useLocation();

  function useQuery() {
    const { search } = location;

    return React.useMemo(() => new URLSearchParams(search), [search]);
  }

  let query = useQuery();
  const code = query.get("code");

  useEffect(() => {
    if (!code) return;
    axios
      .post(
        "https://discord.com/api/oauth2/token",
        new URLSearchParams({
          client_id: "1174638216339533834",
          client_secret: "l8qkiop8SX33dDbz1HOtNLe5ARp2Yd0x",
          grant_type: "authorization_code",
          redirect_uri: "https://cerulean-longma-d0f479.netlify.app/setting",
          code,
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      )
      .then(async (response) => {
        // I use the console to check whether it is running or not
        console.log(response);
        let { token_type, access_token } = response.data;

        let resp = await fetch("https://discord.com/api/users/@me", {
          headers: {
            authorization: `${token_type} ${access_token}`,
          },
        });
        let data = await resp.json();
        // Handles if the user doesn't have a profile photo
        let cekAvatar;
        let { username, id } = data;
        if (data.avatar === null) {
          cekAvatar = "0";
        } else {
          cekAvatar = data.avatar;
        }
        // check the player's avatar, does he use gif?
        let format = cekAvatar.startsWith("a_") ? "gif" : "jpg";
        let validAvatar =
          cekAvatar === "0"
            ? "https://cdn.discordapp.com/embed/avatars/0.png"
            : `https://cdn.discordapp.com/avatars/${id}/${data.avatar}.${format}?size=4096`;
        // Check again to see if it's running
        setDiscord({
          name: username,
          id,
          avatar: validAvatar,
        });
      })
      .catch((e) => {
        console.log(e);
      });
  }, [code]);

  const twitterAuthHandler = (err, data) => {
    if (err) {
      window.location = "/setting";
    } else {
      setTwitter({ name: data.screen_name, id: data.user_id });
    }
  };

  return (
    <>
      <form id="form" onSubmit={handleSubmit(onSubmit)}>
        <div className="block w-full gap-10 mt-12 sm:block md:block lg:flex">
          <div className="w-full sm:w-full md:w-full lg:w-1/2">
            <div className="flex items-center gap-2">
              <div className="text-sm font-black leading-6 tracking-wide text-gray">
                Profile Page
              </div>
              <div>
                <InformationCircleIcon className="h-5 w-5 text-opacity-[0.56] text-nouveau-main font-black" />
              </div>
            </div>
            <div className="flex mt-4">
              <input
                type="file"
                id="profile"
                name="profile"
                className="block mt-6 text-gray w-fit"
                accept="image/x-png,image/jpeg"
                {...register("profileUrl", {
                  required:
                    (!userInfo.profileImage || userInfo.profileImage === "") &&
                    "Please Select Profile Picture",
                })}
                onChange={handleChange}
              />
              <div className="overflow-hidden rounded-3xl">
                {profileURL && (
                  <img
                    src={`${profileURL}`}
                    onError={handleImageError}
                    className="object-cover w-32 h-32 bg-chat-bg bg-opacity-95 rounded-3xl"
                    alt=""
                  />
                )}
              </div>
            </div>
            {errors.profileUrl && <p className="text-red-dark">{errors.profileUrl.message}</p>}
            <div className="mt-12">
              <div className="order-last w-full max-w-lg">
                <div className="flex flex-wrap mb-8 -mx-3">
                  <div className="w-full px-3 mb-6 md:w-full md:mb-0">
                    <label
                      className="flex items-center gap-2 mb-4 text-sm font-black tracking-wide text-gray"
                      htmlFor="grid-first-name"
                    >
                      Username
                      <div>
                        <InformationCircleIcon className="h-5 w-5 text-opacity-[0.56] text-nouveau-main font-black" />
                      </div>
                    </label>
                    {/* "Enter Username ..." */}
                    <input
                      className="block w-full bg-transparent p-4 border-[1.5px] border-nouveau-main focus:outline-none border-opacity-20 text-xs tracking-wider font-bold text-opacity-80 placeholder:tracking-wider rounded-lg text-space-gray placeholder:text-space-gray"
                      type="text"
                      placeholder="Enter Username ..."
                      {...register("userName", {
                        required:
                          (!userInfo.userName || userInfo.userName === "") &&
                          "Please Enter Username",
                      })}
                      value={userName}
                      onChange={(e) => {
                        setDisabled(false);
                        setuserName(e.target.value);
                      }}
                    />
                  </div>
                  {errMsg ? (
                    <p className="ml-6 text-red-dark">{errMsg}</p>
                  ) : (
                    <>
                      {errors.userName && (
                        <p className="ml-6 text-red-dark">{errors.userName.message}</p>
                      )}
                    </>
                  )}
                </div>
                <div className="flex flex-wrap mb-8 -mx-3">
                  <div className="w-full px-3 mb-6 md:w-full md:mb-0">
                    <label
                      className="flex items-center gap-2 mb-4 text-sm font-black tracking-wide text-gray"
                      htmlFor="grid-first-name"
                    >
                      Email Address
                      <div>
                        <InformationCircleIcon className="h-5 w-5 text-opacity-[0.56] text-nouveau-main font-black" />
                      </div>
                    </label>
                    <input
                      className="block w-full bg-transparent p-4 border-[1.5px] border-nouveau-main focus:outline-none border-opacity-20 text-xs tracking-wider font-bold text-opacity-80 placeholder:tracking-wider rounded-lg text-space-gray placeholder:text-space-gray"
                      type="text"
                      placeholder="Enter Email .."
                      value={email}
                      onChange={(e) => {
                        setDisabled(false);
                        setEmail(e.target.value);
                      }}
                    />
                  </div>
                </div>
                <div className="flex flex-wrap mb-8 -mx-3">
                  <div className="w-full px-3 mb-6 md:w-full md:mb-0">
                    <label
                      className="flex items-center gap-2 mb-4 text-sm font-black tracking-wide text-gray"
                      htmlFor="grid-first-name"
                    >
                      Links
                      <div>
                        <InformationCircleIcon className="h-5 w-5 text-opacity-[0.56] text-nouveau-main font-black" />
                      </div>
                    </label>
                    <input
                      className="block w-full bg-transparent p-4 border-[1.5px] border-nouveau-main focus:outline-none border-opacity-20 text-xs tracking-wider font-bold text-opacity-80 placeholder:tracking-wider rounded-lg text-space-gray placeholder:text-space-gray"
                      type="text"
                      placeholder="yourSite.io"
                      value={websiteLink}
                      onChange={(e) => {
                        setDisabled(false);
                        setwebsiteLink(e.target.value);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full sm:w-full md:w-full lg:w-1/2">
            <div className="text-sm font-black leading-6 tracking-wide text-gray">
              Social Connections
            </div>
            <div className="mt-2 text-sm font-semibold leading-6 text-space-gray">
              Help collectors verify your account by connecting social accounts
            </div>

            <div className="gap-4">
              <div className="mt-14 border-[1.5px] rounded-lg border-opacity-20 border-nouveau-main flex w-fit">
                <div className="flex gap-3 px-6 py-4 text-space-gray">
                  <img src={twitter_blue} alt="" />
                  {twitter.name ?? "Twitter"}
                </div>
                {!twitter.name ? (
                  <TwitterLogin
                    authCallback={twitterAuthHandler}
                    consumerKey={"9nLAhm4q6p02k0xvfr9raOUTz"}
                    consumerSecret={"zaMJoDUfhBZHH8O7IlD2wpRPCnmGislLbRFdtnFZUbhEGrO8Ul"}
                    callbackUrl="https://cerulean-longma-d0f479.netlify.app/setting"
                    buttonTheme="light"
                    children={
                      <button
                        type="button"
                        className="px-4 py-3 h-full text-sm font-bold tracking-wide text-white rounded-lg bg-chat-tag"
                      >
                        <div className="flex gap-3">Connect</div>
                      </button>
                    }
                  />
                ) : (
                  <button
                    type="button"
                    className="px-4 py-3 text-sm font-bold tracking-wide text-white rounded-lg bg-light-blue"
                  >
                    <div className="flex gap-3">
                      <div className="xs:block hidden">Connected</div>
                      <CheckIcon className="w-5 h-5 text-white" />
                    </div>
                  </button>
                )}
              </div>
              <div className="mt-4 border-[1.5px] rounded-lg border-opacity-20 border-nouveau-main flex w-fit">
                <div className="flex gap-3 px-6 text-space-gray items-center h-14">
                  {discord.avatar ? (
                    <img src={discord.avatar} alt="" className="w-10 h-10 rounded-full" />
                  ) : (
                    <img src={discordSVG} alt="" className="w-[18px] rounded-full" />
                  )}
                  {discord.name ?? "Discord"}
                </div>
                {!discord.avatar ? (
                  <a
                    target="_blank"
                    className="px-4 py-3 text-sm font-bold tracking-wide text-white rounded-lg bg-chat-tag flex justify-center items-center"
                    href={
                      "https://discord.com/api/oauth2/authorize?client_id=1174638216339533834&redirect_uri=https%3A%2F%2Fcerulean-longma-d0f479.netlify.app%2Fsetting&response_type=code&scope=identify"
                    }
                    rel="noreferrer"
                  >
                    Connect
                  </a>
                ) : (
                  <button
                    type="button"
                    className="px-4 py-3 text-sm font-bold tracking-wide text-white rounded-lg bg-light-blue"
                  >
                    <div className="flex gap-3">
                      <div className="xs:block hidden">Connected</div>
                      <CheckIcon className="w-5 h-5 text-white" />
                    </div>
                  </button>
                )}
              </div>
            </div>
            <div className="flex flex-wrap mt-10 mb-8 -mx-3">
              <div className="w-full px-3 mb-6 md:w-full md:mb-0">
                <label
                  className="flex items-center gap-2 mb-4 text-sm font-black tracking-wide text-gray"
                  htmlFor="grid-first-name"
                >
                  Bio
                  <div>
                    <InformationCircleIcon className="h-5 w-5 text-opacity-[0.56] text-nouveau-main font-black" />
                  </div>
                </label>
                <textarea
                  rows="9"
                  className="block w-full bg-transparent p-4 border-[1.5px] border-nouveau-main focus:outline-none border-opacity-20 text-xs tracking-wider font-bold text-opacity-80 placeholder:tracking-wider rounded-lg text-space-gray placeholder:text-space-gray"
                  placeholder="Tell The World Your Story!"
                  value={bio}
                  onChange={(e) => {
                    setDisabled(false);
                    setBio(e.target.value);
                  }}
                ></textarea>
              </div>
            </div>
            <div className="flex flex-wrap mb-8 -mx-3">
              <div className="w-full px-3 mb-6 md:w-full md:mb-0">
                <label
                  className="flex items-center gap-2 mb-4 text-sm font-black tracking-wide text-gray"
                  htmlFor="grid-first-name"
                >
                  Wallet Address
                  <div>
                    <InformationCircleIcon className="h-5 w-5 text-opacity-[0.56] text-nouveau-main font-black" />
                  </div>
                </label>
                <div className="w-full bg-transparent p-4 border-[1.5px] border-nouveau-main focus:outline-none border-opacity-20 text-xs tracking-wider font-bold text-opacity-80 text-space-gray rounded-lg flex justify-between overflow-wrap">
                  <div value={pubKey}>{pubKey.toString()}</div>
                  {/* <ContentCopyIcon sx={{ cursor: 'pointer' }}  /> */}
                  {!copied ? (
                    <>
                      <ContentCopyRoundedIcon
                        onClick={() => {
                          navigator.clipboard.writeText(`${pubKey.toString()}`);
                          setCopied(true);
                          setTimeout(() => {
                            setCopied(false);
                          }, 500);
                        }}
                        sx={{ cursor: "pointer" }}
                      ></ContentCopyRoundedIcon>
                    </>
                  ) : (
                    <DoneIcon></DoneIcon>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center gap-4 my-10">
          <button
            type="button"
            className="bg-nouveau-main bg-opacity-[0.16] rounded-lg py-3 px-6 text-nouveau-main uppercase text-sm leading-6 tracking-wide font-bold"
            onClick={handleReset}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={disabled}
            className="px-6 py-3 text-sm font-bold leading-6 tracking-wide text-white uppercase rounded-lg bg-chat-tag disabled:bg-gray hover:cursor-pointer"
          >
            Save
          </button>
        </div>
      </form>
    </>
  );
}
