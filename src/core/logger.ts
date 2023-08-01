import config from "../config";
import winston from "winston";

export const logger = winston.createLogger({
  levels: winston.config.syslog.levels,
  level: config.logger.level,
  transports: [
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
    new winston.transports.File({
      filename: config.logger.filePath,
      level: "info",
    }),
  ],
  format:
    process.env.NODE_ENV !== "production"
      ? winston.format.simple()
      : winston.format.combine(
          winston.format.colorize(),
          winston.format.json(),
        ),
});
