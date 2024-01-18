import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { baseUrl } from "../utils/utils";

let initialCartState = {
  gameId: "",
  players: [
    {
      id: 0,
      playerImage: "",
      playerName: "",
    },
    {
      id: 1,
      playerImage: "",
      playerName: "",
    },
    {
      id: 2,
      playerImage: "",
      playerName: "",
    },
    {
      id: 3,
      playerImage: "",
      playerName: "",
    },
    {
      id: 4,
      playerImage: "",
      playerName: "",
    },
    {
      id: -1,
      playerImage: "",
      playerName: "",
    },
  ],
};
const slice = createSlice({
  name: "Players",
  initialState: {
    ...initialCartState,
  },
  reducers: {
    setPlayer: (data, action) => {
      data.players[action.payload.index] = action.payload.data;
    },
    resetGameData: (data, action) => {
      data.players = initialCartState.players;
      data.gameId = "";
    },
    setGameId: (data, action) => {
      data.gameId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlayers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPlayers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.players = action.payload;
      })
      .addCase(fetchPlayers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});
export const { setPlayer, setGameId, resetGameData } = slice.actions;
export default slice.reducer;

export const fetchPlayers = createAsyncThunk(
  "players/fetchPlayers",
  async (userName) => {
    let endpoint = `${baseUrl}/searchPlayer`;

    // Check if userName is provided and is not an empty string.
    if (userName && userName.trim() !== "") {
      endpoint += `?userName=${userName}`;
    }

    const response = await fetch(endpoint);
    const data = await response.json();
    return data;
  }
);
