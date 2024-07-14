// config/sessionStore.ts
import session from "express-session";
import RedisStore from "connect-redis";
import redisClient from "../cache/redis";
import dotenv from "dotenv";

dotenv.config();

const sessionStore = new RedisStore({
  client: redisClient,
  prefix: "fibe:",
});

let cookieSetting;
if (process.env.COOKIE_SETTING === "live") {
  cookieSetting = {
    domain: process.env.COOKIE_DOMAIN,
    httpOnly: true,
    maxAge: 1 * 24 * 60 * 60 * 1000,
  };
} else {
  cookieSetting = {
    secure: false,
    httpOnly: true,
    maxAge: 1 * 24 * 60 * 60 * 1000,
  };
}

const sessionOptions: session.SessionOptions = {
  name: "fibe-sid",
  secret: process.env.SESSION_SECRET as string,
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
  cookie: cookieSetting,
};

export { sessionStore, sessionOptions };
