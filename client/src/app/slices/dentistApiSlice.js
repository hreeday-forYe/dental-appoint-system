import { dentist_url } from "../constants";
import { apiSlice } from "./apiSlice";

export const dentistApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    registerDentist: builder.mutation({
      query: (data) => ({
        url: `${dentist_url}/register-dentist`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),
    getAllDentists: builder.query({
      query: () => ({
        url: `${dentist_url}/`,
        method: "GET",
        credentials: "include",
      }),
    }),
    verifyDentist: builder.mutation({
      query: (id) => ({
        url: `${dentist_url}/verify/${id}`,
        method: "PUT",
        credentials: "include",
      }),
    }),
    getSingleDentist: builder.query({
      query: (id) => ({
        url: `${dentist_url}/${id}`,
        method: "GET",
        credentials: "include",
      }),
    }),
  }),
});

export const {
  useRegisterDentistMutation,
  useGetAllDentistsQuery,
  useVerifyDentistMutation,
  useGetSingleDentistQuery,
} = dentistApiSlice;
