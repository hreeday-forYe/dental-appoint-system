import express from "express";
import AdminController from "../controllers/adminController.js";
import { authorizeRoles, isAuthenticated } from "../middlewares/auth.js";

const adminRouter = express.Router();

// ************************* Core Addition functionalities Routes **********************

// Register dentist by admin
adminRouter.post(
  "/",
  isAuthenticated,
  authorizeRoles("admin"),
  AdminController.registerDentistByAdmin
);

adminRouter.get(
  "/all-payments",
  isAuthenticated,
  authorizeRoles("admin"),
  AdminController.fetchAllPaymentsByAdmin
);

// Get everything for the details
adminRouter.get(
  "/all-users",
  isAuthenticated,
  authorizeRoles("admin"),
  AdminController.fetchAllUsersByAdmin
);

// Fetch all the appointments by the admin
adminRouter.get(
  "/all-appointments",
  isAuthenticated,
  authorizeRoles("admin"),
  AdminController.fetchAllAppointmentsByAdmin
);

adminRouter.post(
  "/add-user",
  isAuthenticated,
  authorizeRoles("admin"),
  AdminController.addUserByAdmin
);
adminRouter.put(
  "/edit-user/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  AdminController.editUserByAdmin
);
adminRouter.put(
  "/ban-user/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  AdminController.banUserByAdmin
);

export default adminRouter;
