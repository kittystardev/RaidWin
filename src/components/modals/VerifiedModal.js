import { Box, Modal } from "@mui/material";
import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import VerifierSection from "../VerifierSection";
import InfoSection from "../Common/InfoSection";
import SettingsSection from "../Common/SettingsSection";
import { Disclosure } from "@headlessui/react";
import { MenuIcon, XIcon } from "@heroicons/react/outline";

export default function VerifiedModal({ open, onClose }) {
  const [activeTab, setActiveTab] = useState("settings");

  const navigation = [
    { name: "Info", tab: "info" },
    { name: "Settings", tab: "settings" },
    { name: "VERIFIER", tab: "verifier" },
  ];

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
          bgcolor: "#1C2438",
          boxShadow: 24,
          borderRadius: "24px",
          width: { xs: "80vw", sm: "65vw", md: "65vw", lg: "65vw" },
          maxHeight: { xs: "90vh", sm: "500px", md: "750px", lg: "750px" },
        }}
        className="verifyer_modal focus-visible:outline-none"
      >
        <div className="p-5 max-sm:px-2 md:p-7 lg:p-10 pb-0">
          {/* <div className='float-right'>
                        <IconButton aria-label="close" size="medium" onClick={onClose}>
                            <CloseIcon sx={{ color: '#6A707F' }} />
                        </IconButton>
                    </div> */}
          <Disclosure as="nav">
            {({ open }) => (
              <>
                <div className="flex justify-between w-full items-center">
                  <Disclosure.Button className="lg:hidden relative inline-flex items-center justify-center rounded-md p-2">
                    <span className="absolute -inset-0.5" />
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XIcon
                        className="block h-5 w-5 text-nouveau-main"
                        aria-hidden="true"
                      />
                    ) : (
                      <MenuIcon
                        className="block h-5 w-5 text-nouveau-main"
                        aria-hidden="true"
                      />
                    )}
                  </Disclosure.Button>
                  <div className="text-sm leading-8 font-black text-gray tracking-wide">
                    Provably Fair
                  </div>

                  <div className="hidden lg:flex justify-around gap-16 font-bold text-sm tracking-wide uppercase">
                    {navigation.map((item) => {
                      return (
                        <div
                          className={`${
                            activeTab === item.tab
                              ? "border-chat-tag border-b-2 text-gray cursor-pointer"
                              : "text-space-gray cursor-pointer"
                          }`}
                          onClick={() => setActiveTab(item.tab)}
                        >
                          {item.name}
                        </div>
                      );
                    })}
                    <div>
                      <CloseIcon
                        sx={{ color: "#6A707F", cursor: "pointer" }}
                        onClick={onClose}
                      />
                    </div>
                  </div>
                  <div className="lg:hidden block">
                    <CloseIcon
                      sx={{ color: "#6A707F", cursor: "pointer" }}
                      onClick={onClose}
                    />
                  </div>
                </div>
                <Disclosure.Panel className="lg:hidden block relative">
                  <div className="p-3 absolute uppercase w-32 bg-background rounded-md left-5">
                    {navigation.map((item, i) => (
                      <Disclosure.Button
                        key={i}
                        as="div"
                        className={`${
                          activeTab === item.tab
                            ? "text-gray cursor-pointer"
                            : "text-space-gray cursor-pointer"
                        }`}
                        onClick={() => setActiveTab(item.tab)}
                      >
                        {item.name}
                      </Disclosure.Button>
                    ))}
                  </div>
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        </div>
        <div className="px-5 max-sm:px md:px-7 lg:px-10">
          {activeTab === "info" ? (
            <InfoSection />
          ) : activeTab === "settings" ? (
            <SettingsSection />
          ) : (
            <VerifierSection />
          )}
        </div>
      </Box>
    </Modal>
  );
}
