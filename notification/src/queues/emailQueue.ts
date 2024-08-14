import { Queue, Worker, Job, QueueEvents, JobsOptions } from "bullmq";
import logger from "../config/winston/logger";
import { redisConfig } from "../config/cache/redis";
import { getDeliveryService } from "../services/integration/getDeliveryService";
import mongoose from "mongoose";

// Configuration constants
const MAX_WORKERS = 5; // Maximum number of workers to run concurrently
const MIN_WORKERS = 1; // Minimum number of workers to maintain
const THRESHOLD = 10; // Minimum number of jobs required to add a new worker
const CHECK_INTERVAL = 60000; // Interval in milliseconds to check the queue [1 minute]

// Define job data and result types for the "notification" queue
export interface EmailNotificationJobData {
  userId?: string;
  message: string;
  type: "email" | "sms"; // Indicate the type of notification
  provider: "SENDGRID" | "SES" | "NODEMAILER" | "Twilio" | "SNS"; // Indicate the service provider
  recipient: { email?: string; phoneNumber?: string }; // Email or phone number
  subject?: string; // For emails
  notificationId: mongoose.Types.ObjectId;
  sourceEmail?: string; // The sender email address
  replyToAddresses?: string[]; // Reply-to email addresses
}

export interface EmailNotificationJobResult {
  success: boolean;
  error?: string;
}

// Initialize the queue and QueueEvents
export const userNotificationQueue = new Queue<EmailNotificationJobData>(
  "user-notification",
  { connection: redisConfig }
);

const queueEvents = new QueueEvents("user-notification", {
  connection: redisConfig,
});

class WorkerManager {
  private workers: Worker<
    EmailNotificationJobData,
    EmailNotificationJobResult
  >[] = [];
  private checkIntervalId: NodeJS.Timeout | null = null;
  private isShuttingDown = false; // Flag to track if the system is shutting down

  /**
   * Initializes a new instance of WorkerManager.
   * @param queue The BullMQ queue instance for managing jobs.
   */
  constructor(private queue: Queue<EmailNotificationJobData>) {
    // Start monitoring immediately to handle delayed jobs when they become active
    this.monitorQueue();
  }

  /**
   * Creates a new worker instance for processing jobs.
   * @returns The created Worker instance.
   */
  private createWorker(): Worker<
    EmailNotificationJobData,
    EmailNotificationJobResult
  > {
    return new Worker<EmailNotificationJobData, EmailNotificationJobResult>(
      this.queue.name,
      this.processJob.bind(this),
      {
        connection: redisConfig,
        concurrency: 1,
      }
    );
  }

  /**
   * Processes a job from the queue.
   * @param job The job to be processed.
   * @returns The result of the job processing.
   */
  private async processJob(
    job: Job<EmailNotificationJobData, EmailNotificationJobResult>
  ): Promise<EmailNotificationJobResult> {
    logger.info(`Processing email job ${job.id}`);

    const {
      provider,
      recipient,
      message,
      subject,
      sourceEmail,
      replyToAddresses,
    } = job.data;

    try {
      if (!recipient.email) {
        throw new Error("Email address is missing for the email notification");
      }

      // Get the appropriate email service provider (SendGrid, SES, or Nodemailer)
      const emailService = getDeliveryService(
        "email",
        provider as "SENDGRID" | "SES" | "NODEMAILER"
      );

      // Send the email using the selected provider
      const response = await emailService.sendEmail({
        to: { email: recipient.email },
        subject: subject || "Default Subject",
        body: message,
        sourceEmail,
        replyToAddresses,
      });

      // Log the result and return success
      logger.info(`Email sent: ${response?.messageId}`);
      return { success: true };
    } catch (error) {
      // Log the error and re-throw it so the queue registers the job as failed
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      logger.error(
        `Failed to process email job ${job.id}: ${errorMessage}`,
        error
      );

      // Re-throw the error to make sure the job fails in the queue
      throw new Error(errorMessage);
    }
  }

  /**
   * Adds a new job to the queue with specified options.
   * @param jobData The data for the job to be added.
   * @param options Optional job options to customize job behavior.
   */
  public async addJob(
    jobData: EmailNotificationJobData,
    options: JobsOptions = {}
  ): Promise<void> {
    try {
      await this.queue.add("notification-job", jobData, options);
      logger.info(`Added job with ID ${options.jobId} to the queue.`);
    } catch (error) {
      logger.error(`Failed to add job to queue: ${error}`, error);
    }
  }

  /**
   * Adds multiple jobs to the queue in bulk.
   * @param jobs An array of job data and options to be added to the queue.
   */
  public async addJobsBulk(
    jobs: Array<{ data: EmailNotificationJobData; options?: JobsOptions }>
  ): Promise<void> {
    try {
      await Promise.all(
        jobs.map(({ data, options }) =>
          this.queue.add("notification-job", data, options)
        )
      );
      logger.info(`Added ${jobs.length} jobs to the queue.`);
    } catch (error) {
      logger.error(`Failed to add jobs to queue: ${error}`, error);
    }
  }

  /**
   * Changes the delay of an existing job.
   * @param jobId The ID of the job to update.
   * @param newDelay The new delay in milliseconds.
   */
  public async changeJobDelay(jobId: string, newDelay: number): Promise<void> {
    try {
      const job = await this.queue.getJob(jobId);

      if (job) {
        await job.changeDelay(newDelay);
        logger.info(`Updated delay for job with ID ${jobId} to ${newDelay}ms.`);
      } else {
        logger.warn(`Job with ID ${jobId} not found.`);
      }
    } catch (error) {
      logger.error(`Failed to change delay for job ${jobId}: ${error}`, error);
    }
  }

  /**
   * Changes the delay for multiple jobs in bulk.
   * @param jobUpdates An array of objects each containing a job ID and new delay.
   */
  public async changeJobsDelaysBulk(
    jobUpdates: Array<{ jobId: string; newDelay: number }>
  ): Promise<void> {
    try {
      await Promise.all(
        jobUpdates.map(async ({ jobId, newDelay }) => {
          await this.changeJobDelay(jobId, newDelay);
        })
      );
      logger.info(`Updated delays for ${jobUpdates.length} jobs.`);
    } catch (error) {
      logger.error(`Failed to update job delays: ${error}`, error);
    }
  }

  /**
   * Removes a job from the queue.
   * @param jobId The ID of the job to remove.
   */
  public async removeJob(jobId: string): Promise<void> {
    try {
      const job = await this.queue.getJob(jobId);

      if (job) {
        await job.remove();
        logger.info(`Removed job with ID ${jobId} from the queue.`);
      } else {
        logger.warn(`Job with ID ${jobId} not found.`);
      }
    } catch (error) {
      logger.error(`Failed to remove job ${jobId}: ${error}`, error);
    }
  }

  /**
   * Removes multiple jobs from the queue in bulk.
   * @param jobIds An array of job IDs to remove.
   */
  public async removeJobsBulk(jobIds: string[]): Promise<void> {
    try {
      await Promise.all(
        jobIds.map(async (jobId) => {
          await this.removeJob(jobId);
        })
      );
      logger.info(`Removed ${jobIds.length} jobs from the queue.`);
    } catch (error) {
      logger.error(`Failed to remove jobs: ${error}`, error);
    }
  }

  /**
   * Manages the worker pool based on the current job count and delayed jobs.
   */
  private async manageWorkerPool() {
    const jobCount = await this.queue.count();
    const delayedCount = await this.queue.getDelayedCount();

    if (
      jobCount + delayedCount >= THRESHOLD &&
      this.workers.length < MAX_WORKERS
    ) {
      const newWorker = this.createWorker();
      this.attachWorkerListeners(newWorker);
      this.workers.push(newWorker);
      logger.info(`Worker added. Total workers: ${this.workers.length}`);
    } else if (
      jobCount + delayedCount < THRESHOLD &&
      this.workers.length > MIN_WORKERS
    ) {
      const workerToRemove = this.workers.pop();
      if (workerToRemove) {
        await this.stopWorker(workerToRemove);
      }
    }

    if (jobCount + delayedCount === 0 && this.workers.length === 0) {
      this.stopMonitoring();
    }
  }

  /**
   * Attaches event listeners to a worker instance.
   * @param worker The worker to which event listeners will be attached.
   */
  private attachWorkerListeners(
    worker: Worker<EmailNotificationJobData, EmailNotificationJobResult>
  ) {
    worker.on("completed", async (job) => {
      logger.info(`Job ${job.id} completed`);
      await this.manageWorkerPool();
    });

    worker.on("failed", async (job, error) => {
      if (job) {
        logger.error(`Job ${job.id} failed: ${error.message}`, error);
      } else {
        logger.error(
          `A job failed but job details are undefined: ${error.message}`,
          error
        );
      }
      await this.manageWorkerPool();
    });

    worker.on("error", (err: Error) => {
      logger.error(`Worker error: ${err.message}`);
    });
  }

  /**
   * Stops and removes a worker from the pool.
   * @param worker The worker to be stopped.
   */
  private async stopWorker(
    worker: Worker<EmailNotificationJobData, EmailNotificationJobResult>
  ) {
    await worker.close();
    logger.info(`Worker stopped. Total workers: ${this.workers.length}`);
  }

  /**
   * Starts monitoring the queue and managing workers based on job metrics.
   */
  private startMonitoring() {
    if (this.checkIntervalId) return;

    this.checkIntervalId = setInterval(async () => {
      await this.manageWorkerPool();
    }, CHECK_INTERVAL);

    logger.info("Started monitoring queue");
  }

  /**
   * Stops monitoring the queue and clears the interval.
   */
  private stopMonitoring() {
    if (this.checkIntervalId) {
      clearInterval(this.checkIntervalId);
      this.checkIntervalId = null;
      logger.info("Stopped monitoring queue");
    }
  }

  /**
   * Initiates a graceful shutdown of the worker manager.
   */
  public async shutdown() {
    // Check if the system is already in the process of shutting down
    if (this.isShuttingDown) {
      logger.warn("Shutdown already in progress.");
      return; // Exit if already shutting down
    }

    this.isShuttingDown = true; // Set the flag to true to indicate shutdown initiation
    logger.info("Initiating graceful shutdown...");

    // Stop accepting new jobs
    this.stopMonitoring();

    // Wait for existing jobs to complete
    await Promise.all(
      this.workers.map(async (worker) => {
        await worker.close(); // Wait for each worker to close
      })
    );

    logger.info("Worker manager shutdown complete.");
  }

  /**
   * Sets up event listeners to monitor the queue.
   */
  private monitorQueue() {
    queueEvents.on("waiting", () => this.startMonitoring());
    queueEvents.on("completed", () => this.startMonitoring());
    queueEvents.on("failed", () => this.startMonitoring());
    queueEvents.on("active", () => this.startMonitoring());
    queueEvents.on("delayed", () => this.startMonitoring()); // New event listener for delayed jobs
  }
}

// Export an instance of WorkerManager for the user notification queue
export const emailQueue = new WorkerManager(userNotificationQueue);

// Handle graceful shutdown
process.on("SIGTERM", async () => {
  await emailQueue.shutdown();
  process.exit(0);
});

process.on("SIGINT", async () => {
  await emailQueue.shutdown();
  process.exit(0);
});

// Example of jobOptions application
// Define options for adding a job
export const jobOptions = {
  /**
   * Delay the job by 5 minutes (300,000 milliseconds).
   * The job will not be processed until the delay period has elapsed.
   */
  delay: 300000,

  /**
   * Job priority. Lower numbers indicate higher priority.
   * Used to determine the order of jobs within the queue.
   */
  priority: 1, // High priority

  /**
   * A unique identifier for the job. If a job with the same ID already exists, this job will not be added.
   * Useful for idempotent jobs where you don't want duplicates.
   */
  jobId: "unique-job-id-123",

  /**
   * Number of times to retry the job if it fails.
   * Can be a number or an object defining retry strategies.
   */
  attempts: 5,

  /**
   * Backoff strategy for retries. Defines the delay between retries.
   * Can be 'fixed' or 'exponential' with a specified delay.
   */
  backoff: {
    type: "exponential", // 'fixed' or 'exponential'
    delay: 60000, // Delay in milliseconds for the backoff
  },

  /**
   * Maximum time (in milliseconds) to wait for the job to be processed before considering it stuck.
   * After this period, the job will be considered stalled and retried.
   */
  stallInterval: 30000, // 30 seconds

  /**
   * Timeout for the job. The job will be forcibly terminated if it exceeds this time.
   */
  timeout: 60000, // 60 seconds

  /**
   * Maximum number of attempts allowed to process the job before marking it as failed.
   * Default is the value set in the attempts option.
   */
  maxAttempts: 5,

  /**
   * Whether or not the job should be removed from the queue after it completes.
   * This option can be used to automatically clean up completed jobs.
   */
  removeOnComplete: {
    age: 3600, // Job will be removed if it is older than this time (in seconds)
    count: 1000, // Job will be removed when there are more than this number of completed jobs
  },

  /**
   * Whether or not the job should be removed from the queue after it fails.
   * This option can be used to automatically clean up failed jobs.
   */
  removeOnFail: {
    age: 86400, // Job will be removed if it is older than this time (in seconds)
  },

  /**
   * Job will be scheduled to run at this specific timestamp (in milliseconds).
   * This is different from delay as it sets an absolute time.
   */
  scheduleAt: Date.now() + 60000, // Schedule the job to run 1 minute from now

  /**
   * If true, the job will be placed in a delayed state and will not be processed until the delay expires.
   * Equivalent to the `delay` option but specifies an absolute time.
   */
  delayUntil: Date.now() + 300000, // Delay job for 5 minutes from now
};
