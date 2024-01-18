import { Grid } from "@mui/material";
import myitem from "../assets/images/myitem.svg";
import React from "react";
import { Link } from "react-router-dom";

export default function MyItem({ name, img, isPlayable, collectionMint }) {
  return (
    <div className="mx-auto my-4 sm:mx-auto md:mx-0">
      <div className="w-48 h-48 rounded-2xl">
        <div className="grow">
          <img src={img} alt={name} className="rounded-2xl" />
        </div>
      </div>
      <div className="mt-4 text-gray w-44">{name}</div>
      {isPlayable && (
        <Link to={`../games/${name.split(" ")[0]}s`}>
          <button
            className={`bg-light-green bg-opacity-[0.09] rounded-lg px-6 py-2 text-light-green font-bold text-sm tracking-wide mt-4 hover:bg-opacity-100 hover:text-yankees-blue play`}
          >
            Play
          </button>
        </Link>
      )}
    </div>
  );
}
