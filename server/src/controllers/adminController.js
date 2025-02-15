import { asyncHandler } from "../middlewares/asyncHandler.js";
import Dentist from "../models/dentistModel.js";
import User from "../models/userModel.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import mongoose from "mongoose";
class AdminController {
  // static registerDentistByAdmin = asyncHandler(async (req, res, next) => {
  //   try {
  //     const {
  //       name,
  //       email,
  //       password,
  //       phone,
  //       address,
  //       dob,
  //       specialization,
  //       experience,
  //       nmcNumber,
  //       qualifications,
  //       consultingFee,
  //       workingHours,
  //       slotDuration,
  //     } = req.body;
  //     // Check if the dentist already exists
  //     const existsDentist = await User.findOne({ email });
  //     if (existsDentist) {
  //       return next(new ErrorHandler("Dentist with email already exits", 400));
  //     }
  //     const dentistUser = await User.create({
  //       name,
  //       email,
  //       password,
  //       phone,
  //       address,
  //       dob,
  //       isVerified: true,
  //     });

  //     // now finally creating the dentist
  //     const newDentist = new Dentist({
  //       user: dentistUser._id,
  //       specialization,
  //       experience,
  //       nmcNumber,
  //       qualifications,
  //       consultingFee,
  //       workingHours,
  //       slotDuration,
  //     });
  //     await newDentist.save()

  //     res.status(201).json({
  //       success: true,
  //       message: "Dentist profile created successfully.",
  //     });
  //   } catch (error) {
  //     return next(new ErrorHandler(error.message, 500));
  //   }
  // });

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
}

export default AdminController;
