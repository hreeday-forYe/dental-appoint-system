import express from "express";
const notificationRouter = express.Router();

// Create a new notification
notificationRouter.post("/");

notificationRouter.get("/:userId");

notificationRouter.patch("/:id/read");

notificationRouter.delete("/:id");

export default notificationRouter;
