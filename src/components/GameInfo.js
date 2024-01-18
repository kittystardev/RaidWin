import React from "react";
import wave from "../assets/images/wave.svg";
import item_stack from "../assets/images/item_stack.svg";
import owner from "../assets/images/owner.svg";
import pacman from "../assets/images/pacman.svg";
import { useParams, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import { baseUrl } from "../utils/utils";
import { setFloorPrice } from "../store/SolanaPrice";
import { useDispatch } from "react-redux";

export default function GameInfo({ collectionMint }) {
  const [searchParams] = useSearchParams();

  // console.log("collectionMint", collectionMint)

  // console.log("searchParams", searchParams)

  // console.log("collectionMint",collectionMint)
  // let { collectionMint } = useParams();
  // let collectionMint = searchParams.get("collectionId");
  // console.log("collection_game_infor", collectionMint);

  const [stateDetails, setStateDetails] = useState([]);
  const dispatch = useDispatch();
  const fetchData = async () => {
    try {
      const resp = await fetch(
        `${baseUrl}/getCollectionStatsDetails/${collectionMint}`
      );
      let data = await resp.json();
      const formattedTotalSupply = new Intl.NumberFormat("en-US", {
        maximumFractionDigits: 1,
        notation: "compact",
        compactDisplay: "short",
      }).format(data.totalSupply);
      data.formattedTotalSupply = formattedTotalSupply;
      setStateDetails(data);
      dispatch(setFloorPrice(data.floorPrice));
      // console.log("dadfdfda", data)
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    if (collectionMint) fetchData();
  }, [collectionMint]);

  return (
    <div className="px-6 my-9 sm:px-6 md:px-0 lg:px-0">
      <div className="grid gap-4 overflow-auto grid-template">
        <div className="bg-yankees-blue bg-opacity-[0.56] rounded-3xl py-6 px-9 text-center">
          <div className="font-extrabold text-4xl leading-[48px] tracking-wide text-gray font-feature">
            {stateDetails.floorPrice && stateDetails.floorPrice?.toFixed(2)} SOL
          </div>
          <div className="flex justify-center gap-2 mt-1">
            <div className="flex items-center">
              <img src={wave} className="w-5 h-4" />
            </div>
            <div className="text-sm font-semibold leading-6 tracking-wide text-space-gray">
              Floor Price
            </div>
          </div>
        </div>
        <div className="bg-yankees-blue bg-opacity-[0.56] rounded-3xl py-6 px-9 text-center">
          <div className="font-extrabold text-4xl leading-[48px] tracking-wide text-gray font-feature ">
            {stateDetails.formattedTotalSupply}
          </div>
          <div className="flex justify-center gap-2 mt-1">
            <div className="flex items-center">
              <img src={item_stack} className="w-5 h-4" />
            </div>
            <div className="text-sm font-semibold leading-6 tracking-wide text-space-gray">
              Items
            </div>
          </div>
        </div>
        <div className="bg-yankees-blue bg-opacity-[0.56] rounded-3xl py-6 px-9 text-center">
          <div className="font-extrabold text-4xl leading-[48px] tracking-wide text-gray font-feature ">
            {stateDetails.numOwners}
          </div>
          <div className="flex justify-center gap-2 mt-1">
            <div className="flex items-center">
              <img src={owner} className="w-5 h-4" />
            </div>
            <div className="text-sm font-semibold leading-6 tracking-wide text-space-gray">
              Owners
            </div>
          </div>
        </div>
        <div className="bg-yankees-blue bg-opacity-[0.56] rounded-3xl py-6 px-9 text-center">
          <div className="font-extrabold text-4xl leading-[48px] tracking-wide text-gray font-feature ">
            {stateDetails &&
              stateDetails.numbOfGame &&
              stateDetails?.numbOfGame - 2}
          </div>
          <div className="flex justify-center gap-2 mt-1">
            <div className="flex items-center">
              <img src={pacman} className="w-5 h-4" />
            </div>
            <div className="text-sm font-semibold leading-6 tracking-wide text-space-gray">
              Games Played
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
