import React, { memo } from "react";
import { useLocation } from "react-router-dom";
import DropdownMobile from "./Common/DropdownMobile";
import DropdownSearch from "./Common/DropdownSearch";
import GamesSection from "./GamesSection";

function Games({collectionMint, gameState, setLoading}) {
  const location = useLocation();

  return (
    <div
      className={`mb-9 ${
        location.pathname === "/" ? "px-0" : "px-6 sm:px-6 md:px-0 lg:px-0"
      }`}
    >
      <div className="justify-between block sm:flex md:flex lg:flex xl:flex 2xl:flex">
        <div className="flex justify-between ">
          <div className="flex items-center text-2xl font-black tracking-wide text-gray">
            Games
          </div>
          {location.pathname === "winnertakesall" &&
            location.pathname === "collections" && (
              <DropdownMobile></DropdownMobile>
            )}
        </div>
        <DropdownSearch setLoading={setLoading} _mostpopuler={true}></DropdownSearch>
      </div>

      <GamesSection collectionMint={collectionMint} title={location.pathname.split('/')[2]} gameState={gameState}></GamesSection>
    </div>
  );
}
export default memo(Games);
