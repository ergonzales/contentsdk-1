export const getDelay = (number: number) => {
  const delayMap: { [key: number]: string } = {
    0: "delay-150",
    1: "delay-300",
    2: "delay-500",
    3: "delay-700",
    4: "delay-300",
    5: "delay-500",
  };
  return delayMap[number] || "duration-300";
};
