import React, { useState } from "react";
import profile from "../assets/images/profile.svg";
import notification from "../assets/images/notification.svg";
import UserProfile from "./UserProfile";
import { Helmet } from "react-helmet";
import { handleImageError } from "../utils/utils";

export default function Setting() {
  const [isUserProfile, setIsUserProfile] = useState(true);

  return (
    <>
      <Helmet>
        <title>RaidWin</title>
      </Helmet>
      {/* <form id='form' onSubmit={handleSubmit(onSubmit)}> */}
      <div>
        <div className="block sm:block md:block lg:flex justify-between">
          <div className="font-extrabold text-[36px] sm:text-[36px] md:text-[36px] lg:text-[56px] text-gray">
            Settings
          </div>
          <div className="flex items-center mt-8 sm:mt-8 md:mt-8 lg:mt-0">
            <div className="gap-4 flex">
              <button
                className={`${
                  isUserProfile
                    ? "bg-chat-tag bg-opacity-[0.09] text-chat-tag "
                    : "bg-nouveau-main bg-opacity-[0.08] text-space-gray"
                } rounded-lg px-6 py-3 font-bold text-sm tracking-wide`}
              >
                <div
                  className="flex gap-3"
                  onClick={() => setIsUserProfile(!isUserProfile)}
                >
                  <img src={profile} onError={handleImageError} />
                  Profile
                </div>
              </button>
              <button
                className={`${
                  !isUserProfile
                    ? "bg-chat-tag bg-opacity-[0.09] text-chat-tag"
                    : "bg-nouveau-main bg-opacity-[0.08] text-space-gray"
                } rounded-lg px-6 py-3  font-bold text-sm tracking-wide`}
              >
                <div
                  className="flex gap-3"
                  onClick={() => setIsUserProfile(!isUserProfile)}
                >
                  <img src={notification} />
                  Notifications
                </div>
              </button>
            </div>
          </div>
        </div>
        <div className="border-t-2 mt-10 border-nouveau-main border-opacity-[0.24] rounded-sm"></div>

        {isUserProfile && <UserProfile />}
      </div>
    </>
  );
}
