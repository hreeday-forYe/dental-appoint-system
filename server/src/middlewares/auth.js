import { asyncHandler } from './asyncHandler.js';
import jwt from 'jsonwebtoken';
import ErrorHandler from '../utils/ErrorHandler.js';
import User from '../models/userModel.js';

// Authenticate the user if he is actually logged in or not

const isAuthenticated = asyncHandler(async (req, res, next) => {
  let token = req.cookies.jwt;

  // console.log(`As you can see the token is: ${token}`); // this line prints out undefined
  if (!token) {
    return next(new ErrorHandler('Please login to access this resource', 400));
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  if (!decoded) {
    return next(new ErrorHandler('Token is invalid', 400));
  }

  // Getting the user from the database #TODO: MODIFY THE Changes to the models configuration
  const user = await User.findById(decoded.userId).select('-password'); // Deletes the userID

  // Checking if the user is not there
  if (!user) {
    return next(new ErrorHandler('User not found', 400));
  }

  req.user = user;
  next();
});


// validate the user role
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user?.role || '')) {
      return next(
        new ErrorHandler(
          `Role: ${req.user?.role} is not allowed to access this routes`,
          403
        )
      );
    }
    next();
  };
};

export { isAuthenticated, authorizeRoles };
