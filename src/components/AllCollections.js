import React from "react";
import CollectionCardList from "./CollectionCardList";
import DropdownMobile from "./Common/DropdownMobile";
import DropdownSearch from "./Common/DropdownSearch";
import NFTPoolCardList from "./NFTPoolCardList";

export default function AllCollections({ setLoading }) {
  return (
    <>
      <div className="justify-between block sm:flex md:flex lg:flex xl:flex 2xl:flex">
        <div className="flex justify-between ">
          <div className="text-gray font-black text-2xl tracking-wide flex items-center">
            Collections
          </div>
          <DropdownMobile></DropdownMobile>
        </div>
        <DropdownSearch setLoading={setLoading} _mostpopuler={true}></DropdownSearch>
      </div>
      {/* <NFTPoolCardList /> */}
      <div className="mb-12">
        <CollectionCardList />
      </div>
    </>
  );
}
