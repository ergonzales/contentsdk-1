export const getGridCols = (number: string) => {
  switch (number) {
    case "1":
      return "lg:grid-cols-1";
    case "2":
      return "lg:grid-cols-2";
    case "3":
      return "lg:grid-cols-3";
    case "4":
      return "lg:grid-cols-4";
    case "5":
      return "lg:grid-cols-5";
    case "6":
      return "lg:grid-cols-6";
    case "7":
      return "lg:grid-cols-7";
    case "8":
      return "lg:grid-cols-8";
    case "9":
      return "lg:grid-cols-9";
    case "10":
      return "lg:grid-cols-10";
    case "11":
      return "lg:grid-cols-11";
    default:
      return "lg:grid-cols-3";
  }
};
