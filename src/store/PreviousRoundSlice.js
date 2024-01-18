import { createSlice } from "@reduxjs/toolkit";

let initialCartState = {
    rounds:[]
}

/* {
        id: Round id,
        playerImage: player image,
        playerName: Player Name
        winningNFT: [] 
        floorPrice:  Number
        total: Number
        ROI: Return on investment
 } */
const slice = createSlice({
    name: 'PreviousRound',
    initialState: {
        ...initialCartState
    },
    reducers: {
        addRound: (data, action) => {
            data.rounds.push(action.payload);
        }, 
        setRounds: (data, action) => {
            data.rounds = action.payload;
        },
    }
})
export const { addRound, setRounds } = slice.actions;
export default slice.reducer
