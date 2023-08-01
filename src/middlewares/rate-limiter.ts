import config from "../config";
import { NextFunction, Request, Response } from "express";
import redisClient from "../core/redis-connector";

const rateLimiter = async (req: Request, res: Response, next: NextFunction) => {
  const ipAddress = req.ip;
  const redisKey = `rate-limiter:${ipAddress}`;
  try {
    const requestsCount = await redisClient.incr(redisKey);
    if (requestsCount === 1) {
      await redisClient.expire(redisKey, config.rateLimiter.TIME_WINDOW);
    }
    if (requestsCount > config.rateLimiter.MAX_REQUESTS_PER_MINUTE) {
      // Sending a 429 response and stop the request from reaching the route contorller
      return res
        .status(429)
        .json({ error: "Too many requests. Please try again later." });
    }
    return next();
  } catch (error) {
    return next(error);
  }
};

export default rateLimiter;
