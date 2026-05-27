export const transformIdToDashWithCurlyBrackets = (initialValue: string): string => {
  let targetProvinceId = initialValue;
  targetProvinceId =
    targetProvinceId?.slice(8, 9) !== "-"
      ? `${targetProvinceId.slice(0, 8)}-${targetProvinceId.slice(8, 12)}-${targetProvinceId.slice(12, 16)}-${targetProvinceId.slice(16, 20)}-${targetProvinceId.slice(20)}`
      : targetProvinceId;
  targetProvinceId = targetProvinceId?.slice(0, 1) == "{" ? targetProvinceId : `{${targetProvinceId}}`;
  return targetProvinceId;
};

export const removeNonIntegersFromId = (id: string): string => {
  return id?.replaceAll("{", "").replaceAll("}", "").replaceAll("-", "");
};

export const conformToUppercaseWithoutDash = (id: string) => {
  return id?.replaceAll("{", "").replaceAll("}", "").replaceAll("-", "").toUpperCase();
};
