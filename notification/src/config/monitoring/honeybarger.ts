import Honeybadger from "@honeybadger-io/js";
import { getConfig } from "../config";

const env = process.env.NODE_ENV || "development";
const config = getConfig[env as keyof typeof getConfig];

// Initialize Honeybadger with your API key
const honeybadger = Honeybadger.configure({
  apiKey: config.HONEYBADGER_KEY,
  //   environment: process.env.NODE_ENV || "development",
});

export default honeybadger;
