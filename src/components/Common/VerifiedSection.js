import React from "react";
import shiledcorrect from "../../assets/images/shiledcorrect.svg";
import VerifiedModal from "../modals/VerifiedModal";

export default function VerifiedSection() {
  const [verifyModalOpen, setVerifyModalOpen] = React.useState(false);
  const verifyModal = () => setVerifyModalOpen(true);
  const CloseModal = () => setVerifyModalOpen(false);
  return (
    <>
      <div
        className="w-[35%] ml-auto sm:ml-11 md:ml-16 lg:ml-[300px] xl:ml-[400px] 2xl:ml-auto mr-2 px-0 sm:px-6 sm:pl-0 lg:px-0 lg:pr-52 max-w-[100%] cursor-pointer"
        onClick={() => verifyModal()}
      >
        <div className="varifyness hidden xl:flex gap-10 py-4 px-8 header-fair-gradient tracking-wide font-bold text-space-gray rounded-[63px] absolute top-[21px] ">
          <div className="flex items-center gap-4 text-xs uppercase">
            <img src={shiledcorrect} className="w-5 h-5" alt="" />
            THIS GAME IS PROVABLY fair
          </div>
          <div className="flex items-center text-sm text-light-blue">
            Verify Fairness
          </div>
        </div>
      </div>
      <VerifiedModal
        open={verifyModalOpen}
        onClose={CloseModal}
      ></VerifiedModal>
    </>
  );
}
