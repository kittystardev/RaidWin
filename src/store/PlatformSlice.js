import { createSlice } from "@reduxjs/toolkit";
import { DummyPubKey } from "../utils/utils";

let initialState = {
  treasury_pubkey: DummyPubKey,
  platform_fees: "",
  penalty_fees: 0,
};

export const platformSlice = createSlice({
  name: "PlatFormInfo",
  initialState: {
    ...initialState,
  },
  reducers: {
    setTreasuryPubkey: (data, action) => {
      data.treasury_pubkey = action.payload;
    },
    setPlatformFees: (data, action) => {
      data.platform_fees = action.payload;
    },
    setPenaltyFees: (data, action) =>{
      data.penalty_fees = action.payload;
    },
  },
});

export const { setTreasuryPubkey, setPlatformFees, setPenaltyFees } = platformSlice.actions;
export default platformSlice.reducer