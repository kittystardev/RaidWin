import { Box, IconButton, Modal, Skeleton } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import wallet_cart from "../../assets/images/wallet_cart.svg";
import polygon from "../../assets/images/polygon.svg";
import phantom from "../../assets/images/phantom.svg";
import verify from "../../assets/images/verify.svg";
import discord from "../../assets/images/discord.svg";
import twitter from "../../assets/images/twitter.svg";
import opensea from "../../assets/images/opensea.svg";
import styled from "styled-components";
import { useSelector } from "react-redux";
import {
  baseUrl,
  getCreator,
  handleImageError,
  imagePath,
} from "../../utils/utils";
import { Link, useParams } from "react-router-dom";
import { isMobile } from "react-device-detect";
import megicedan from "../../assets/images/megicedan.svg";
import earth from "../../assets/images/earth.svg";

const ModalFooter = styled(Box)`
  margin-top: 40px;
  background: #131826;
  opacity: 0.56;
  border-radius: 0px 0px 24px 24px;
  padding-top: 32px;
  padding-bottom: 32px;
  padding-left: 40px;
  padding-right: 40px;
`;

export default function ConnectionModal(props) {
  const collectionMint = useSelector(
    (state) => state.Temp.collectionMintForModal
  );
  let { collectionMint: collectionMintName } = useParams();
  const fromGammeJoin = useSelector((state) => state.Temp.fromGammeJoin);
  const [collectionDetails, setcollectionDetails] = useState("");
  useEffect(() => {
    if (collectionMint && collectionMint !== "") {
      (async function () {
        try {
          const data = await getCreator(collectionMint);
          setcollectionDetails(data);
        } catch (error) {
          console.log(error);
        }
      })();
    }
    return () => {};
  }, [collectionMint, collectionMintName]);

  const [collections, setCollections] = useState([]);

  const fetchMarketplaceData = useCallback(async () => {
    try {
      const resp = await fetch(
        `${baseUrl}/collectionShortInfo/${collectionMintName}`
      );
      let collections = await resp.json();

      setCollections(collections);
    } catch (error) {
      console.log(error);
    }
  }, [collectionMintName]);

  useEffect(() => {
    if (!collectionMintName) return;
    fetchMarketplaceData();
  }, [collectionMintName, fetchMarketplaceData]);

  useEffect(() => {
    if (!props.open) setcollectionDetails("");
  }, [props.open]);

  const [isMobileLink, setIsMobileLink] = useState(false);
  useEffect(() => {
    (async function () {
      const provider = await window.solana;
      setIsMobileLink(!provider && isMobile);
    })();
    return () => {};
  }, []);

  return (
    <Modal
      open={props.open}
      onClose={props.onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      // hideBackdrop= {true}
      // onBackdropClick={props.open}
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          // width: '540px',
          bgcolor: "#1C2438",
          // border: '2px solid #000',
          boxShadow: 24,
          // p: 4,
          borderRadius: "24px",
          width: { xs: "300px", sm: "450px", md: "500px", lg: "540px" },
          overflow: "auto",
          maxHeight: { xs: "90vh", sm: "500px", md: "550px", lg: "650px" },
        }}
        className="focus:outline-none"
      >
        <div className="p-4">
          <div className="flex justify-end">
            <IconButton
              aria-label="close"
              size="medium"
              onClick={props.onClose}
            >
              <CloseIcon sx={{ color: "#6A707F" }} />
            </IconButton>
          </div>

          <div>
            {fromGammeJoin ? (
              <>
                <div className="flex justify-center">
                  {collectionDetails ? (
                    <img
                      src={`${imagePath}${collectionDetails.profilePath}`}
                      onError={handleImageError}
                      className="rounded-xl opacity-25 h-[148px] w-[148px] ml-10 "
                      alt=""
                    />
                  ) : (
                    <Skeleton
                      animation="wave"
                      variant="rectangular"
                      width={148}
                      height={148}
                      className="rounded-2xl"
                    />
                  )}
                  {/* <img src={`${imagePath}${collectionDetails.profilePath}`} className='opacity-25 h-[148px] w-[148px] rounded-2xl' /> */}
                  <div className="relative right-[22px] bottom-[8px]">
                    <img
                      src={polygon}
                      className={`hover:cursor-pointer bg-background mask mask-hexagon-2 mask-repeat object-cover`}
                      alt=""
                    />

                    <img
                      src={wallet_cart}
                      className={`hover:cursor-pointer w-4 h-4 absolute top-[9px] left-[12px]`}
                      alt=""
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-center">
                  <div className="relative ">
                    <img
                      src={polygon}
                      className={`hover:cursor-pointer bg-background mask mask-hexagon-2 mask-repeat object-cover`}
                      alt=""
                    />

                    <img
                      src={wallet_cart}
                      className={`hover:cursor-pointer w-4 h-4 absolute top-[9px] left-[12px]`}
                      alt=""
                    />
                  </div>
                </div>
              </>
            )}

            <div className="mt-10 text-center font-black text-2xl leading-8 text-gray tracking-wide capitalize">
              Connect your Wallet
            </div>

            {fromGammeJoin && (
              <div className="px-0 sm:px-8 md:px-8 lg:px-14 mt-4">
                <p className="text-space-gray font-semibold text-sm leading-6 tracking-wide text-center sm:text-center md:text-left">
                  You must own an NFT from {!collectionDetails && "this"}
                  <Link to={`/games/${collectionDetails.title}`}>
                    <span className="text-lighter-blue uppercase cursor-pointer">
                      {collectionDetails && collectionDetails.title}
                    </span>
                  </Link>{" "}
                  collection to continue
                </p>
              </div>
            )}
            {fromGammeJoin && (
              <div className="mt-7 flex justify-center gap-6">
                {collections.website && (
                  <a
                    href={`${collections.website}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <img src={earth} className="w-[18px] h-[18px] " alt="" />
                  </a>
                )}
                {collections.discord && (
                  <a
                    href={`${collections.discord}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <img src={discord} className="w-[18px] h-[18px] " alt="" />
                  </a>
                )}
                {collections.twitter && (
                  <a
                    href={`${collections.twitter}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <img src={twitter} className="w-[18px] h-[18px] " alt="" />
                  </a>
                )}
                {collections.magiceden && (
                  <a
                    href={`${collections.magiceden}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <img
                      src={megicedan}
                      className="w-[18px] h-[18px] "
                      alt=""
                    />
                  </a>
                )}
                {collections.opensea && (
                  <a
                    href={`${collections.opensea}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <img src={opensea} className="w-[18px] h-[18px] " alt="" />
                  </a>
                )}
              </div>
            )}

            <div className="mt-10 px-0 sm:px-8 md:px-8 lg:px-16">
              {isMobileLink ? (
                // <a href="https://phantom.app/ul/browse/https%3A%2F%2Fsolwin.vercel.app">
                <a href="https://phantom.app/ul/browse/https%3A%2F%2Fsolana-nft-betting.vercel.app%2F">
                  <div className="bg-pickled-bluewood rounded-lg px-3 py-2 flex justify-between cursor-pointer">
                    <div className="flex gap-2">
                      <div>
                        <img src={phantom} alt="" />
                      </div>
                      <div className="flex items-center tracking-wide text-sm leading-6 font-bold capitalize text-gray">
                        Phantom
                      </div>
                    </div>
                    <div className="flex items-center">
                      <button className="bg-light-green uppercase py-0 px-2 rounded-md text-yankees-blue text-xs leading-4 sm:leading-4 md:leading-4 lg:leading-6 xl:leading-6 font-bold">
                        Recommended
                      </button>
                    </div>
                  </div>
                </a>
              ) : (
                <div
                  className="bg-pickled-bluewood rounded-lg px-3 py-2 flex justify-between cursor-pointer"
                  onClick={props.handleClick}
                >
                  <div className="flex gap-2">
                    <div>
                      <img src={phantom} alt="" />
                    </div>
                    <div className="flex items-center tracking-wide text-sm leading-6 font-bold capitalize text-gray">
                      Phantom
                    </div>
                  </div>
                  <div className="flex items-center">
                    <button className="bg-light-green uppercase py-0 px-2 rounded-md text-yankees-blue text-xs leading-4 sm:leading-4 md:leading-4 lg:leading-6 xl:leading-6 font-bold">
                      Recommended
                    </button>
                  </div>
                </div>
              )}

              <div className="mt-4 flex justify-end cursor-pointer gap-2">
                <div className="text-xs tracking-wider text-space-gray font-bold">
                  Show more options
                </div>
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ModalFooter>
          <div className="flow-root justify-between sm:flow-root md:flex lg:flex xl:flex">
            <div className="flex">
              <div className="flex gap-3">
                <div className="text-space-gray tracking-wider text-opacity-60 text-xs font-bold">
                  Secured By
                </div>
                <div className="flex relative">
                  <img src={verify} className="opacity-30" alt="" />
                  <img src={verify} className="relative right-[18px]" alt="" />
                </div>
              </div>
              <div className="text-gray font-black text-sm leading-6 tracking-wider">
                Verify
              </div>
            </div>
            {/* <div className="text-space-gray text-opacity-[0.64] tracking-wider text-xs font-bold flex items-center">
              Legel Report issue
            </div> */}
          </div>
        </ModalFooter>
      </Box>
    </Modal>
  );
}
