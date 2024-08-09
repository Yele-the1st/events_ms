import Bull from "bull";
import { redisConfig } from "../../config/cache/redis";
import { getProcessorForQueue, QueueName } from "./jobProcessor";
import logger from "../../config/winston/logger";

class QueueService {
  private queues: Map<QueueName, Bull.Queue>;

  constructor() {
    this.queues = new Map();
    this.queues.set(
      "notification",
      new Bull("notification", { redis: redisConfig })
    );
    this.queues.set("email", new Bull("email", { redis: redisConfig }));
    // Initialize other queues as needed

    // Register event listeners for each queue
    this.queues.forEach((queue, queueName) => {
      this.registerQueueEvents(queue, queueName);
    });
  }

  private registerQueueEvents(queue: Bull.Queue, queueName: QueueName) {
    queue.on("error", (error) => {
      logger.error(`Error in queue ${queueName}:`, error);
    });

    queue.on("failed", (job, error) => {
      logger.error(`Job ${job.id} in queue ${queueName} failed:`, error);
      // You can add additional logic here, like re-queuing the job or sending an alert
    });

    queue.on("completed", (job, result) => {
      logger.log(
        `Job ${job.id} in queue ${queueName} completed with result:`,
        result
      );
      // Handle the successful completion of the job
    });
  }

  async addJob(
    queueName: QueueName,
    name: string,
    data: unknown,
    delay: number
  ) {
    const queue = this.queues.get(queueName);
    if (!queue) {
      throw new Error(`Queue with name ${queueName} does not exist.`);
    }
    await queue.add(name, data, { delay });
  }

  async processJobs(queueName: QueueName) {
    const queue = this.queues.get(queueName);
    if (!queue) {
      throw new Error(`Queue with name ${queueName} does not exist.`);
    }

    const processor = getProcessorForQueue(queueName);
    if (!processor) {
      throw new Error(`Processor for queue ${queueName} is not defined.`);
    }

    queue.process(processor);
  }
}

export default QueueService;
