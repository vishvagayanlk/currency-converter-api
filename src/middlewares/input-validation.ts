import { NextFunction, Request, Response } from "express";
import { ZodError, ZodIssue, z } from "zod";
import utils from "../utils";
import moment from "moment";
import { ConverterActionEnum } from "../types";

const isValidDateFormat = (val: string): boolean => {
  return (
    !isNaN(Date.parse(val)) && moment(val, moment.ISO_8601, true).isValid()
  );
};

const isDateSameOrBeforeToday = (val: string): boolean => {
  const currentDateFormatted = moment().utc();
  const inputDateFormatted = moment(val, moment.ISO_8601, true).utc();
  return inputDateFormatted.isSameOrBefore(currentDateFormatted, "day");
};

const inputValidationSchema = z.object({
  amount: z.number().refine(
    (val: number) => {
      return !isNaN(val) && val > 0;
    },
    {
      message: "Amount must be a valid number",
    },
  ),
  sourceCurrency: z
    .string()
    .refine((val: string) => utils.isValidCurrency(val), {
      message: "Invalid source currency",
    }),
  targetCurrency: z
    .string()
    .refine((val: string) => utils.isValidCurrency(val), {
      message: "Invalid target currency",
    }),
  date: z
    .string()
    .refine(isValidDateFormat, {
      message: "Invalid date format",
    })
    .refine(isDateSameOrBeforeToday, {
      message: "Date must be in the present or past",
    }),
  action: z
    .string()
    .refine(
      (val: string) =>
        Object.values(ConverterActionEnum).includes(val as ConverterActionEnum),
      {
        message: "Invalid action",
      },
    ),
  refundDate: z
    .string()
    .refine(isValidDateFormat, {
      message: "Invalid refund date format",
    })
    .refine(isDateSameOrBeforeToday, {
      message: "refund Date must be in the present or past",
    })
    .optional(),
});

const validateInputMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    inputValidationSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      const { issues } = error;
      const errorMessage = issues.reduce(
        (previous: string, current: ZodIssue) => {
          const separator = previous === "" ? "" : ", "; // Add a comma and space separator between error messages
          const errorMessageBuild = previous.concat(separator, current.message);
          return errorMessageBuild;
        },
        "",
      );

      res.status(400).json({
        error: errorMessage,
      });
    } else {
      res.status(400).json({
        error,
      });
    }
  }
};

export default validateInputMiddleware;
