import express, { Request, Response as ResponseType } from "express";
import request from "supertest";
import redisClient from "../../src/core/redis-connector";
import rateLimiter from "../../src/middlewares/rate-limiter";

jest.mock("ioredis", () => require("ioredis-mock"));

describe("src/middleware/rate-limiter", () => {
  beforeAll(async () => {
    redisClient.flushall();
    jest.clearAllMocks();
  });
  afterEach(async () => {
    await redisClient.quit();
  });
  it("should not allow requests above the limit", async () => {
    const ip = "127.0.0.1";
    const app = express();
    app.get("/test-route", rateLimiter, (req: Request, res: ResponseType) => {
      res.status(200).send("Success");
    });
    const responseAllow = await request(app)
      .get("/test-route")
      .set("X-Forwarded-For", ip);
    expect(responseAllow.status).toBe(200);
    expect(responseAllow.text).toContain("Success");
    for (let i = 1; i <= 100; i++) {
      await request(app).get("/test-route").set("X-Forwarded-For", ip);
    }
    const response = await request(app)
      .get("/test-route")
      .set("X-Forwarded-For", ip);
    expect(response.status).toBe(429);
    expect(response.text).toContain(
      "Too many requests. Please try again later.",
    );
  });
});
