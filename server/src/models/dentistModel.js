import mongoose from "mongoose";

const DentistSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  specialization: { type: [String], required: true },
  experience: { type: Number, required: true },
  clinicAddress: { type: String, required: true },
  availableSlots: [{ type: Date }],
  workinghouse: {type:String, required:true},
  approved: { type: Boolean, default: false },
},{timestamps:true});

const Dentist = mongoose.model("Dentist", DentistSchema);

export default Dentist;
