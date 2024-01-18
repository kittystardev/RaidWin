import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { baseUrl } from "../utils/utils";

let initialState = {
    // data: {},
    userInfo: {
        _id: "",
        bio: "",
        email: "",
        profileImage: "",
        twitter: "",
        userName: "",
        websiteLink: "",
    }
}
export const UserSlice = createSlice({
    name: 'userInfo',
    initialState: {
        ...initialState
    },
    reducers: {
        resetUserInfo: (state, action) => {
            return initialState;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchUserData.fulfilled, (state, actions) => {
            state.userInfo = actions.payload
        })
    }
})

export const { resetUserInfo } = UserSlice.actions;

export default UserSlice.reducer;
export const fetchUserData = createAsyncThunk(
    'userInfo/fetchUserData',
    async (args, thunkAPI) => {
        const resp = await fetch(`${baseUrl}/player/${args}`);
        let userInfo = await resp.json();
        return userInfo;
    }
)