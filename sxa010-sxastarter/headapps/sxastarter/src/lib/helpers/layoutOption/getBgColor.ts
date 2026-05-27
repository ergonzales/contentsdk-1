const COLORIZER = {
  blue: "bg-ChartwellBlue",
  plum: "bg-ChartwellPlum",
  white: "bg-ChartwellWhite",
};

type CustomColorizer = {
  blue: string;
  plum: string;
  white: string;
};

export const getBgColor = (colors: string, customColorizer?: CustomColorizer): string => {
  switch (colors) {
    case "blue":
      return customColorizer?.blue || COLORIZER.blue;
    case "plum":
      return customColorizer?.plum || COLORIZER.plum;
    case "white":
      return customColorizer?.white || COLORIZER.white;
    default:
      return "";
  }
};
