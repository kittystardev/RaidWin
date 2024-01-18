import { Menu, MenuItem } from "@mui/material";
import React from "react";
import styled from "styled-components";

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
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

export default function MenuItems(props) {
  return (
    <StyledMenu
      anchorEl={props.anchorEl}
      id="account-menu"
      open={props.open}
      onClose={props.handleClose}
      onClick={props.handleClose}
      transformOrigin={{ horizontal: "right", vertical: "top" }}
      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
    >
      <div
        className="py-5 -ml-3 hover:bg-yankees-blue hover:bg-opacity-50 hover:rounded-lg cursor-pointer hover:text-gray"
        onClick={props.handleClose}
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
              d="M16 14V21M16 21L19 18M16 21L13 18M1 4V10C1 10 1 13 8 13C15 13 15 10 15 10V4"
              stroke="#6A7080"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M8 19C1 19 1 16 1 16V10M8 1C15 1 15 4 15 4C15 4 15 7 8 7C1 7 1 4 1 4C1 4 1 1 8 1Z"
              stroke="#6A7080"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <div className="">Withdraw</div>
        </div>
      </div>
    </StyledMenu>
  );
}
