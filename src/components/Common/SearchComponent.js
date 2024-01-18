import React from "react";
import verified from "../../assets/images/verified.svg";
import solana_icon from "../../assets/images/solana_icon.svg";
import { ChevronLeftIcon } from "@heroicons/react/outline";
import { handleImageError, imagePath, replaceSlug } from "../../utils/utils";
import { Link } from "react-router-dom";

export default function SearchComponent({
  onClose,
  searchResult,
  Search,
  _collection,
}) {
  // console.log("SearchComponent", _collection);
  return (
    <>
      <div className="w-full max-h-[50vh] overflow-auto">
        <div className="block sm:block md:block lg:hidden">
          <div className="p-3">
            <ChevronLeftIcon
              className="h-8 w-8 text-gray opacity-75"
              onClick={onClose}
            />
          </div>
          <div className="relative mt-4 sm:mt-4 md:mt-0 lg:mt-0 xl:mt-0 2xl:mt-0">
            <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
              <svg
                className="w-5 h-5 text-space-gray dark:text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
            </div>

            <input
              type="search"
              id="default-search"
              className="block p-2.5 pl-10 w-full text-sm text-space-gray bg-yankees-blue bg-opacity-[0.88]  border-b border-white focus:ring-yankees-blue focus:outline-none focus:ring "
              autoComplete="off"
              placeholder="Search by name ..."
              onChange={(e) => Search(e.target.value)}
            />
          </div>
        </div>

        {_collection &&
        searchResult.collections &&
        searchResult.collections.length > 0 ? (
          <div className="text-space-gray uppercase font-bold text-xs text-opacity-80 tracking-wider px-6 pt-6 pb-6">
            Collections
          </div>
        ) : (
          <></>
        )}

        {_collection ? (
          <>
            {searchResult.collections &&
              searchResult.collections.length > 0 &&
              searchResult.collections.map((result, index) => {
                return (
                  <Link to={`../games/${result.slug}`}>
                    <div className="pb-6" key={index}>
                      <div className="flex justify-between hover-search hover:bg-mirage  cursor-pointer pb-3">
                        <div className="px-6 flex gap-4 mt-3">
                          <img
                            src={`${imagePath}profile400/${result.profilePath}`}
                            onError={handleImageError}
                            className="w-12 h-12 rounded-xl bg-yankees-blue"
                            alt=""
                          />
                          <div>
                            <div className="flex gap-2">
                              <div className="text-base font-bold text-gray overflow-ellipsis max-w-[100px] sm:max-w-[100%] md:max-w-[100%] ">
                                {result.title}
                              </div>
                              <img src={verified} className="w-5 h-5" alt="" />
                            </div>

                            <div className="flex gap-2 mt-2 items-center">
                              <img
                                src={solana_icon}
                                className="w-4 h-4 grayscale opacity-60"
                                alt=""
                              />
                              <div className="text-sm leading-6 font-semibold text-space-gray">
                                {result.supply} items
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center font-semibold text-sm  leading-6 text-space-gray tracking-wide px-6">
                          {result.floorPrice.toFixed(2)} SOL
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
          </>
        ) : (
          <></>
        )}

        {searchResult.players && searchResult.players.length > 0 && (
          <div className="mt-5 text-space-gray uppercase font-bold text-xs text-opacity-80 tracking-wider px-6 pb-6">
            USERS
          </div>
        )}
        {searchResult.players &&
          searchResult.players.length > 0 &&
          searchResult.players.map((result, index) => {
            return (
              <Link
                to={`../${replaceSlug(result.userName) || result._id}`}
                state={{
                  pubKey: result._id,
                }}
              >
                <div className="pb-6" key={index}>
                  <div className="flex justify-between hover-search hover:bg-mirage  cursor-pointer pb-3">
                    <div className="px-6 flex gap-4 mt-3">
                      {result.profileImage ? (
                        <img
                          src={`${imagePath}profile48/${result.profileImage}`}
                          className="w-12 h-12 rounded-xl bg-yankees-blue"
                          alt=""
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-chat-bg bg-opacity-95 object-cover"></div>
                      )}
                      <div className="items-center flex">
                        <div className="flex gap-2">
                          <div className="text-base  font-bold text-gray overflow-ellipsis max-w-[100px] sm:max-w-[100%] md:max-w-[100%]">
                            {result.userName}
                          </div>
                          <img src={verified} className="w-5 h-5" alt="" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
      </div>
    </>
  );
}
