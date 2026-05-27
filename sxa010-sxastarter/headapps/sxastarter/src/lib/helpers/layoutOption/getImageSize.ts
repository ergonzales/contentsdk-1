export const getImageSize = (size: string) => {
  switch (size) {
    case "large":
      return "!h-[30vh] md:!h-[50vh] lg:!h-[70vh] ";
    case "medium":
      return "!h-[20vh] md:!h-[30vh] lg:!h-[40vh] xl:!h-[50vh]";
    case "small":
      return "!h-[15vh] md:!h-[20vh] lg:!h-[30vh] xl:!h-[24vh]";
    default:
      return "!h-[30vh] md:!h-[50vh] lg:!h-[70vh] ";
  }
};
