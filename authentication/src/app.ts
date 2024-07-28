// Import Packages
import express from "express";
import session from "express-session";
import passport from "passport";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import compression from "compression";

// Import configs
import morganMiddleware from "./api/middlewares/morgan";
import { configurePassport } from "./config/passport";
import { sessionOptions } from "./config/db/sessionStore";
import { limiter } from "./config/limiter/rateLimiter";
import Honeybadger from "./config/monitoring/honeybarger";
import {
  requestMetricsMiddleware,
  trackMetrics,
} from "./config/prometheus/metrics";
import indexRouter from "./api/routes/index";
import { ErrorMiddleware } from "./api/middlewares/errorMiddleware";

export const app = express();

// Apply middleware before other routes
app.use(Honeybadger.requestHandler); // Honeybadger request handler

// Apply compression middleware with default settings
app.use(compression());

// Disable the 'X-Powered-By: Express' header
app.disable("x-powered-by");

// Apply Helmet middleware for enhanced security headers
app.use(helmet());

// Parse incoming request bodies with JSON payloads
app.use(express.json());

// Parse cookies attached to the client request
app.use(cookieParser());

// Use the session middleware with the configured options
app.use(session(sessionOptions));

// Initialize Passport configuration
configurePassport();

// Initialize Passport and session
app.use(passport.initialize());
app.use(passport.session());

// Use Morgan for HTTP request logging with Winston integration
app.use(morganMiddleware);

// Rate Limiter: Limit requests to 100 requests per hour per IP address
app.use(limiter);

// Route handlers
app.use("/", indexRouter);

// Middleware to collect request metrics
app.use(requestMetricsMiddleware);
app.use(trackMetrics);

// Honeybadger error handler (optional if required)
app.use(Honeybadger.errorHandler);

// Error handling middleware (make sure it's last)
app.use(ErrorMiddleware);
