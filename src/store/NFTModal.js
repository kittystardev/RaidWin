import { createSlice } from "@reduxjs/toolkit";

let initialCartState = {
  alertdata: {
    info: "",
    open: false,
    response: "",
  },
  gameId: "",
  is1v1: false,
  side: "",
  collectionMint: "",
  nftmodal: false,
  creators: [],
};
const slice = createSlice({
  name: "Index",
  initialState: {
    ...initialCartState,
  },
  reducers: {
    setAlertIdx: (data, action) => {
      data.alertdata = action.payload;
    },
    setModalIdx: (data, action) => {
      const obj = action.payload;
      data.nftmodal = obj.modal;
      data.collectionMint = obj.collectionMint;
      data.gameId = obj.gameId;
      data.is1v1 = obj.is1v1;
      data.creators = obj.creators;
      if (obj.is1v1 === true) {
        data.side = obj.side;
      }
    },
    setModalOpen: (data, action) => {
      data.nftmodal = action.payload;
    },
  },
});
export const { setAlertIdx, setModalIdx, setModalOpen } = slice.actions;
export default slice.reducer;
