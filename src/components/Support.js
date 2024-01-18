import { Box } from "@mui/system";
import React from "react";
import requirement from "../assets/images/requirement.svg";
import license from "../assets/images/license.svg";
import troubleshoot from "../assets/images/troubleshoot.svg";
import mirror from "../assets/images/mirror.svg";
import clouds from "../assets/images/clouds.svg";
import clouds_hover from "../assets/images/clouds_hover.png";
import mirror_hover from "../assets/images/mirror_hover.png";
import license_hover from "../assets/images/license_hover.png";
import troubleshoot_hover from "../assets/images/troubleshoot_hover.png";
import requirement_hover from "../assets/images/requirement_hover.png";
import flag_triangle from "../assets/images/flag_triangle.svg";
import manager from "../assets/images/manager.svg";
import message from "../assets/images/message.svg";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Helmet } from "react-helmet";
import Tippy from "@tippyjs/react";
import FAQSearch from "./FAQSearch";

export default function Support() {
  const [faq, setFaq] = useState(clouds);
  const [withdrawals, setWithdrawals] = useState(mirror);
  const [troubleshootfair, setTroubleShoot] = useState(troubleshoot);
  const [myAccount, setMyAccount] = useState(license);
  const [start, setStart] = useState(requirement);
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <>
      <Helmet>
        <title>RaidWin</title>
      </Helmet>
      <div>
        <div className="capitalize text-start sm:text-center md:text-center lg:text-center font-extrabold text-2xl sm:text-2xl md:text-2xl lg:text-6xl leading-[72px] text-gray">
          How can we Help?
        </div>
        <div className="block sm:flex md:flex lg:flex justify-center mt-4">
          <div className="text-gray">
            <div className="relative mt-4 sm:mt-4 md:mt-0 lg:mt-0 xl:mt-0 2xl:mt-0">
              <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                <svg
                  className="w-5 h-5 text-space-gray dark:text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  ></path>
                </svg>
              </div>
              <Tippy
                content={<FAQSearch searchTerm={searchTerm}></FAQSearch>}
                trigger={"click"}
                arrow={false}
                placement={"bottom"}
                allowHTML={true}
                interactive={true}
                offset={[0, 0]}
                className="auto-complete min-w-[100%] sm:min-w-[256px] md:min-w-[320px]"
              >
                <input
                  type="search"
                  id="default-search"
                  className="block p-2.5 pl-10 w-full sm:w-64 md:w-80 lg:w-80  text-sm text-space-gray bg-background border-b border-nouveau focus:ring-transparent outline-none"
                  placeholder="Search FAQs & Documentation"
                  autoComplete="off"
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </Tippy>
            </div>
          </div>
        </div>
        <Box
          sx={{ display: { xs: "none", sm: "none", md: "block", lg: "block" } }}
        >
          <div className="">
            <div className="">
              <div className="flex justify-between gap-4 mt-28">
                <Link to="/getting-started">
                  <img
                    src={start}
                    className="m-auto w-20 h-20"
                    onMouseEnter={() => {
                      setStart(requirement_hover);
                    }}
                    onMouseLeave={() => {
                      setStart(requirement);
                    }}
                  />
                  <div className="mt-4 font-black text-sm text-center tracking-wide leading-6 text-gray capitalize">
                    Getting Started
                  </div>
                </Link>

                <Link to="/Myaccount">
                  <img
                    src={myAccount}
                    className="m-auto w-20 h-20"
                    onMouseEnter={() => {
                      setMyAccount(license_hover);
                    }}
                    onMouseLeave={() => {
                      setMyAccount(license);
                    }}
                    alt=""
                  />
                  <div className="mt-4 font-black text-sm text-center tracking-wide leading-6 text-gray capitalize">
                    My Account
                  </div>
                </Link>
                <Link to="/prabablyfair">
                  <img
                    src={troubleshootfair}
                    className="m-auto w-20 h-20"
                    onMouseEnter={() => {
                      setTroubleShoot(troubleshoot_hover);
                    }}
                    onMouseLeave={() => {
                      setTroubleShoot(troubleshoot);
                    }}
                    alt=""
                  />
                  <div className="mt-4 font-black text-sm text-center tracking-wide leading-6 text-gray capitalize">
                    Provably Fair
                  </div>
                </Link>
                <Link to="/deposits">
                  <img
                    src={withdrawals}
                    className="mx-auto"
                    onMouseEnter={() => {
                      setWithdrawals(mirror_hover);
                    }}
                    onMouseLeave={() => {
                      setWithdrawals(mirror);
                    }}
                    alt=""
                  />
                  <div className="mt-4 font-black text-sm text-center tracking-wide leading-6 text-gray capitalize">
                    Deposits & Withdrawals
                  </div>
                </Link>
                <Link to="/faq">
                  <img
                    src={faq}
                    className="m-auto w-20 h-20"
                    onMouseEnter={() => {
                      setFaq(clouds_hover);
                    }}
                    onMouseLeave={() => {
                      setFaq(clouds);
                    }}
                    alt=""
                  />
                  <div className="mt-4 font-black text-sm text-center tracking-wide leading-6 text-gray capitalize">
                    FAQ
                  </div>
                </Link>
              </div>
              <div className="mt-32">
                <div className="flex justify-between">
                  <div className="w-1/3">
                    <div>
                      <img src={flag_triangle} className="w-16 h-16" />
                    </div>
                    <div className="mt-8 font-black text-xl leading-8 tracking-wide text-gray">
                      Are You Creator?
                    </div>
                    <div className="mt-4 font-semibold text-sm leading-6 text-space-gray text-opacity-80 tracking-wide">
                      <Link to="/business">
                        <span className="text-chat-tag cursor-pointer">
                          Apply for listing
                        </span>
                      </Link>{" "}
                      and <br />
                      maximazie engagement
                    </div>
                  </div>
                  <div className="w-1/3">
                    <div>
                      <img src={manager} className="w-16 h-16 m-auto" />
                    </div>
                    <div className="mt-8 font-black text-xl leading-8 tracking-wide text-gray text-center">
                      Inviting Friends?
                    </div>
                    <div className="mt-4 font-semibold text-sm leading-6 text-space-gray text-opacity-80 tracking-wide text-center">
                      Invite friends to register through <br />
                      the{" "}
                      <Link to="/referral-program">
                        <span className="text-chat-tag cursor-pointer">
                          referral
                        </span>
                      </Link>{" "}
                      link or QR code
                    </div>
                  </div>
                  <div className="w-1/3">
                    <div>
                      <img src={message} className="w-16 h-16 ml-auto" />
                    </div>
                    <div className="mt-8 font-black text-xl leading-8 tracking-wide text-gray text-right">
                      Can’t Find Answer?
                    </div>
                    <div className="mt-4 font-semibold text-sm leading-6 text-space-gray text-opacity-80 tracking-wide text-right">
                      Contact us via{" "}
                      <span className="text-chat-tag cursor-pointer">
                        {" "}
                        <a href="mailto:support@raidwin.com">e-mail</a>{" "}
                      </span>{" "}
                      <br />
                      or live-chat
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Box>

        {/* Mobile view */}

        <Box
          sx={{ display: { xs: "block", sm: "block", md: "none", lg: "none" } }}
        >
          <div className="">
            <div className="pb-12">
              <div className="flex justify-around gap-4 mt-20">
                <Link to="/getting-started">
                  <img src={requirement} className="mx-auto w-20 h-20" />
                  <div className="mt-4 font-black text-sm text-center tracking-wide leading-6 text-gray capitalize">
                    Getting Started
                  </div>
                </Link>
                <Link to="/Myaccount">
                  <img src={license} className="ml-auto w-20 h-20" />
                  <div className="mt-4 font-black text-sm text-center tracking-wide leading-6 text-gray capitalize">
                    My Account
                  </div>
                </Link>
              </div>
              <div className="flex justify-around gap-4 mt-20">
                <Link to="/prabablyfair">
                  <img src={troubleshoot} className="mx-auto w-20 h-20" />
                  <div className="mt-4 font-black text-sm text-center tracking-wide leading-6 text-gray capitalize">
                    Provably Fair
                  </div>
                </Link>
                <Link to="/deposits">
                  <img src={mirror} className="ml-auto w-20 h-20" />
                  <div className="mt-4 font-black text-sm text-right tracking-wide leading-6 text-gray capitalize">
                    Deposits & Withdrawals
                  </div>
                </Link>
              </div>
              <div className="flex justify-around gap-4 mt-20">
                <Link to="/faq">
                  <img src={clouds} className="m-auto w-20 h-20" />
                  <div className="mt-4 font-black text-center text-sm tracking-wide leading-6 text-gray capitalize">
                    FAQ
                  </div>
                </Link>
              </div>
              <div className="mt-32 ">
                <div className="block justify-between">
                  <div className="mt-12">
                    <div>
                      <img src={flag_triangle} className="w-16 h-16 m-auto" />
                    </div>
                    <div className="mt-8 font-black text-xl leading-8 tracking-wide text-gray text-center">
                      Are You Creator?
                    </div>
                    <div className="mt-4 font-semibold text-sm leading-6 text-space-gray text-opacity-80 tracking-wide text-center">
                      <Link to="/business">
                        <span className="text-chat-tag cursor-pointer">
                          Apply for listing
                        </span>
                      </Link>{" "}
                      and <br />
                      maximazie engagement
                    </div>
                  </div>
                  <div className="mt-12">
                    <div>
                      <img src={manager} className="w-16 h-16 m-auto" />
                    </div>
                    <div className="mt-8 font-black text-xl leading-8 tracking-wide text-gray text-center">
                      Inviting Friends?
                    </div>
                    <div className="mt-4 font-semibold text-sm leading-6 text-space-gray text-opacity-80 tracking-wide text-center">
                      Invite friends to register through <br />
                      the{" "}
                      <Link to="/referral-program">
                        <span className="text-chat-tag cursor-pointer">
                          referral
                        </span>
                      </Link>{" "}
                      referral link or QR code
                    </div>
                  </div>
                  <div className="mt-12">
                    <div>
                      <img src={message} className="w-16 h-16 m-auto" />
                    </div>
                    <div className="mt-8 font-black text-xl leading-8 tracking-wide text-gray text-center">
                      Can’t Find Answer?
                    </div>
                    <div className="mt-4 font-semibold text-sm leading-6 text-space-gray text-opacity-80 tracking-wide text-center">
                      Contact us via{" "}
                      <span className="text-chat-tag cursor-pointer">
                        {" "}
                        <a href="mailto:support@raidwin.com">e-mail</a>{" "}
                      </span>{" "}
                      <br />
                      or live-chat
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Box>
      </div>
    </>
  );
}
