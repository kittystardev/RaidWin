import React from "react";
const classes = {
  pending: "opacity-100",
  begin: "opacity-50",
  active: "hex-green opacity-100",
};

export default function PlayerRound({
  afterComplete,
  player,
  currentActive,
  countDown,
  open,
  handleClick,
}) {
  return (
    <div
      className={`hex absolute top-[${player.rootTop}] left-[${player.rootleft}] right-[${player.rootRight}]`}
      onClick={handleClick}
      aria-controls={open ? "account-menu" : undefined}
      aria-haspopup="true"
      aria-expanded={open ? "true" : undefined}
    >
      {afterComplete.display && (
        <>
          <div
            className={`flex ${afterComplete[1].bgcolor} text-yankees-blue gap-2 justify-center rounded-xl py-1 px-2 w-16 absolute bottom-[113px] right-[22px]`}
          >
            <img src={afterComplete.image} />
            <div className="text-xs tracking-wide uppercase font-bold">
              {afterComplete.text}
            </div>
          </div>
        </>
      )}
      <div
        className={`hex-background mask mask-hexagon-2 mask-repeat object-cover ${
          currentActive === 1
            ? classes.active
            : currentActive === 0 && countDown == 10
            ? classes.pending
            : classes.begin
        }`}
      >
        <img
          src={player.playerImage}
          className={`hover:cursor-pointer w-28 h-28 mask mask-hexagon-2 mask-repeat object-cover absolute top-[${player.playerImgTop}] right-[${player.playerImgRight}] left-[${player.playerImgLeft}]`}
        />
      </div>
    </div>
  );
}
