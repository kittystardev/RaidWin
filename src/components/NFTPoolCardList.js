import React, { useEffect, useMemo } from "react";
import NFTPoolCard from "./NFTPoolCard";
import { useDispatch, useSelector } from "react-redux";
import { fetchCollections } from "../store/collectionSlice";
import { useLocation } from "react-router-dom";
import { setDataLoaded } from "../store/TempSlice";
import { Helmet } from "react-helmet";
import { Fragment } from "react";

export default function NFTPoolCardList() {
  const location = useLocation();
  const dispatch = useDispatch();
  const { collections } = useSelector((state) => state.collections);
  // console.log("collections", collections)

  useEffect(() => {
    if (collections.length !== 0) dispatch(setDataLoaded(false));
  }, [collections]);

  useEffect(() => {
    dispatch(fetchCollections());
    let interval = setInterval(() => {
      dispatch(fetchCollections());
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div
      className={`pt-9 grid  gap-6 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 max-width-responsive mb-12 `}
    >
      {collections.map((pool, index) => {
        return (
          <Fragment key={index}>
            <Helmet>
              <title>RaidWin</title>
            </Helmet>
            <NFTPoolCard
              creators={pool.creators}
              joined={pool.joined}
              collection_mint={pool.collection_mint}
              title={pool.title}
              banner={pool.banner}
              profile={pool.profile}
              content={pool.content}
              gamesState={pool.gamesState}
              slug={pool.slug}
              collectionName={pool.collectionName}
            ></NFTPoolCard>
          </Fragment>
        );
      })}
    </div>
  );
}
