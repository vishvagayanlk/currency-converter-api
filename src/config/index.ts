import common from "./common";
import configValidateSchema from "./schemas/config.schema";
import { ConfigSchema, EnvNames } from "./types";

// config factory based on enviroment
const loadConfig = (): ConfigSchema => {
  const env = process.env.NODE_ENV || EnvNames.DEVELOPMENT;
  /* eslint-disable */
  const mainConfigModule = require(`./${env}`);
  const mainConfig: ConfigSchema = mainConfigModule.default;
  let localConfig: Partial<ConfigSchema> = {};

  try {
    /* eslint-disable */
    const localConfigModule = require(`./${env}.local`);
    localConfig = localConfigModule.default;
  } catch (error) {
    localConfig = {};
  }

  const mergedConfig: ConfigSchema = {
    ...common,
    ...mainConfig,
    ...localConfig,
  };

  validateConfig(mergedConfig);
  return mergedConfig;
};

// config validations agains predefined schema
const validateConfig = (config: ConfigSchema) => {
  try {
    configValidateSchema.parse(config);
  } catch (error) {
    throw new Error(
      `Error occurred while validating env config: ${(error as Error).message}`,
    );
  }
};

export default loadConfig();
