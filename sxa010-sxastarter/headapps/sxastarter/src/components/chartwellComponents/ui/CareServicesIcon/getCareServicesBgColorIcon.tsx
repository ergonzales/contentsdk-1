export const getCareServicesBgColorIcon = (type: string | null) => {
  if (!type) {
    return { bgColor: "bg-[#e5e5e5]", textColor: "text-[#000000]" };
  }
  switch (type) {
    case "Assisted Living":
    case "Semi-autonome":
      return { bgColor: "bg-[#00b1a8]", textColor: "text-[#001311]" };
    case "Independent Living":
    case "Autonome":
      return { bgColor: "bg-[#AC8AC0]", textColor: "text-[#000000]" };
    case "Long Term Care":
    case "Soins de longue durée":
      return { bgColor: "bg-[#89c85f]", textColor: "text-[#000000]" };
    case "Memory Care":
    case "Unité de soins":
      return { bgColor: "bg-[#f38932]", textColor: "text-[#000000]" };
    case "Seniors Apartments":
    case "Appartements":
      return { bgColor: "bg-[#C285A1]", textColor: "text-[#000000]" };
    default:
      return { bgColor: "bg-[#e5e5e5]", textColor: "text-[#000000]" };
  }
};
