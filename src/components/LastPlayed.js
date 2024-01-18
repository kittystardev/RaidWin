import React, { useMemo } from "react";
import { useLocation, useParams, useSearchParams } from "react-router-dom";
import { baseUrl } from "../utils/utils";
import LastPlayedTable from "./LastPlayedTable";

export default function LastPlayed({ collectionMint }) {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  // console.log("collection_last_played", collectionMint);

  let countUrl = useMemo(
    () => `${baseUrl}/lastPlayerCount/${collectionMint}`,
    [collectionMint]
  );
  let url = useMemo(
    () => `${baseUrl}/lastPlayer/${collectionMint}`,
    [collectionMint]
  );
  // let { collectionMint } = useParams();
  // let collectionMint = searchParams.get("collectionId");
  return (
    <>
      <div
        className={`flex justify-between ${
          location.pathname === "/" ? "px-0" : "px-6 sm:px-6 md:px-0 lg:px-0"
        }`}
      >
        <div className="flex items-center text-2xl font-black tracking-wide text-gray">
          Last Played
        </div>
        {/* <button className='px-6 py-3 text-sm font-bold leading-6 tracking-wide rounded-lg bg-nouveau-main bg-opacity-8 hover:bg-opacity-5 text-space-gray'>
                    LeaderBoard
                </button> */}
      </div>
      {/* {collectionMint !== "" && (
        <LastPlayedTable countUrl={countUrl} url={url}></LastPlayedTable>
      )} */}
    </>
  );
}
