import express, {
  ErrorRequestHandler,
  NextFunction,
  Request,
  Response,
} from "express";
import converterRouter from "./routes/currency-converter-route";
import rateLimiter from "./middlewares/rate-limiter";
import { logger } from "./core/logger";
import validateInputMiddleware from "./middlewares/input-validation";
import cors from "cors";
import morgan from "morgan";

const app = express();
app.use(morgan("combined"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", rateLimiter, validateInputMiddleware, converterRouter);
app.use(
  (
    err: ErrorRequestHandler,
    req: Request,
    res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: NextFunction,
  ) => {
    logger.error(`There was an Error ${err}`);
    res.json({
      message: `There was an Error ${err}`,
    });
  },
);

export default app;
