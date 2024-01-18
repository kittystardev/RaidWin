import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCollections1vs1 } from "../store/collectionSlice1vs1";
import { setDataLoaded } from "../store/TempSlice";
import NFTPoolCard1vs1 from "./NFTPoolCard1vs1";
import { Helmet } from "react-helmet";

export default function NFTPoolCardList1vs1() {
  const dispatch = useDispatch();
  const { collections1vs1 } = useSelector((state) => state.collections1vs1);

  useEffect(() => {
    if (collections1vs1.length !== 0) dispatch(setDataLoaded(false));
  }, [collections1vs1]);

  useEffect(() => {
    dispatch(fetchCollections1vs1());
    // setInterval(() => {
    //   dispatch(fetchCollections1vs1());
    // }, 5000);
  }, []);
  // console.log("collections1vs1", collections1vs1);

  return (
    <>
      <Helmet>
        <title>RaidWin</title>
      </Helmet>
      <div
        className={`pt-9 grid  gap-6 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 max-width-responsive mb-12 `}
      >
        {collections1vs1.map((pool, index) => {
          return (
            <NFTPoolCard1vs1
              key={index}
              creators={pool.creators}
              joined={pool.joined}
              collection_mint={pool.collection_mint}
              title={pool.title}
              banner={pool.banner}
              profile={pool.profile}
              content={pool.content}
              floorPrice={pool.floorPrice}
              gamesState={pool.gamesState}
              slug={pool.slug}
              collectionName={pool.collectionName}
            ></NFTPoolCard1vs1>
          );
        })}
      </div>
    </>
  );
}
