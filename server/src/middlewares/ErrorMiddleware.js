import ErrorHandler from "../utils/ErrorHandler.js";

export const ErrorMiddleware = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  // Wrong MongoDB ID ERROR
  if (err.name === "CastError") {
    const message = `Resource not Found Invalid: ${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  // Duplicate key ERROR
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
    err = new ErrorHandler(message, 400);
  }

  // Wrong JWT error
  if (err.name === "JsonWebTokenError") {
    const message = "Json web token is invalid, try again";
    err = new ErrorHandler(message, 400);
  }

  // JWT EXPIRE ERROR
  if (err.name === "TokenExpiredError") {
    const message = `JSON WEB TOKEN IS EXPIRED, try again:`;
    err = new ErrorHandler(message, 400);
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
    errors: err.errors || [], // includes errors if they are present in the error object
  });
};
