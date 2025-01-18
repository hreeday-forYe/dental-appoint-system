import { asyncHandler } from "../middlewares/asyncHandler.js";
import Dent from "../models/userModel.js";
import jwt from "jsonwebtoken";
import ErrorHandler from "../utils/ErrorHandler.js";
import ejs from "ejs";
import path from "path";
import { fileURLToPath } from "url";
import sendMail from "../utils/sendMail.js";
import createActivationToken from "../utils/activation.js";
import { sendToken } from "../utils/jwt.js";

const registerDentist = async (req, res, next) => {
  try {
    const {
      name,
      email,
      phonenumber,
      nmcNumber,
      expYear,
      speciality,
      qualification,
      currentWork,
    } = req.body;
    
  } catch (error) {
    return next(new ErrorHandler(err.message, 400));
  }
};
