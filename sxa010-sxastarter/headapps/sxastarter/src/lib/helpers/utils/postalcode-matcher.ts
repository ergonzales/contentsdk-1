export const isThisPostalCode = (targetString: string): boolean => {
  const postalCodeRegex = /^[A-Za-z]\d[A-Za-z] ?\d[A-Za-z]\d$|^[A-Za-z]\d[A-Za-z]$/;
  return postalCodeRegex.test(targetString);
};
