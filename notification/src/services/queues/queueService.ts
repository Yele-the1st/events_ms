import Bull from "bull";
import { redisConfig } from "../../config/cache/redis";

type QueueName = "notification" | "email"; // Add other queue names here

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

  async processJobs(
    queueName: QueueName,
    processor: (job: Bull.Job) => Promise<void>
  ) {
    const queue = this.queues.get(queueName);
    if (!queue) {
      throw new Error(`Queue with name ${queueName} does not exist.`);
    }
    queue.process(processor);
  }
}

export default QueueService;
