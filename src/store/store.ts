import { configureStore } from "@reduxjs/toolkit";
import { checkoutApi } from "./checkoutApi";
import { ordersApi } from "./ordersApi";

export const store = configureStore({
  reducer: {
    [checkoutApi.reducerPath]: checkoutApi.reducer,
    [ordersApi.reducerPath]: ordersApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(checkoutApi.middleware)
      .concat(ordersApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
