import { Redis } from "ioredis";

// Create a new Redis instance
export const redis = new Redis({
  host: "localhost", // Redis server address
  port: 6379, // Redis server port
  // Optionally, add other configurations like password if Redis is password protected
  //     password: process.env.REDIS_PASSWORD || '',
});

// const redisClient = () => {
//   if (process.env.REDIS_URL) {
//     console.log(`Redis connected`);
//     return process.env.REDIS_URL;
//   }
//   throw new Error("Redis connection failed");
// };

// export const redis = new Redis(redisClient());

// const redisURL = `redis://:${redis.password}@${redis.host}:${redis.port}`;
