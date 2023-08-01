import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+\\.ts?$": "ts-jest", // Transform TypeScript files with ts-jest
  },
  testRegex: "(/tests/.*\\.(int|spec))\\.ts$", // Include test files in the regex pattern ending with .test.ts or .spec.ts
  moduleFileExtensions: ["js", "ts", "json", "node"], // Include JavaScript and TypeScript file extensions
};
export default config;
