import { Redis } from "ioredis";
import { getConfig } from "../config";
import logger from "../winston/logger";

const env = process.env.NODE_ENV || "development";
const config = getConfig[env as keyof typeof getConfig];

const host = config.REDIS_HOST;
const port = config.REDIS_PORT!;
const password = config.REDIS_PASSWORD;

// Create a new Redis instance
const redisClient = new Redis({
  host: host || "localhost", // Redis server address
  port: parseInt(port, 10) || 6379, // Redis server port
  password: password, // Redis server password if set
});

redisClient.on("connect", () => logger.info("Cache is connecting"));
redisClient.on("ready", () => logger.info("Cache is ready"));
redisClient.on("end", () => logger.info("Cache disconnected"));
redisClient.on("reconnecting", () => logger.info("Cache is reconnecting"));
redisClient.on("error", (err) => {
  logger.error("Redis error:", err);
});

// If the Node process ends, close the Cache connection
process.on("SIGINT", async () => {
  redisClient.disconnect();
});

export default redisClient;
