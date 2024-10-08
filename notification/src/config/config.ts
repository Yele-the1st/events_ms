import dotenv from "dotenv";
import os from "os";

dotenv.config();

interface Config {
  NODE_ENV: string | undefined;
  UV_THREADPOOL_SIZE: number;
  MONGODB_URL: string | undefined;
  PORT: string | number;
  JWT_SECRET: string | undefined;
  JWT_EXPIRES: string | undefined;
  JWT_COOKIE_EXPIRES_IN: string | undefined;
  SALT_ROUNDS: number;
  TOKEN_EXPIRATION_TIME: string;
  SESSION_SECRET: string;
  HOST: string;
  GOOGLE_CLIENT_ID: string | undefined;
  GOOGLE_CLIENT_SECRET: string | undefined;
  LIVE_BASE_URL: string;
  HONEYBADGER_KEY: string | undefined;
  LOG_DIRECTORY: string | undefined;
  REDIS_HOST: string | undefined;
  REDIS_PORT: string | undefined;
  REDIS_PASSWORD: string | undefined;
  COOKIE_DOMAIN: string | undefined;
  API_KEY: string | undefined;
}

const development: Config = {
  NODE_ENV: process.env.NODE_ENV,
  UV_THREADPOOL_SIZE: os.cpus().length,
  MONGODB_URL: process.env.MONGODB_URL,
  PORT: process.env.PORT || 3000,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES: process.env.JWT_EXPIRES,
  JWT_COOKIE_EXPIRES_IN: process.env.JWT_COOKIE_EXPIRES_IN,
  SALT_ROUNDS: Number(process.env.SALT_ROUNDS) || 12,
  TOKEN_EXPIRATION_TIME: process.env.TOKEN_EXPIRATION_TIME || "10m",
  SESSION_SECRET: process.env.SESSION_SECRET || "fibe",
  HOST: os.hostname(),
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,

  LIVE_BASE_URL: process.env.LIVE_BASE_URL || "fibe-staging.azurewebsites.net",
  HONEYBADGER_KEY: process.env.HONEYBADGER_KEY,

  LOG_DIRECTORY: process.env.LOG_DIR,
  REDIS_HOST: process.env.REDIS_HOST,
  REDIS_PORT: process.env.REDIS_PORT,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD,
  COOKIE_DOMAIN: process.env.COOKIE_DOMAIN,
  API_KEY: process.env.API_KEY,
};

const test: Partial<Config> = {
  NODE_ENV: "test",
};

const production: Partial<Config> = {
  NODE_ENV: "production",
};

export const getConfig = {
  development,
  test,
  production,
};
