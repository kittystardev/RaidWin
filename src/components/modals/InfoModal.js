import { Box, IconButton, Modal } from "@mui/material";
import React from "react";
import CloseIcon from "@mui/icons-material/Close";
import { Share } from "@mui/icons-material";
import { useLocation } from "react-router-dom";
import { Menu } from "@headlessui/react";
import ShareOption from "../ShareOption";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "#1C2438",
  // border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  borderRadius: "24px",
  "@media (max-width: 425px)": {
    width: 300,
  },
};

export default function InfoModal(props) {
  // console.log("firstddd", props.roundDetails);
  const location = useLocation();
  // console.log("roundDetails", props?.userData);
  // const isGame = location.pathname.pu;
  if (props.roundDetails) {
    // console.log("roundDetails", props);

    // function generateLink() {
    //   const basePath =
    //     location.pathname === "/"
    //       ? props.roundDetails?.losers?.length === 5
    //         ? "/winnertakesall"
    //         : "/dogevscheems"
    //       : props.roundDetails?.winningNFT?.length === 5
    //       ? "/winnertakesall"
    //       : location.pathname === props?.userData &&
    //         props.roundDetails?.players?.length === 6
    //       ? "/winnertakesall"
    //       : "/dogevscheems";

    //   const slugOrMintName = props.roundDetails?.slug
    //     ? props.roundDetails?.slug
    //     : props.roundDetails?.collection_mint_name;

    //   return `${basePath}/${slugOrMintName}?gameId=${props.roundDetails?.account}#game`;
    // }

    function generateLink() {
      let basePath = "/dogevscheems"; // Default path

      if (location.pathname === "/") {
        if (
          props.roundDetails?.losers?.length === 5 ||
          props.roundDetails?.winningNFT?.length === 5
        ) {
          basePath = "/winnertakesall";
        }
      } else if (props.roundDetails?.winningNFT?.length === 5) {
        basePath = "/winnertakesall";
      } else if (
        (location.pathname.slice(1) === props?.userData ||
          location.pathname.slice(1) === props?.userPubkey) &&
        props.roundDetails?.players?.length === 6
      ) {
        basePath = "/winnertakesall";
      }

      const slugOrMintName = props.roundDetails?.slug
        ? props.roundDetails?.slug
        : props.roundDetails?.collection_mint_name;

      return `${basePath}/${slugOrMintName}?gameId=${props.roundDetails?.account}#game`;
    }

    return (
      <Modal
        open={props.open}
        onClose={props.onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="flex items-center justify-between">
            <div className="text-gray">Round information</div>
            <IconButton
              aria-label="close"
              size="medium"
              onClick={props.onClose}
            >
              <CloseIcon sx={{ color: "#6A707F" }} />
            </IconButton>
          </div>
          <hr />
          <div className="flex justify-between mt-4 ">
            <div className="text-gray">Round ID</div>
            <div className="text-space-gray">
              {/* {props.roundDetails.account} */}

              {props.roundDetails.account?.substring(0, 8) +
                " ... " +
                props.roundDetails.account?.substring(
                  props.roundDetails.account?.length - 6
                )}
            </div>
          </div>
          <div className="flex justify-between mt-4">
            <div className="text-gray ">Client Seed</div>
            <div className=" text-space-gray">
              {/* {props.roundDetails.client_seed} */}
              {props.roundDetails.client_seed?.substring(0, 8) +
                " ... " +
                props.roundDetails.client_seed?.substring(
                  props.roundDetails.client_seed?.length - 6
                )}
            </div>
          </div>
          {/* <div className='flex justify-between mt-4'>
                        <div className='text-gray'>
                            Transaction Link
                        </div>
                        <div className='text-space-gray'>
                            {props.roundDetails.account?.substring(0, 8) + " ... " + props.roundDetails.account?.substring(props.roundDetails.account?.length - 6)}
                        </div>
                    </div> */}

          <div className="flex justify-between mt-4">
            <a
              className="bg-nouveau-main bg-opacity-[0.08] rounded-lg px-6 py-3 text-space-gray font-bold"
              // href={`/winnertakesall/${props.roundDetails.collection_mint}/${props.roundDetails.account}#game`}
              href={generateLink()}
            >
              Replay
            </a>
            <div className="">
              <Menu as="div" className="relative inline-block text-left">
                <div>
                  <Menu.Button
                    className="mt-3 cursor-pointer"
                    // onClick={() => {
                    //   navigator.clipboard.writeText(
                    //     `${window.location.protocol}://${window.location.hostname}:${window.location.port}/winnertakesall/${props.roundDetails.collection_mint}/${props.roundDetails.account}`
                    //   );
                    // }}
                  >
                    <Share />
                  </Menu.Button>
                </div>
                <ShareOption></ShareOption>
              </Menu>
            </div>
          </div>
        </Box>
      </Modal>
    );
  } else {
    return <></>;
  }
}
