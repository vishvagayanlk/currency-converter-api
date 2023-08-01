import { NextFunction, Request, Response } from "express";
import services from "../services";
import utils from "../utils";
import { ConverterActionEnum } from "../types";

const currencyConverterController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { amount, sourceCurrency, targetCurrency, date, action, refundDate } =
      req.body;
    if (!amount || !sourceCurrency || !targetCurrency || !date) {
      return res.status(400).json({ error: "Invalid query parameters" });
    }
    if (isNaN(amount) || !isFinite(amount)) {
      return res.status(400).json({ error: "Invalid amount" });
    }
    const formattedDate = utils.formatDate(date as string);
    let convertedAmount;
    if (action === ConverterActionEnum.PAYMENT) {
      convertedAmount = await services.convertCurrency(
        amount,
        sourceCurrency as string,
        targetCurrency as string,
        formattedDate,
      );
    }
    if (action === ConverterActionEnum.REFUND) {
      if (!refundDate) {
        return res.status(400).json({ error: "Refund date is required" });
      }
      const formattedRefundDate = utils.formatDate(refundDate as string);
      convertedAmount = await services.refundConverter(
        amount,
        formattedDate,
        formattedRefundDate,
        sourceCurrency as string,
        targetCurrency as string,
      );
    }
    return res.status(200).json({
      amount: convertedAmount,
      currency: targetCurrency,
      refundDate,
    });
  } catch (error) {
    next(error);
  }
};
export default currencyConverterController;
