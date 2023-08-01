const roundOffToTwoDecimalPlaces = (input: number): number => {
  const m = Number((Math.abs(input) * 100).toPrecision(15));
  return (Math.round(m) / 100) * Math.sign(input);
};

export default roundOffToTwoDecimalPlaces;
