import { asyncHandler } from "../middlewares/asyncHandler.js";
import Appointment from "../models/appointmentModel.js";
import User from "../models/userModel.js";
import Dentist from "../models/dentistModel.js";
import ErrorHandler from "../utils/ErrorHandler.js";

class AppointmentController {
  static bookAppointment = asyncHandler(async (req, res, next) => {
    try {
      const userId = req.user._id;
      const { dentistId, date, time, reason } = req.body;
      // Fees and duratons should be taken from the dentist profile or dentist data in my opinion
      const dentist = await Dentist.findById(dentistId);
      if (!dentist) {
        return next(new ErrorHandler("Dentist not found", 400));
      }
      // Create the appointment
      const newAppointment = new Appointment({
        user: userId,
        dentist: dentistId,
        date,
        timeSlot: time,
        duration: dentist.slotDuration,
        reasonForVisit: reason,
        fees: dentist.consultingFee,
      });

      await newAppointment.save();

      // TODO: Plan for notification

      res.status(201).json({
        success: true,
        message: "Appointment booked successfully.",
        data: newAppointment,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  });
  static rescheduleAppointment = asyncHandler(async (req, res, next) => {});
  static checkAvailability = asyncHandler(async (req, res, next) => {
    try {
      const { dentistId, date, time } = req.body;

      // Fetch the dentist's working hours
      const dentist = await Dentist.findById(dentistId);
      if (!dentist) {
        return next(new ErrorHandler("Dentist not found.", 404));
      }

      // Check if the requested time slot is within the dentist's working hours
      const requestedTime = new Date(`${date}T${time}:00`);
      const startTime = new Date(
        `${date}T${dentist.workingHours.startTime}:00`
      );
      const endTime = new Date(`${date}T${dentist.workingHours.endTime}:00`);

      if (requestedTime < startTime || requestedTime >= endTime) {
        return res.status(200).json({
          success: true,
          available: false,
          message:
            "The requested time slot is outside the dentist's working hours.",
        });
      }

      // Check if the time slot is already booked
      const existingAppointment = await Appointment.findOne({
        dentist: dentistId,
        date,
        timeSlot: time,
      });

      if (existingAppointment) {
        return res.status(200).json({
          success: true,
          available: false,
          message: "The requested time slot is already booked.",
        });
      }

      // If the time slot is available
      res.status(200).json({
        success: true,
        available: true,
        message: "The requested time slot is available.",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  });
}

export default AppointmentController;
