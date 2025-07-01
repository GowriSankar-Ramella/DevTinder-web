import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"
import { BASE_URL } from "../constants"

export const checkAuthStatus = createAsyncThunk("auth/checkAuthStatus", async () => {
    const res = await axios.get(BASE_URL + "/profile/view", { withCredentials: true })
    console.log(res)
    return res.data.data.user
})
const authSlice = createSlice({
    name: "auth",
    initialState: {
        isLoading: true,
        user: null
    },
    reducers: {
        addUser: (state, action) => {
            state.user = action.payload
            state.isLoading = false
        },
        removeUser: (state, action) => {
            state.user = null
            state.isLoading = false
        }
    },
    extraReducers: (builder) => {
        builder.addCase(checkAuthStatus.fulfilled, (state, action) => {
            state.user = action.payload
            console.log("user set")
            state.isLoading = false
        }).addCase(checkAuthStatus.rejected, (state, action) => {
            state.user = null
            console.log("user set to null")
            state.isLoading = false
        })
    }
})

export const { addUser, removeUser } = authSlice.actions

export default authSlice.reducer