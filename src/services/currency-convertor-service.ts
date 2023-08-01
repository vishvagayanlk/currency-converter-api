import getExchangeRateDataSet from "../core/open-exchanges-connector";
import roundOffToTwoDecimalPlaces from "../utils/roundoff-to-two-decimal-places";

const convertCurrency = async (
  amount: number,
  sourceCurrency: string,
  targetCurrency: string,
  date: string,
): Promise<number> => {
  if (!isFinite(amount) || amount === 0) {
    return amount;
  }
  if (sourceCurrency === targetCurrency) return amount;
  // Fetch exchange rates data for the specified date
  const exchangeRatesData = await getExchangeRateDataSet(date);
  // Get the exchange rate of the source currency against USD
  const sourceCurrencyToUSD = exchangeRatesData[sourceCurrency];
  // Get the exchange rate of the target currency against USD
  const targetCurrencyToUSD = exchangeRatesData[targetCurrency];

  if (!sourceCurrencyToUSD || !targetCurrencyToUSD) {
    throw new Error("Invalid currency code provided.");
  }

  // Convert the amount from the source currency to USD
  const amountInUSD = amount / sourceCurrencyToUSD;

  // Convert the amount from USD to the target currency
  const amountInTargetCurrency = roundOffToTwoDecimalPlaces(
    amountInUSD * targetCurrencyToUSD,
  );
  return amountInTargetCurrency;
};

export default convertCurrency;
