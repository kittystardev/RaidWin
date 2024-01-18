import React, { useEffect, useState } from "react";
import verified from "../assets/images/verified.svg";
import earth from "../assets/images/earth.svg";
import discord from "../assets/images/discord.svg";
import twitter from "../assets/images/twitter.svg";
import share from "../assets/images/share.svg";
import megicedan from "../assets/images/megicedan.svg";
import opensea from "../assets/images/opensea.svg";
import decentraland_seq from "../assets/images/decentraland_seq.svg";
import decentraland_rec from "../assets/images/decentraland_rec.svg";
import { useLocation, useParams, useSearchParams } from "react-router-dom";
import {
  baseUrl,
  getCollectionMint,
  handleImageError,
  imagePath,
} from "../utils/utils";
import { Skeleton } from "@mui/material";
import VerifiedSection from "./Common/VerifiedSection";
import {
  ArrowDownIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/outline";
import PageNotFound from "./Common/PageNotFound";
import { Vortex } from "react-loader-spinner";
import Lottie from "lottie-react";
import animation_optimized from "../json/animation_optimized.json";
import { getCollectionMintByName } from "../utils/collections";
import GameInfo from "./GameInfo";
import Games from "./Games";
import LastPlayed from "./LastPlayed";
import { useDispatch, useSelector } from "react-redux";
import { fetchCollections } from "../store/collectionSlice";
import LastPlayedCollection from "./LastPlayedCollection";
import { Share } from "@mui/icons-material";
import ShareOption from "./ShareOption";
import { Menu } from "@headlessui/react";
import MetaDetails from "../MetaDetails";
import { Helmet } from "react-helmet";

const collectionMetaImages = {
  madlads: "https://wnrs.tools/0kKb0Tv_1689160981954.png",
  degods: "https://wnrs.tools/degods%20banner_1686842701241_1689161379635.png",
};

export default function CollectionDetails({ setLoading }) {
  const [isLoading, setIsLoading] = useState(true);
  const [pageNotFound, setPageNotFound] = useState(false);
  const [searchParams] = useSearchParams();
  let { slug: collectionMintName } = useParams();
  let [collectionMint, setCollectionMint] = useState("");

  const location = useLocation();
  // console.log("location", location);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCollections());
  }, []);

  useEffect(() => {
    getCollectionMintByName(collectionMintName).then((resp) => {
      setCollectionMint(resp);
    });
  }, [collectionMintName]);

  // console.log("collectionMintName", collectionMintName);

  const [readMoreShown, setReadMoreShown] = useState(false);

  const [collections, setCollections] = useState([]);

  const fetchData = async () => {
    // if (!collectionMint || collectionMint === "") {
    //   setPageNotFound(true);
    //   setIsLoading(false);
    //   return;
    // }
    try {
      // console.log("collection_name", collectionMint);
      if (collectionMint === "") return;
      const resp = await fetch(
        `${baseUrl}/collectionShortInfo/${collectionMintName}`
      );
      let collections = await resp.json();
      if (collections.msg) {
        setPageNotFound(true);
        setIsLoading(false);
        return;
      }
      if (pageNotFound) setPageNotFound(false);
      setCollections(collections);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      if (collectionMint === "") return;
      setPageNotFound(true);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!collectionMintName || !collectionMint) return;
    fetchData();
  }, [collectionMintName, collectionMint]);

  const readMoreButton = () => {
    setReadMoreShown((prevState) => !prevState);
  };
  const imageUrl = `${imagePath}${collections.bannerPath}`;
  // console.log("collection gameState", collections);

  // const metaImageUrl =
  //   collectionMetaImages[collectionMintName] ||
  //   "https://wnrs.tools/poster_1689161835221.png";

  return (
    <>
      <Helmet>
        <title>{collections.title}</title>
        <meta property="og:title" content={collections.title} />
        <meta property="og:description" content={collections.desc} />
      </Helmet>
      {pageNotFound ? (
        <PageNotFound />
      ) : (
        <>
          {isLoading && (
            <div className="fixed inset-0 flex w-screen h-screen justify-center items-center bg-background bg-opacity-90 z-[80] ">
              <Lottie
                animationData={animation_optimized}
                loop={true}
                className="flex items-center justify-center w-full lg:w-1/3 h-screen mx-auto"
              />
            </div>
          )}
          {/* <VerifiedSection /> */}
          {/* <Helmet>
            <meta property="og:image" content={metaImageUrl} />
          </Helmet> */}
          <div>
            <div className="">
              {collectionMint ? (
                <>
                  {collections.title ? (
                    <>
                      <img
                        src={imageUrl}
                        onError={handleImageError}
                        className="w-[1280px] h-[200px] rounded-none sm:rounded-none md:rounded-3xl object-cover"
                      />
                    </>
                  ) : (
                    <>
                      <Skeleton
                        variant="rectangular"
                        width={1280}
                        height={200}
                        sx={{ borderRadius: "1.5rem" }}
                      />
                    </>
                  )}
                </>
              ) : (
                <>
                  {/* <img
                    src={decentraland_rec}
                    className="w-[1280px] h-[200px] rounded-none sm:rounded-none md:rounded-3xl object-cover"
                  /> */}
                </>
              )}
            </div>
            <div>
              <div className="relative">
                {collectionMint ? (
                  <>
                    {collections.title ? (
                      <>
                        <img
                          src={`${imagePath}profile400/${collections.profilePath}`}
                          onError={handleImageError}
                          className="absolute -bottom-[22px] left-[32px] rounded-3xl w-[128px] h-[128px] border-[3px] border-background"
                        />
                      </>
                    ) : (
                      <>
                        <Skeleton
                          variant="rectangular"
                          width={128}
                          height={128}
                          sx={{ borderRadius: "1.5rem" }}
                          className="absolute -bottom-[22px] left-[32px] "
                        />
                      </>
                    )}
                  </>
                ) : (
                  <>
                    {/* <img
                      src={decentraland_seq}
                      className=" absolute -bottom-[22px] left-[32px]"
                    /> */}
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="px-6 mt-8 mb-8 sm:px-6 md:px-0 lg:px-0">
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <div className="text-2xl font-black tracking-wide text-gray">
                  {collectionMint ? <>{collections.collectionName}</> : ""}
                </div>
                <img src={verified} />
              </div>
              <div className="hidden gap-6 sm:flex md:flex">
                {collections.website && (
                  <a href={`${collections.website}`} target="_blank">
                    <img src={earth} className="w-[18px] h-[18px] " />
                  </a>
                )}
                {collections.discord && (
                  <a href={`${collections.discord}`} target="_blank">
                    <img src={discord} className="w-[18px] h-[18px] " />
                  </a>
                )}
                {collections.twitter && (
                  <a href={`${collections.twitter}`} target="_blank">
                    <img src={twitter} className="w-[18px] h-[18px] " />
                  </a>
                )}
                {collections.magiceden && (
                  <a href={`${collections.magiceden}`} target="_blank">
                    <img src={megicedan} className="w-[18px] h-[18px] " />
                  </a>
                )}
                {collections.opensea && (
                  <a href={`${collections.opensea}`} target="_blank">
                    <img src={opensea} className="w-[18px] h-[18px] " />
                  </a>
                )}
                {/* <img src={share} className="w-[18px] h-[18px] " /> */}
                <Menu as="div" className="relative inline-block text-left">
                  <div>
                    <Menu.Button className=" cursor-pointer">
                      <img src={share} className="w-[18px] h-[18px] " />
                    </Menu.Button>
                  </div>
                  <ShareOption></ShareOption>
                </Menu>
              </div>
            </div>
            <div className="mt-2">
              <div>
                <p className="w-full sm:w-full md:w-[45%] font-semibold text-sm leading-6 text-space-gray">
                  {collectionMint ? (
                    <>
                      {readMoreShown ? (
                        <span className="w-full">{collections.desc} </span>
                      ) : (
                        <span className="w-full hyphens">
                          {collections.desc?.substring(0, 55)}
                          {"... "}
                        </span>
                      )}

                      <span
                        onClick={readMoreButton}
                        className="inline-flex items-center"
                      >
                        {readMoreShown ? (
                          <>
                            <span className="font-bold cursor-pointer text-chat-tag">
                              Less
                            </span>
                            <span className="ml-2 ">
                              {" "}
                              <ChevronUpIcon className="w-5 h-5" />{" "}
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="font-bold cursor-pointer text-chat-tag">
                              More
                            </span>
                            <span className="ml-2 ">
                              {" "}
                              <ChevronDownIcon className="w-5 h-5" />{" "}
                            </span>
                          </>
                        )}
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="w-full">
                        Decentraland is an Ethereum blockchain-powered virtual
                        world, developed and owned by its users, who can ...{" "}
                        {"   "}
                      </span>
                      <span
                        onClick={readMoreButton}
                        className="inline-flex items-center"
                      >
                        <span className="font-bold cursor-pointer text-chat-tag">
                          More
                        </span>
                        <span className="ml-2 ">
                          {" "}
                          <ChevronDownIcon className="w-5 h-5" />{" "}
                        </span>
                      </span>
                    </>
                  )}
                </p>
              </div>
            </div>
            <div className="mt-8">
              <div className="flex gap-6 sm:hidden md:hidden">
                {collections.website && (
                  <a href={`${collections.website}`} target="_blank">
                    <img src={earth} className="w-[18px] h-[18px] " />
                  </a>
                )}
                {collections.discord && (
                  <a href={`${collections.discord}`} target="_blank">
                    <img src={discord} className="w-[18px] h-[18px] " />
                  </a>
                )}
                {collections.twitter && (
                  <a href={`${collections.twitter}`} target="_blank">
                    <img src={twitter} className="w-[18px] h-[18px] " />
                  </a>
                )}
                {collections.magiceden && (
                  <a href={`${collections.magiceden}`} target="_blank">
                    <img src={megicedan} className="w-[18px] h-[18px] " />
                  </a>
                )}
                {collections.opensea && (
                  <a href={`${collections.opensea}`} target="_blank">
                    <img src={opensea} className="w-[18px] h-[18px] " />
                  </a>
                )}
                <Menu as="div" className="relative inline-block text-left">
                  <div>
                    <Menu.Button className=" cursor-pointer">
                      <img src={share} className="w-[18px] h-[18px] " />
                    </Menu.Button>
                  </div>
                  <ShareOption></ShareOption>
                </Menu>
              </div>
            </div>
          </div>

          <GameInfo collectionMint={collectionMintName} />
          <Games collectionMint={collectionMint} gameState={collections} setLoading={setLoading} />
          <LastPlayed collectionMint={collectionMintName} />
          <LastPlayedCollection
            collectionMint={collectionMintName}
            gameState={collections}
          />
        </>
      )}
    </>
  );
}
