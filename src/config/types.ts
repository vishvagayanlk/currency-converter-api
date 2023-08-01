type LogLevels = "error" | "warn" | "info" | "debug" | "verbose";
interface ConfigSchema {
  port: number;
  logger: {
    level: LogLevels;
    filePath: string;
  };
  redis: {
    host: string;
    port: number;
  };
  rateLimiter: {
    MAX_REQUESTS_PER_MINUTE: number;
    TIME_WINDOW: number;
  };
  openExchange?: {
    appId?: string;
    apiBaseUrl?: string;
  };
}

enum EnvNames {
  DEVELOPMENT = "development",
  PRODUCTION = "production",
}

type EnvType = keyof typeof EnvNames;

export type { ConfigSchema, EnvType, LogLevels };

export { EnvNames };
