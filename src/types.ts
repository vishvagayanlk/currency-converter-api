interface ExchangeRatesData {
  [currencyCode: string]: number;
}

enum ConverterActionEnum {
  PAYMENT = "PAYMENT",
  REFUND = "REFUND",
}

type ConverterActionType = keyof typeof ConverterActionEnum;

export { ConverterActionEnum, ConverterActionType };

export default ExchangeRatesData;
