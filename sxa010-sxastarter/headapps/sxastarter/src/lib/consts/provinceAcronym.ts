/* eslint-disable prettier/prettier */
export const PROVINCE_ACRONYM: { [key: string]: string } = {
  "newfoundland and labrador": "NL",
  "prince edward island": "PE",
  "nova scotia": "NS",
  "new brunswick": "NB",
  quebec: "QC",
  ontario: "ON",
  manitoba: "MB",
  saskatchewan: "SK",
  alberta: "AB",
  "british columbia": "BC",
  yukon: "YT",
  "northwest territories": "NT",
  nunavut: "NU",
};

export const provinceNameToAcronym = (provinceName: string): string | undefined => {
  const cleanedProvinceName = provinceName.trim().replaceAll("-", " ").replaceAll("_", " ").toLowerCase();
  if (Object.keys(PROVINCE_ACRONYM).includes(cleanedProvinceName)) {
    return PROVINCE_ACRONYM[cleanedProvinceName];
  }
  return;
};
