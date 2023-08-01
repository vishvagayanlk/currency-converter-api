import getExchangeRateDataSet from "../core/open-exchanges-connector";
import roundOffToTwoDecimalPlaces from "../utils/roundoff-to-two-decimal-places";

const refundConverter = async (
  amount: number,
  date: string,
  refundDate: string,
  sourceCurrency: string,
  targetCurrency: string,
) => {
  // Fetch exchange rates data for the transaction date and refund date
  const transactionRatesData = await getExchangeRateDataSet(date);
  const refundRatesData = await getExchangeRateDataSet(refundDate);
  // get the exchange rate of the source currancy agains USD for both dateset
  const sourceCurrencyToUSDOnTransactionDate =
    transactionRatesData[sourceCurrency];
  const sourceCurrencyToUSDOnRefundDate = refundRatesData[sourceCurrency];

  // Get the exchange rate of the target currency against USD for both dates
  const targetCurrencyToUSDOnTransactionDate =
    transactionRatesData[targetCurrency];
  const targetCurrencyToUSDOnRefundDate = refundRatesData[targetCurrency];
  if (
    !sourceCurrencyToUSDOnTransactionDate ||
    !sourceCurrencyToUSDOnRefundDate ||
    !targetCurrencyToUSDOnTransactionDate ||
    !targetCurrencyToUSDOnRefundDate
  ) {
    throw new Error("Invalid currency code provided.");
  }
  // Convert the amount from the source currency to USD on the transaction date
  const amountInUSDOnTransactionDate =
    amount / sourceCurrencyToUSDOnTransactionDate;
  // Convert the amount from USD to the target currency on the refund date
  const amountInTargetCurrencyOnRefundDate =
    amountInUSDOnTransactionDate * targetCurrencyToUSDOnRefundDate;

  // Round off the converted amount to two decimal places
  const roundedAmountInTargetCurrency = roundOffToTwoDecimalPlaces(
    amountInTargetCurrencyOnRefundDate,
  );
  return roundedAmountInTargetCurrency;
};
export default refundConverter;
