import { NextImage, ImageField } from "@sitecore-content-sdk/nextjs";
import { InView, useInView } from "react-intersection-observer";
import { getLinkTarget } from "lib/helpers/utils/targetLink";
interface SocialLinkProps {
  href: string;
  name: string;
  tailwindStyleLink?: string;
  ImageValue: ImageField;
  target: string;
  index?: number;
}

export const ChartwellSocialLink = ({ href, name, tailwindStyleLink, ImageValue, target, index }: SocialLinkProps): any => {
  const { ref, inView } = useInView({
    threshold: 1,
    triggerOnce: true,
  });
  const getDuration = (number: number | undefined) => {
    switch (number) {
      case 0:
        return "duration-900";
      case 1:
        return "duration-1250";
      case 2:
        return "duration-1500";
      case 3:
        return "duration-2750";
      case 4:
        return "duration-900";
      case 5:
        return "duration-1250";
      case 6:
        return "duration-1500";
      case 7:
        return "duration-2750";
      case 8:
        return "duration-900";

      default:
        return "duration-600";
    }
  };
  const linkTarget = getLinkTarget(target);
  return (
    <a href={href} ref={ref} target={linkTarget} rel="noreferrer noopener" className={`${tailwindStyleLink}  w-100px  md:w-[45px]  rounded-full  `}>
      <span className="sr-only">{name}</span>
      <InView as="div" className={`${inView ? "scale-100 rotate-0" : "scale-0 rotate-180"} ${getDuration(index)} `}>
        <NextImage field={ImageValue} />
      </InView>
    </a>
  );
};
