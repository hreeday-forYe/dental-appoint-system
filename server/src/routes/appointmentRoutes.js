import express from "express";
import { authorizeRoles, isAuthenticated } from "../middlewares/auth.js";
import AppointmentController from "../controllers/appointmentController.js";
const appointmentRouter = express.Router();

appointmentRouter.post(
  "/",
  isAuthenticated,
  authorizeRoles("user"),
  AppointmentController.bookAppointment
);
appointmentRouter.post(
  "/check-availability",
  isAuthenticated,
  authorizeRoles("user"),
  AppointmentController.checkAvailability
);

appointmentRouter.get(
  "/dentist-appointments",
  isAuthenticated,
  authorizeRoles("dentist"),
  AppointmentController.fetchDentistAppointments
);
appointmentRouter.get(
  "/user-appointments",
  isAuthenticated,
  AppointmentController.fetchUserAppointments
);

appointmentRouter.put(
  "/complete-payment",
  isAuthenticated,
  authorizeRoles("user"),
  AppointmentController.completePayment
);

appointmentRouter.put(
  "/:id",
  isAuthenticated,
  authorizeRoles("dentist"),
  AppointmentController.approveAppointmentDentist
);
appointmentRouter.put(
  "/cancel/:id",
  isAuthenticated,
  authorizeRoles("dentist", "user"),
  AppointmentController.cancelAppointment
);

appointmentRouter.post(
  "/initiate-payment",
  isAuthenticated,
  authorizeRoles("user"),
  AppointmentController.initiatePayment
);

export default appointmentRouter;
