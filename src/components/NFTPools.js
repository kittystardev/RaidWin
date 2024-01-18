import React from "react";
import DropdownMobile from "./Common/DropdownMobile";
import DropdownSearch from "./Common/DropdownSearch";

export default function NFTPools({ setLoading }) {
  return (
    <>
      <div className="justify-between block sm:flex md:flex lg:flex xl:flex 2xl:flex">
        <div className="flex justify-between ">
          <div className="text-gray font-black text-2xl tracking-wide flex items-center">
            Rounds
          </div>
          <DropdownMobile></DropdownMobile>
        </div>
        <DropdownSearch setLoading={setLoading} _mostpopuler={true}></DropdownSearch>
      </div>
    </>
  );
}
