import { asyncHandler } from "../middlewares/asyncHandler.js";
import Dentist from "../models/dentistModel.js";
import User from "../models/userModel.js";
import Appointment from "../models/appointmentModel.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import mongoose from "mongoose";
import ejs from "ejs";
import path from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";
import sendMail from "../utils/sendMail.js";
import Payment from "../models/paymentModel.js";
class AdminController {
  static registerDentistByAdmin = asyncHandler(async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const {
        name,
        email,
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
        password,
      } = req.body;
      console.log(req.body);

      if (
        !name ||
        !email ||
        !phone ||
        !specialization ||
        !experience ||
        !nmcNumber ||
        !password
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

      // ****************** Authomatic password Creationg ********
      //  const password = crypto.randomBytes(5).toString("hex").toUpperCase();

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

      // ***********************SEND MAIL TO THE EMAIL OF THE ADDED Dentist****************************
      /* const mailData = {
        name: dentistUser[0].name,
        email: dentistUser[0].email,
        OneTimePassword: password,
      };

      const __filename = fileURLToPath(import.meta.url);
      const currentDirectory = path.dirname(__filename);
      const mailPath = path.join(
        currentDirectory,
        "../mails/welcomeDentist.ejs"
      );

      const html = await ejs.renderFile(mailPath, mailData);

      // Sending the mail to the Dentist for his account creation Successfull
      try {
        if (dentistUser && newDentist) {
          await sendMail({
            email: dentistUser[0].email,
            subject: "Account Credentials and Confirmation",
            template: "welcomeDentist.ejs",
            data: mailData,
          });
        }
      } catch (mailError) {
        console.error("Mail sending failed:", mailError);
        return next(new ErrorHandler("Failed to send email.", 500));
      }
  */

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
          .json({ success: true, message: "No user Found" });
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
      const appointments = await Appointment.find()
        .populate("user", "name email") // Populating user's name from User schema
        .populate({
          path: "dentist", // Populating the Dentist document
          populate: {
            path: "user", // Populating the User document within Dentist
            select: "name email", // Selecting only the name field from User
          },
        });

      if (!appointments) {
        return res
          .status(200)
          .json({ success: true, message: "No Appointments Found" });
      }
      return res.status(200).json({
        success: true,
        message: "Appointments Fetched Successfully",
        appointments,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  });

  static editDentistByAdmin = asyncHandler(async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const { dentistId } = req.params; // Assuming the dentist's ID is passed as a URL parameter
      const {
        name,
        email,
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
        password,
      } = req.body;

      // Check if the dentist exists
      const existingDentist = await Dentist.findById(dentistId).session(
        session
      );
      if (!existingDentist) {
        await session.abortTransaction();
        session.endSession();
        return next(new ErrorHandler("Dentist not found.", 404));
      }

      // Find the corresponding user
      const existingUser = await User.findById(existingDentist.user).session(
        session
      );
      if (!existingUser) {
        await session.abortTransaction();
        session.endSession();
        return next(new ErrorHandler("User not found.", 404));
      }

      // Validate if the new email is already in use by another user
      if (email && email !== existingUser.email) {
        const emailExists = await User.findOne({ email }).session(session);
        if (emailExists) {
          await session.abortTransaction();
          session.endSession();
          return next(
            new ErrorHandler("Email is already in use by another user.", 400)
          );
        }
      }

      // Update the User entry
      if (name) existingUser.name = name;
      if (email) existingUser.email = email;
      if (phone) existingUser.phone = phone;
      if (address) existingUser.address = address;
      if (dob) existingUser.dob = dob;
      if (password) existingUser.password = password;

      await existingUser.save({ session });

      // Update the Dentist profile
      if (specialization) existingDentist.specialization = specialization;
      if (experience) existingDentist.experience = experience;
      if (nmcNumber) existingDentist.nmcNumber = nmcNumber;
      if (qualifications) existingDentist.qualifications = qualifications;
      if (consultingFee) existingDentist.consultingFee = consultingFee;
      if (workingHours) existingDentist.workingHours = workingHours;
      if (slotDuration) existingDentist.slotDuration = slotDuration;

      await existingDentist.save({ session });

      await session.commitTransaction();
      session.endSession();

      res.status(200).json({
        success: true,
        message: "Dentist profile updated successfully.",
      });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      return next(new ErrorHandler(error.message, 500));
    }
  });

  static addUserByAdmin = asyncHandler(async (req, res, next) => {
    try {
      const { name, email, password } = req.body;
      if (!name) {
        return next(new ErrorHandler("Name cannot be empty", 400));
      }

      if (!email) {
        return next(new ErrorHandler("Email cannot be empty", 400));
      }
      if (!password) {
        return next(new ErrorHandler("Password cannot be empty", 400));
      }
      const existUser = await User.findOne({ email });
      if (existUser) {
        return next(new ErrorHandler("User already exists", 400));
      }
      await User.create({ name, email, password, isVerified: true });
      res.status(201).json({
        success: true,
        messaged: "User Added Successfully",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  });
  static editUserByAdmin = asyncHandler(async (req, res, next) => {
    try {
      const userId = req.params.id;
      const { name, email, phone, address } = req.body;
      const userExists = await User.findOne({ email });
      if (userExists && userExists._id.toString() !== userId) {
        return next(
          new ErrorHandler("User with this email already exists", 400)
        );
      }
      const user = await User.findByIdAndUpdate(
        userId,
        {
          name,
          email,
          phone,
          address,
        },
        {
          new: true,
          runValidators: true,
        }
      );
      if (!user) {
        return next(new ErrorHandler("User was not found", 400));
      }
      return res.status(200).json({
        success: true,
        message: "User Profile updated Successfully",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  });

  static banUserByAdmin = asyncHandler(async (req, res, next) => {
    try {
      const userId = req.params.id;
      const user = await User.findById(userId);
      if (!user) {
        return next(new ErrorHandler("User not found", 400));
      }
      if (user.isVerified) {
        user.isVerified = false;
      } else {
        user.isVerified = true;
      }

      // This is for the people who are getting banned
      if (user.isVerified === false) {
        const mailData = {
          userName: user.name,
          banReason: "Due to  violation of terms and conditions",
        };

        const __filename = fileURLToPath(import.meta.url);
        const currentDirectory = path.dirname(__filename);
        const mailPath = path.join(
          currentDirectory,
          "../mails/banUserMail.ejs"
        );

        const html = await ejs.renderFile(mailPath, mailData);

        // Sending the mail to the User to tell his account was banned
        try {
          await sendMail({
            email: user.email,
            subject: "Account Suspension Notice",
            template: "banUserMail.ejs",
            data: mailData,
          });
        } catch (mailError) {
          console.error("Mail sending failed:", mailError);
          return next(new ErrorHandler("Failed to send email.", 500));
        }
      }

      // This is for the people who are getting unbanned
      if (user.isVerified) {
        const mailData = {
          userName: user.name,
        };

        const __filename = fileURLToPath(import.meta.url);
        const currentDirectory = path.dirname(__filename);
        const mailPath = path.join(
          currentDirectory,
          "../mails/unbanUserMail.ejs"
        );

        const html = await ejs.renderFile(mailPath, mailData);

        // Sending the mail to the User to tell his account was banned
        try {
          await sendMail({
            email: user.email,
            subject: "Account Suspension Revoked",
            template: "unbanUserMail.ejs",
            data: mailData,
          });
        } catch (mailError) {
          console.error("Mail sending failed:", mailError);
          return next(new ErrorHandler("Failed to send email.", 500));
        }
      }

      await user.save();
      return res.status(200).json({
        success: true,
        message: user.isVerified? "User unbanned successfully" : 'User banned Successfully',
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  });

  static fetchAllPaymentsByAdmin = asyncHandler(async (req, res, next) => {
    try {
      const payments = await Payment.find().populate({
        path: "paidBy",
        select: "name email avatar", // Include only name and email from User
      });
      if (!payments) {
        return res
          .status(200)
          .json({ success: true, message: "No payment Found" });
      }

      return res.status(200).json({
        success: true,
        message: "Payements Fetched successfully",
        payments,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  });
}
export default AdminController;
