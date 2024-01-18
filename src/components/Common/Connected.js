import { Button, Menu, MenuItem } from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { setPubKey } from "../../store/TempSlice";
import { getAddress, handleImageError, imagePath, replaceSlug } from "../../utils/utils";
import { useState } from "react";
import { resetUserInfo } from "../../store/UserSlice";

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    // anchorOrigin={{
    //     vertical: 'bottom',
    //     horizontal: 'right',
    // }}
    // transformOrigin={{
    //     vertical: 'top',
    //     horizontal: 'right',
    // }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    backgroundColor: "#27314B",
    borderRadius: "24px",
    // marginTop: theme.spacing(1),
    padding: "24px",
    minWidth: 240,
  },
}));

const Menus = styled(MenuItem)`
  padding-left: 0px !important;
  padding-top: 20px !important;
`;

export default function Connected() {
  const { userInfo } = useSelector((state) => state.userInfo);
  const pubKey = useSelector((state) => state.Temp.pubKey);
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);
  // console.log(open)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const navigate = useNavigate();
  const pageNavigate = (page) => {
    navigate(`/${page}`);
  };

  return (
    <>
      <Button
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        sx={{
          "&:hover": {
            background: "none",
          },
        }}
        onClick={handleClick}
        className="hidden sm:flex md:hidden pl-5 pr-6 "
      >
        <div
          className={`flex sm:flex md:flex lg:flex xl:flex 2xl:flex gap-2 items-center ${
            open ? "bg-light-green p-2" : "bg-yankees-blue"
          } p-0 sm:p-2 md:p-2 lg:p-2 rounded-lg`}
        >
          <div className="hidden normal-case	 sm:flex md:flex lg:flex xl:flex 2xl:flex text-space-gray font-bold hover:text-gray">
            {userInfo.userName ? <div>{userInfo.userName}</div> : getAddress(pubKey.toString())}
          </div>
          <div className="overflow-hidden rounded-lg ">
            {userInfo.userName ? (
              <img
                src={`${imagePath}profile48/${userInfo.profileImage}`}
                onError={handleImageError}
                className="rounded-lg w-8 h-8 object-cover"
                alt=""
              />
            ) : (
              <div className="rounded-lg w-8 h-8 object-cover bg-chat-bg"></div>
              // <div className="custom-character bg-opacity-25">{pubKey[0].toString()}</div>
            )}
          </div>
        </div>
      </Button>

      <StyledMenu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <div className="text-gray font-black text-sm tracking-wide pb-9">
          {userInfo.userName ? <div>Hi {userInfo.userName}!</div> : getAddress(pubKey.toString())}
        </div>
        <Link
          to={`/${replaceSlug(userInfo.userName) || pubKey}`}
          state={{
            pubKey: pubKey,
          }}
        >
          <div
            className="py-5 -ml-3 hover:bg-yankees-blue hover:bg-opacity-50 hover:rounded-lg cursor-pointer hover:text-gray"
            onClick={handleClose}
          >
            <div className="text-space-gray flex gap-2 ml-3">
              <svg
                width="20"
                height="22"
                viewBox="0 0 20 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 21V19.75C1 17.4294 1.94821 15.2038 3.63604 13.5628C5.32387 11.9219 7.61305 11 10 11V11C12.3869 11 14.6761 11.9219 16.364 13.5628C18.0518 15.2038 19 17.4294 19 19.75V21M10 11C11.364 11 12.6721 10.4732 13.6365 9.53553C14.601 8.59785 15.1429 7.32608 15.1429 6C15.1429 4.67392 14.601 3.40215 13.6365 2.46447C12.6721 1.52678 11.364 1 10 1C8.63603 1 7.32792 1.52678 6.36345 2.46447C5.39898 3.40215 4.85714 4.67392 4.85714 6C4.85714 7.32608 5.39898 8.59785 6.36345 9.53553C7.32792 10.4732 8.63603 11 10 11V11Z"
                  stroke="#6A7080"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              <div className="">Profile</div>
            </div>
          </div>
        </Link>

        <Link to="/referral-program">
          <div
            className="py-5 -ml-3 hover:bg-yankees-blue hover:bg-opacity-50 hover:rounded-lg cursor-pointer hover:text-gray"
            onClick={handleClose}
          >
            <div className="text-space-gray flex gap-2 ml-3">
              <svg
                width="24"
                height="22"
                viewBox="0 0 24 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 21V18C1 16.1435 1.7375 14.363 3.05025 13.0503C4.36301 11.7375 6.14348 11 8 11C9.85652 11 11.637 11.7375 12.9497 13.0503C14.2625 14.363 15 16.1435 15 18V21"
                  stroke="#6A7080"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M13 13C13 11.6739 13.5268 10.4021 14.4645 9.46447C15.4021 8.52678 16.6739 8 18 8C18.6566 8 19.3068 8.12933 19.9134 8.3806C20.52 8.63188 21.0712 9.00017 21.5355 9.46447C21.9998 9.92876 22.3681 10.48 22.6194 11.0866C22.8707 11.6932 23 12.3434 23 13V14"
                  stroke="#6A7080"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M8 10C9.06087 10 10.0783 9.57857 10.8284 8.82843C11.5786 8.07828 12 7.06087 12 6C12 4.93913 11.5786 3.92172 10.8284 3.17157C10.0783 2.42143 9.06087 2 8 2C6.93913 2 5.92172 2.42143 5.17157 3.17157C4.42143 3.92172 4 4.93913 4 6C4 7.06087 4.42143 8.07828 5.17157 8.82843C5.92172 9.57857 6.93913 10 8 10V10ZM18 7C18.7956 7 19.5587 6.68393 20.1213 6.12132C20.6839 5.55871 21 4.79565 21 4C21 3.20435 20.6839 2.44129 20.1213 1.87868C19.5587 1.31607 18.7956 1 18 1C17.2044 1 16.4413 1.31607 15.8787 1.87868C15.3161 2.44129 15 3.20435 15 4C15 4.79565 15.3161 5.55871 15.8787 6.12132C16.4413 6.68393 17.2044 7 18 7Z"
                  stroke="#6A7080"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              <div className="">Referrals</div>
            </div>
          </div>
        </Link>

        <Link to="/setting">
          <div
            className="py-5 -ml-3 hover:bg-yankees-blue hover:bg-opacity-50 hover:rounded-lg cursor-pointer hover:text-gray"
            onClick={handleClose}
          >
            <div className="text-space-gray flex gap-2 ml-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <div className="">Settings</div>
            </div>
          </div>
        </Link>

        <div
          className="py-5 -ml-3 hover:bg-yankees-blue hover:bg-opacity-50 hover:rounded-lg cursor-pointer hover:text-gray"
          onClick={async () => {
            const provider = await window.solana;
            localStorage.removeItem("pubKey");
            provider.disconnect();
            dispatch(setPubKey(""));
            dispatch(resetUserInfo());
            handleClose();
          }}
        >
          <div className="text-space-gray flex gap-2 ml-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 rotate-180"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <div className="">Log Out</div>
          </div>
        </div>
      </StyledMenu>
    </>
  );
}
