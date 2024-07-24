import { Request, Response } from "express";
import ErrorHandler from "../../utils/ErrorHandler";
import logger from "../../config/winston/logger";

// Define a custom error interface
interface CustomError extends Error {
  statusCode?: number;
  status?: number;
  code?: number | string;
  keyValue?: Record<string, unknown>;
  path?: string;
  errors?: { [key: string]: { message: string } };
}

// Error handling middleware
export const ErrorMiddleware = (
  err: CustomError,
  req: Request,
  res: Response
) => {
  // Default status code and message
  const statusCode = err.statusCode || err.status || 500;
  const errorMessage = err.message || "Internal Server Error";

  // Handle specific error types
  if (err.name === "CastError") {
    // Invalid MongoDB ID format
    const message = `Resource not found. Invalid: ${err.path}`;
    err = new ErrorHandler(message, 400);
  } else if (err.code === 11000) {
    // Duplicate key error
    const duplicateField = Object.keys(err.keyValue || {}).join(", ");
    const message = `Duplicate field value entered: ${duplicateField}`;
    err = new ErrorHandler(message, 400);
  } else if (err.name === "ValidationError") {
    // Mongoose validation error
    const message = `Validation Error: ${Object.values(err.errors || {})
      .map((e) => e.message)
      .join(", ")}`;
    err = new ErrorHandler(message, 400);
  } else if (err.name === "JsonWebTokenError") {
    // JWT errors
    const message = "Invalid JSON Web Token. Please authenticate.";
    err = new ErrorHandler(message, 401);
  } else if (err.name === "TokenExpiredError") {
    // JWT expired error
    const message = "JSON Web Token has expired. Please log in again.";
    err = new ErrorHandler(message, 401);
  } else if (err.name === "SyntaxError" && err.message.includes("JSON")) {
    // Invalid JSON payload
    const message = "Invalid JSON payload.";
    err = new ErrorHandler(message, 400);
  } else if (err.code === "ENOENT") {
    // File not found error
    const message = "File not found.";
    err = new ErrorHandler(message, 404);
  } else if (statusCode === 403) {
    // Forbidden access
    const message = "Forbidden access.";
    err = new ErrorHandler(message, 403);
  } else if (statusCode === 404) {
    // Resource not found
    const message = "Resource not found.";
    err = new ErrorHandler(message, 404);
  } else {
    // For other types of errors, use default handling
    err = new ErrorHandler(errorMessage, statusCode);
  }

  // Log the error for debugging
  logger.error(err);

  // Send the error response
  res.status(statusCode).json({
    success: false,
    message: err.message,
  });
};
