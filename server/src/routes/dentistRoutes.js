import express from "express";
import { authorizeRoles, isAuthenticated } from "../middlewares/auth.js";
import DentistController from "../controllers/dentistController.js";
const dentistRouter = express.Router();

dentistRouter.post(
  "/register-dentist",
  isAuthenticated,
  authorizeRoles("admin", "user"),
  DentistController.registerDentist
);
dentistRouter.get("/", DentistController.fetchAllDentist);

dentistRouter.get("/:id", DentistController.fetchSingleDentist);
dentistRouter.put("/verify/:id", DentistController.verifyDentist);

dentistRouter.put("/:id", DentistController.manageAvailability);

export default dentistRouter;
