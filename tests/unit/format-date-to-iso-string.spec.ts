import moment from "moment";
import formatDateToISOString from "../../src/utils/format-date-to-iso-string";

describe("src/utils/format-date-to-iso-string", () => {
  it("Should return UTC date part only", () => {
    const date = "2023-07-30T10:00:00Z";
    const formattedDate = formatDateToISOString(moment.utc(date).toISOString());
    expect(formattedDate).toStrictEqual("2023-07-30");
  });
  it("Should return UTC date part only", () => {
    const date = "2023-07-30T10:00:00Z";
    const formattedDate = formatDateToISOString(date);
    expect(formattedDate).toBe("2023-07-30");
  });
});
