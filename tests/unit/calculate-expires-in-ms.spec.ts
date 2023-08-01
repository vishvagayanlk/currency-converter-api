import utils from "../../src/utils";

jest.mock("../../src/core/redis-connector", () => jest.fn());
describe("src/utils/calculate-expires-in-ms", () => {
  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });
  it("should return a number of seconds in a rest of the day", async () => {
    const mockDate = new Date("2023-07-30T10:30:00Z");
    jest.spyOn(global, "Date").mockImplementation(() => mockDate);
    const endOfDay = new Date(mockDate);
    endOfDay.setUTCHours(23, 59, 59, 999);
    const expectedExpiresInMs = endOfDay.getTime() - mockDate.getTime();
    const result = utils.calculateExpiresInMs();
    expect(result).toBe(expectedExpiresInMs);
  });
  it("should handle time zone differences correctly", () => {
    const mockDate = new Date("2023-07-30T10:00:00+04:30");
    const dateSpy = jest
      .spyOn(global, "Date")
      .mockImplementation(() => mockDate);
    const endOfDay = new Date(mockDate);
    endOfDay.setUTCHours(18, 29, 59, 999); // End of the day in UTC+05:30
    const expectedExpiresInMs = endOfDay.getTime() - mockDate.getTime();
    const result = utils.calculateExpiresInMs();
    expect(result).toBe(expectedExpiresInMs);
    dateSpy.mockRestore();
  });
});
