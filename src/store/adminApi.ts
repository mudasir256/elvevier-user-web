import { createApi } from "@reduxjs/toolkit/query/react";
import type { ColorGallery, Product, ProductVariant } from "@/types";
import { adminBaseQuery } from "./baseQuery";

export type AdminSession = {
  email: string;
  name: string;
};

export type AdminLoginResponse = {
  token: string;
  admin: AdminSession;
};

export type ProductPayload = {
  name: string;
  price: number;
  compareAtPrice: string;
  categoryId: string;
  subcategory: string;
  color: string;
  variants: ProductVariant[];
  colorImages: ColorGallery[];
  description: string;
  image: string;
  images: string[];
  featured: boolean;
  new: boolean;
  active: boolean;
};

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: adminBaseQuery,
  tagTypes: ["AdminProduct", "AdminSession"],
  refetchOnFocus: true,
  refetchOnReconnect: true,
  keepUnusedDataFor: 120,
  endpoints: (builder) => ({
    adminLogin: builder.mutation<AdminLoginResponse, { email: string; password: string }>({
      query: (body) => ({ url: "/admin/login", method: "POST", body }),
    }),
    adminMe: builder.query<AdminSession, void>({
      query: () => "/admin/me",
      providesTags: ["AdminSession"],
    }),
    getAdminProducts: builder.query<Product[], { category?: string; search?: string }>({
      query: ({ category, search } = {}) => {
        const params = new URLSearchParams();
        if (category && category !== "all") params.set("category", category);
        if (search) params.set("search", search);
        const query = params.toString();
        return `/admin/products${query ? `?${query}` : ""}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map((product) => ({ type: "AdminProduct" as const, id: product.id })),
              { type: "AdminProduct" as const, id: "LIST" },
            ]
          : [{ type: "AdminProduct" as const, id: "LIST" }],
    }),
    createProduct: builder.mutation<{ id: string }, ProductPayload>({
      query: (body) => ({ url: "/admin/products", method: "POST", body }),
      invalidatesTags: [{ type: "AdminProduct", id: "LIST" }],
    }),
    updateProduct: builder.mutation<{ ok: boolean }, { id: string; body: ProductPayload }>({
      query: ({ id, body }) => ({ url: `/admin/products/${id}`, method: "PATCH", body }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "AdminProduct", id },
        { type: "AdminProduct", id: "LIST" },
      ],
    }),
    deleteProduct: builder.mutation<{ ok: boolean }, string>({
      query: (id) => ({ url: `/admin/products/${id}`, method: "DELETE" }),
      invalidatesTags: (_result, _error, id) => [
        { type: "AdminProduct", id },
        { type: "AdminProduct", id: "LIST" },
      ],
    }),
    uploadProductImages: builder.mutation<{ url?: string; urls: string[] }, FormData>({
      query: (body) => ({ url: "/admin/products/image", method: "POST", body }),
    }),
  }),
});

export const {
  useAdminLoginMutation,
  useLazyAdminMeQuery,
  useGetAdminProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useUploadProductImagesMutation,
} = adminApi;
