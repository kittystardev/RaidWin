import React, { useEffect } from "react";
import NFTPoolCard from "./NFTPoolCard";
import { useDispatch, useSelector } from "react-redux";
import { fetchCollections } from "../store/collectionSlice";
import { useLocation } from "react-router-dom";
import { Helmet } from "react-helmet";

export default function CollectionCardList() {
  const location = useLocation();
  const dispatch = useDispatch();
  const { collections } = useSelector((state) => state.collections);

  useEffect(() => {
    dispatch(fetchCollections());
    let interval = setInterval(() => {
      dispatch(fetchCollections());
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);
  // console.log("sortedCollection", collections);
  return (
    <>
      <Helmet>
        <title>RaidWin</title>
      </Helmet>
      <div
        className={`pt-9 grid gap-6 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-3 max-width-responsive `}
      >
        {collections.map((pool, index) => {
          return (
            <NFTPoolCard
              creators={pool.creators}
              joined={pool.joined}
              key={index}
              collection_mint={pool.collection_mint}
              title={pool.title}
              banner={pool.banner}
              profile={pool.profile}
              content={pool.content}
              floorPrice={pool.floorPrice}
              gamesState={pool.gamesState}
              slug={pool.slug}
              collectionName={pool.collectionName}
            ></NFTPoolCard>
          );
        })}
      </div>
    </>
  );
}
