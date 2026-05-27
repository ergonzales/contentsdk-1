export const getPosition = (value: string) => {
  switch (value) {
    case "Left":
      return "mr-auto";
    case "Right":
      return "ml-auto";
    case "Center":
      return "mx-auto";
    default:
      return " mx-auto";
  }
};
