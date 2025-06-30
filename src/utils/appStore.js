import { configureStore } from '@reduxjs/toolkit';
import AuthReducer from "./authSlice"
import FeedReducer from "./feedSlice"

const appStore = configureStore({
    reducer: {
        auth: AuthReducer,
        feed: FeedReducer
    }
})

export default appStore