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
  }),
});

export const { useAddDentistMutation, useFetchAllUsersQuery, useFetchAllAppointmentsQuery } = adminApiSlice;
