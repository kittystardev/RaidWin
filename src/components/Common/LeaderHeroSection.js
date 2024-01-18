import { Box } from "@mui/material";
import React from "react";
import leaderboard_blue from "../../assets/images/leaderboard_blue.svg";
import leaderstar_blue from "../../assets/images/leaderstar_blue.svg";
import winner_stand from "../../assets/images/winner_stand.svg";
import gold_star from "../../assets/images/gold_star.svg";
import silver_star from "../../assets/images/silver_star.svg";
import bronze_star from "../../assets/images/bronze_star.svg";
import leaderstar_pink from "../../assets/images/leaderstar_pink.svg";
import { handleImageError, imagePath } from "../../utils/utils";
import { useSelector } from "react-redux";
import { Helmet } from "react-helmet";

export default function LeaderHeroSection() {
  const topPlayers = useSelector((state) => state.topplayer.topPlayer);

  // console.log("topPlayerssss", topPlayers)
  return (
    <div className="mb-8">
      <Helmet>
        <title>RaidWin</title>
      </Helmet>
      {/* Display */}
      <Box
        sx={{
          display: { xs: "none", sm: "none", md: "none", lg: "flex" },
          backgroundColor: "#1C2438",
          borderRadius: "24px",
          minHeight: "224px",
          color: "#D6DCEC",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div className=" pl-[48px]">
          <div className="mt-[61px] font-extrabold text-[56px] tracking-tight leading-[71px] text-gray">
            LeaderBoard
          </div>
          <div className="mt-1 font-black text-sm leading-6 tracking-wider text-space-gray">
            Top Players
          </div>
        </div>
        <div>
          <img
            src={leaderboard_blue}
            className="absolute right-[0px] rounded-3xl height-leaderboard-image"
            alt=""
          />
        </div>
        <div>
          <img src={leaderstar_blue} alt="" />
        </div>
        <div>
          <img src={winner_stand} className="absolute right-[124px]" alt="" />
        </div>
        <div>
          {topPlayers[0]?._id[0]?.profileImage ? (
            <>
              <img
                src={`${imagePath}profile48/${topPlayers[0]?._id[0]?.profileImage}`}
                onError={handleImageError}
                className="player hex-green-border rounded-xl absolute top-[26px] right-[308px] w-20 h-20"
                alt=""
              />
            </>
          ) : (
            <>
              <img
                src={`${imagePath}profile48/${topPlayers[0]?._id[0]?.profileImage}`}
                onError={handleImageError}
                alt=""
                className="player hex-green-border rounded-xl absolute top-[26px] right-[308px] w-20 h-20"
              />
            </>
          )}
        </div>
        <div>
          <img
            src={gold_star}
            className="absolute top-[60px] right-[309px]"
            alt=""
          />
        </div>
        <div>
          {topPlayers[1]?._id[0]?.profileImage ? (
            <>
              {" "}
              <img
                // src={`${imagePath}${topPlayers[1]?._id[0]?.profileImage}`}
                src={`${imagePath}profile48/${topPlayers[1]?._id[0]?.profileImage}`}
                onError={handleImageError}
                alt=""
                className="player rotate-[-25deg] hex-green-border rounded-xl absolute top-[92px] right-[451px] w-20 h-20"
              />
            </>
          ) : (
            <>
              <img
                // src={`${imagePath}${topPlayers[1]?._id[0]?.profileImage}`}
                src={`${imagePath}profile48/${topPlayers[1]?._id[0]?.profileImage}`}
                onError={handleImageError}
                alt=""
                className="player rotate-[-25deg] hex-green-border rounded-xl absolute top-[92px] right-[451px] w-20 h-20"
              />
            </>
          )}
        </div>
        <div>
          <img
            src={silver_star}
            className="absolute top-[123px] right-[429px]"
            alt=""
          />
        </div>
        <div>
          {topPlayers[2]?._id[0]?.profileImage ? (
            <>
              {" "}
              <img
                src={`${imagePath}profile48/${topPlayers[2]?._id[0]?.profileImage}`}
                onError={handleImageError}
                alt=""
                className="player rotate-[25deg] hex-green-border rounded-xl absolute top-[111px] right-[171px]  w-20 h-20 "
              />
            </>
          ) : (
            <>
              <img
                src={`${imagePath}profile48/${topPlayers[2]?._id[0]?.profileImage}`}
                onError={handleImageError}
                alt=""
                className="player rotate-[25deg] hex-green-border rounded-xl absolute top-[111px] right-[171px]  w-20 h-20 "
              />
            </>
          )}
        </div>
        <div>
          <img
            src={bronze_star}
            className="absolute top-[146px] right-[187px]"
            alt=""
          />
        </div>
        <div>
          <img src={leaderstar_pink} className="absolute right-0" alt="" />
        </div>
      </Box>

      {/* Mobile */}
      <Box
        sx={{
          display: { xs: "block", sm: "block", md: "block", lg: "none" },
          backgroundColor: "#1C2438",
          borderRadius: "42px",
          color: "#D6DCEC",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div className="leaderboard_mobile">
          <div className="text-center font-extrabold text-[36px] leading-[48px] text-gray pt-5">
            LeaderBoard
          </div>
          <div className="font-black text-sm leading-6 tracking-wider text-space-gray text-center uppercase">
            Top Players
          </div>
          <div className="mx-auto leader_hero flex items-center justify-center">
            <div className="flex relative w-full h-[210px] items-center justify-center">
              <div className="winner_div h-full w-[426px] ">
                <img
                  src={winner_stand}
                  className="winner_stand scale-100"
                  id="winner_stand"
                  alt=""
                />
                <div className="hii absolute w-[inherit] top-0 h-full">
                  <div className="flex items-center justify-center">
                    <div className="mx-4 absolute top-[20px] player_1">
                      <div className="">
                        {topPlayers[0]?._id[0]?.profileImage ? (
                          <img
                            src={`${imagePath}profile48/${topPlayers[0]?._id[0]?.profileImage}`}
                            onError={handleImageError}
                            className="player hex-green-border rounded-xl w-20 h-20"
                            id="player1"
                            alt=""
                          />
                        ) : (
                          <>
                            <img
                              src={`${imagePath}profile48/${topPlayers[0]?._id[0]?.profileImage}`}
                              onError={handleImageError}
                              className="player hex-green-border rounded-xl w-20 h-20"
                              id="player1"
                              alt=""
                            />
                          </>
                        )}

                        <img
                          src={gold_star}
                          className="gold_star absolute top-[20px]"
                          alt=""
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mx-4 absolute left-[25px] bottom-[40px] player_2">
                    <div className="">
                      {topPlayers[1]?._id[0]?.profileImage ? (
                        <img
                          src={`${imagePath}profile48/${topPlayers[1]?._id[0]?.profileImage}`}
                          onError={handleImageError}
                          className="player rotate-[-25deg] hex-green-border rounded-xl  w-20 h-20"
                          id="player2"
                          alt=""
                        />
                      ) : (
                        <img
                          src={`${imagePath}profile48/${topPlayers[1]?._id[0]?.profileImage}`}
                          onError={handleImageError}
                          className="player rotate-[-25deg] hex-green-border rounded-xl  w-20 h-20"
                          id="player2"
                          alt=""
                        />
                      )}

                      <img
                        src={silver_star}
                        className="silver_star absolute top-[25px] left-[15px]"
                        alt=""
                      />
                    </div>
                  </div>
                  <div className="mx-4 absolute right-[25px] top-[100px] player_3">
                    <div className="">
                      {topPlayers[2]?._id[0]?.profileImage ? (
                        <>
                          <img
                            src={`${imagePath}profile48/${topPlayers[2]?._id[0]?.profileImage}`}
                            onError={handleImageError}
                            className="player rotate-[25deg] hex-green-border rounded-xl  w-20 h-20 "
                            id="player3"
                            alt=""
                          />
                        </>
                      ) : (
                        <img
                          src={`${imagePath}profile48/${topPlayers[2]?._id[0]?.profileImage}`}
                          onError={handleImageError}
                          className="player rotate-[25deg] hex-green-border rounded-xl  w-20 h-20 "
                          id="player3"
                          alt=""
                        />
                      )}

                      <img
                        src={bronze_star}
                        className="bronze_star absolute top-[28px] right-[11px]"
                        alt=""
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Box>
    </div>
  );
}
