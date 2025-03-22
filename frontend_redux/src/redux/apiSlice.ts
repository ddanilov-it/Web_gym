import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Client, Subscription } from "../types/types";
import { RootState } from "./store";


// Определяем базовые запросы для сервисов
const authBaseQuery = fetchBaseQuery({ baseUrl: "http://localhost:5000" });
const subBaseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:5001",
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;
    const token = state.auth.token || localStorage.getItem("token");

    console.log("📡 Токен в prepareHeaders:", token);  // Логируем токен перед отправкой запроса
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    } else {
      console.warn("⚠️ Токен отсутствует!");
    }
    return headers;
  },
});




export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: async (args, api, extraOptions) => {
    const url = typeof args === "string" ? args : args.url;

    if (url.startsWith("/login") || url.startsWith("/register")) {
      return authBaseQuery(args, api, extraOptions);
    }
    return subBaseQuery(args, api, extraOptions);
  },
  tagTypes: ["Clients", "Subscriptions"],
  endpoints: (builder) => ({
    login: builder.mutation<{ token: string }, { email: string; password: string }>({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: credentials,
      }),
    }),
    register: builder.mutation<{ message: string }, { username: string; firstName: string; lastName: string; email: string; password: string }>({
      query: (userData) => ({
        url: "/register",
        method: "POST",
        body: userData,
      }),
    }),
    getClients: builder.query<Client[], void>({
      query: () => "/clients",
      providesTags: ["Clients"],
    }),
    getSubscriptions: builder.query<Subscription[], void>({
      query: () => "/subscriptions",
      providesTags: ["Subscriptions"],
    }),
    addClient: builder.mutation<{ id: number }, Omit<Client, "id">>({
      query: (clientData) => ({
        url: "/clients",
        method: "POST",
        body: clientData,
      }),
      invalidatesTags: ["Clients"],
    }),
    addSubscription: builder.mutation<void, Omit<Subscription, "id">>({
      query: (subscriptionData) => ({
        url: "/subscriptions",
        method: "POST",
        body: subscriptionData,
      }),
      invalidatesTags: ["Subscriptions"],
    }),
    deleteClient: builder.mutation<void, number>({
      query: (clientId) => ({
        url: `/clients/${clientId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Clients"],
    }),
    deleteSubscription: builder.mutation<void, number>({
      query: (subscriptionId) => ({
        url: `/subscriptions/${subscriptionId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Subscriptions"],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetClientsQuery,
  useGetSubscriptionsQuery,
  useAddClientMutation,
  useAddSubscriptionMutation,
  useDeleteClientMutation,
  useDeleteSubscriptionMutation,
} = apiSlice;
