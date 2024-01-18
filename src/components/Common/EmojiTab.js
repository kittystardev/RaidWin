import React, { useState } from "react";
import Emoji from "../emoji/Emojis";

export default function EmojiTab({ setMsg, msg }) {
  const [showEmojis, setShowemojis] = useState();
  const [emojiname, setEmojiname] = useState("");
  // const [cursorPosition, setCursorPosition] = useState();

  const pickEmoji = (e, { emoji, names }) => {
    console.log(names[1]);
    setEmojiname(names[1]);
    setMsg(msg + emoji);
    // setCursorPosition(start.length + emoji.length);
  };
  return (
    <>
      <div className={`emoji-list`}>
        <Emoji
          pickEmoji={pickEmoji}
          className={` ${
            showEmojis ? "hover:bg-light-green" : "sm:bg-yankees-blue"
          }`}
        />
        {/* Emoji */}
      </div>
    </>
  );
}
