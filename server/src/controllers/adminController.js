import { asyncHandler } from "../middlewares/asyncHandler.js";
import Dentist from "../models/dentistModel.js";
import User from "../models/userModel.js";
import Appointment from "../models/appointmentModel.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import mongoose from "mongoose";
class AdminController {

  static registerDentistByAdmin = asyncHandler(async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const {
        name,
        email,
        password,
        phone,
        address,
        dob,
        specialization,
        experience,
        nmcNumber,
        qualifications,
        consultingFee,
        workingHours,
        slotDuration,
      } = req.body;
      console.log(req.body);

      if (
        !name ||
        !email ||
        !password ||
        !phone ||
        !specialization ||
        !experience ||
        !nmcNumber
      ) {
        return next(
          new ErrorHandler("Please fill in all required fields.", 400)
        );
      }

      // Check if the dentist already exists
      const existsDentist = await User.findOne({ email }).session(session);
      if (existsDentist) {
        await session.abortTransaction();
        session.endSession();
        return next(
          new ErrorHandler("Dentist with this email already exists.", 400)
        );
      }

      // Create the User entry
      const dentistUser = await User.create(
        [
          {
            name,
            email,
            password,
            phone,
            address,
            dob,
            isVerified: true,
            role: "dentist",
          },
        ],
        { session }
      );

      // Create the Dentist profile
      const newDentist = await Dentist.create(
        [
          {
            user: dentistUser[0]._id,
            specialization,
            experience,
            nmcNumber,
            qualifications,
            consultingFee,
            workingHours,
            slotDuration,
          },
        ],
        { session }
      );

      await session.commitTransaction();
      session.endSession();

      res.status(201).json({
        success: true,
        message: "Dentist profile created successfully.",
      });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      return next(new ErrorHandler(error.message, 500));
    }
  });

  static fetchAllUsersByAdmin = asyncHandler(async (req, res, next) => {
    try {
      const users = await User.find();
      if (!users) {
        return res
          .status(200)
          .json({ success: true, message: "No Dentist Found" });
      }

      return res.status(200).json({
        success: true,
        message: "Users Fetched successfully",
        users,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  });

  static fetchAllAppointmentsByAdmin = asyncHandler(async (req, res, next) => {
    try {
      const appointments = await Appointment.find().populate("user", "name email") // Populating user's name from User schema
      .populate({
        path: "dentist", // Populating the Dentist document
        populate: {
          path: "user", // Populating the User document within Dentist
          select: "name email", // Selecting only the name field from User
        },
      });

      if(!appointments){
        return res.status(200).json({success:true, message:"No Appointments Found"})
      }
      return res.status(200).json({success:true, message:"Appointments Fetched Successfully", appointments})
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  });
}
export default AdminController;
