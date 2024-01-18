import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { baseUrl, imagePath } from "../utils/utils";

export const Status = Object.freeze({
  IDLE: "idle",
  LOADING: "loading",
  ERROR: "error",
});

let initialState = {
  status: Status.IDLE,
  collections: [],
  timeStamp: -1,
  sortingId: 0,
};
export const collectionsSlice = createSlice({
  name: "collections",
  initialState: {
    ...initialState,
  },
  reducers: {
    setNumberOfJoined: (data, action) => {
      const { collection_mint, joined } = action.payload;
      data.collections = data.collections.map((ele) => {
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
      .addCase(fetchCollections.fulfilled, (state, actions) => {
        state.status = Status.IDLE;
        state.timeStamp = Date.now();
        if (state.sortingId === 4) {
          let collection = actions.payload;
          let sortedCollection = collection.slice();
          sortedCollection.sort((a, b) => {
            if (a.title.toLowerCase() > b.title.toLowerCase()) return -1; // Invert the comparison for Z to A
            if (a.title.toLowerCase() < b.title.toLowerCase()) return 1;
            return 0;
          });
          state.collections = sortedCollection;
          return;
        } else if (state.sortingId === 3) {
          let collection = actions.payload;
          let sortedCollection = collection.slice();
          sortedCollection.sort((a, b) => {
            if (a.title.toLowerCase() < b.title.toLowerCase()) return -1; // Convert to lowercase for case-insensitive comparison
            if (a.title.toLowerCase() > b.title.toLowerCase()) return 1;
            return 0;
          });
          state.collections = sortedCollection;
          return;
        } else if (state.sortingId === 2) {
          // High to low
          let collection = actions.payload;
          let sortedCollection = collection.slice();
          sortedCollection.sort((a, b) => b.floorPrice - a.floorPrice);
          state.collections = sortedCollection;
          return;
        } else if (state.sortingId === 1) {
          // Low to high
          let collection = actions.payload;
          let sortedCollection = collection.slice();
          sortedCollection.sort((a, b) => a.floorPrice - b.floorPrice);
          console.log("sortedCollection", sortedCollection);
          state.collections = sortedCollection;
          return;
        }
        state.collections = actions.payload;
      })
      .addCase(fetchCollections.rejected, (state, action) => {
        state.status = Status.ERROR;
      })
      .addCase(fetchCollections.pending, (state, action) => {
        state.status = Status.LOADING;
      });
  },
});
export const { setNumberOfJoined, setSortingId } = collectionsSlice.actions;
export default collectionsSlice.reducer;

export const fetchCollections = createAsyncThunk(
  "collections/fetchCollections",
  async (args, thunkAPI) => {
    const resp = await fetch(`${baseUrl}/collectioninfo`);
    let collections = await resp.json();
    collections = collections.map((ele, index) => {
      // console.log("ele", ele)
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
    return collections;
  }
);
