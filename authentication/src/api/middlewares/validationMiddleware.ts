// src/middleware/validationMiddleware.ts
import { Request, Response, NextFunction } from "express";
import { ZodError, ZodSchema, ZodIssue } from "zod";
import ErrorHandler from "../../utils/ErrorHandler";

export const validateData =
  (schema: ZodSchema<unknown>) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((issue: ZodIssue) => ({
          message: `${issue.path.join(".")}: ${issue.message}`,
        }));
        const validationError = new ErrorHandler(
          "Invalid data",
          400,
          errorMessages
        );
        next(validationError); // Pass the error to the error handling middleware
      } else {
        const internalError = new ErrorHandler("Internal Server Error", 500);
        next(internalError); // Pass the error to the error handling middleware
      }
    }
  };
