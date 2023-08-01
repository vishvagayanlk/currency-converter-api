import request from "supertest";
import redisClient from "../../src/core/redis-connector";
import app from "../../src/server";
import ExchangeRatesData from "../../src/types";
import formatDateToISOString from "../../src/utils/format-date-to-iso-string";

jest.mock("ioredis", () => require("ioredis-mock"));

interface MockDataType {
  base: string;
  rates: ExchangeRatesData;
}

describe("api/convert endpoint intigation test", () => {
  const setuMockFetch = (
    status: number,
    statusText: string,
    isOk: boolean,
    mockData: Array<MockDataType>,
  ) => {
    jest
      .spyOn(global, "fetch")
      .mockImplementationOnce(() =>
        Promise.resolve({
          json: async () => mockData[0],
          ok: isOk,
          status: status,
          statusText: statusText,
        } as Response),
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          json: async () => mockData[1],
          ok: isOk,
          status: status,
          statusText: statusText,
        } as Response),
      );
  };
  const mockResponseDataTransactionDate: MockDataType = {
    base: "USD",
    rates: {
      AUD: 0.5,
      USD: 1,
      GBP: 2,
    },
  };

  const mockResponseDataRefundDate: MockDataType = {
    base: "USD",
    rates: {
      AUD: 0.25,
      USD: 1,
      GBP: 1.5,
    },
  };
  beforeEach(async () => {
    setuMockFetch(200, "OK", true, [
      mockResponseDataRefundDate,
      mockResponseDataTransactionDate,
    ]);
  });
  afterEach(async () => {
    redisClient.flushall();
    jest.clearAllMocks();
  });
  it("should give correct response", async () => {
    const responseAllow = await request(app).post("/api/convert").send({
      amount: 350,
      sourceCurrency: "AUD",
      targetCurrency: "USD",
      action: "PAYMENT",
      date: "2023-07-30",
    });
    expect(responseAllow.status).toBe(200);
    const result = JSON.parse(responseAllow.text);
    expect(result).toEqual({ currency: "USD", amount: 1400 });
  });
  it("should validate input", async () => {
    const responseAllow = await request(app).post("/api/convert").send({
      amount: "NOT-VALID",
      sourceCurrency: "NOT-VALID",
      targetCurrency: "NOT-VALID",
      action: "NOT-VALID",
      date: "NOT-VALID",
    });
    expect(responseAllow.status).toBe(400);
    const result = JSON.parse(responseAllow.text);
    expect(result).toEqual({
      error:
        "Expected number, received string, Invalid source currency, Invalid target currency, Invalid date format, Date must be in the present or past, Invalid action",
    });
  });
  it("should return original amount if source currency is same as target currency", async () => {
    const responseAllow = await request(app).post("/api/convert").send({
      amount: 350,
      sourceCurrency: "AUD",
      targetCurrency: "AUD",
      action: "PAYMENT",
      date: "2023-07-30",
    });
    expect(responseAllow.status).toBe(200);
    const result = JSON.parse(responseAllow.text);
    expect(result).toEqual({
      amount: 350,
      currency: "AUD",
    });
  });
  it("should give correct amount for refund action with given refund date", async () => {
    const responseRefund = await request(app)
      .post("/api/convert")
      .send({
        amount: 500,
        sourceCurrency: "AUD",
        targetCurrency: "GBP",
        date: "2022-07-31",
        action: "REFUND",
        refundDate: formatDateToISOString("2023-07-31"),
      });
    expect(responseRefund.status).toBe(200);
    const result = JSON.parse(responseRefund.text);
    expect(result).toEqual({
      currency: "GBP",
      amount: 1500,
      refundDate: "2023-07-30",
    });
  });
});
