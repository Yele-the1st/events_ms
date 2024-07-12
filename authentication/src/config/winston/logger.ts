import { createLogger, format, transports } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import * as fs from "fs";
import * as path from "path";

const env = process.env.NODE_ENV || "development";
const logDir = "log";
const datePatternConfiguration = {
  default: "YYYY-MM-DD",
  everHour: "YYYY-MM-DD-HH",
  everMinute: "YYYY-MM-DD-THH-mm",
};
const numberOfDaysToKeepLog = 30;
const fileSizeToRotate = 1; // in megabyte

// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const dailyRotateFileTransport = new DailyRotateFile({
  filename: `${logDir}/%DATE%-results.log`,
  datePattern: datePatternConfiguration.everHour,
  zippedArchive: true,
  maxSize: `${fileSizeToRotate}m`,
  maxFiles: `${numberOfDaysToKeepLog}d`,
});

const logger = createLogger({
  // change level if in dev environment versus production
  level: env === "development" ? "verbose" : "info",
  handleExceptions: true,
  format: format.combine(
    format.label({ label: path.basename(__filename) }),
    format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    format.printf(
      (info) =>
        `${info.timestamp}[${info.label}] ${info.level}: ${JSON.stringify(
          info.message
        )}`
    )
  ),
  transports: [
    new transports.Console({
      level: "info",
      handleExceptions: true,
      format: format.combine(
        format.label({ label: path.basename(__filename) }),
        format.colorize(),
        format.printf(
          (info) =>
            `${info.timestamp}[${info.label}] ${info.level}: ${info.message}`
        )
      ),
    }),
    dailyRotateFileTransport,
  ],
});

export default logger;
