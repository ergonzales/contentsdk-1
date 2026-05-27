export const normalizeString = (searchTerm: string | ""): string | "" => {
  return (
    searchTerm
      ?.normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replaceAll("-", "")
      .replaceAll(" ", "")
      .replaceAll(".", "")
      .toLowerCase() || ""
  ).trim();
};
