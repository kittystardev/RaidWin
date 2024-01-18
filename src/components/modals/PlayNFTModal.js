import {
  Avatar,
  Box,
  Checkbox,
  Modal,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import React, { useEffect, useRef } from "react";
import CloseIcon from "@mui/icons-material/Close";
import correcticon from "../../assets/images/correcticon.svg";
import addicon from "../../assets/images/addicon.svg";
import styled from "styled-components";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAlertIdx } from "../../store/NFTModal";
import { join_game } from "../../utils/joinGame";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import {
  baseUrl,
  decodeMetadata,
  getMetadataAccount,
  handleImageError,
  socket,
} from "../../utils/utils";
import { resetNftList, setNftList } from "../../store/TempSlice";
import BuyNFTModal from "./BuyNFTModal";
import { waitForFinalized } from "../../utils/externalwallet";
import { useCallback } from "react";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  maxWidth: "720px",
  width: "90%",
  minWidth: "350px",
  bgcolor: "#1C2438",
  // border: '2px solid #000',
  borderRadius: "24px",
  boxShadow: 24,
  py: { xs: 3, sm: 5 },
  px: { xs: 3, sm: 5 },
};

const AddCheckbox = styled(Checkbox)`
  position: absolute;
  height: 32px;
  width: 32px;
  opacity: 0;
`;

const NftCard = ({ alignment, value, nftList, onClick }) => {
  return (
    <div
      className="flex items-center justify-center"
      onClick={() => {
        onClick(value === alignment);
      }}
    >
      <div className="relative h-full nftmodal">
        {/* <div onClick={() => { setaddcartCheck(!addcartCheck) }} className="relative" > */}
        <div className="relative">
          <div className="absolute z-30 top-2 right-2">
            <AddCheckbox
              icon={
                <Avatar
                  sx={{
                    width: "32px",
                    height: "32px",
                    backgroundColor: "rgba(28, 36, 56, 0.48)",
                  }}
                >
                  <img src={addicon} alt="" />
                </Avatar>
              }
              checkedIcon={
                <Avatar
                  sx={{
                    width: "32px",
                    height: "32px",
                    backgroundColor: "#B5EC5B",
                  }}
                >
                  <img src={correcticon} alt="" />
                </Avatar>
              }
              checked={value === alignment}
              className={`backdrop-blur-sm hoveraddicon `}
              sx={{ ...(value === alignment && { opacity: "1 !important" }) }}
            />
          </div>
          <div
            className={`relative rounded-2xl w-[148px]  ${
              value === alignment && "border-2 border-light-green "
            }`}
          >
            <img
              src={nftList.playerImage}
              onError={handleImageError}
              className="rounded-2xl object-cover w-[145px]"
              alt=""
            />
            {/* <img src={nft1} /> */}
          </div>
        </div>
        <div className="mt-2 text-sm font-semibold tracking-wide text-center text-space-gray">
          {`${nftList.playerName}`}
        </div>
      </div>
    </div>
  );
};

export default function PlayNFTModal(props) {
  const nftList = useSelector((state) => state.Temp.nftList);
  const pubKey = useSelector((state) => state.Temp.pubKey);
  const publicKey = useSelector((state) => state.Temp.pubKey);
  const gameId = useSelector((state) => state.Index.gameId);
  const collectionMint = useSelector((state) => state.Index.collectionMint);
  const creators = useSelector((state) => state.Index.creators);
  const is1v1 = useSelector((state) => state.Index.is1v1);
  const side = useSelector((state) => state.Index.side);
  const [Stage, setStage] = useState(-1);
  const dispatch = useDispatch();
  const accessToken = useSelector((state) => state.Temp.accessToken);

  useEffect(() => {
    dispatch(resetNftList());
  }, [dispatch, publicKey]);
  const getNft = useCallback(
    async (publicKey) => {
      let connection = new Connection(clusterApiUrl("devnet"), "confirmed");
      let response = await connection.getParsedTokenAccountsByOwner(publicKey, {
        programId: TOKEN_PROGRAM_ID,
      });
      let mints = await Promise.all(
        response.value
          .filter(
            (accInfo) =>
              accInfo.account.data.parsed.info.tokenAmount.uiAmount !== 0
          )
          .map((accInfo) =>
            getMetadataAccount(accInfo.account.data.parsed.info.mint)
          )
      );
      let mintPubkeys = mints.map((m) => new PublicKey(m));
      let nftMetadata = [];
      for (let j = 0; j < mintPubkeys.length; j += 100) {
        let multipleAccounts = await connection.getMultipleAccountsInfo(
          mintPubkeys.slice(j, j + 100)
        );
        nftMetadata = [
          ...nftMetadata,
          ...multipleAccounts
            .filter((account) => account !== null)
            .map((account) => decodeMetadata(account.data)),
        ];
      }
      const ret = [];

      nftMetadata.forEach((ele) => {
        if (ele.data.creators) {
          if (creators.length === ele.data.creators.length) {
            let flag = true;
            for (let i = 0; i < creators.length; i++) {
              if (creators[i] !== ele.data.creators[i].address) {
                flag = false;
                break;
              }
            }
            if (flag) {
              ret.push(ele);
            }
          }
        }
      });
      return ret;
    },
    [creators]
  );

  // console.log("collectionMint", props)
  const modalOpen = useCallback(async () => {
    try {
      const resp = await fetch(
        `${baseUrl}/gameState/${collectionMint}/2/${is1v1}`
      );
      const obj = await resp.json();
      if (obj.msg === "created") {
        let nftData = await getNft(new PublicKey(publicKey));
        let nftMintName = [];

        nftData.map(async (nft) => {
          let res = await fetch(nft.data.uri);
          let data = await res.json();
          let nftObj = {
            playerName: nft.data.name,
            mint: nft.mint,
            playerImage: data.image,
          };
          nftMintName = [...nftMintName, nftObj];

          dispatch(setNftList(nftMintName));
        });
        setStage(nftData.length);
      } else if (obj.msg === "creating") {
        modalOpen();
      }
    } catch (err) {
      console.log(err);
    }
  }, [collectionMint, dispatch, getNft, is1v1, publicKey]);
  useEffect(() => {
    setStage(-1);
    if (props.open) {
      modalOpen();
    } else {
      setNFT(null);
    }
  }, [modalOpen, props.open]);
  const [NFT, setNFT] = useState(null);
  const [alignment, setAlignment] = React.useState("left");
  const [joining, setJoining] = React.useState(false);

  const handleAlignment = (event, newAlignment) => {
    setAlignment(newAlignment);
  };
  useEffect(() => {
    setAlignment(!props.open ? "right" : "left");
  }, [props.open]);

  const containerRef = useRef(null);

  const handleWheel = (event) => {
    event.preventDefault();
    const { current } = containerRef;
    if (event.deltaY > 0) {
      current.scrollLeft += 50;
    } else {
      current.scrollLeft -= 50;
    }
  };

  return (
    <>
      {Stage === -1 ? (
        <></>
      ) : Stage === 0 ? (
        <BuyNFTModal
          open={props.open}
          onClose={props.handleClose}
        ></BuyNFTModal>
      ) : (
        <Modal
          open={props.open}
          onClose={props.handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          className="Hii"
        >
          <Box sx={style}>
            <div className="flex justify-between">
              <div className="text-xl font-black tracking-wide text-gray">
                Select the NFT you want to play with
              </div>
              <CloseIcon
                className="cursor-pointer text-nouveau-main"
                onClick={props.handleClose}
              />
            </div>
            {/* <div className='grid grid-cols-2 gap-4 mt-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'> */}

            <ToggleButtonGroup
              ref={containerRef}
              onWheel={handleWheel}
              value={alignment}
              exclusive
              onChange={handleAlignment}
              aria-label="text alignment"
              className="mt-10 grid gap-4 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 overflow-auto w-full"
            >
              {nftList.map((value) => {
                return (
                  <ToggleButton
                    disableRipple
                    value={value.mint}
                    sx={{ padding: 0, border: "none" }}
                  >
                    <NftCard
                      onClick={(isSelected) => {
                        if (!isSelected) setNFT(value);
                        else setNFT(null);
                      }}
                      key={value.mint}
                      value={value.mint}
                      alignment={alignment}
                      nftList={value}
                    />
                  </ToggleButton>
                );
              })}
            </ToggleButtonGroup>
            {/* </div> */}

            <div className="flex justify-center mt-12">
              <button
                className="px-8 py-3 text-sm font-bold leading-6 uppercase rounded-lg bg-light-green disabled:bg-light-blue-rgb text-yankees-blue"
                disabled={joining || NFT === null}
                onClick={async () => {
                  setJoining(true);
                  try {
                    const signature = await join_game(
                      new PublicKey(pubKey),
                      NFT.mint,
                      collectionMint,
                      is1v1,
                      side
                    );
                    props.handleClose();
                    dispatch(
                      setAlertIdx({
                        info: "Confirming Deposit",
                        open: true,
                        response: "",
                      })
                    );
                    await waitForFinalized(signature);
                    if (!is1v1)
                      socket.emit("NewOrDisjoinedJoined", {
                        accessToken,
                        gameId,
                      });
                    else
                      socket.emit("NewOrDisjoinedJoined1v1", {
                        accessToken,
                        gameId,
                      });

                    dispatch(
                      setAlertIdx({
                        info: "Deposit confirmed",
                        open: true,
                        response: "success",
                      })
                    );
                    setTimeout(() => {
                      dispatch(
                        setAlertIdx({
                          info: "",
                          open: false,
                          response: "success",
                        })
                      );
                    }, 2000);
                    // start();
                    // dispatch(handleClosesetPlayer({ data: NFT, index: 5 }))
                    setNFT(null);
                  } catch (err) {
                    console.log(err);
                    dispatch(
                      setAlertIdx({ info: "Failed", open: true, response: "" })
                    );
                    setTimeout(() => {
                      dispatch(
                        setAlertIdx({
                          info: "",
                          open: false,
                          response: "Failed",
                        })
                      );
                    }, 2000);
                  }
                  setJoining(false);
                }}
              >
                {joining ? "Joining..." : "Play"}
              </button>
            </div>
          </Box>
        </Modal>
      )}
    </>
  );
}
