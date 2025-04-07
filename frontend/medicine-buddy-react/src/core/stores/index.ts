import { configureStore } from '@reduxjs/toolkit'
// import { loggerMiddleware } from './middlewares/loggerMiddleware'
import authReducer from "./slices/authSlice";
import stepsReducer from "./slices/stepsSlice";

export const store = configureStore({
  reducer: {
    authReducer: authReducer,
    stepsReducer: stepsReducer,
  },
  // middleware: (getDefaultMiddleware) => [...getDefaultMiddleware(), loggerMiddleware],
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;