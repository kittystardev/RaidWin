import { Box, IconButton, Modal, Skeleton } from "@mui/material";
import React, { useEffect, useState } from "react";
import polygon_red from "../../assets/images/polygon_red.svg";
import earth from "../../assets/images/earth.svg";
import verify from "../../assets/images/verify.svg";
import discord from "../../assets/images/discord.svg";
import twitter from "../../assets/images/twitter.svg";
import opensea from "../../assets/images/opensea.svg";
import megicedan from "../../assets/images/megicedan.svg";
import CloseIcon from "@mui/icons-material/Close";
import styled from "styled-components";
import {
  baseUrl,
  getCreator,
  handleImageError,
  imagePath,
} from "../../utils/utils";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { useCallback } from "react";

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

export default function BuyNFTModal({ open, onClose }) {
  const [collectionDetails, setCollectionDetails] = useState("");
  const { collectionMint: collectionMintName } = useParams();
  const collectionMint = useSelector(
    (state) => state.Temp.collectionMintForModal
  );

  useEffect(() => {
    if (collectionMint) {
      (async function fetchCreator() {
        try {
          const data = await getCreator(collectionMint);
          setCollectionDetails(data);
        } catch (error) {
          console.error(error);
        }
      })();
    }
  }, [collectionMint, collectionMintName]);

  useEffect(() => {
    if (!open) setCollectionDetails("");
  }, [open]);

  const fetchMarketplaceData = useCallback(async () => {
    if (!collectionMintName) return;
    try {
      const resp = await fetch(
        `${baseUrl}/collectionShortInfo/${collectionMintName}`
      );
      await resp.json();
      // Handle the collections data as needed
    } catch (error) {
      console.error(error);
    }
  }, [collectionMintName]);

  useEffect(() => {
    fetchMarketplaceData();
  }, [collectionMintName, fetchMarketplaceData]);

  return (
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
          width: { xs: "300px", sm: "450px", md: "540px", lg: "540px" },
          overflow: "auto",
          maxHeight: { xs: "90vh", sm: "500px", md: "750px", lg: "750px" },
        }}
        className="focus:outline-none"
      >
        <div className="p-4">
          <div className="flex justify-end">
            <IconButton aria-label="close" size="medium" onClick={onClose}>
              <CloseIcon sx={{ color: "#6A707F" }} />
            </IconButton>
          </div>

          <div>
            {/* NFT not found */}
            <div className="flex justify-center">
              {collectionDetails ? (
                <img
                  src={`${imagePath}profile400/${collectionDetails.profilePath}`}
                  onError={handleImageError}
                  className=" rounded-2xl opacity-25 h-[148px] w-[148px] ml-10 "
                  alt=""
                />
              ) : (
                <Skeleton
                  variant="rectangular"
                  width={148}
                  height={148}
                  className="rounded-2xl"
                />
              )}

              <div className="relative right-[22px] bottom-[8px]">
                <img
                  src={polygon_red}
                  className={`hover:cursor-pointer backdrop-blur-sm mask mask-hexagon-2 mask-repeat object-cover`}
                  alt=""
                />

                <CloseIcon
                  className={`hover:cursor-pointer text-red absolute top-[7px] left-[9px]`}
                />
              </div>
            </div>
            <div className="mt-10 text-2xl font-black leading-8 tracking-wide text-center capitalize text-gray">
              NFT Not Detected
            </div>

            {/* NFT not found */}
            <div className="px-0 mt-4 sm:px-8 md:px-8 lg:px-14">
              <p className="text-sm font-semibold leading-6 tracking-wide text-center text-space-gray sm:text-center md:text-left">
                You must own an NFT from {!collectionDetails && "this"}
                <Link to={`/games/${collectionDetails.title}`}>
                  <span className="uppercase cursor-pointer text-lighter-blue">
                    {collectionDetails && collectionDetails.title}
                  </span>
                </Link>{" "}
                collection to continue
              </p>
            </div>
            {/* NFT not found */}

            <div className="flex justify-center gap-6 mt-7">
              {collectionDetails.website && (
                <a
                  href={`${collectionDetails.website}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <img src={earth} className="w-[18px] h-[18px] " alt="" />
                </a>
              )}
              {collectionDetails.discord && (
                <a
                  href={`${collectionDetails.discord}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <img src={discord} className="w-[18px] h-[18px] " alt="" />
                </a>
              )}
              {collectionDetails.twitter && (
                <a
                  href={`${collectionDetails.twitter}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <img src={twitter} className="w-[18px] h-[18px] " alt="" />
                </a>
              )}
              {collectionDetails.magiceden && (
                <a
                  href={`${collectionDetails.magiceden}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <img src={megicedan} className="w-[18px] h-[18px] " alt="" />
                </a>
              )}
              {collectionDetails.opensea && (
                <a
                  href={`${collectionDetails.opensea}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <img src={opensea} className="w-[18px] h-[18px] " alt="" />
                </a>
              )}
            </div>

            <div className="flex justify-center gap-4 px-0 mt-10 sm:px-8 md:px-8 lg:px-16">
              <button
                className="px-5 py-2 text-sm font-bold leading-6 tracking-wider capitalize bg-opacity-25 rounded-lg bg-nouveau-main text-space-gray"
                onClick={onClose}
              >
                Cancel
              </button>
              <a
                href={`${collectionDetails.magiceden}`}
                target="_blank"
                rel="noreferrer"
              >
                <button className="px-5 py-2 text-sm font-bold leading-6 tracking-wider capitalize rounded-lg bg-light-green text-yankees-blue hover:bg-hover-light-green">
                  Buy One
                </button>
              </a>
            </div>
          </div>
        </div>
        <ModalFooter>
          <div className="justify-between flow-root sm:flow-root md:flex lg:flex xl:flex">
            <div className="flex">
              <div className="flex gap-3">
                <div className="text-xs font-bold tracking-wider text-space-gray text-opacity-60">
                  Secured By
                </div>
                <div className="relative flex">
                  <img src={verify} className="opacity-30" alt="" />
                  <img src={verify} className="relative right-[18px]" alt="" />
                </div>
              </div>
              <div className="text-sm font-black leading-6 tracking-wider text-gray">
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
