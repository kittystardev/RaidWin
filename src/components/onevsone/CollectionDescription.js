import React, { useCallback, useState } from "react";
import verified from "../../assets/images/verified.svg";
import { baseUrl, handleImageError, imagePath } from "../../utils/utils";
import { Link, useParams } from "react-router-dom";
import { useEffect } from "react";
import { Skeleton } from "@mui/material";
import { getCollectionMintByName } from "../../utils/collections";

export default function CollectionDescription() {
  const [collections, setCollections] = useState([]);

  // let collectionMint = searchParams.get("collectionId");
  let { collectionMint: collectionMintName } = useParams();
  let [collectionMint, setCollectionMint] = useState("");
  useEffect(() => {
    getCollectionMintByName(collectionMintName).then((resp) => {
      setCollectionMint(resp);
    });
  }, [collectionMintName]);

  const fetchData = useCallback(async () => {
    try {
      const resp = await fetch(
        `${baseUrl}/collectionByCollectionMint/${collectionMint}`
      );
      let collections = await resp.json();

      setCollections(collections);
    } catch (error) {
      console.log(error);
    }
  }, [collectionMint]);

  useEffect(() => {
    if (collectionMint) fetchData();
  }, [collectionMint, fetchData]);
  return (
    <div className="bg-cloud-burst bg-opacity-[0.72] p-8 rounded-3xl relative z-20">
      <Link to={`/games/${collections.slug || "collections"}`}>
        <div className="flex gap-3 items-center">
          {collections.collectionName ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-space-gray-rgb"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ) : (
            <Skeleton
              variant="circular"
              sx={{ borderRadius: "0.75rem" }}
              animation="wave"
            />
          )}
          {collections.collectionName ? (
            <>
              <div className="text-gray font-black text-xl not-italic tracking-wide">
                {collections.collectionName}
              </div>
              <img src={verified} className="w-5 h-5" alt="" />
            </>
          ) : (
            <Skeleton
              variant="text"
              sx={{ fontSize: "1rem" }}
              width={56}
              animation="wave"
            />
          )}
        </div>
        <div className="mt-4 relative">
          <div className="gap-3 block sm:flex ">

            {collections.collectionName ? (
              <img
                src={`${imagePath}profile400/${collections.profilePath}`}
                onError={handleImageError}
                className="rounded-xl w-16 h-16"
                alt=""
              />
            ) : (
              <Skeleton
                variant="rectangular"
                width={96}
                height={60}
                sx={{ borderRadius: "0.75rem" }}
              />
            )}
            {collections.collectionName ? (
              <div className="text-space-gray tracking-wide font-semibold leading-6 text-sm">
                {collections.desc}
              </div>
            ) : (
              <Skeleton
                variant="rectangular"
                width={300}
                height={60}
                sx={{ borderRadius: "0.75rem" }}
              />
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
