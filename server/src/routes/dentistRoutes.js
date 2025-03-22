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

dentistRouter.get("/:id", DentistController.fetchSingleDentist);

dentistRouter.put("/verify/:id", isAuthenticated, authorizeRoles('admin'), DentistController.verifyDentist);

dentistRouter.put("/:id", isAuthenticated, authorizeRoles('dentist'), DentistController.manageAvailability);

export default dentistRouter;
