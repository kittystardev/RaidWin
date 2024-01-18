import React, { useState } from "react";
import { Link } from "react-router-dom";
import dropdown from "../../assets/img/dropdown.svg";
import dropup from "../../assets/img/dropup.svg";

export default function DropdownMobile() {
  const [popular, setPopular] = useState(false);

  // console.log("DropdownMobile");
  return (
    <div className="justify-between text-gray flex sm:flex md:hidden lg:hidden xl:hidden 2xl:hidden">
      <ul className="flex flex-col mt-0 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium justify-center ml-3">
        <li className="relative">
          <button
            id="dropdownNavbarLink"
            data-dropdown-toggle="dropdownNavbar"
            onClick={() => setPopular(!popular)}
            className="flex items-center justify-between w-full py-2 pl-3 pr-4 font-medium text-space-gray border rounded-lg p-4 border-nouveau hover:text-light-gray"
            style={{ fontSize: "14px" }}
          >
            Most popular
            <img
              src={!popular ? dropdown : dropup}
              className=" ml-5 flex items-center"
              alt="dropdown"
            ></img>
          </button>
          <div
            id="dropdownNavbar"
            className={`absolute bg-background z-50 ${
              !popular ? "hidden" : ""
            } divide-y divide-gray-100 rounded shadow w-full `}
          >
            <ul
              className="py-1 text-sm text-gray-700 dark:text-gray-400"
              aria-labelledby="dropdownLargeButton"
            >
              <li>
                <Link
                  to="/"
                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  Settings
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  Earnings
                </Link>
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </div>
  );
}
