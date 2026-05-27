import Image from "next/image";
import useBackGroundPosition from "../../customHooks/backGroundPosition";

interface IProps {
  src: string;
  alt: string;
  bgPosition: string;
  styles?: string;
  priority?: boolean;
}

export const BackgroundImage = ({ src, alt, bgPosition, styles, priority = true }: IProps) => {
  const styleBackGroundPosition = useBackGroundPosition(bgPosition) || "";
  return (
    <div className={`absolute inset-0 ${styles}`}>
      <Image src={src} alt={alt} quality={70} priority={priority} fill className={`object-cover w-auto ${styleBackGroundPosition}`} />
    </div>
  );
};

export const NextImageBkg: React.FC<{
  field: any;
  bgPosition?: string;
  styles?: string;
  priority?: boolean;
}> = ({ field, bgPosition = "", styles = "", priority = true }) => {
  const styleBackGroundPosition = useBackGroundPosition(bgPosition) || "";
  const src = field?.value?.src || field?.src;
  const alt = field?.value?.alt || field?.alt || "background";

  if (!src) return null;

  return (
    <div className={`absolute inset-0 ${styles}`}>
      <Image src={src} alt={alt} quality={70} priority={priority} fill className={`object-cover w-auto ${styleBackGroundPosition}`} />
    </div>
  );
};
