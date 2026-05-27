export const getTypeOfCard = (index: number) => {
  const sequence = ["card-1", "card-2", "card-3", "card-3", "card-1", "card-2", "card-2", "card-3", "card-1"];
  const normalizedIndex = index % sequence.length;

  return sequence[normalizedIndex];
};
