import { createSlice } from "@reduxjs/toolkit";

let initialState = {
  topPlayer: [],
  isMuted: !Boolean(localStorage.getItem("mute")),
};

export const topplayer = createSlice({
  name: "topPlayer",
  initialState: {
    ...initialState,
  },
  reducers: {
    setTopPlayer: (data, action) => {
      data.topPlayer = action.payload;
    },
    setIsMuted: (data, action) => {
      data.isMuted = action.payload;
    },
  },
});

export const { setTopPlayer, setIsMuted } = topplayer.actions;
export default topplayer.reducer;
