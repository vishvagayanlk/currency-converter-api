import getExchangeRateDataSet from "../../src/core/open-exchanges-connector";
import refundConverter from "../../src/services/refund-converter-service";
jest.mock("../../src/core/open-exchanges-connector");
jest.mock("../../src/core/redis-connector", () => jest.fn());
describe("src/services/refund-converter-service", () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });
  it("should convert currency from USD to AUD", async () => {
    jest
      .mocked(getExchangeRateDataSet)
      .mockImplementationOnce(() =>
        Promise.resolve({ AUD: 1.5, USD: 1.0, GBP: 2.0 }),
      )
      .mockImplementationOnce(() =>
        Promise.resolve({ AUD: 1.25, USD: 1.0, GBP: 3.0 }),
      );
    const amount = await refundConverter(
      100,
      "2022-07-29",
      "2023-07-29",
      "AUD",
      "GBP",
    );
    expect(amount).toEqual(200);
  });
});
