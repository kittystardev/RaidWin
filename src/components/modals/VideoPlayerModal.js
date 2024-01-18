import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useRef, useState } from "react";

export default function VideoPlayerModal({ isOpen, closeModal }) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex h-screen items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-4/5 transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <main className="h-[50vh]">
                  <div className="flex items-center justify-center h-full w-full relative">
                    <img
                      src="https://files.kick.com/images/channel/1770127/banner_image/291e04d9-6347-4be4-b03e-bf531d747883"
                      className="h-full w-full object-cover absolute z-[-10]"
                    />
                    <div className="fixed bottom-0 right-10">
                      <a
                        href="https://kick.com"
                        target="_blank"
                        title="Kick.com"
                      >
                        <div
                          style={{ width: 96, height: 96 }}
                        >
                          <svg
                            width={96}
                            height={96}
                            viewBox="0 0 80 26"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M0 0H8.57143V5.71429H11.4286V2.85714H14.2857V0H22.8571V8.57143H20V11.4286H17.1429V14.2857H20V17.1429H22.8571V25.7143H14.2857V22.8571H11.4286V20H8.57143V25.7143H0V0ZM57.1429 0H65.7143V5.71429H68.5714V2.85714H71.4286V0H80V8.57143H77.1429V11.4286H74.2857V14.2857H77.1429V17.1429H80V25.7143H71.4286V22.8571H68.5714V20H65.7143V25.7143H57.1429V0ZM25.7143 0H34.2857V25.7143H25.7143V0ZM45.7143 0H40V2.85714H37.1429V22.8571H40V25.7143H45.7143H54.2857V17.1429H45.7143V8.57143H54.2857V0H45.7143Z"
                              fill="white"
                            />
                          </svg>
                        </div>
                      </a>
                    </div>
                    <div className="flex flex-row gap-4 lg:gap-5 xl:gap-16 w-full sm:w-fit">
                      <div className="sm:block sm:w-[300px] rounded overflow-hidden relative">
                        <img src="https://images.kick.com/video_thumbnails/7wZNkCkHF8Wa/ys2KBZQo2gRG/720.webp" className="aspect-video inset-0 absolute z-[-10] w-full h-full" />
                        <div className="flex items-center bg-[#191b1fcc] h-8 absolute left-0 top-0 px-2 w-full">
                          <span className="text-sm">
                            GMHikaru's latest stream{" "}
                          </span>
                        </div>
                        <a
                          href="https://kick.com/video/60c78573-7768-4972-9b07-d3777f7d3d93"
                          target="_blank"
                          title="Kick.com"
                        >
                          <div className="opacity-100 flex items-center justify-center h-full w-full">
                            <div style={{ width: 28, height: 28 }}>
                              <svg
                                width={28}
                                height={28}
                                viewBox="0 0 16 16"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M6.5 2H3.5V14H6.5L12.5 9V7L6.5 2Z"
                                  fill="currentColor"
                                />
                              </svg>
                            </div>
                          </div>
                        </a>
                      </div>
                      <div className="sm:w-[300px] sm:rounded backdrop-blur-sm bg-[#191b1fcc] flex flex-col gap-4 p-5">
                        <div className="bg-[#f4f9fd] rounded-sm">Offline</div>
                        <a
                          href="https://kick.com/gmhikaru"
                          target="_blank"
                          className="group-hover/informations:text-action-base"
                          title="Kick.com"
                        >
                          <h1 className="text-white hover:text-light-green text-xl">Meet GMHikaru</h1>
                        </a>
                        <p>
                          Grandmaster Hikaru Nakamura, 5-time United States
                          Chess Champion, Content Creator for Misfits Gaming
                        </p>
                      </div>
                    </div>
                  </div>
                </main>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
