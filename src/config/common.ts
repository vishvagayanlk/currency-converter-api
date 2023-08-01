import type { ConfigSchema } from "./types";
import "dotenv/config";

const config: ConfigSchema = {
  port: 3000,
  logger: {
    level: "info",
    filePath: "./tmp/log.json",
  },
  redis: {
    host: "localhost:3303",
    port: 5845,
  },
  rateLimiter: {
    MAX_REQUESTS_PER_MINUTE: 60,
    TIME_WINDOW: 60,
  },
  openExchange: {
    appId: process.env.OPEN_EXCHANGE_APP_ID,
    apiBaseUrl: "https://openexchangerates.org/api",
  },
};

export default config;
