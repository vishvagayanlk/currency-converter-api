import config from "../config";
import Redis from "ioredis";
import { logger } from "./logger";

let redisClient: Redis;
const getRedisClient = () => {
  if (!redisClient) {
    redisClient = new Redis(config.redis);

    // Handle connection and error events in redis
    redisClient.on("connect", () => {
      logger.info(
        `Connected to Redis server at ${config.redis.host}:${config.redis.port}`,
      );
    });

    redisClient.on("error", (err) => {
      logger.error("Redis connection error:", err);
    });
  }

  return redisClient;
};

export default getRedisClient();
