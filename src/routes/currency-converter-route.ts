import controller from "../controllers";
import { Router } from "express";

const currencyConverterRouter = Router();

currencyConverterRouter.post(
  "/convert",
  controller.currencyConverterController,
);

export default currencyConverterRouter;
