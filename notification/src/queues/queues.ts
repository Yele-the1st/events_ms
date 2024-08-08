import Bull from "bull";
import { RedisOptions } from "ioredis";

// Define Redis options
const redisOptions: RedisOptions = {
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
};

// Create a queue instance for emails
const emailQueue = new Bull("emailQueue", { redis: redisOptions });

export default emailQueue;
