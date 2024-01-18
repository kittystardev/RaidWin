import React from "react";
import closebutton from "../../assets/images/closebutton.svg";
import sendmsg from "../../assets/images/sendmsg.svg";
import smileicon from "../../assets/images/smileicon.svg";
import smileicon_blue from "../../assets/images/smileicon_blue.svg";
import { Avatar, Box, Menu, Tab } from "@mui/material";
import styled from "styled-components";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import EmojiTab from "./EmojiTab";
import StickersTab from "./StickersTab";
import { useEffect } from "react";
import { baseUrl, handleImageError, imagePath, socket } from "../../utils/utils";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import ChatList from "./ChatList";
import { setConnectModal, setFromGameJoin } from "../../store/TempSlice";
import UserNameModal from "../modals/UserNameModal";
import { fetchPlayers } from "../../store/PlayersSlice";
import TipModal from "./TipModal";
import TipCongratulationModal from "../modals/TipCongratulationModal";
import victory from "../../assets/audio/victory.mp3";

const StyledMenu = styled((props) => <Menu {...props} />)(({ theme }) => ({
  "& .MuiPaper-root": {
    backgroundColor: "#27314B",
    borderRadius: "24px",
    // marginTop: theme.spacing(1),
    // padding: '24px',
    minWidth: 300,
    maxWidth: 300,
    maxHeight: 472,
    minHeight: 472,
    opacity: "0.99 !important",
    overflow: "hidden !important",
  },
}));

export default function ChatBox({ setShowChatBox }) {
  const { _id: pubKey, profileImage, userName } = useSelector((state) => state.userInfo.userInfo);
  const { userInfo } = useSelector((state) => state.userInfo);
  let players = useSelector((state) => state.Players.players);
  const SOLPrice = useSelector((state) => state.solanaprice.priceUsdt);

  const dispatch = useDispatch();

  const [chatData, setChatData] = useState([]);
  const [emoji, setEmoji] = useState(null);
  const [pageNo, setPageNo] = useState(0);
  const [selectedUser, setSelectedUser] = useState({});
  const [status, setStatus] = useState("");

  const open = Boolean(emoji);
  const EmojiOpen = (event) => {
    setEmoji(event.currentTarget);
  };
  const handleClose = () => {
    setEmoji(null);
  };
  const [value, setValue] = useState("1");
  const [msg, setMsg] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [latestTipData, setLatestTipData] = useState({});

  const [matchedPlayers, setMatchedPlayers] = useState([]);
  const [mutedUser, setMutedUser] = useState([]);

  const [receiverKey, setReceiverKey] = useState("");
  const [show, setShow] = useState(pubKey !== receiverKey);
  const audio = new Audio(victory);

  const playAudio = () => {
    // Check if the audio is paused or ended before playing
    if (audio.paused || audio.ended) {
      audio.play();
    }
  };

  useEffect(() => {
    if ((!pubKey || pubKey === "") && (!receiverKey || receiverKey === "")) return;
    if (pubKey === receiverKey) {
      audio.play().catch((error) => {
        // Autoplay was prevented, handle the error
        console.error("Autoplay prevented:", error);
      });
    }
    setShow(pubKey === receiverKey);
  }, [pubKey, receiverKey]);

  const [userTipModal, setUserTipModal] = useState(false);

  const handleInputChange = (e) => {
    setMsg(e.target.value);

    if (e.target.value.includes("@")) {
      const searchTerm = e.target.value.split("@").pop().toLowerCase(); // Grabs the last word after "@"

      if (
        e.target.value.charAt(e.target.value.indexOf("@") - 1) === " " ||
        e.target.value.indexOf("@") === 0 ||
        searchTerm
      ) {
        const matches = players.filter((player) =>
          player.userName?.toLowerCase().startsWith(searchTerm)
        );

        setMatchedPlayers(matches);

        if (matches.length > 0) {
          setShowDialog(true);
          return;
        }
      }
    }
    setShowDialog(false);
  };

  useEffect(() => {
    const findMuteUser = async () => {
      try {
        const resp = await fetch(`${baseUrl}/findMuteUser`);
        let data = await resp.json();
        setMutedUser(data.mutedUser);
      } catch (error) {
        console.log("error", error);
      }
    };
    findMuteUser();
  }, []);

  const handleUserSelect = (player) => {
    if (player && player.userName) {
      setSelectedUser(player);
      const regex = /@[^@]*$/;
      setMsg((prevValue) => prevValue.replace(regex, `@${player.userName}`));
      setShowDialog(false);

      if (msg.startsWith("/tip @") && player.userName !== userInfo.userName) {
        openTipModal(player.userName);
      }
    }
  };

  const handleChildData = (data) => {
    if (!data.txId) return;
    sendMessgeToServerTip(
      `${userInfo.userName} tipped ${data.amount} SOL💸 ($${(
        data.amount * SOLPrice.data?.priceUsdt
      ).toFixed(2)}) to @${selectedUser.userName}`,
      data.receiverPublicKey,
      data.amount,
      selectedUser.userName
    );
    setMsg("");
  };

  const openTipModal = (usernameToTip) => {
    setUserTipModal(true);
  };

  const closeModal = () => {
    setUserTipModal(false); // Set modal visibility to false
  };

  const handleChangeTab = (event, newValue) => {
    setValue(newValue);
  };
  const addNewMSG = (data) => {
    const newChat = {
      name: data.userName,
      image: data.profileImage,
      content: data.msg,
      id: data._id,
    };
    setChatData([newChat, ...chatData]);
  };

  const addTipMSG = (data) => {
    const newTipChat = {
      content: data.msg,
      id: data._id,
    };
    setChatData([newTipChat, ...chatData]);
  };

  const handleStatusChange = (pubKey, action) => {
    let user = mutedUser.find((u) => u.pubKey === pubKey);

    action === "unmuted" ? setStatus("unmuted") : setStatus("muted");
    console.log("user :>> ", user, status);
  };

  useEffect(() => {
    socket.on("statusMute", ({ pubKey }) => handleStatusChange(pubKey, "muted"));
    socket.on("statusUnmute", ({ pubKey }) => handleStatusChange(pubKey, "unmuted"));
    socket.on("statusDefaultMute", ({ pubKey }) => handleStatusChange(pubKey, "muted"));
    socket.on("findMuteUser", (data) => {
      setMutedUser(data.data);
    });

    return () => {
      socket.off("statusMute");
      socket.off("statusUnmute");
      socket.off("statusDefaultMute");
      socket.off("findMuteUser");
    };
  }, [status]);

  useEffect(() => {
    socket.on("new_message", (data) => {
      if (data.userName) {
        addNewMSG(data);
      }
      if (data.receiverKey) {
        addTipMSG(data);
        setReceiverKey(data.receiverKey);
      }
    });
    socket.on("chatDeleted", ({ chatId }) => {
      setChatData((prev) => {
        return prev.filter((data) => data.id !== chatId);
      });
    });
    socket.on("deleteChatUser", ({ chatId }) => {
      setChatData((prev) => {
        return prev.filter((data) => data.playerId !== chatId);
      });
    });

    return () => {
      socket.off("chatDeleted");
      socket.off("new_message");
      socket.off("deleteChatUser");
    };
  }, [chatData]);

  const PageLimit = 25;

  const getNameContent = (_content) => {
    let name = "",
      content = _content;
    try {
      const strList = _content.split(" tipped");
      if (strList.length > 1) {
        if (strList[0][0] !== "@") {
          name = strList[0];
          content = "@" + _content;
        }
      }
    } catch (e) {}
    return { name, content };
  };
  const fetchData = async () => {
    try {
      const resp = await fetch(`${baseUrl}/getMSG/${pageNo}/${PageLimit}`);
      let chats = (await resp.json()).map((data) => {
        const { name, content } = getNameContent(data.msg);
        return {
          name: data.userName ?? name,
          image: data.profileImage,
          content,
          id: data._id,
          playerId: data.pubKey,
          tags: data.tags,
        };
      });
      setPageNo(pageNo + 1);
      setChatData([...chatData, ...chats]);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const sendMessgeToServer = (msg) => {
    const data = { pubKey, profileImage, userName, msg };
    socket.emit("new_message", data);
    // addNewMSG(data);
    handleClose();
  };
  const sendMessgeToServerTip = (msg, receiverKey, amount, selectedUser) => {
    const data = { pubKey, msg, receiverKey, amount, selectedUser };
    socket.emit("new_message", data);
    // addNewMSG(data);
    handleClose();
  };

  useEffect(() => {
    const handleEsc = (event) => {
      if ((event.key === "Escape" || event.keyCode === 27) && showDialog) {
        setShowDialog(false);
      }
    };
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [showDialog]);

  useEffect(() => {
    dispatch(fetchPlayers());
  }, []);

  function SendMessage(e) {
    e.preventDefault();
    if (msg !== "" && userInfo.userName !== "") {
      if (userInfo.userName === undefined) {
        setUserModal();
      } else {
        if (msg.startsWith(`@${userInfo.userName} tipped`)) return;
        sendMessgeToServer(msg);
        setShowDialog(false);
        setMsg("");
      }
    } else if (userInfo._id === "" || userInfo._id === undefined) {
      setMsg("");
      ConnectModal();
    } else {
      setMsg("");
    }
  }

  const fetchMoreData = () => {
    fetchData();
  };

  const ConnectModal = () => {
    dispatch(setFromGameJoin(false));
    dispatch(setConnectModal(true));
  };

  const [userModalOpen, setUserModalOpen] = useState(false);
  const setUserModal = () => setUserModalOpen(true);
  const CloseUserModal = () => setUserModalOpen(false);

  return (
    <>
      <div>
        <div className="flex flex-col h-screen">
          <header className="sticky top-0 w-full">
            <div className="bg-chat-body-rgb md:rounded-tl-[40px]">
              <div className="w-full bg-chat-header-rgba items-center flex justify-between p-8 md:rounded-tl-[40px] backdrop-blur-xl">
                <div className="text-sm font-black tracking-wider text-gray">Chat</div>
                <div className="flex items-center space-x-6">
                  <img
                    src={closebutton}
                    onClick={() => {
                      setShowChatBox(false);
                    }}
                    alt="close"
                    className="w-4 h-4 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </header>
          <main className="flex flex-1">
            <div className=" overflow-hidden flex-1 bg-chat-body-rgb bg-opacity-80 backdrop-blur-xl h-[100vh]">
              <ChatList
                chatData={chatData}
                setChatData={setChatData}
                fetchMoreData={fetchMoreData}
              ></ChatList>
            </div>
          </main>
          <footer className="w-full sticky bottom-0 bg-chat-body-rgb bg-opacity-[0.64] backdrop-blur-xl">
            <div className="w-full p-4 md:w-80">
              {showDialog && (
                <div className="bg-blue-chaos mb-2 !rounded-lg text-white max-h-60 overflow-auto">
                  {matchedPlayers.map((player, i) => (
                    <div
                      key={i}
                      onClick={() => handleUserSelect(player)}
                      className="flex justify-between hover-search hover:bg-yankees-blue hover:bg-opacity-50 hover:rounded-lg cursor-pointer"
                    >
                      <div className="flex items-center gap-4 p-3">
                        <img
                          src={`${imagePath}profile48/${player.profileImage}`}
                          className="h-10 w-10 rounded-md"
                          onError={handleImageError}
                          alt=""
                        />
                        <p className="text-space-gray font-semibold">{player.userName ?? ""}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {/* {
                mutedUser.some(
                  (item) => item.pubKey === pubKey && item.status === "muted"
                ) ? (
                  <div className="text-center text-white">
                    You cannot chat anymore
                  </div>
                ) : ( */}
              <form onSubmit={SendMessage}>
                <div className="flex justify-between w-full space-x-8 rounded-full bg-background opacity-80">
                  <input
                    type="text"
                    name="chattext"
                    value={msg}
                    disabled={mutedUser.some(
                      (item) => item.pubKey === pubKey && item.status === "muted"
                    )}
                    onChange={handleInputChange}
                    className={`w-full md:min-w-[200px] px-4 py-3 rounded-lg bg-background text-gray focus:outline-none focus:border-sky-500 focus:ring-sky-500 sm:text-sm focus:ring-0 placeholder:text-space-gray ${
                      mutedUser.some((item) => item.pubKey === pubKey && item.status === "muted") &&
                      "font-bold"
                    }`}
                    placeholder={
                      mutedUser.some((item) => item.pubKey === pubKey && item.status === "muted")
                        ? "You are not able to chat anymore"
                        : "type something ..."
                    }
                    autoComplete="off"
                    onClick={() => {
                      if (userInfo._id === "") {
                        ConnectModal();
                      } else if (
                        !userInfo.userName ||
                        userInfo.userName === "" ||
                        !userInfo.profileImage ||
                        userInfo.profileImage === ""
                      ) {
                        setUserModal();
                      }
                    }}
                  />

                  {mutedUser.some(
                    (item) => item.pubKey === pubKey && item.status === "muted"
                  ) ? null : (
                    <div className="flex justify-end space-x-4 ">
                      {!emoji ? ( // Added The authentication for opening the emoji tab .. here.
                        <img
                          src={smileicon}
                          className="cursor-pointer focus:ring-sky-500"
                          onClick={(event) => {
                            userInfo._id === ""
                              ? ConnectModal()
                              : !userInfo.userName || userInfo.userName === ""
                              ? setUserModal()
                              : EmojiOpen(event);
                          }}
                          alt="smile"
                        />
                      ) : (
                        <img
                          src={smileicon_blue}
                          className="cursor-pointer focus:ring-sky-500"
                          onClick={(event) => {
                            userInfo._id === ""
                              ? ConnectModal()
                              : !userInfo.userName || userInfo.userName === ""
                              ? setUserModal()
                              : EmojiOpen(event);
                          }}
                          alt="smile"
                        />
                      )}
                      <button
                        type="submit"
                        disabled={mutedUser.some(
                          (item) => item.pubKey === pubKey && item.status === "muted"
                        )}
                      >
                        <Avatar
                          sx={{
                            cursor: "pointer",
                            width: "48px",
                            height: "48px",
                            bgcolor: !msg || !userInfo.userName ? "#5a88ff8a" : "#5A88FF",
                          }}
                        >
                          <img src={sendmsg} className="w-4 h-4" alt="Send" />
                        </Avatar>
                      </button>
                    </div>
                  )}
                </div>
              </form>
              {/* ) */}
              {/* //  : (
              //   <Skeleton
              //     variant="rectangular"
              //     width="100%"
              //     height={25}
              //     sx={{ borderRadius: "1.5rem" }}
              //   />
              // ) */}
              {/* // } */}

              <StyledMenu
                id="basic-menu"
                anchorEl={emoji}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                }}
                sx={{
                  width: "100%",
                  top: "-54px",
                  borderRadius: "24px",
                }}
              >
                <Box sx={{ width: "100%", overflow: "hidden" }}>
                  <TabContext value={value}>
                    <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                      <TabList onChange={handleChangeTab} aria-label="lab API tabs example">
                        <Tab
                          label="Emoji"
                          value="1"
                          sx={{ width: "50%", textTransform: "capitalize" }}
                        />
                        <Tab
                          label="Stickers"
                          value="2"
                          sx={{ width: "50%", textTransform: "capitalize" }}
                        />
                      </TabList>
                    </Box>
                    <TabPanel value="1" sx={{ p: 0 }}>
                      <EmojiTab setMsg={setMsg} msg={msg}></EmojiTab>
                    </TabPanel>
                    <TabPanel value="2" sx={{ p: 0 }}>
                      <StickersTab
                        sendSticker={(stickerId) => sendMessgeToServer(`~${stickerId}~`)}
                      ></StickersTab>
                    </TabPanel>
                  </TabContext>
                </Box>
              </StyledMenu>
            </div>
          </footer>
        </div>
      </div>
      <UserNameModal open={userModalOpen} onClose={CloseUserModal}></UserNameModal>

      {userTipModal && (
        <TipModal
          show={userTipModal}
          onClose={closeModal}
          sendDataToParent={handleChildData}
          userName={selectedUser.userName}
          ReceiverKey={selectedUser.playerId}
          setLatestTipData={setLatestTipData}
        ></TipModal>
      )}
      {show && (
        <TipCongratulationModal
          handleClose={() => {
            setShow(false);
          }}
          latestTipData={latestTipData}
          receiverPubKey={receiverKey}
        />
      )}
    </>
  );
}
