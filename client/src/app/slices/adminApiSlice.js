import { data } from "react-router-dom";
import { admin_url } from "../constants";
import { apiSlice } from "./apiSlice";

export const adminApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addDentist: builder.mutation({
      query: (data) => ({
        url: `${admin_url}/`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),
    fetchAllUsers: builder.query({
      query: () => ({
        url: `${admin_url}/all-users`,
        method: "GET",
        credentials: "include",
      }),
    }),
    fetchAllAppointments: builder.query({
      query: () => ({
        url: `${admin_url}/all-appointments`,
        method: "GET",
        credentials: "include",
      }),
    }),
    adminAddUser: builder.mutation({
      query: (data) => ({
        url: `${admin_url}/add-user`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),
    adminEditUser: builder.mutation({
      query: ({ id, data }) => ({
        url: `${admin_url}/edit-user/${id}`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
    }),
    adminBanUser: builder.mutation({
      query: (id) => ({
        url: `${admin_url}/ban-user/${id}`,
        method: "PUT",
        credentials: "include",
      }),
    }),
  }),
});

export const {
  useAddDentistMutation,
  useFetchAllUsersQuery,
  useFetchAllAppointmentsQuery,
  useAdminAddUserMutation,
  useAdminEditUserMutation,
  useAdminBanUserMutation
} = adminApiSlice;
