import "dotenv/config";
import app from "./server";
import config from "./config";
import { logger } from "./core/logger";

app.listen(config.port, async () => {
  logger.info(`Server running on port: ${config.port}`);
});

process.on("unhandledRejection", (reason: Error) => {
  const { message } = reason;
  logger.warn(`Unhandled Rejection${message ? `: ${message}` : ""}`);
});
