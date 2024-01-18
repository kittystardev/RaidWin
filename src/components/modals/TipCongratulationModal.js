import React, { useCallback } from "react";
import { useSelector } from "react-redux";
import { Box, IconButton, Modal } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import TipCongratulation from "../../assets/images/TipCongratulation.png";
import { useEffect } from "react";
import confetti from "canvas-confetti";
import { Link } from "react-router-dom";
import { handleImageError, imagePath, replaceSlug } from "../../utils/utils";

export default function TipCongratulationModal({
  handleClose,
  receiverPubKey,
  latestTipData,
}) {
  const pubKey = useSelector((state) => state.Temp.pubKey);
  const { userInfo } = useSelector((state) => state.userInfo);

  // const start = useCallback(() => {
  //   let audio = new Audio(victory);
  //   audio.play();
  // }, []);

  useEffect(() => {
    if (userInfo.userName && pubKey === receiverPubKey) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        zIndex: "99999",
      });
      // start();
    }
  }, [pubKey]);

  const SOLPrice = useSelector((state) => state.solanaprice.priceUsdt);
  const exchangeRate = SOLPrice.data?.priceUsdt;


  return (
    <Modal
      open={userInfo.userName && pubKey === receiverPubKey}
      onClose={handleClose}
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "#1C2438",
          boxShadow: 24,
          borderRadius: "24px",
          width: { xs: "300px", sm: "450px", md: "500px", lg: "540px" },
          overflow: { xs: "auto", sm: "auto", md: "auto", lg: "auto" },
          maxHeight: { xs: "450px", sm: "500px", md: "650px", lg: "750px" },
          "&:focus": {
            outline: "none",
          },
        }}
      >
        <div className="flex flex-col justify-center items-center text-white p-10">
          <div className="absolute top-3 right-4">
            <IconButton aria-label="close" size="medium" onClick={handleClose}>
              <CloseIcon sx={{ color: "#6A707F" }} />
            </IconButton>
          </div>
          <img
            src={`${imagePath}/profile400/${latestTipData?.pubKey?.profileImage}`}
            onError={handleImageError}
            className="mb-7 h-20 w-20 mask mask-hexagon-2 mask-repeat object-cover "
            alt=""
          />
          <h1 className="sm:text-lg md:text-2xl lg:text-4xl font-extrabold">
            Congratulations!
          </h1>
          <p className="pt-3 sm:text-xs md:text-base lg:text-base font-normal text-center text-space-gray ">
            You received a tip of {latestTipData.amount} SOL ($
            {(parseFloat(latestTipData.amount) * exchangeRate).toFixed(2)}) from{" "}
            <Link
              to={`/${replaceSlug(latestTipData?.pubKey?.userName) || latestTipData?.pubKey?._id}`}
              state={{
                pubKey: latestTipData?.pubKey?._id,
              }}
              onClick={handleClose}
              className="text-blue"
            >
              @{latestTipData?.pubKey?.userName}
            </Link>
          </p>
        </div>
      </Box>
    </Modal>
  );
}
