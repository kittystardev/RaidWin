import React from "react";
import { Menu, Transition } from "@headlessui/react";
import { Share } from "@mui/icons-material";
import { Fragment } from "react";
import twitter from "../assets/images/twitter.svg";
import { useDispatch } from "react-redux";
import { setAlertIdx } from "../store/NFTModal";

export default function ShareWinnerOption({ imageDataUrl }) {
  const dispatch = useDispatch();
  let timeOut;

  

  const handleCopy = () => {
    // copy(window.location.href)
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => {
        timeOut = setTimeout(() => {
          dispatch(setAlertIdx({ info: "", open: false }));
          dispatch(
            setAlertIdx({
              info: "Copied Successfully",
              open: true,
              response: "success",
            })
          );
        }, 1000);
        timeOut = setTimeout(() => {
          dispatch(setAlertIdx({ info: "", open: false, response: "success" }));
        }, 5000);
      })
      .catch((error) => {
        timeOut = setTimeout(() => {
          dispatch(setAlertIdx({ info: "", open: false, response: "Failed" }));
        }, 2000);
        timeOut = setTimeout(() => {
          dispatch(setAlertIdx({ info: "", open: false, response: "Failed" }));
        }, 5000);
      });
  };

  const shareOnTwitter = () => {
    console.log('imageDataUrl', imageDataUrl)
    if (!imageDataUrl) return;

    const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent('Check out my game result!')}&url=${encodeURIComponent(imageDataUrl)}`;
    window.open(twitterShareUrl, "_blank");
  }

  const shareOnFacebook = () => {
    console.log('imageDataUrl', imageDataUrl)
    if (!imageDataUrl) return;

    const facebookShareUrl = `https://www.facebook.com/sharer.php?u=${encodeURIComponent(imageDataUrl)}`;
    window.open(facebookShareUrl, "_blank");
  };

  

  return (
    <Transition
      as={Fragment}
      enter="transition ease-out duration-100"
      enterFrom="transform opacity-0 scale-95"
      enterTo="transform opacity-100 scale-100"
      leave="transition ease-in duration-75"
      leaveFrom="transform opacity-100 scale-100"
      leaveTo="transform opacity-0 scale-95"
    >
      <Menu.Items className="absolute z-50 bottom-12 max-sm:-left-14  sm:right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100  bg-pickled-bluewood rounded-3xl shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
        <div className="p-2">
          <Menu.Item>
            <div
              className="py-5  hover:bg-yankees-blue hover:bg-opacity-50 hover:rounded-lg cursor-pointer hover:text-gray"
              onClick={handleCopy}
            >
              <div className="text-gray flex gap-2 ml-3">
                <Share />
                <div className="">Copy Link</div>
              </div>
            </div>
          </Menu.Item>
          <Menu.Item>
            <div
              className="py-5  hover:bg-yankees-blue hover:bg-opacity-50 hover:rounded-lg cursor-pointer hover:text-gray"
              onClick={shareOnFacebook}
            >
              <div className="text-gray flex gap-2 ml-3">
                <Share />
                <div className="">Share on Facebook</div>
              </div>
            </div>
          </Menu.Item>
          <Menu.Item>
            <div
              className="py-5  hover:bg-yankees-blue hover:bg-opacity-50 hover:rounded-lg cursor-pointer hover:text-gray"
              onClick={shareOnTwitter}
            >
              <div className="text-gray flex gap-2 ml-3">
                <img src={twitter} alt="twitter" />
                <div className="">Share on Twitter</div>
              </div>
            </div>
          </Menu.Item>
        </div>
      </Menu.Items>
    </Transition>
  );
}
