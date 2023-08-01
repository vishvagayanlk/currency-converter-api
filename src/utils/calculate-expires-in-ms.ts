const calculateExpiresInMs = (): number => {
  const currentDate = new Date();
  const endOfDay = new Date(currentDate);
  endOfDay.setUTCHours(23, 59, 59, 999);
  return endOfDay.getTime() - currentDate.getTime();
};

export default calculateExpiresInMs;
