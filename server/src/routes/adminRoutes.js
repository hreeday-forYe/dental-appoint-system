import express from "express";
import AdminController from "../controllers/adminController.js";
import { authorizeRoles, isAuthenticated } from "../middlewares/auth.js";

const adminRouter = express.Router();

// ************************* Core Addition functionalities Routes **********************

// Register dentist by admin
adminRouter.post(
  "/",
  isAuthenticated,
  authorizeRoles('admin'),
  AdminController.registerDentistByAdmin
);

// Get everything for the details 



export default adminRouter;
