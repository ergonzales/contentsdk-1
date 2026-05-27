export const getHeadingColor = (value: string) => {
  const colorMap: { [key: string]: string } = {
    plum: "text-ChartwellPlum",
    white: "text-ChartwellWhite",
    blue: "text-ChartwellBlue",
  };
  return colorMap[value] || "text-ChartwellPlum";
};
