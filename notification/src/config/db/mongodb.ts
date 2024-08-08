/* eslint-disable no-console */
import mongoose, { ConnectOptions } from "mongoose";
import logger from "../winston/logger";

import { getConfig } from "../config";

const env = process.env.NODE_ENV || "development";
const config = getConfig[env as keyof typeof getConfig];

const dbURI: string = config.MONGODB_URL as string;
const options: ConnectOptions = {
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
};

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(dbURI, options);
    console.log("MongoDB connected!");
  } catch (err) {
    logger.error(err);
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};

export const connectDBWithRetry = async (
  retries = 10,
  delay = 5000
): Promise<void> => {
  try {
    logger.info("Attempting to connect to MongoDB...");
    await mongoose.connect(dbURI, options);
    logger.info("MongoDB connection established successfully");
  } catch (err) {
    logger.error("MongoDB connection error:", err);
    if (retries > 0) {
      logger.warn(
        `Retrying MongoDB connection in ${
          delay / 1000
        } seconds... (${retries} retries left)`
      );
      setTimeout(() => connectDBWithRetry(retries - 1, delay), delay);
    } else {
      logger.error("MongoDB connection failed after retries. Exiting process.");
      process.exit(1);
    }
  }
};
