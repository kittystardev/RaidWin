import { createSlice} from "@reduxjs/toolkit";

let initialState = {
    priceUsdt: 0,
    tpsValue: 0,
    floorPice: 0,
}

export const solanaprice = createSlice({
    name: "solanaprice",
    initialState: {
        ...initialState
    },
    reducers: {
        setUsdtPrice: (data, action) =>{
            data.priceUsdt = action.payload
        },
        setTpsValue: (data, action) => {
            data.tpsValue = action.payload
        },
        setFloorPrice: (data, action) =>{
            data.floorPice = action.payload
        }
    }
})

export const { setUsdtPrice, setTpsValue, setFloorPrice } = solanaprice.actions;
export default solanaprice.reducer