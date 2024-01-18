import React from "react";
import Marquee from "react-fast-marquee";
import boost_speaker from "../assets/images/boost_speaker.png";
import business1 from "../assets/images/business1.png";
import business2 from "../assets/images/business2.png";
import business3 from "../assets/images/business3.png";
import business4 from "../assets/images/business4.png";
import business5 from "../assets/images/business5.png";
import revenue_sharing from "../assets/images/revenue_sharing.png";
import utility from "../assets/images/utility.png";

export default function Business() {
  return (
    <div>
      <div className="block sm:block md:block lg:flex gap-20">
        <div className="w-full sm:w-full md:w-full lg:w-[30%]">
          <img src={boost_speaker} />
        </div>
        <div className="w-full sm:w-full md:w-full lg:w-1/2 flex items-center">
          <div>
            <div className="text-[36px] sm:text-[36px] md:text-[36px] lg:text-[56px] font-extrabold leading-[44px] sm:leading-[44px] md:leading-[44px] lg:leading-[72px] text-center sm:text-center md:text-center lg:text-left tracking-tight text-gray">
              Boost Engagement
            </div>
            <div className="font-semibold text-sm leading-6 text-space-gray mt-4 text-center sm:text-center md:text-center lg:text-left">
              Supercharge your community by increasing engagement and adding new
              utility for the holders of your collectibles
            </div>
            <div className="text-center sm:text-center md:text-center lg:text-left">
              <button className="bg-chat-tag rounded-lg  font-bold  text-sm leading-6 text-white mt-10 tracking-wide py-3 px-6 w-fit">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="my-28">
        <Marquee className="gap-5 flex" speed={100}>
          <div className="ml-4 flex gap-10">
            <div>
              <img src={business1} />
            </div>
            <div>
              <img src={business2} />
            </div>
            <div>
              <img src={business3} />
            </div>
            <div>
              <img src={business4} />
            </div>
            <div>
              <img src={business5} />
            </div>
          </div>
        </Marquee>
      </div>
      <div className="block sm:block md:block lg:flex ">
        <div className="w-full sm:w-full md:w-full lg:w-1/2">
          <div className="block sm:block md:block lg:flex gap-6 text-center sm:text-center md:text-center lg:text-left">
            <div>
              <img src={revenue_sharing} className="mx-auto" />
            </div>
            <div>
              <div className="font-extrabold text-4xl text-gray mt-6 sm:mt-6 md:mt-6 lg:mt-0">
                Revenue Sharing
              </div>
              <div className="font-semibold text-sm text-space-gray my-4">
                Earn 30% of the fees earned from the games <br />
                played in your community
              </div>
              <div className="mt-16">
                <button className="bg-chat-tag rounded-lg  font-bold  text-sm leading-6 text-white  tracking-wide py-3 px-6 w-fit">
                  Get Started
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full sm:w-full md:w-full lg:w-1/2">
          <div className="block sm:block md:block lg:flex gap-6 text-center sm:text-center md:text-center lg:text-left justify-end mt-20 sm:mt-20 md:mt-20 lg:mt-0">
            <div className="">
              <img src={utility} className="mx-auto" />
            </div>
            <div>
              <div className="font-extrabold text-4xl text-gray mt-6 sm:mt-6 md:mt-6 lg:mt-0">
                Increase Utility
              </div>
              <div className="font-semibold text-sm text-space-gray my-4">
                Give your collectibles extra utility by allowing <br />
                your community to play with them
              </div>
              <div className="my-16">
                <button className="bg-chat-tag rounded-lg  font-bold  text-sm leading-6 text-white  tracking-wide py-3 px-6 w-fit">
                  Get Started
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
