import { asyncHandler } from "../middlewares/asyncHandler.js";
import Appointment from "../models/appointmentModel.js";
import User from "../models/userModel.js";
import Dentist from "../models/dentistModel.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import ejs from "ejs";
import path from "path";
import { fileURLToPath } from "url";
import sendMail from "../utils/sendMail.js";
import { format } from "date-fns";
import cron from "node-cron";
class AppointmentController {
  static bookAppointment = asyncHandler(async (req, res, next) => {
    try {
      const userId = req.user._id;
      const { dentistId, date, timeSlot, reasonForVisit } = req.body;
      // console.log(req.body);
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
        timeSlot,
        duration: dentist.slotDuration,
        reasonForVisit,
        fees: dentist.consultingFee,
      });

      await newAppointment.save();

      // TODO: Plan for notification
      // await Notification.create

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
      const { date, time, dentistId } = req.body;
      // console.log(req.body);
      // Fetch the dentist's working hours and working days
      const dentist = await Dentist.findById(dentistId);
      if (!dentist) {
        return next(new ErrorHandler("Dentist not found.", 404));
      }

      // Parse the selected date
      const selectedDate = new Date(date);
      const selectedDay = selectedDate.toLocaleDateString("en-US", {
        weekday: "long",
      }); // Get the day name (e.g., "Sunday")

      // Check if the selected day is in the dentist's working days
      if (!dentist.workingHours.days.includes(selectedDay)) {
        return res.status(200).json({
          success: true,
          available: false,
          message: `The dentist is not available on ${selectedDay}.`,
        });
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
      // const formattedDate = new Date(date).toISOString().split("T")[0];
      const formattedDate = new Date(date).toISOString().split("T")[0];

      const existingAppointment = await Appointment.findOne({
        dentist: dentistId,
        date: { $gte: formattedDate }, // Ensure date format matches DB
        timeSlot: time, // Ensure time field matches DB schema
      });

      if (existingAppointment) {
        return res.status(200).json({
          success: true,
          available: false,
          message: "The requested time slot is already booked.",
        });
      }

      // If all validations pass, the time slot is available
      return res.status(200).json({
        success: true,
        available: true,
        message: "The requested time slot is available.",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  });

  static fetchUserAppointments = asyncHandler(async (req, res, next) => {
    try {
      const userId = req.user._id;
      const appointments = await Appointment.find({ user: userId }).populate({
        path: "dentist",
        select: "experience qualifications specialization",
        populate: {
          path: "user",
          select: "name email phone avatar role",
        },
      });
      return res.status(200).json({
        success: true,
        appointments,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message));
    }
  });

  static fetchDentistAppointments = asyncHandler(async (req, res, next) => {
    try {
      const userId = req.user._id;
      const dentist = await Dentist.findOne({ user: userId });
      // console.log(dentist);
      const appointments = await Appointment.find({
        dentist: dentist._id,
      }).populate("user", "name email phone avatar role");
      return res.status(200).json({
        success: true,
        appointments,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  });

  static approveAppointmentDentist = asyncHandler(async (req, res, next) => {
    try {
      const { id } = req.params;
      const appointment = await Appointment.findByIdAndUpdate(
        id,
        { status: "Confirmed" },
        { new: true, runValidators: true }
      )
        .populate("user", "name email") // Populating user's name from User schema
        .populate({
          path: "dentist", // Populating the Dentist document
          populate: {
            path: "user", // Populating the User document within Dentist
            select: "name", // Selecting only the name field from User
          },
        });

      // Format the date and time using date-fns
      const formattedDate = format(new Date(appointment.date), "do MMMM yyyy");
      const formattedTime = appointment.timeSlot;
      // Sending mail to the user Functionality
      const mailData = {
        userName: appointment.user.name,
        dentistName: appointment.dentist.user.name,
        appointmentDate: formattedDate,
        appointmentTime: formattedTime,
      };

      const __filename = fileURLToPath(import.meta.url);
      const currentDirectory = path.dirname(__filename);
      const mailPath = path.join(
        currentDirectory,
        "../mails/appointmentConfirmation.ejs"
      );

      const html = await ejs.renderFile(mailPath, mailData);

      // Sending the mail to the user after the approved appointment
      try {
        if (appointment && appointment.status === "Confirmed") {
          await sendMail({
            email: appointment.user.email,
            subject: "Appointment Confirmation",
            template: "appointmentConfirmation.ejs",
            data: mailData,
          });
        }
      } catch (mailError) {
        console.error("Mail sending failed:", mailError);
        return next(new ErrorHandler("Failed to send email.", 500));
      }

      return res.status(200).json({
        success: true,
        message: "Appointment confirmed",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  });

  static cancelAppointment = asyncHandler(async (req, res, next) => {
    try {
      const { id } = req.params;
      const { reason } = req.body;
      const appointment = await Appointment.findById(id);


      if (!appointment) {
        return next(new ErrorHandler("Appointment not found", 404));
      }

      if (appointment.status === "Cancelled") {
        return res.status(400).json({
          success: false,
          message: "Appointment is already cancelled.",
        });
      }

      appointment.status = "Cancelled";
      appointment.cancellationReason = reason;
      await appointment.save();
      return res.status(200).json({
        success: true,
        message: "Appointment cancelled successfully.",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  });
}
const updateExpiredAppointments = async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const expiredAppointments = await Appointment.updateMany(
      { date: { $lt: today }, status: { $in: ["Pending", "Confirmed"] } },
      { $set: { status: "Completed" } }
    );

    console.log(
      `${expiredAppointments.modifiedCount} appointments updated to Completed.`
    );
  } catch (error) {
    console.error("Error updating appointments:", error);
  }
};
// Schedule the job to run at midnight every day
cron.schedule("0 0 * * *", () => {
  console.log("Running scheduled appointment update...");
  updateExpiredAppointments();
});

export default AppointmentController;
