import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const dentistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    specialization: {
      type: String,
      required: true,
    },
    experience: {
      type: Number,
      required: true,
    },
    nmcNumber: {
      type: String,
      required: true,
    },
    qualifications: {
      type: [String],
      required: true,
    },
    consultingFee: {
      type: Number, // Fee in the local currency (e.g., 500 for $500)
      required: true,
      default: 0, // Default to 0 (can be updated by the dentist)
    },
    slotDuration: {
      type: Number, // Duration in minutes (e.g., 30, 60)
      required: true,
      default: 30, // Default to 30-minute slots
    },
    workingHours: {
      startTime: String, // e.g., "08:00"
      endTime: String,   // e.g., "17:00"
      days: [String],    // e.g., ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
    },
    bio: {
      type: String,
    },
    firstLogin:{
      type:Boolean,
      default:false
    }
  },
  { timestamps: true }
);

const Dentist = mongoose.model("Dentist", dentistSchema);

export default Dentist;
