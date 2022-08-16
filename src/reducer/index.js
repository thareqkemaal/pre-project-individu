import { configureStore } from '@reduxjs/toolkit';
import { userReducer } from './userReducer'

export const rootStore = configureStore({
    reducer: {
        userReducer,
    }
})