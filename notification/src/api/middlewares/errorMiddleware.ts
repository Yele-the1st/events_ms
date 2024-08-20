// src/middleware/errorMiddleware.ts
import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../../utils/ErrorHandler";
import logger from "../../config/winston/logger";

// Define a custom error interface
interface CustomError extends Error {
  statusCode?: number;
  status?: string; // Update this line
  code?: number | string;
  keyValue?: Record<string, unknown>;
  path?: string;
  errors?: { [key: string]: { message: string } };
  details?: { message: string }[];
}

// Error handling middleware
export const ErrorMiddleware = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction // eslint-disable-line @typescript-eslint/no-unused-vars
) => {
  const statusCode = err.statusCode || 500;
  let errorMessage = err.message || "Internal Server Error";
  const details = err.details;

  // Handle specific error types
  if (err.name === "CastError") {
    errorMessage = `Resource not found. Invalid: ${err.path}`;
    err = new ErrorHandler(errorMessage, 400);
  } else if (err.code === 11000) {
    const duplicateField = Object.keys(err.keyValue || {}).join(", ");
    errorMessage = `Duplicate field value entered: ${duplicateField}`;
    err = new ErrorHandler(errorMessage, 400);
  } else if (err.name === "ValidationError") {
    errorMessage = `Validation Error: ${Object.values(err.errors || {})
      .map((e) => e.message)
      .join(", ")}`;
    err = new ErrorHandler(errorMessage, 400);
  } else if (err.name === "JsonWebTokenError") {
    errorMessage = "Invalid JSON Web Token. Please authenticate.";
    err = new ErrorHandler(errorMessage, 401);
  } else if (err.name === "TokenExpiredError") {
    errorMessage = "JSON Web Token has expired. Please log in again.";
    err = new ErrorHandler(errorMessage, 401);
  } else if (err.name === "SyntaxError" && err.message.includes("JSON")) {
    errorMessage = "Invalid JSON payload.";
    err = new ErrorHandler(errorMessage, 400);
  } else if (err.code === "ENOENT") {
    errorMessage = "File not found.";
    err = new ErrorHandler(errorMessage, 404);
  } else if (statusCode === 403) {
    errorMessage = "Forbidden access.";
    err = new ErrorHandler(errorMessage, 403);
  } else if (statusCode === 404) {
    errorMessage = "Resource not found.";
    err = new ErrorHandler(errorMessage, 404);
  } else {
    err = new ErrorHandler(errorMessage, statusCode, details);
  }

  // Log the error for debugging
  logger.error(err);

  // Send the error response
  res.status(statusCode).json({
    success: false,
    message: err.message,
    details: err.details || undefined,
  });
};
