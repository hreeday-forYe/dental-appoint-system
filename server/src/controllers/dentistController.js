import { asyncHandler } from "../middlewares/asyncHandler.js";
import Dentist from "../models/dentistModel.js";
import Appointment from "../models/appointmentModel.js";
import User from "../models/userModel.js";
import ErrorHandler from "../utils/ErrorHandler.js";
class DentistController {
  // ****************** DENTIST AUTHENTICATION MANAGEMENT ***************
  static registerDentist = asyncHandler(async (req, res, next) => {
    try {
      const {
        specialization,
        experience,
        nmcNumber,
        qualifications,
        consultingFee,
        workingHours,
        slotDuration,
      } = req.body;

      // Get the authenticated user's ID from the request
      const userId = req.user._id;

      // Check if the user already has a dentist profile
      const existingDentist = await Dentist.findOne({ user: userId });
      if (existingDentist) {
        return next(
          new ErrorHandler("Dentist Already Exists with this user", 400)
        );
      }

      // Create a new dentist profile
      const newDentist = new Dentist({
        user: userId,
        specialization,
        experience,
        nmcNumber,
        qualifications,
        consultingFee,
        workingHours,
        slotDuration,
      });

      // Save the dentist profile
      await newDentist.save();
      // Change the user role to dentist now
      await User.findByIdAndUpdate(
        userId,
        { role: "dentist", isVerified: false },
        { runValidators: true, new: true }
      );

      // Populate the user details in the response
      const dentist = await Dentist.findById(newDentist._id).populate(
        "user",
        "name email role isVerified"
      );

      res.status(201).json({
        success: true,
        message: "Dentist profile created successfully.",
        dentist,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  });

  /* ****************** FETCH DENTISTS *************** */
  static fetchAllDentist = asyncHandler(async (req, res, next) => {
    // Find all dentists and populate the related user details
    const dentists = await Dentist.find().populate("user", "-medicalHistory");

    res.status(200).json({
      success: true,
      message: "All dentists fetched successfully.",
      dentists,
    });
  });

  static fetchSingleDentist = asyncHandler(async (req, res, next) => {
    // Find single dentists for the user find from the dentist Model and  populate the related user
    const dentistId = req.params.id;

    // Find the dentist by ID and populate the related user details
    const dentist = await Dentist.findById(dentistId).populate(
      "user",
      "-medicalHistory"
    );

    if (!dentist) {
      return next(new ErrorHandler("Dentist Not Found", 400));
    }

    res.status(200).json({
      success: true,
      message: "Dentist fetched successfully.",
      dentist,
    });
  });

  static verifyDentist = asyncHandler(async (req, res, next) => {
    try {
      // Change the status of the dentist params id to isVerified to true
      const { id } = req.params; // Get the dentist ID from the request parameters

      // Find the dentist by ID
      const dentist = await Dentist.findById(id);

      if (!dentist) {
        return next(new ErrorHandler("Dentist not found", 404));
      }

      // Get the userId from the dentist document
      const userId = dentist.user;

      // Find the user by userId and update the isVerified field to true
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { isVerified: true },
        { new: true, runValidators: true } // Return the updated document and run schema validators
      );

      if (!updatedUser) {
        return next(new ErrorHandler("User not found", 404));
      }
      res.status(200).json({
        success: true,
        message: "Dentist Verified Successfully",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  });

  static manageAvailability = asyncHandler(async (req, res, next) => {
    // find the dentist with his id and manage his working hours from the dentist model
    const dentistId = req.params.id;
    const { workingHours } = req.body;

    // Find the dentist by ID and update their working hours
    const updatedDentist = await Dentist.findByIdAndUpdate(
      dentistId,
      { workingHours },
      { new: true, runValidators: true }
    );

    if (!updatedDentist) {
      return next(new ErrorHandler("Dentist Not found", 400));
    }

    res.status(200).json({
      success: true,
      message: "Dentist availability updated successfully.",
      data: updatedDentist,
    });
  });

  static fetchAppointments = asyncHandler(async (req, res, next) => {
    try {
      // Find dentist by user ID
      const dentist = await Dentist.findOne({ user: req.user._id }).populate(
        "user",
        "name email"
      ); // Populate basic user info

      if (!dentist) {
        return next(new ErrorHandler("Dentist not found", 404));
      }

      // Get query parameters for filtering
      const { status, dateFrom, dateTo } = req.query;

      // Build query object
      const query = { dentist: dentist._id };

      // Add status filter if provided
      if (
        status &&
        ["Pending", "Confirmed", "Completed", "Cancelled"].includes(status)
      ) {
        query.status = status;
      }

      // Add date range filter if provided
      if (dateFrom || dateTo) {
        query.date = {};
        if (dateFrom) query.date.$gte = new Date(dateFrom);
        if (dateTo) query.date.$lte = new Date(dateTo);
      }

      // Find appointments with population of related data
      const appointments = await Appointment.find(query)
        .populate({
          path: "user",
          select: "name email phone", // Only get necessary user fields
        })
        .populate({
          path: "dentist",
          select: "specialization qualifications", // Dentist professional info
          populate: {
            path: "user",
            select: "name", // Dentist's name from User model
          },
        })
        .sort({ date: 1, timeSlot: 1 }); // Sort by date and time

      return res.status(200).json({
        success: true,
        message: "Appointments fetched successfully",
        count: appointments.length,
        appointments,
      });
    } catch (error) {
      return next(
        new ErrorHandler(
          error.message || "Failed to fetch appointments",
          error.statusCode || 500
        )
      );
    }
  });

  static getPatientsData = asyncHandler(async (req, res, next) => {
    try {
      const userId = req.user._id; // Assuming dentist is logged in and user object is attached to req
      const dentist = await Dentist.findOne({ user: userId });

      // Find all appointments for this dentist
      const appointments = await Appointment.find({ dentist: dentist._id })
        .populate({
          path: "user",
          select: "name email phone avatar", // Select only necessary fields
        })
        .lean();

      // Get unique patients by filtering duplicates
      const uniquePatientsMap = new Map();

      appointments.forEach((appointment) => {
        if (appointment.user) {
          // Use patient ID as the map key to ensure uniqueness
          if (!uniquePatientsMap.has(appointment.user._id.toString())) {
            uniquePatientsMap.set(appointment.user._id.toString(), {
              _id: appointment.user._id,
              name: appointment.user.name,
              email: appointment.user.email,
              phone: appointment.user.phone || "Not provided",
              avatar: appointment.user.avatar?.url || null,
              lastAppointment: appointment.date, // Store the most recent appointment date
            });
          }
        }
      });

      // Convert map values to array
      const uniquePatients = Array.from(uniquePatientsMap.values());

      // Sort patients by most recent appointment
      uniquePatients.sort(
        (a, b) => new Date(b.lastAppointment) - new Date(a.lastAppointment)
      );

      res.status(200).json({
        success: true,
        count: uniquePatients.length,
        patients: uniquePatients,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  });

  static getDentistProfile = asyncHandler(async (req, res, next) => {
    try {
      const user = await User.findById(req.user._id);
      if (!user) {
        return next(new ErrorHandler("user not found", 400));
      }
      const dentist = await Dentist.findOne({ user: user._id }).populate(
        "user"
      );
      if (!dentist) {
        return next(new ErrorHandler("Dentist not found", 400));
      }

      return res.status(200).json({
        success: true,
        message: "Profile fetched Successfully",
        dentist,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  });
}

export default DentistController;
