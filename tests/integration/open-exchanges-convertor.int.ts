import getExchangeRateDataSet from "../../src/core/open-exchanges-connector";
import redisClient from "../../src/core/redis-connector";
jest.mock("ioredis", () => require("ioredis-mock"));
describe("src/utils/open-exchanges-connector", () => {
  const setuMockFetch = (status: number, statusText: string, isOk: boolean) => {
    jest.spyOn(global, "fetch").mockImplementation(() =>
      Promise.resolve({
        json: async () => mockResponseData,
        ok: isOk,
        status: status,
        statusText: statusText,
      } as Response),
    );
  };
  const mockResponseData = {
    disclaimer: "Usage subject to terms: https://openexchangerates.org/terms",
    license: "https://openexchangerates.org/license",
    timestamp: 1690657201,
    base: "USD",
    rates: {
      AUD: 1.1,
    },
  };
  afterEach(async () => {
    redisClient.flushall();
    jest.clearAllMocks();
  });
  afterAll(async () => {
    await redisClient.quit();
  });
  it("should fetch exchange rates data from mock api", async () => {
    setuMockFetch(200, "OK", true);
    const date = "2023-07-29";
    const exchangeRatesData = await getExchangeRateDataSet(date);
    expect(exchangeRatesData).toStrictEqual({ AUD: 1.1 });
    expect(global.fetch).toBeCalledTimes(1);
  });
  it("should cache previous request send exchange rates", async () => {
    setuMockFetch(200, "OK", true);
    const date = "2023-07-29";
    const exchangeRatesData1 = await getExchangeRateDataSet(date);
    const exchangeRatesData2 = await getExchangeRateDataSet(date);
    expect(exchangeRatesData1).toStrictEqual({ AUD: 1.1 });
    expect(exchangeRatesData2).toStrictEqual({ AUD: 1.1 });
    expect(global.fetch).toBeCalledTimes(1);
  });
  it("should throw an error when API request fails", async () => {
    setuMockFetch(500, "Internal Server Error", false);
    const date = "2023-07-29";
    await expect(getExchangeRateDataSet(date)).rejects.toThrowError(
      "Open Exchange Rates API request failed with status: Internal Server Error, 500",
    );
  });
  it("should fetch new data from the API after cache expiration", async () => {
    jest.useFakeTimers(); // Enable fake timers
    jest.spyOn(global, "fetch").mockImplementation(() =>
      Promise.resolve({
        json: async () => mockResponseData,
        ok: true,
        status: 200,
        statusText: "OK",
      } as Response),
    );
    setuMockFetch(200, "OK", true);
    const date = "2023-07-29";
    const exchangeRatesData1 = await getExchangeRateDataSet(date);
    expect(exchangeRatesData1).toStrictEqual({ AUD: 1.1 });
    expect(global.fetch).toBeCalledTimes(1);

    // Expire redis client
    await redisClient.expire(date, 0);
    // Perform the second API call after cache expiration
    const exchangeRatesData2 = await getExchangeRateDataSet(date);
    expect(exchangeRatesData2).toStrictEqual({ AUD: 1.1 });
    expect(global.fetch).toBeCalledTimes(2);
  });
});
