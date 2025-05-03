import express from "express";
import { authorizeRoles, isAuthenticated } from "../middlewares/auth.js";
import DentistController from "../controllers/dentistController.js";
const dentistRouter = express.Router();

dentistRouter.post(
  "/register-dentist",
  isAuthenticated,
  authorizeRoles("user"),
  DentistController.registerDentist
);
dentistRouter.get("/", DentistController.fetchAllDentist);
dentistRouter.get(
  "/appointments",
  isAuthenticated,
  authorizeRoles("dentist"),
  DentistController.fetchAppointments
);
dentistRouter.get(
  "/patients",
  isAuthenticated,
  authorizeRoles("dentist"),
  DentistController.getPatientsData
);
dentistRouter.get(
  "/dentist-profile",
  isAuthenticated,
  authorizeRoles("dentist"),
  DentistController.getDentistProfile
);

dentistRouter.get(
  "/get-patients",
  isAuthenticated,
  authorizeRoles("dentist"),
  DentistController.fetchPatients
);

dentistRouter.get(
  "/:id",
  DentistController.fetchSingleDentist
);

dentistRouter.put(
  "/verify/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  DentistController.verifyDentist
);

dentistRouter.put(
  "/update-dentist-profile",
  isAuthenticated,
  authorizeRoles("dentist"),
  DentistController.updateDentistProfile
);

export default dentistRouter;
