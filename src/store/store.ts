import { configureStore } from "@reduxjs/toolkit";
import { checkoutApi } from "./checkoutApi";

export const store = configureStore({
  reducer: {
    [checkoutApi.reducerPath]: checkoutApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(checkoutApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
