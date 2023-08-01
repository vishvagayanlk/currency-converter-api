import getExchangeRateDataSet from "../../src/core/open-exchanges-connector";
import convertCurrency from "../../src/services/currency-convertor-service";
jest.mock("../../src/core/open-exchanges-connector");
jest.mock("../../src/core/redis-connector", () => jest.fn());
describe("src/services/currency-convertor-service", () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });
  it("should convert currency from USD to AUD", async () => {
    jest
      .mocked(getExchangeRateDataSet)
      .mockImplementation(() => Promise.resolve({ AUD: 1.5, USD: 1.0 }));
    const amount = await convertCurrency(100, "AUD", "USD", "2023-07-29");
    expect(amount).toEqual(66.67);
  });
  it("should convert currency from GBP to AUD", async () => {
    jest
      .mocked(getExchangeRateDataSet)
      .mockImplementation(() =>
        Promise.resolve({ AUD: 1.5, USD: 1.0, GBP: 2.0 }),
      );
    const amount = await convertCurrency(100, "AUD", "GBP", "2023-07-29");
    expect(amount).toEqual(133.33);
  });
  it("should handle non-finite amount properly", async () => {
    let amount: number;
    jest
      .mocked(getExchangeRateDataSet)
      .mockImplementation(() => Promise.resolve({ AUD: 1.25, USD: 1.0 }));
    amount = await convertCurrency(NaN, "AUD", "USD", "2023-07-29");
    expect(amount).toEqual(NaN);
    amount = await convertCurrency(0, "AUD", "USD", "2023-07-29");
    expect(amount).toEqual(0);
  });
});
