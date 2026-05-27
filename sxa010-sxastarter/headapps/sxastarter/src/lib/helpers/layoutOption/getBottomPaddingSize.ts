export const getBottomPaddingSize = (value: string) => {
  const paddingSizeMap: { [key: string]: string } = {
    none: "!pb-0",
    XS: "!pb-4",
    S: "!pb-8",
    M: "!pb-10",
    L: "!pb-14",
    XL: "!pb-18",
  };
  return paddingSizeMap[value] || "!pb-10";
};
