import userRouter from "./userRoutes.js";
import dentistRouter from "./dentistRoutes.js";
import appointmentRouter from "./appointmentRoutes.js"
import express from "express";

const router = express.Router();

router.use("/api/v1/user", userRouter);
router.use("/api/v1/dentist", dentistRouter);
router.use("/api/v1/appointment", appointmentRouter);

export default router;
