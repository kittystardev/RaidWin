// pageTitleSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { baseUrl } from "../utils/utils";

// Async Thunk for API Call

export const fetchPageTitles = createAsyncThunk(
  "pageTitles/fetchPageTitles",
  async (userId, thunkAPI) => {
    try {
      const response = await fetch(`${baseUrl}/page-titles`);
      if (!response.ok) throw new Error("Network response was not ok");

      let data = await response.json();
      return data; // Return data from API
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Create Slice
const pageTitleSlice = createSlice({
  name: "pageTitle",
  initialState: { entities: [], loading: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPageTitles.pending, (state, action) => {
        state.loading = "loading";
      })
      .addCase(fetchPageTitles.fulfilled, (state, action) => {
        state.loading = "idle";
        state.entities = action.payload.data;
      })
      .addCase(fetchPageTitles.rejected, (state, action) => {
        state.loading = "idle";
        state.error = action.error.message;
      });
  },
});

export default pageTitleSlice.reducer;
