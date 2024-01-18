import { createSlice } from "@reduxjs/toolkit";
let tokenDetails = sessionStorage.getItem("solwin_token");
// console.log("tokenDetails", tokenDetails)
let accessToken = "";
let userPubKey = "";
if(tokenDetails !== null) {
    const obj = JSON.parse(tokenDetails);
    accessToken = obj.token;
    userPubKey = obj.userPubKey;
}
let initialState = {
    accessToken,
    userPubKey, 
    pubKey: "",
    modalOpen: false,
    fromGammeJoin: false,
    collectionMintForModal: "",
    nftList: [],
    dataLoaded: true
}
export const tempSlice = createSlice({
    name: 'Temp',
    initialState: {
        ...initialState
    },
    reducers: {
        setAccessTokenDetails: (data, action) => {
            data.accessToken = action.payload.token;
            data.userPubKey = action.payload.userPubKey;
        },
        setPubKey: (data, action) => {
            data.pubKey = action.payload;
        },
        setNftList: (data, action) => {
            data.nftList = action.payload;
        },
        setConnectModalToggle: (data, action) => {
            data.modalOpen = !data.modalOpen;
        },
        setConnectModal: (data, action) => {
            data.modalOpen = action.payload;
        },
        setFromGameJoin: (data, action) => {
            data.fromGammeJoin = action.payload;
        },
        setCollectionMintForModal: (data, action) => {
            data.collectionMintForModal = action.payload;
        },
        setDataLoaded: (data, action) => {
            data.dataLoaded = action.payload;
        },
        resetNftList: (data, action) => {
            data.nftList = [];
        }
    }
})
export const { setAccessTokenDetails, setPubKey, setNftList, setDataLoaded, resetNftList, setConnectModalToggle, setFromGameJoin, setConnectModal, setCollectionMintForModal } = tempSlice.actions;
export default tempSlice.reducer