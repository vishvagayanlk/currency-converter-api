import utils from "../../src/utils";

describe("src/utils/round-off-to-two-decimal-places", () => {
  it("should round of when third decimal please is Greater than 5", () => {
    const result = utils.roundOffToTwoDecimalPlaces(2.331);
    expect(result).toBe(2.33);
  });
  it("should round of when third decimal please is less than 5", () => {
    const result = utils.roundOffToTwoDecimalPlaces(2.336);
    expect(result).toBe(2.34);
  });
  it("should round of when number is integer", () => {
    const result = utils.roundOffToTwoDecimalPlaces(2);
    expect(result).toBe(2);
  });
});
