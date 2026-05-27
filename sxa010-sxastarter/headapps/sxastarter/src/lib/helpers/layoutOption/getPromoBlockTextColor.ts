export const getPromoBlockTextColor = (color: string) => {
  switch (color) {
    case "white":
      return {
        textColor: "text-ChartwellPlum",
        bgColor: "bg-ChartwellWhite",
        CTAStyle: "blue-on-clear-background",
      };
    case "plum":
      return {
        textColor: "text-ChartwellWhite",
        bgColor: "bg-ChartwellPlum/95",
        CTAStyle: "white-on-plum-background",
      };

    case "blue":
      return {
        textColor: "text-ChartwellWhite",
        bgColor: "bg-ChartwellBlue/95",
        CTAStyle: "white-on-clear-background",
      };
    default:
      return {
        textColor: "text-ChartwellPlum",
        bgColor: "bg-ChartwellWhite",
        CTAStyle: "blue-on-clear-background",
      };
  }
};
