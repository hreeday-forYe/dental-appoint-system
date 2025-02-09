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
appointmentRouter.put(
  "/",
  isAuthenticated,
  authorizeRoles("user"),
  AppointmentController.rescheduleAppointment
);

export default appointmentRouter;
