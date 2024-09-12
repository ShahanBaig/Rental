import ErrorHandler from "../utils/errorhandler.js";

const errorCheck = async (err, req, res, next) => {
  // Defaults error messages
  err.statusCode = err.statusCode || 500
  err.message = err.message || "Internal Server Error"

  // MongoDB ID error
  if (err.name === "CastError") {
    err = new ErrorHandler("Resource not found. Invalid: " + err.path, 400)
  }

  // Return and end request
  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};

export default errorCheck