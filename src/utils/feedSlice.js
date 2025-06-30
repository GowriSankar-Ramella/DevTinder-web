import { createSlice } from "@reduxjs/toolkit";

const feedSlice = createSlice({
    name: "feed",
    initialState: null,
    reducers: {
        addFeed: (state, action) => {
            return action.payload
        },
        removeuser: (state, action) => {
            return state.filter(user => user._id !== action.payload)
        }
    }
})

export const { addFeed, removeuser } = feedSlice.actions

export default feedSlice.reducer