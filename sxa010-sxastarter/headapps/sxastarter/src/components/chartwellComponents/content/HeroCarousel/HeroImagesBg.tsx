import Image from "next/image";
import useBackGroundPosition from "../../customHooks/backGroundPosition";
interface IProps {
  index: number;
  currentIndex: number;
  Images: { alt: string; src: string };
  bgPosition: string;
}
export const HeroImagesBg = ({ index, currentIndex, Images, bgPosition }: IProps) => {
  const styleBackGroundPosition = useBackGroundPosition(bgPosition) || "";
  return (
    <div className="absolute inset-0">
      <Image
        src={Images?.src}
        alt={Images?.alt}
        quality={70}
        priority={true}
        fill
        className={`object-cover ${index === currentIndex ? "opacity-100" : "opacity-0"} duration-300 ease-in-out w-auto ${styleBackGroundPosition}`}
      />
    </div>
  );
};
