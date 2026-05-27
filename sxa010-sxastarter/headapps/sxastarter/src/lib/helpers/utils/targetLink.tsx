export const getLinkTarget = (target: string | undefined) => {
  switch (target) {
    case undefined:
    case "":
      return "_self";

    case "self":
      return "_self";

    case "blank":
    case "_blank":
      return "_blank";

    default:
      return "_self";
  }
};
