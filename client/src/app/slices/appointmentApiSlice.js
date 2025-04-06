import { appointment_url } from "../constants";
import { apiSlice } from "./apiSlice";

export const appointmentApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    bookAppointment: builder.mutation({
      query: (data) => ({
        url: `${appointment_url}/`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),
    checkAvailability: builder.mutation({
      query: (data) => ({
        url: `${appointment_url}/check-availability`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),
    getUserAppointments: builder.query({
      query: () => ({
        url: `${appointment_url}/user-appointments`,
        method: "GET",
        credentials: "include",
      }),
    }),
    getDentistAppointments: builder.query({
      query: () => ({
        url: `${appointment_url}/dentist-appointments`,
        method: "GET",
        credentials: "include",
      }),
    }),
    changeAppointmentStatus: builder.mutation({
      query: (id) => ({
        url: `${appointment_url}/${id}`,
        method: "PUT",
        credentials: "include",
      }),
    }),
    cancelAppointment: builder.mutation({
      query: ({appointmentId, reason}) => ({
        url: `${appointment_url}/cancel/${appointmentId}`,
        method: "PUT",
        credentials: "include",
        body: reason,
      }),
    }),
    completePayment: builder.query({
      query: (pidx) => ({
        url: `${appointment_url}/complete-payment?pidx=${pidx}`,
        method: "GET",
        credentials: "include",
      }),
    }),
    //kahlti initiatePayment slices
    initiatePayment: builder.mutation({
      query: (data) => ({
        url: `${appointment_url}/initiate-payment`,
        method: "POST",
        body: data,
        credentials: "include",
        }),
      }),
  }),
});

export const {
  useBookAppointmentMutation,
  useCheckAvailabilityMutation,
  useGetUserAppointmentsQuery,
  useGetDentistAppointmentsQuery,
  useChangeAppointmentStatusMutation,
  useCancelAppointmentMutation,
  useInitiatePaymentMutation,
  useCompletePaymentQuery
} = appointmentApiSlice;
