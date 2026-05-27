export const getBlockTextWidth = (width: string) => {
  switch (width) {
    case "20":
      return "lg:!w-1/5";
    case "30":
      return "lg:!w-1/3";
    case "40":
      return "lg:!w-2/5";
    case "50":
      return "lg:!w-1/2";
    default:
      return "lg:!w-1/2";
  }
};
