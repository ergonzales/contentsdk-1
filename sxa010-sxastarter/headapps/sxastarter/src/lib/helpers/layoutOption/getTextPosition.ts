export const getTextPosition = (value: string) => {
  switch (value) {
    case "Left":
      return "text-left";
    case "Right":
      return "text-right";
    case "Center":
      return "text-center";
    default:
      return "text-center";
  }
};
