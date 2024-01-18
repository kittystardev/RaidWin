import React, { useEffect, useRef, useState } from "react";
import verified from "../assets/images/verified.svg";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  baseUrl,
  getCollectionMint,
  getNumberOfJoined,
  handleImageError,
  imagePath,
} from "../utils/utils";
import { useDispatch, useSelector } from "react-redux";
import solana_icon from "../assets/images/solana_icon.svg";
import { setFloorPrice } from "../store/SolanaPrice";

export default function NFTPoolCard({
  title,
  banner,
  profile,
  content,
  collection_mint,
  creators,
  joined,
  floorPrice,
  gamesState,
  slug,
  collectionName,
}) {
  const location = useLocation();
  const navigate = useNavigate();

  // console.log("gamesStatejhagsfgsfjasvhfj", gamesState)
  // const { floorPice } = useSelector((state) => state.solanaprice);
  // const [floorPice, setFloorPrice] = useState()

  // console.log("slug", slug);

  const dispatch = useDispatch();
  const fetchData = async () => {
    try {
      const resp = await fetch(`${baseUrl}/getCollectionStatsDetails/${slug}`);
      let data = await resp.json();
      const formattedTotalSupply = new Intl.NumberFormat("en-US", {
        maximumFractionDigits: 1,
        notation: "compact",
        compactDisplay: "short",
      }).format(data.totalSupply);
      data.formattedTotalSupply = formattedTotalSupply;
      dispatch(setFloorPrice(data.floorPrice));
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    if (!slug) return;
    fetchData();
  }, [slug]);

  // console.log("title", title);

  const PlayGame = async () => {
    try {
      const resp = await fetch(
        `${baseUrl}/gameState/${getCollectionMint(gamesState, false)}/2/false`
      );
      const obj = await resp.json();
      if (obj.msg === "created") {
        navigate(`/winnertakesall/${slug}?gameId=${obj.data.account}`);
      } else if (obj.msg === "creating") {
        this();
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className="bg-yankees-blue hover:bg-rhino rounded-3xl">
        <div className="justify-center items-center  h-[120px] rounded-t-3xl overflow-hidden cursor-pointer">
          {location.pathname === "/games" ? (
            <Link to={`../games/${slug}`}>
              <img
                src={banner}
                onError={handleImageError}
                className="rounded-t-3xl min-w-[100%] max-w-[100%] h-auto min-h-[120px] bg-no-repeat bg-contain"
              />
            </Link>
          ) : (
            <img
              src={banner}
              onError={handleImageError}
              className="rounded-t-3xl min-w-[100%] max-w-[100%] h-auto min-h-[120px] bg-no-repeat bg-contain image-hover"
              onClick={() => PlayGame()}
            />
          )}
        </div>
        {location.pathname === "/games" ? (
          <div className="relative cursor-pointer">
            <Link to={`../games/${slug}`}>
              <img
                src={profile}
                onError={handleImageError}
                className="min-w-[80px] h-[80px] rounded-xl border-[3px] border-yankees-blue absolute -bottom-[35px] left-[32px] "
              />
            </Link>
          </div>
        ) : (
          <div className="relative cursor-pointer">
            <img
              src={profile}
              onError={handleImageError}
              className="min-w-[80px] h-[80px] rounded-xl border-[3px] border-yankees-blue absolute -bottom-[35px] left-[32px] "
              onClick={() => PlayGame()}
            />
          </div>
        )}

        <div className="p-8 cursor-pointer">
          {location.pathname === "/games" ? (
            <Link to={`../games/${slug}`}>
              <div className="flex items-center gap-2 mt-8">
                <div>
                  <div className="flex flex-row items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5 text-space-gray-rgb"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <div className="text-gray font-black text-xl not-italic tracking-wide cursor-pointer overflow-ellipsis max-w-[200px] sm:max-w-[100%] md:max-w-[100%] lg:max-w-[150px] xl:max-w-full">
                      {collectionName}
                    </div>
                    <img src={verified} className="w-5 h-5" />
                  </div>
                  <div className="flex flex-row items-center gap-1 mt-2 text-gray">
                    <span className="mx-1 font-normal">Floor</span>
                    <img src={solana_icon} className="w-4 h-4"></img>
                    {floorPrice?.toFixed(2)}
                  </div>
                </div>
              </div>
            </Link>
          ) : (
            <div className="relative mt-4" onClick={() => PlayGame()}>
              <div className="flex items-center gap-2 mt-8">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 text-space-gray-rgb"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <div className="text-gray font-black text-xl not-italic tracking-wide cursor-pointer overflow-ellipsis max-w-[200px] sm:max-w-[100%] md:max-w-[100%] ">
                  {collectionName}
                </div>
                <img src={verified} className="w-5 h-5" />
              </div>

              <div className="bottom-0 mt-10">
                <div className="flex justify-between">
                  <div className="flex gap-2">
                    <div className="text-sm font-bold leading-8 tracking-wide">
                      <span className="text-light-green">
                        {getNumberOfJoined(gamesState, false)}
                      </span>
                      <span className="text-nouveau-main">/6</span>
                    </div>
                    <div className="flex text-sm leading-8 tracking-wide text-light-gray">
                      Players
                    </div>
                  </div>

                  <div>
                    <button
                      className="px-8 py-3 text-sm font-bold leading-6 uppercase rounded-lg bg-light-green hover:bg-hover-light-green text-yankees-blue"
                      onClick={() => PlayGame()}
                    >
                      Play
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
