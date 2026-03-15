import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface OrderItem {
  name: string;
  variant: string;
  price: number;
  quantity: number;
  image?: string;
  size?: string;
}

interface CheckoutRequest {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  apartment?: string;
  city: string;
  state?: string;
  postalCode?: string;
  phone: string;
  orderItems: OrderItem[];
  subtotal: number;
  shipping: string;
  total: number;
}

interface CheckoutResponse {
  message: string;
  orderId: string;
}

export interface Order {
  _id: string;
  contact: { email: string };
  deliveryAddress: {
    firstName: string;
    lastName: string;
    address: string;
    apartment?: string;
    city: string;
    state?: string;
    postalCode?: string;
    phone: string;
  };
  orderItems: OrderItem[];
  subtotal: number;
  shipping: string;
  total: number;
  status: string;
  createdAt: string;
  updatedAt?: string;
}

export const checkoutApi = createApi({
  reducerPath: "checkoutApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:4000/api" }),
  endpoints: (builder) => ({
    placeOrder: builder.mutation<CheckoutResponse, CheckoutRequest>({
      query: (order) => ({
        url: "/checkout",
        method: "POST",
        body: order,
      }),
    }),
    getOrder: builder.query<Order, string>({
      query: (id) => `/orders/${id}`,
    }),
  }),
});

export const { usePlaceOrderMutation, useGetOrderQuery } = checkoutApi;
