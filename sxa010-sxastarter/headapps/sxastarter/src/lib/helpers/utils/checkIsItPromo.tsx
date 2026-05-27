export const checkIsItPromo = (startDate: Date, endDate: Date): boolean => {
  return new Date() > new Date(startDate) && new Date() <= new Date(endDate);
};
