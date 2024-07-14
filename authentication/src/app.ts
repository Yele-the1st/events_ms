import express from "express";
import morganMiddleware from "./api/middlewares/morgan";
import { configurePassport } from "./config/passport";
import passport from "passport";
import session from "express-session";
import { sessionOptions } from "./config/db/sessionStore";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { limiter } from "./config/limiter/rateLimiter";

export const app = express();

// Apply Helmet middleware for enhanced security headers
app.use(helmet());

// Parse incoming request bodies with JSON payloads
app.use(express.json());

// Parse cookies attached to the client request
app.use(cookieParser());

// Initialize Passport configuration
configurePassport();

// Initialize Passport and session
app.use(passport.initialize());
app.use(passport.session());

// Use Morgan for HTTP request logging with Winston integration
app.use(morganMiddleware);

// Use the session middleware with the configured options
app.use(session(sessionOptions));

// Rate Limiter: Limit requests to 100 requests per hour per IP address
app.use(limiter);
