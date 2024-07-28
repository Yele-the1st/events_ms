class ErrorHandler extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;
  details?: { message: string }[];

  constructor(
    message: string,
    statusCode: number,
    details?: { message: string }[]
  ) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;
    this.details = details;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ErrorHandler;
