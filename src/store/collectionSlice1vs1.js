import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { baseUrl, imagePath } from "../utils/utils";

export const Status = Object.freeze({
  IDLE: "idle",
  LOADING: "loading",
  ERROR: "error",
});

let initialState = {
  status: Status.IDLE,
  collections1vs1: [],
  timeStamp: -1,
};
export const collectionsSlice1vs1 = createSlice({
  name: "collections1vs1",
  initialState: {
    ...initialState,
  },
  reducers: {
    setNumberOfJoined: (data, action) => {
      const { collection_mint, joined } = action.payload;
      data.collections1vs1 = data.collections1vs1.map((ele) => {
        if (ele.collection_mint === collection_mint) {
          return { ...ele, joined };
        }
        return ele;
      });
    },
    setSortingId: (data, action) => {
      data.sortingId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCollections1vs1.fulfilled, (state, actions) => {
        state.status = Status.IDLE;
        state.timeStamp = Date.now();
        state.collections1vs1 = actions.payload;
      })
      .addCase(fetchCollections1vs1.rejected, (state, action) => {
        state.status = Status.ERROR;
      })
      .addCase(fetchCollections1vs1.pending, (state, action) => {
        state.status = Status.LOADING;
      });
  },
});
export const { setNumberOfJoined, setSortingId } = collectionsSlice1vs1.actions;
export default collectionsSlice1vs1.reducer;

export const fetchCollections1vs1 = createAsyncThunk(
  "collections1vs1/fetchCollections1vs1",
  async (args, thunkAPI) => {
    const resp = await fetch(`${baseUrl}/collectioninfo`);
    let collections1vs1 = await resp.json();
    collections1vs1 = collections1vs1.map((ele, index) => {
      return {
        title: ele.title,
        content: ele.desc,
        creators: ele.creators,
        banner: `${imagePath}${ele.bannerPath}`,
        profile: `${imagePath}profile400/${ele.profilePath}`,
        collection_mint: ele.collection_mint,
        joined: ele.joined,
        floorPrice: ele.floorPrice,
        gamesState: ele.gamesState,
        slug: ele.slug,
        collectionName: ele.collectionName,
      };
    });
    return collections1vs1;
  }
);
