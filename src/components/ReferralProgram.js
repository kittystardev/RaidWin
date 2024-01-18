import React, { useEffect, useMemo } from "react";
// import link_refferal from '../assets/images/link-dynamic.png'
import link_refferal from "../assets/images/Chain.png";
import right_arrow from "../assets/images/right_arrow.svg";
import right_down_arrow from "../assets/images/right_down_arrow.svg";
import invite_friend from "../assets/images/invite_friend.svg";
import get_rewards from "../assets/images/reward.png";
import solana_icon from "../assets/images/solana_icon.svg";
import { isMobileOnly } from "react-device-detect";
import { Helmet } from "react-helmet";
import { useDispatch, useSelector } from "react-redux";
import { Skeleton } from "@mui/material";
import { useState } from "react";
import { setAlertIdx } from "../store/NFTModal";
import { fetchPageTitles } from "../store/pageTitleSlice";
import { useLocation } from "react-router-dom";
import { baseUrl } from "../utils/utils";

export default function ReferralProgram() {
  const dispatch = useDispatch();
  const [total, setTotal] = useState({});
  const [referralId, setReferralId] = useState("");
  const [copyLoading, setCopyLoading] = useState(false);

  const pubKey = useSelector((state) =>
    state.Temp.pubKey ? state.Temp.pubKey.toString() : ""
  );

  let inputValue = `${window.location.origin}?ref=${referralId ?? pubKey}`;

  const pageTitles = useSelector((state) => state.pageTitle.entities);
  const location = useLocation();

  useEffect(() => {
    dispatch(fetchPageTitles());
  }, [dispatch]);

  const pageTitle = useMemo(() => {
    if (location && pageTitles) {
      const page = pageTitles.find(
        (ele) => ele.page === location.pathname.substring(1)
      );
      return page ? page.title : "RaidWin";
    }
    return "RaidWin";
  }, [pageTitles, location]);

  const handleCopy = () => {
    let timeOut;
    setCopyLoading(true);
    dispatch(
      setAlertIdx({
        info: "Copying",
        open: true,
        response: "",
      })
    );
    navigator.clipboard
      .writeText(inputValue)
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
          setCopyLoading(false);
        }, 5000);
      })
      .catch((error) => {
        timeOut = setTimeout(() => {
          dispatch(setAlertIdx({ info: "", open: false, response: "Failed" }));
        }, 2000);
        timeOut = setTimeout(() => {
          dispatch(setAlertIdx({ info: "", open: false, response: "Failed" }));
          setCopyLoading(false);
        }, 5000);
      });
  };

  useEffect(() => {
    (async () => {
      if (!pubKey) return;
      try {
        const response = await fetch(`${baseUrl}/referralId/${pubKey}`);
        const data = await response.json();
        setReferralId(data?.uuid);
        const resp = await fetch(`${baseUrl}/userRefferalCount/${data?.uuid}`);
        let referralData = await resp.json();
        setTotal(referralData);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [pubKey]);

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>
      <div className="">
        <div className="text-center font-black sm:font-black md:font-bold lg:font-extrabold text-[24px] sm:text-[24px] md:text-[24px] lg:text-[56px] leading-[32px] sm:leading-[32px] md:leading-[32px] lg:leading-[72px] tracking-wide text-gray capitalize">
          RaidWin Referral Program
        </div>
        <div className="text-center font-black text-[14px] leading-[24px] tracking-wider text-space-gray uppercase mt-4">
          GIVE A DISCOUNT TO YOUR FRIENDS & GET MORE. HOW IT WORKS:
        </div>
        <div className="mt-28">
          <div className="ml-8 block sm:block md:block lg:flex justify-between gap-8">
            <div>
              <div>
                <img
                  src={link_refferal}
                  className="mx-auto sm:mx-auto md:mx-auto lg:mx-0"
                />
              </div>
              <div className="font-black text-xl leading-7 text-gray relative bottom-[40px] text-center sm:text-center md:text-center lg:text-left ">
                1. Get your Link
              </div>
              <div className="text-center sm:text-center md:text-center lg:text-left relative bottom-[28px] font-semibold text-sm leading-6 tracking-wide text-space-gray text-opacity-80">
                Generate a referral link and QR Codes
              </div>
            </div>
            <img
              src={right_arrow}
              className="hidden sm:hidden md:hidden lg:block relative bottom-[63px]"
            />
            <div className="mt-12 sm:mt-12 md:mt-12 lg:mt-0">
              <div>
                <img
                  src={invite_friend}
                  className="mx-auto sm:mx-auto md:mx-auto lg:mx-0"
                />
              </div>
              <div className="font-black text-xl leading-7 text-gray relative bottom-[40px] text-center sm:text-center md:text-center lg:text-left ml-7">
                2. Invite Friends
              </div>
              <div className="text-center sm:text-center md:text-center lg:text-center relative bottom-[28px] font-semibold text-sm leading-6 tracking-wide text-space-gray text-opacity-80">
                Invite friendsto register thought
                <br />
                the referral link or QR codes
                <br />
                and get rewards ones they complete a trade
              </div>
            </div>
            <img
              src={right_down_arrow}
              className="hidden sm:hidden md:hidden lg:block relative bottom-[63px]"
            />
            <div className="mt-12 sm:mt-12 md:mt-12 lg:mt-0">
              <div>
                <img
                  src={get_rewards}
                  className="mx-auto sm:mx-auto md:mx-auto lg:mx-0 lg:ml-auto"
                />
              </div>
              <div className="font-black text-xl leading-7 text-gray relative bottom-[40px] text-center sm:text-center md:text-center lg:text-right ">
                3. Get Rewards
              </div>
              <div className="text-center sm:text-center md:text-center lg:text-right relative bottom-[28px] font-semibold text-sm leading-6 tracking-wide text-space-gray text-opacity-80">
                Receive up to <span className="text-gray">40%</span> comission
                in real time
              </div>
            </div>
          </div>
        </div>
        <div className="mt-10 mb-14">
          <div className="block sm:block md:block lg:flex justify-between">
            <div className="ml-2 w-full sm:w-full md:w-full lg:w-1/2">
              <div className="font-bold text-xs tracking-wider leading-[60px] uppercase text-space-gray text-opacity-[0.64]">
                Your Personal Referral Link:
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3/4 ">
                  {pubKey ? (
                    <input
                      value={inputValue}
                      type="text"
                      readOnly
                      placeholder="https://solwin/referral_link/jenfrost"
                      className="input bg-yankees-blue w-full max-w-xs placeholder-space-gray text-sm text-space-gray focus-visible:outline-none"
                    />
                  ) : (
                    <Skeleton variant="rounded" height={48} />
                  )}
                </div>

                <button
                  onClick={handleCopy}
                  disabled={!pubKey || copyLoading}
                  className="bg-chat-tag rounded-lg text-white font-bold text-sm  tracking-wide px-6 py-[14px]"
                >
                  Copy
                </button>
              </div>
            </div>
            <div className="flex gap-12 mt-6 sm:mt-6 md:mt-6 lg:mt-0">
              <div>
                {total.refferal_count ? (
                  <div className="font-extrabold text-[56px] leading-[72px] text-gray">
                    {total.refferal_count}
                  </div>
                ) : (
                  <Skeleton
                    variant="rounded"
                    height={30}
                    width={60}
                    sx={{ bgcolor: "#1f283f" }}
                  />
                )}
                <div className="font-semibold text-sm leading-6 tracking-wide text-space-gray text-opacity-80 mt-2">
                  Referral
                  <br />
                  Friends
                </div>
              </div>
              <div className="flex">
                <div>
                  {total.value ? (
                    <div className="flex items-baseline gap-3">
                      <span>
                        <img src={solana_icon} />
                      </span>
                      <div className="font-extrabold text-[56px] leading-[72px] text-gray">
                        {(+total.value).toFixed(2)}{" "}
                        <span className="font-black tracking-wide text-xl leading-[32px]">
                          SOL
                        </span>
                      </div>
                    </div>
                  ) : (
                    <Skeleton
                      variant="rounded"
                      height={30}
                      width={215}
                      sx={{ bgcolor: "#1f283f" }}
                    />
                  )}

                  <div className="font-semibold text-sm leading-6 tracking-wide text-space-gray text-opacity-80 mt-2">
                    Estimated Commission <br />
                    Value
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
