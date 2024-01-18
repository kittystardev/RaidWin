import { Dialog, Slide, useMediaQuery } from "@mui/material";
import React, { Fragment, useState } from "react";
import { useLocation } from "react-router-dom";
import "tippy.js/dist/tippy.css";
import Tippy from "@tippyjs/react";
import SearchComponent from "./SearchComponent";
import { useEffect } from "react";
import { baseUrl } from "../../utils/utils";
import { useDispatch } from "react-redux";
import { setSortingId } from "../../store/collectionSlice";

import { CheckIcon, ChevronDownIcon } from "@heroicons/react/outline";
import { Listbox } from "@headlessui/react";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function DropdownSearch({
  _mostpopuler = false,
  _collection = true,
  _byUsername = false,
  setLoading,
}) {
  // console.log("DropdownSearch", _mostpopuler);

  const [searchValue, setSearchValue] = useState("");
  const [open, setOpen] = useState(false);
  const [searchResult, setSearchResult] = useState({
    collections: [],
    players: [],
  });

  const OpenSearchBar = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const desktopView = useMediaQuery("(max-width:1024px)");
  useEffect(() => {
    if (!desktopView) {
      setOpen(false);
    }
  }, [desktopView]);

  const Search = async (key) => {
    if (key === null || key === "") {
      console.log("key_val", key);
      setSearchResult({
        collections: [],
        players: [],
      });
      return;
    } else {
      try {
        const resp = await fetch(`${baseUrl}/searchQuery/${key}`);
        let data = await resp.json();

        if (!data.collections) data.collections = [];
        if (!data.players) data.players = [];

        setSearchResult(data);
      } catch (err) {
        setSearchResult({
          collections: [],
          players: [],
        });
        console.log(err);
      }
    }
  };
  const location = useLocation();

  const dispatch = useDispatch();
  const sortByza = () => {
    setLoading(true);
    dispatch(setSortingId(4));
    setLoading(false);
  };
  const sortByaz = () => {
    setLoading(true);
    dispatch(setSortingId(3));
    setLoading(false);
  };

  const sortByprice = (type) => {
    console.log("sortedCollection", type);
    setLoading(true);
    if (type === 0) {
      dispatch(setSortingId(2)); // Sorting high to low
    } else {
      dispatch(setSortingId(1)); // sorting low to high
    }
    setLoading(false);
  };

  const sorting = [
    { name: "Most Popular", sort: "", index: "" },
    { name: "By Price: High To Low", sort: sortByprice, index: 0 },
    { name: "By Price: Low To High", sort: sortByprice, index: 1 },
    { name: "By name A-Z", sort: sortByaz, index: "" },
    { name: "By name Z-A", sort: sortByza, index: "" },
  ];

  const [selected, setSelected] = useState(sorting[0]);
  return (
    <div className="block gap-6 sm:block md:flex ">
      {location.pathname !== "/" && _mostpopuler ? (
        <div className="justify-between text-gray hidden sm:hidden md:flex lg:flex xl:flex 2xl:flex">
          <Listbox value={selected} onChange={setSelected}>
            <div className="relative mt-1 z-20">
              <Listbox.Button className="relative w-[250px] cursor-default font-medium  bg-background py-2 pl-3 pr-10 text-left shadow-md text-space-gray border rounded-lg p-4 border-nouveau hover:text-light-graysm:text-sm">
                <span className="block truncate">{selected.name}</span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronDownIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </span>
              </Listbox.Button>

              <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-background py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {sorting.map((person, personIdx) => (
                  <Listbox.Option
                    key={personIdx}
                    className={({ active }) =>
                      `relative select-none py-2 pl-10 pr-4 cursor-pointer hover:bg-light-gray ${
                        active ? "" : "text-gray"
                      }`
                    }
                    value={person}
                  >
                    {({ selected }) => (
                      <>
                        <span
                          className={`block truncate ${
                            selected ? "font-medium " : "font-normal"
                          }`}
                          onClick={() => {
                            if (typeof person.sort === "function") {
                              person.sort(person.index);
                            }
                          }}
                        >
                          {person.name}
                        </span>
                        {selected ? (
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </div>
          </Listbox>
        </div>
      ) : (
        <></>
      )}

      <div className="text-gray">
        <div className="hidden sm:hidden md:hidden lg:block">
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
            <Tippy
              content={
                searchValue === "" ? (
                  ""
                ) : (
                  <SearchComponent
                    onClose={handleClose}
                    searchResult={searchResult}
                    _collection={_collection}
                    Search={Search}
                  ></SearchComponent>
                )
              }
              trigger={"click"}
              arrow={false}
              placement={"bottom"}
              allowHTML={true}
              interactive={true}
              offset={[0, 0]}
              className="auto-complete min-w-[100%] sm:min-w-[256px] md:min-w-[100%] lg:min-w-[500px]"
            >
              <input
                type="search"
                id="default-search"
                className="block p-2.5 pl-10 w-full sm:w-64 md:w-[100%] lg:min-w-[500px] text-sm text-space-gray bg-background border-b border-nouveau focus:ring-background focus:outline-none focus:ring "
                autoComplete="off"
                // placeholder="Search by name ... "
                placeholder={
                  !_byUsername
                    ? "Search by name ... "
                    : "Search people by username ..."
                }
                onChange={(e) => {
                  setSearchValue(e.target.value);
                  Search(e.target.value);
                }}
              />
            </Tippy>
          </div>
        </div>

        <div className="block sm:block md:block lg:hidden">
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
              className="block p-2.5 pl-10 w-full sm:w-64 md:w-[100%] lg:min-w-[500px] text-sm text-space-gray bg-background border-b border-nouveau focus:ring-background focus:outline-none focus:ring "
              autoComplete="off"
              placeholder="Search by name ..."
              onClick={OpenSearchBar}
            />
          </div>
        </div>
        <div className="block sm:block md:block lg:hidden">
          <Dialog
            fullScreen
            open={open}
            onClose={handleClose}
            TransitionComponent={Transition}
            PaperProps={{
              style: {
                backgroundColor: "rgba(28, 36, 56, 0.88)",
                backdropFilter: "blur(20px)",
              },
            }}
          >
            <SearchComponent
              onClose={handleClose}
              searchResult={searchResult}
              Search={Search}
              _collection={_collection}
            ></SearchComponent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
