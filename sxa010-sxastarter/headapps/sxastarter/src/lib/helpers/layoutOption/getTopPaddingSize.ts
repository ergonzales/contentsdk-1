export const getTopPaddingSize = (value: string) => {
  const paddingSizeMap: { [key: string]: string } = {
    none: "!pt-0",
    XS: "!pt-4",
    S: "!pt-8",
    M: "!pt-10",
    L: "!pt-14",
    XL: "!pt-18",
  };
  return paddingSizeMap[value] || "!pt-10";
};
