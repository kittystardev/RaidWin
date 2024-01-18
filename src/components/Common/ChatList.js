import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { stickers } from "../../utils/Stickers";
import { handleImageError, imagePath, replaceSlug } from "../../utils/utils";
import "../../assets/scss/style.scss";
import Tags from "../Tags";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ChatList({ chatData, fetchMoreData, setChatData }) {
  let players = useSelector((state) => state.Players.players);
  const { userInfo } = useSelector((state) => state.userInfo);

  const navigate = useNavigate();

  function parseMessage(message) {
    return message
      .split(/\s+/)
      .map((word, index) => {
        if (word.startsWith("@")) {
          const player = players.find((p) => p.userName === word.substring(1));
          if (player) {
            return (
              <span
                key={index}
                className="cursor-pointer text-blue"
                onClick={() => goToProfile(word.substring(1), player.playerId)}
              >
                {word}
              </span>
            );
          }
        }
        return word;
      })
      .reduce((acc, curr) => [acc, " ", curr]);
  }

  function goToProfile(username, playerId) {
    navigate(`/${username || playerId}`, {
      state: {
        pubKey: playerId,
      },
    });
  }
console.log(chatData);
  return (
    <div
      id="scrollableDiv"
      className="flex flex-col-reverse flex-1 h-full overflow-auto chatbox scrollY"
    >
      {/* 80VH  sm:h-[75vh] md:h-[72vh] lg:h-[72vh]*/}
      <InfiniteScroll
        dataLength={chatData?.length}
        next={fetchMoreData}
        style={{
          overflow: "hidden",
          display: "flex",
          flexDirection: "column-reverse",
          paddingBottom: "35px",
        }}
        className="chatlist-bottom-aligment"
        inverse={true}
        hasMore={true}
        loader={<h4 className="text-center">Loading...</h4>}
        scrollableTarget="scrollableDiv"
      >
        {chatData?.map((value, index) => {
          const { content } = value;
          let stickerId = -1;
          if (
            content.charAt(0).startsWith("~") &&
            content.charAt(content.length - 1).endsWith("~")
          ) {
            stickerId = parseInt(content.substr(1, content.length - 2));
          }

          return (
            <div
              key={index}
              className={`${
                value.image && "flex"
              } w-full px-4 pt-4 pb-2 space-x-4`}
            >
              {!value.content.includes(`${value.name} tipped`) && (
                <Link
                  to={`/${replaceSlug(value.name) || value.playerId}`}
                  state={{
                    pubKey: value.playerId,
                  }}
                  className="h-12 w-max rounded-xl"
                >
                  <img
                    src={`${imagePath}profile48/${
                      value.playerId === userInfo._id
                        ? userInfo.profileImage
                        : value.image
                    }`}
                    onError={handleImageError}
                    className="object-cover w-12 h-12 rounded-xl  bg-opacity-50 bg-background"
                    alt=""
                  ></img>
                </Link>
              )}
              <span className="w-full">
                {!value.content.includes(`${value.name} tipped`) &&
                  value.tags?.map((tags, i) => {
                    return <Tags tag={tags} key={i} />;
                  })}

                <span className="text-sm font-bold text-gray">
                  {" "}
                  {!value.content.startsWith(`@${value.name} tipped`) &&
                    `${
                      value.playerId === userInfo._id
                        ? userInfo.userName
                        : value.name
                    }: `}
                  <span className="cursor-pointer text-chat-tag">
                    {value?.tag && `${value.tag}: `}
                  </span>
                  {value.sticker && (
                    <img
                      src={value.sticker}
                      onError={handleImageError}
                      alt="Sticker"
                      className="w-12 h-12"
                    ></img>
                  )}
                  {stickerId !== -1 && !isNaN(stickerId) ? (
                    <span>
                      <img
                        src={stickers[stickerId]}
                        className="w-14 h-14"
                        onError={handleImageError}
                        alt=""
                      />
                    </span>
                  ) : !value.content.includes(`${value.name} tipped`) ? (
                    <span className="text-sm font-semibold text-space-gray">
                      {parseMessage(value.content)}
                    </span>
                  ) : (
                    <div className="text-sm font-semibold text-space-gray p-4 bg-background bg-opacity-50 rounded-md">
                      🎉{parseMessage(value.content)}!
                    </div>
                  )}
                </span>
              </span>
            </div>
          );
        })}
      </InfiniteScroll>
    </div>
  );
}
