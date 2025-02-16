import { asyncHandler } from "../middlewares/asyncHandler.js";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import ErrorHandler from "../utils/ErrorHandler.js";
import ejs from "ejs";
import path from "path";
import { fileURLToPath } from "url";
import sendMail from "../utils/sendMail.js";
import createActivationToken from "../utils/activation.js";
import { sendToken } from "../utils/jwt.js";
import cloudinary from "cloudinary";

class UserController {
  // ******************* AUTHENTICATION HANDLING ******************************

  static registerUser = asyncHandler(async (req, res, next) => {
    try {
      const { name, email, password } = req.body;

      if (!name) {
        return next(new ErrorHandler("Name cannot be empty", 400));
      }

      if (!email) {
        return next(new ErrorHandler("Email cannot be empty", 400));
      }
      if (!password) {
        return next(new ErrorHandler("Name cannot be empty", 400));
      }
      const isEmailExist = await User.findOne({ email });

      if (isEmailExist) {
        return next(new ErrorHandler("Email already exists", 400));
      }
      // putting the destructured object variable in one object known as user
      const user = {
        name,
        email,
        password,
      };

      const activationToken = createActivationToken(user);
      const activationCode = activationToken.activationCode;

      const data = { user: { name: user.name }, activationCode };
      // getting the current directory
      const __filename = fileURLToPath(import.meta.url);
      const currentDirectory = path.dirname(__filename);

      const mailPath = path.join(
        currentDirectory,
        "../mails/activationMail.ejs"
      );

      // console.log('This is the mailPath', mailPath);
      const html = await ejs.renderFile(mailPath, data);

      // Send mail function call
      try {
        await sendMail({
          email: user.email,
          subject: "Activate your account",
          template: "activationMail.ejs",
          data,
        });
        res.status(201).json({
          success: true,
          message: `Please check your email: ${user.email} to activate your account.`,
          activationToken: activationToken.token,
        });
      } catch (err) {
        return next(new ErrorHandler(err.message, 400));
      }
    } catch (err) {
      return next(new ErrorHandler(err.message, 400));
    }
  });

  static activateUser = asyncHandler(async (req, res, next) => {
    try {
      const { activation_code, activation_token } = req.body;

      const newUser = jwt.verify(
        activation_token,
        process.env.ACTIVATION_SECRET
      );

      // console.log(newUser);
      // console.log(newUser.activationCode);
      if (newUser.activationCode !== activation_code) {
        return next(new ErrorHandler("Invalid activation Code", 400));
      }

      const { name, email, password } = newUser?.userdata;

      const existUser = await User.findOne({ email });

      if (existUser) {
        return next(new ErrorHandler("Email already exits", 400));
      }

      await User.create({
        name,
        email,
        password,
        isVerified: true,
      });

      res.status(201).json({
        success: true,
        message: "User has been successfully created",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  });

  static loginUser = asyncHandler(async (req, res, next) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return next(
          new ErrorHandler("Please enter your email or Password", 400)
        );
      }
      const user = await User.findOne({ email }).select("+password");

      if (!user) {
        return next(new ErrorHandler("Invalid Email or Password", 400));
      }

      if (!user.isVerified) {
        return next(new ErrorHandler("You are not verified yet", 400));
      }

      const isPasswordMatch = await user.comparePassword(password);

      if (!isPasswordMatch) {
        return next(new ErrorHandler("Invalid Email or Password", 400));
      }

      sendToken(user._id, res);

      delete user._doc.password;

      // response to the frontend
      res.status(201).json({
        success: true,
        message: "User is successfully logged in",
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  });

  static logoutUser = asyncHandler(async (req, res, next) => {
    try {
      res.cookie("jwt", "", {
        httpOnly: true,
        expires: new Date(0),
      });
      res.status(200).json({
        success: true,
        message: "User logged out successfully",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  });

  // ************************ USER MANAGEMENT PROFILE HANDLING *****************************
  static updateUserProfile = asyncHandler(async (req, res, next) => {
    try {
      const { name, email, phone, dob, address, medicalHistory } = req.body;
      const user = await User.findByIdAndUpdate(
        req.user._id,
        {
          name,
          email,
          phone,
          dob,
          address,
          medicalHistory,
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
        message: "Profile updated Successfully",
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  });

  static getUserInfo = asyncHandler(async (req, res, next) => {
    try {
      const user = await User.findById(req.user._id);
      if (!user) {
        return next(new ErrorHandler("User is not found", 400));
      }
      return res.status(200).json({ success: true, user });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  });

  static changePassword = asyncHandler(async (req, res, next) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const user = await User.findById(req.user._id).select("+password");
      const passwordMatch = user.comparePassword(currentPassword);
      if (!passwordMatch) {
        return next(new ErrorHandler("Password is incorrect"));
      }
      if (currentPassword === newPassword) {
        return next(new ErrorHandler("New password is already used", 400));
      }
      // Now update the old password with new password
      user.password = newPassword;
      await user.save();
      return res
        .status(200)
        .json({ success: true, message: "Password updated successfully" });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  });

  static updateUserAvatar = asyncHandler(async (req, res, next) => {
    try {
      const { image } = req.body;

      if (!image) {
        return next(new ErrorHandler("No image provided", 400));
      }

      // Upload the image to Cloudinary
      const result = await cloudinary.v2.uploader.upload(image, {
        folder: "avatars", // Optional: Save images in a specific folder
        resource_type: "auto", // Automatically detect the file type
      });
      const uploadedImage = {
        public_id: result.public_id,
        url: result.secure_url,
      };

      // Update user profile with the image
      const user = await User.findByIdAndUpdate(
        req.user._id,
        { avatar: uploadedImage },
        { runValidators: true, new: true }
      ).lean();

      // Return the Cloudinary URL of the uploaded image
      return res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  });


  
}

export default UserController;
