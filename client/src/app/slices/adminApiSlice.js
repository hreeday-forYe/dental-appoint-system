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
  }),
});

export const { useAddDentistMutation } = adminApiSlice;
