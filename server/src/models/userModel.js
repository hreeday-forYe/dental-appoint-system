import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
dotenv.config();

const emailRegexPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
    },
    email: {
      type: String,
      required: [true, "Please enter your email"],
      validate: {
        validator: function (value) {
          return emailRegexPattern.test(value);
        },
        message: "Please enter a valid email",
      },
      unique: true,
    },
    password: {
      type: String,
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    phone: {
      type: Number,
      minlength: [10, "Phone Number must be 10 digits"],
      unique: true,
    },
    address: {
      type: String,
    },
    dob: {
      type: Date,
    },
    medicalHistory: {
      type: String,
    },
    role: {
      type: String,
      enum: ["user", "admin", "dentist"],
      default: "user",
    },
    avatar: {
      public_id: String,
      url: String,
    },
  },
  { timestamps: true }
);

// Pre hooks->Check the password if modified then hash the password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password for the login
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password); // Returns true or false
};

const User = mongoose.model("User", userSchema);

export default User;
