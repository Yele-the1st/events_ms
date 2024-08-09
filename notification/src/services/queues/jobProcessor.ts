import Bull from "bull";
import logger from "../../config/winston/logger";

// Import the email and OTP sending functions

export type QueueName = "notification" | "email"; // Add other queue names here

// Define a mapping object for processors
const processors: Record<QueueName, (job: Bull.Job) => Promise<void>> = {
  notification: async (job: Bull.Job) => {
    const { recipient, otp } = job.data;
    try {
      //   await sendOtpEmail(recipient, otp);
      logger.info(`OTP sent to ${recipient}`);
    } catch (error) {
      logger.error(`Failed to send OTP to ${recipient}: ${error}`);
    }
  },
  email: async (job: Bull.Job) => {
    const { recipient, subject, body } = job.data;
    try {
      //   await sendEmail(recipient, subject, body);
      logger.info(`Email sent to ${recipient}`);
    } catch (error) {
      logger.error(`Failed to send email to ${recipient}: ${error}`);
    }
  },
  // Add other queue processors here
};

export function getProcessorForQueue(queueName: QueueName) {
  return processors[queueName] || null;
}
//
