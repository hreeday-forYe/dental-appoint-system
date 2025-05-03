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
    fetchDentistAppointments: builder.query({
      query: () => ({
        url: `${dentist_url}/appointments`,
        method: "GET",
        credentials: "include",
      }),
    }),
    getPatientsData: builder.query({
      query: () => ({
        url: `${dentist_url}/get-patients`,
        method: "GET",
        credentials: "include",
      }),
    }),
    getDentistProfile: builder.query({
      query: () => ({
        url: `${dentist_url}/dentist-profile`,
        method: "GET",
        credentials: "include",
      }),
    }),
    updateDentistProfile: builder.mutation({
      query: (data) => ({
        url: `${dentist_url}/update-dentist-profile`,
        method: "PUT",
        body: data,
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
  useFetchDentistAppointmentsQuery,
  useGetPatientsDataQuery,
  useGetDentistProfileQuery,
  useUpdateDentistProfileMutation
} = dentistApiSlice;
