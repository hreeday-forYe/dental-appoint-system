import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const AppointmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // The patient who booked the appointment
      required: true,
    },
    dentist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Dentist", // The dentist providing the service
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    timeSlot: {
      type: String, // Example: "10:00 AM - 10:30 AM"
      required: true,
    },
    duration: {
      type: Number,
      required: true,
      default: 30,
    },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Completed", "Cancelled"],
      default: "Pending",
    },
    cancellationReason: {
      type: String,
    },
    reasonForVisit: {
      type: String, // Example: "Routine Checkup, Tooth Extraction"
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Refunded"],
      default: "Pending",
    },
    paymentMethod: {
      type: String,
      enum: ["Cash", "Khalti"],
      default: "Cash",
    },
    fees: {
      type: Number,
    },
  },
  { timestamps: true }
);

const Appointment = mongoose.model("Appointment", AppointmentSchema);

export default Appointment;
