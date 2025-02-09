import express from "express";
import UserController from "../controllers/userController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const userRouter = express.Router();


// ************************* AUTHENTICATION ROUTES **********************

userRouter.post("/register", UserController.registerUser);
userRouter.post("/activate", UserController.activateUser);
userRouter.post("/login", UserController.loginUser);
userRouter.post("/logout", isAuthenticated, UserController.logoutUser);

// ********************* PROFILE MANAGEMENT ROUTES *********************
userRouter.put(
  "/update-profile",
  isAuthenticated,
  UserController.updateUserProfile
);
userRouter.get("/get-profile", isAuthenticated, UserController.getUserInfo);
userRouter.put(
  "/change-password",
  isAuthenticated,
  UserController.changePassword
);
userRouter.put(
  "/update-avatar",
  isAuthenticated,
  UserController.updateUserAvatar
);
export default userRouter;
