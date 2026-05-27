export const removePropertyNameSuffixes = (propertyName: string): any => {
  return propertyName.replaceAll("Retirement Residence", "").replaceAll("Senior Townhomes", "").replaceAll("Senior Apartments", "").replaceAll("Assisted Living", "").replaceAll("Memory Care", "");
};
