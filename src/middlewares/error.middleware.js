  import { AppError } from "../utils/error.util.js";

  // Global Error Handler
  export const globalErrorHandler = (err, req, res, next) => {
    // Default values
    let statusCode = err.statusCode || 500;
    let status = err.status || "error";
    let message = err.message || "Something went wrong";
    let details = err.details || null;

    // Handle Mongoose duplicate key error
    if (err.code && err.code === 11000) {
      statusCode = 400;
      status = "fail";
      const field = Object.keys(err.keyValue)[0];
      message = `${field} already exists`;
      details = { field, value: err.keyValue[field] };
    }

    // Handle Mongoose validation errors
    if (err.name === "ValidationError") {
      statusCode = 400;
      status = "fail";
      const errors = Object.values(err.errors).map((e) => e.message);
      message = "Validation failed";
      details = errors;
    }

    // Handle JWT errors
    if (err.name === "JsonWebTokenError") {
      statusCode = 401;
      status = "fail";
      message = "Invalid token. Please login again.";
    }

    if (err.name === "TokenExpiredError") {
      statusCode = 401;
      status = "fail";
      message = "Token expired. Please login again.";
    }

    // Log programming errors in dev mode
    if (process.env.NODE_ENV === "development") {
      console.error("ERROR 💥:", err);
    }

    res.status(statusCode).json({
      success: false,
      status,
      message,
      details
    });
  };
