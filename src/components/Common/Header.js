import { Menu, MenuItem, Skeleton, styled } from "@mui/material";
import React, { useEffect } from "react";
import wallet from "../../assets/images/wallet.svg";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ConnectionModal from "../modals/ConnectionModal";
import Connected from "./Connected";
import {
  setAccessTokenDetails,
  setConnectModal,
  setFromGameJoin,
} from "../../store/TempSlice";
import { setUsdtPrice } from "../../store/SolanaPrice";
import { useState } from "react";
import { baseUrl } from "../../utils/utils";

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
    marginTop: theme.spacing(1),
    padding: "24px",
    minWidth: 240,
  },
}));

const Menus = styled(MenuItem)`
  padding-left: 0px !important;
  padding-top: 20px !important;
`;

export default function Header({
  profilemenuopen,
  handleClick,
  anchorEl,
  setAnchorEl,
  skeleton,
}) {
  const dispatch = useDispatch();
  const pubKey = useSelector((state) =>
    state.Temp.pubKey ? state.Temp.pubKey.toString() : ""
  );
  const open = useSelector((state) => state.Temp.modalOpen);
  const ConnectModal = () => {
    dispatch(setFromGameJoin(false));
    dispatch(setConnectModal(true));
  };
  const CloseModal = () => dispatch(setConnectModal(false));
  let location = useLocation();
  const handleClose = () => {
    setAnchorEl(null);
  };

  const accessToken = useSelector((state) => state.Temp.accessToken);
  const userPubKey = useSelector((state) => state.Temp.userPubKey);
  useEffect(() => {
    if (pubKey !== "") {
      dispatch(setConnectModal(false));
      if (pubKey !== userPubKey) signMsg(pubKey);
    }
  }, [pubKey, accessToken]);
  const [tpsvalue, setTpsValue] = useState(0.0);
  const SOLPrice = useSelector((state) => state.solanaprice.priceUsdt);
  const fetchData = async () => {
    try {
      const resp = await fetch(`https://api.solscan.io/market?symbol=SOL`);
      let data = await resp.json();
      const tpsValue = await fetch(
        `https://api.solscan.io/chaininfo?cluster=mainnet`
      );
      let tpsData = await tpsValue.json();
      setTpsValue(tpsData);
      dispatch(setUsdtPrice(data));
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    setInterval(() => {
      fetchData();
    }, 10000);
  }, []);

  //   const signMsg = async (pubKey) => {
  //     const provider = await window.solana;
  //     console.log("provider", provider);
  //     let timestamp = Math.floor(Date.now() / 1000);
  //     const message = `solwin.app wants you to sign in with your Solana account: ${pubKey} Click Sign or Approve only means you have proved this wallet is owned by you.
  // URI: https://solwin.vercel.app/
  // Version: 1
  // Chain ID: devnet
  // Nonce: ${Math.random() * 10000}
  // Issued At: ${timestamp}`;
  //     const encodedMessage = new TextEncoder().encode(message);
  //     const signedMessage = await provider.request({
  //       method: "signMessage",
  //       params: {
  //         message: encodedMessage,
  //         display: "utf8",
  //       },
  //     });
  //     console.log("signed_aprv", message, signedMessage);
  //     const resp = await fetch(`${baseUrl}/generateToken`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ message, received_from_frontend: signedMessage }),
  //     });
  //     const obj = await resp.json();
  //     sessionStorage.setItem("solwin_token", JSON.stringify(obj));
  //     dispatch(setAccessTokenDetails(obj));
  //   };

  // Working

  const signMsg = async (pubKey) => {
    let timestamp = Math.floor(Date.now() / 1000);
    const message = `solwin.app wants you to sign in with your Solana account: ${pubKey} Click Sign or Approve only means you have proved this wallet is owned by you.
URI: https://solwin.vercel.app/
Version: 1
Chain ID: devnet
Nonce: ${Math.random() * 10000}
Issued At: ${timestamp}`;

    try {
      const messageBytes = new TextEncoder().encode(message);

      const signedMessage = await window.solana.signMessage(
        messageBytes,
        "utf8"
      );

      // console.log("Signed Message:", signedMessage);

      // Send the signed message to your backend for further processing
      const resp = await fetch(`${baseUrl}/generateToken`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          received_from_frontend: signedMessage,
        }),
      });

      const obj = await resp.json();
      sessionStorage.setItem("solwin_token", JSON.stringify(obj));
      dispatch(setAccessTokenDetails(obj));
    } catch (error) {
      console.error("Signing Error:", error);
    }
  };

  return (
    <div className="flex justify-between items-center pl-2 mt-0 mb-5 sm:mt-0 md:mt-5  min-h-[0px] sm:min-h-[0px] md:min-h-[52px]">
      <div className="flex justify-between w-full 2xl:w-[83%]">
        {SOLPrice.data?.priceUsdt && (
          <div className="hidden sm:hidden md:flex gap-3">
            <div className="gap-[6px] sm:gap-[6px] items-center flex">
              <div className="text-light-gray uppercase text-sm font-semibold">
                Sol/ usd{" "}
              </div>
              <div>
                <span className="text-light-green text-sm font-bold">$ </span>
                <span className="text-gray text-sm font-bold">
                  {SOLPrice.data?.priceUsdt}
                </span>
              </div>
            </div>
            <div className="items-center flex gap-[6px] sm:gap-[6px] ">
              <div className="text-light-gray text-sm font-semibold">
                Solana Network{" "}
              </div>
              <div className="flex gap-1 items-center">
                <div className="text-gray text-sm font-semibold">
                  {tpsvalue?.data && tpsvalue?.data?.networkInfo
                    ? parseFloat(tpsvalue?.data?.networkInfo?.tps)?.toFixed(2)
                    : 0}
                </div>
                <span className="uppercase text-light-blue">TPS</span>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="hidden sm:flex md:flex">
        <div
          id="demo-customized-button"
          aria-haspopup="true"
          className="flex flex-row gap-3 items-center"
          sx={{
            "&:hover": {
              background: "none",
            },
          }}
        >
          <div
            className={`${
              !pubKey && "bg-yankees-blue"
            } rounded-lg items-center hidden cursor-pointer w-max mr-2 sm:mr-0 sm:hidden md:flex`}
            onClick={() => !pubKey && ConnectModal()}
          >
            <div
              className={`text-xs flex justify-items-end justify-end ${
                !pubKey && "pl-1 pr-2 py-1"
              }  items-center`}
            >
              {
                !pubKey ? (
                  <>
                    {skeleton ? (
                      <Skeleton
                        variant="rectangular"
                        sx={{ borderRadius: "8px", pl: 3 }}
                        width={100}
                        height={32}
                      />
                    ) : (
                      <div className="hidden sm:flex pl-5 pr-6 text-space-gray hover:text-gray font-bold uppercase">
                        Click to connect
                      </div>
                    )}
                  </>
                ) : (
                  <Connected></Connected>
                )
                // <div className='hidden sm:flex pl-5 pr-6 text-space-gray hover:text-gray font-bold' onClick={profilemenuopen}>
                //     {pubKey.toString()}
                // </div>
              }

              {!pubKey && (
                <div className="flex w-8 h-8">
                  <img src={wallet} className="rounded-lg" />
                </div>
              )}
              {/* <img src={avatar} /> */}
            </div>
          </div>
          {/* {pubKey && (
            <div
              className="rounded-lg items-center text-sm hidden cursor-pointer p-2 sm:hidden md:flex bg-yankees-blue"
              onClick={() => signMsg()}
            >
              Sign Msg
            </div>
          )} */}
        </div>
      </div>

      <ConnectionModal
        open={open}
        onClose={CloseModal}
        handleClick={handleClick}
      ></ConnectionModal>
    </div>
  );
}
