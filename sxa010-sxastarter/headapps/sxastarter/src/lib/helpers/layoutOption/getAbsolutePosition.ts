export const getAbsolutePosition = (position: string): string => {
  const mobileOnlyClass = "inset-0 md:inset-auto"; // Mobile-only class
  switch (position) {
    case "FromLeftToRightUnderHeroImage":
      return `FromLeftToRightUnderHeroImage`;
    case "BottomCenter":
      return `${mobileOnlyClass} md:bottom-0 md:left-[50%] md:translate-x-[-50%] md:w-[30%]`;
    case "BottomLeft":
      return `${mobileOnlyClass} md:bottom-0 md:left-0 md:w-[30%]`;
    case "BottomRight":
      return `${mobileOnlyClass} md:bottom-0 md:right-0 md:w-[30%]`;
    case "LeftCenter":
      return `${mobileOnlyClass} md:top-[40%] md:left-16 md:translate-y-[-50%] md:w-[40%] xl:w-[30%]`;
    case "center center":
      return `${mobileOnlyClass} md:top-[50%] md:left-[50%] md:translate-y-[-50%] md:translate-x-[-50%] md:w-[30%]`;
    case "RightCenter":
      return `${mobileOnlyClass} md:top-[40%] md:right-16 md:translate-y-[-50%] md:w-[40%] xl:w-[30%]`;
    case "TopCenter":
      return `${mobileOnlyClass} md:top-0 md:left-[50%] md:translate-x-[-50%] md:w-[30%]`;
    case "TopLeft":
      return `${mobileOnlyClass} md:top-0 md:left-0 md:w-[30%]`;
    case "TopRight":
      return `${mobileOnlyClass} md:top-0 md:right-0 md:w-[30%]`;
    case "FromTopToBottomRightSide":
      return `${mobileOnlyClass} md:top-0 md:right-0 md:bottom-0 md:h-full md:w-[50%]`;
    case "FromTopToBottomLeftSide":
      return `${mobileOnlyClass} md:top-0 md:left-0 md:bottom-0 md:h-full md:w-[50%]`;
    default:
      return mobileOnlyClass;
  }
};
