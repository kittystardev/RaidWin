import React from "react";
import { Link } from "react-router-dom";
import notfound from "../../assets/images/notfound.svg";
import notfound_purple from "../../assets/images/notfound_purple.svg";

function PageNotFound() {
  return (
    <div>
      <div className="mt-5 text-start sm:text-center md:text-center lg:text-center font-extrabold text-2xl sm:text-2xl md:text-2xl lg:text-6xl  text-gray">
        Nothing to Play Here ...
      </div>
      <img src={notfound} className="mx-auto" alt="" />
      <div className="relative">
        <img
          src={notfound_purple}
          alt=""
          className="absolute bottom-[100px] max-w-[1180px] opacity-70 "
        />
      </div>
      <div className="w-full text-center ">
        <Link to="/">
          <button className="bg-lighter-blue bg-opacity-[0.09] rounded-lg font-bold text-sm leading-6 text-light-blue px-3 py-2 w-28">
            Home
          </button>
        </Link>
      </div>
    </div>
  );
}

export default PageNotFound;
