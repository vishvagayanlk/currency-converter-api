import config from "../config";
import ExchangeRatesData from "../types";
import redisClient from "./redis-connector";
import { logger } from "./logger";
import calculateExpiresInMs from "../utils/calculate-expires-in-ms";

const fetchExchangeRates = async (date: string): Promise<ExchangeRatesData> => {
  const apiUrl = `${config.openExchange?.apiBaseUrl}/historical/${date}.json?app_id=${config.openExchange?.appId}`;
  const response = await fetch(apiUrl);
  if (!response.ok) {
    throw new Error(
      `Open Exchange Rates API request failed with status: ${response.statusText}, ${response.status}`,
    );
  }
  const data = await response.json();
  if (!data || !data?.rates) {
    throw new Error("Open Exchange Rates API request failed with status");
  }
  return data.rates as ExchangeRatesData;
};

const getExchangeRateDataSet = async (
  date: string,
): Promise<ExchangeRatesData> => {
  try {
    // Check existing rates within give date and if it exists return cached rates
    const existingRates = await redisClient.get(date);
    if (existingRates) {
      const jsonExistingData = await JSON.parse(existingRates);
      logger.info("Fetching from cache");
      return jsonExistingData;
    }
    const exchangeRates = await fetchExchangeRates(date);
    await redisClient.set(
      date,
      JSON.stringify(exchangeRates),
      "EX",
      calculateExpiresInMs(),
    );
    return exchangeRates;
  } catch (error) {
    logger.error(`An error occurred while fetching exchange rates: ${error}`);
    throw error;
  }
};

export { fetchExchangeRates };
export default getExchangeRateDataSet;
