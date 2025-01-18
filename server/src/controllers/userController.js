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
import cloudinary from 'cloudinary';


const registerUser = asyncHandler(async (req, res, next) => {
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

    const mailPath = path.join(currentDirectory, "../mails/activationMail.ejs");

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

// Activate User function for storing the data of the user to the database
const activateUser = asyncHandler(async (req, res, next) => {
  try {
    const { activation_code, activation_token } = req.body;

    const newUser = jwt.verify(activation_token, process.env.ACTIVATION_SECRET);

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
    return next(new ErrorHandler(error.message, 400));
  }
});

// Login user functions logins the user
const loginUser = asyncHandler(async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ErrorHandler("Please enter your email or Password", 400));
    }
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return next(new ErrorHandler("Invalid Email or Password", 400));
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
    return next(new ErrorHandler(error.message, 400));
  }
});

/*
 * LOGOUT USER FUNCTION- Logs the user out from the site clearing his cookies
 */

const logoutUser = asyncHandler(async (req, res, next) => {
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
    return next(new ErrorHandler(error.message, 400));
  }
});

const updateUserInfo = asyncHandler(async (req, res, next) => {
  try {
    const { name, email, address, medicalIssues, phone,avatar } = req.body;
    const userId = req.user?._id;
    const user = await User.findById(userId).select("+password");

    // Check if user exists
    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    // Verify password
    // const isPasswordValid = await user.comparePassword(password);
    // if (!isPasswordValid) {
    //   return next(new ErrorHandler('Invalid password', 400));
    // }

    // Update email if provided
    // if (email && email !== user.email) {
    //   const isEmailExist = await User.findOne({ email });
    //   if (isEmailExist) {
    //     return next(new ErrorHandler('Email already exists', 400));
    //   }
    //   user.email = email;
    // }

    // Update name if provided
    if (name) {
      user.name = name;
    }
    if(address){
      user.address = address;
    }
    if(phone){
      user.phone = phone;
    }
    if(medicalIssues){
      user.medicalissues = medicalIssues
    }


    if (avatar && user) {
      // If we have one avatar then call this if
      if (user?.avatar?.public_id) {
        // First delete the old image
        await cloudinary.v2.uploader.destroy(user?.avatar?.public_id);

        // Then add the new image if the user already has the avatar
        const mycloud = await cloudinary.v2.uploader.upload(avatar, {
          folder: 'avatars',
          width: 150,
        });
        user.avatar = {
          public_id: mycloud.public_id,
          url: mycloud.secure_url,
        };
      } else {
        const mycloud = await cloudinary.v2.uploader.upload(avatar, {
          folders: 'avatars',
        });
        user.avatar = {
          public_id: mycloud.public_id,
          url: mycloud.secure_url,
        };
      }
    }

    delete user._doc.password;
  
    await user.save();
  
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

export { registerUser, loginUser, logoutUser, activateUser, updateUserInfo };
