import express from "express";
import {
  activateUser,
  changePassword,
  getUserInfo,
  loginUser,
  logoutUser,
  registerUser,
  updateUserAvatar,
  updateUserProfile,
} from "../controllers/userController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/activate", activateUser);
userRouter.post("/login", loginUser);
userRouter.post("/logout", isAuthenticated, logoutUser);
userRouter.put("/update-profile", isAuthenticated, updateUserProfile);
userRouter.get("/get-profile", isAuthenticated, getUserInfo);
userRouter.put("/change-password", isAuthenticated, changePassword);
userRouter.put("/update-avatar", isAuthenticated, updateUserAvatar);
export default userRouter;
