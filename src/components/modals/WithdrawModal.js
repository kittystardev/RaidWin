import { Box, CircularProgress, IconButton, Modal } from "@mui/material";
import React from "react";
import CloseIcon from "@mui/icons-material/Close";
import flag_gloss from "../../assets/images/flag_gloss.png";

import styled from "styled-components";
import { useState } from "react";
import { CheckIcon } from "@heroicons/react/outline";
import { useEffect } from "react";
import { baseUrl, decodePlatformState } from "../../utils/utils";
import { setPenaltyFees } from "../../store/PlatformSlice";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { useCallback } from "react";

const ModalFooter = styled(Box)`
  margin-top: 40px;
  background: #131826;
  opacity: 0.56;
  border-radius: 0px 0px 24px 24px;
  padding-top: 32px;
  padding-bottom: 32px;
  padding-left: 40px;
  padding-right: 40px;
`;

export default function WithdrawModal({
  open,
  onClose,
  leaveGame,
  claimState,
  setClaimState,
  title,
  slug,
}) {
  const penaltyFees = useSelector((state) => state.platformSlice.penalty_fees);
  const dispatch = useDispatch();
  useEffect(() => {
    if (claimState === 1) {
      setClaimState(-1);
    }
  }, [claimState, setClaimState]);

  useEffect(() => {
    const data = async () => {
      const { penalty_fees } = await decodePlatformState();
      dispatch(setPenaltyFees(penalty_fees));
    };
    data();
  }, [dispatch, penaltyFees]);
  const [searchParams] = useSearchParams();
  searchParams.get("collectionId");

  const [stateDetails, setStateDetails] = useState([]);
  const fetchData = useCallback(async () => {
    try {
      const resp = await fetch(`${baseUrl}/getCollectionStatsDetails/${slug}`);
      let data = await resp.json();
      const formattedTotalSupply = new Intl.NumberFormat("en-US", {
        maximumFractionDigits: 1,
        notation: "compact",
        compactDisplay: "short",
      }).format(data.totalSupply);
      data.formattedTotalSupply = formattedTotalSupply;
      setStateDetails(data);
    } catch (err) {
      console.log(err);
    }
  }, [slug]);
  useEffect(() => {
    if (!slug) return;
    fetchData();
  }, [fetchData, slug]);

  // console.log("stateDetails", title)

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          // width: '540px',
          bgcolor: "#1C2438",
          // border: '2px solid #000',
          boxShadow: 24,
          // p: 4,
          borderRadius: "24px",
          width: { xs: "280px", sm: "450px", md: "540px", lg: "540px" },
          overflow: "auto",
          maxHeight: { xs: "90vh", sm: "80vh", md: "750px", lg: "750px" },
        }}
      >
        <div className="p-6">
          <div className="float-right">
            <IconButton aria-label="close" size="medium" onClick={onClose}>
              <CloseIcon sx={{ color: "#6A707F" }} />
            </IconButton>
          </div>
        </div>
        <div className="p-6">
          <img src={flag_gloss} className="mx-auto" alt="" />
        </div>
        <div className="p-6">
          <p className="text-gray text-center font-black text-xl leading-8 tracking-wide">
            Are You Sure To Give Up?
          </p>
          <p className="mt-4 px-0 sm:px-0 md:px-16 text-center font-semibold text-base text-space-gray tracking-wide">
            Withdrawing early before a game has ended has a fee of{" "}
            <span className="text-lighter-blue">{penaltyFees}%</span> attached
            it
          </p>
        </div>
        <div className="pb-10">
          <div className="mt-10 px-0 sm:px-8 md:px-8 lg:px-16 justify-center gap-4 flex">
            <button
              className="bg-light-green rounded-lg text-yankees-blue font-bold text-sm leading-6 tracking-wider px-5 py-2 capitalize hover:bg-hover-light-green"
              onClick={() => {
                onClose();
              }}
            >
              Cancel
            </button>
            <button
              disabled={claimState !== -1}
              className={`bg-light-blue bg-opacity-[0.08] rounded-lg text-light-blue  font-bold text-sm leading-6 tracking-wider px-5 py-2 capitalize`}
              onClick={() => {
                leaveGame();
              }}
            >
              {claimState === -1 ? (
                <>
                  <div className="flex gap-2">
                    <div>Withdraw</div>
                  </div>
                </>
              ) : claimState === 0 ? (
                <div className="flex gap-2">
                  <h1>Withdrawing</h1>
                  <CircularProgress sx={{ color: "#44C6E2" }} size={20} />
                </div>
              ) : (
                claimState === 1 && (
                  <div className="flex gap-2">
                    <h1>Withdrawed</h1>
                    <CheckIcon className="w-5 h-5 text-light-blue" />
                  </div>
                )
              )}
            </button>
          </div>
        </div>
        <ModalFooter>
          <div className="flow-root gap-6 sm:flow-root md:flex lg:flex xl:flex">
            <div className="flex">
              <div className="flex gap-3">
                <div className="text-space-gray tracking-wider text-opacity-60 text-xs font-bold">
                  Floor price: {stateDetails.floorPrice?.toFixed(2)} SOL
                </div>
              </div>
            </div>
            <div className="text-space-gray text-opacity-[0.64] tracking-wider text-xs font-bold flex items-center">
              Fee: {((stateDetails.floorPrice * penaltyFees) / 100)?.toFixed(2)}{" "}
              SOL
            </div>
          </div>
        </ModalFooter>
      </Box>
    </Modal>
  );
}
