import { MinusIcon } from "@heroicons/react/24/outline";
import { Field, NextImage, ImageField } from "@sitecore-content-sdk/nextjs";
import { ChartwellLink } from "../ui/link/ChartwellLink";
import { HeadingLevel } from "../ui/HeadingLevel/HeadingLevel";

interface IProps {
  headingLevel: Field<string>;
  titleText: Field<string>;
  isOpen: boolean;
  Image: ImageField;
  desc: string;
  index: number;
  CTALink: string;
  CTAText: string;
  handleCardClick: (e: React.MouseEvent, index: number, isOpen: boolean) => void;
}

export const TileCard = ({ headingLevel, titleText, isOpen, Image, desc, index, CTALink, CTAText, handleCardClick }: IProps) => {
  return (
    <li
      className={`relative  mt-4 first:mt-0 sm:mt-0  min-w-[340px]  md:min-w-[380px] lg:min-w-[380px]  xl:min-w-[400px]  max-w-[340px]  md:max-w-[380px] lg:max-w-[380px]  xl:max-w-[400px]  ${
        !isOpen && "cursor-pointer"
      }  bg-ChartwellWhite p-8   lg:hover:scale-105 duration-300 ease-in-out shadow-md  `}
      onClick={(e) => handleCardClick(e, index, true)}
    >
      {/* + - BTN */}
      <div onClick={(e) => handleCardClick(e, index, false)} className={`absolute top-0 p-2 pl-8 pb-8 right-0  z-10  cursor-pointer ${!isOpen ? "pointer-events-none" : ""}`}>
        <button className={` rotate-90  border border-ChartwellGrey  rounded-full flex flex-col items-center  ${isOpen ? "open border border-ChartwellPurple-70" : "closed "}`} type="button">
          <div className="relative">
            <span className="sr-only">Flip over</span>
            <MinusIcon className={`" ${isOpen ? "rotate-90" : "rotate-90"} w-5 h-5 absolute`} />
            <MinusIcon className={`${isOpen ? "rotate-90" : ""}   w-5 h-5 `} />
          </div>
        </button>
      </div>
      {/* Front card side */}
      <div className={`bg-white divide-gray-200 ${isOpen ? "CardRotate-y-180 " : " CardRotate-y-0 "}  duration-300 ease-in-out flex flex-col h-full`}>
        <NextImage field={Image} className="" />
        <div className=" bg-ChartwellPlum flex items-center  py-4 px-6 h-full">
          <HeadingLevel headingLevel={headingLevel} titleText={titleText} styles={"  !text-xl  text-center  px-2 !text-white"} />
        </div>
      </div>
      {/* Back card side */}
      <div
        className={`bg-ChartwellWhite absolute  inset-0  p-8  flex flex-col items-center justify-center ${
          isOpen ? "CardRotate-y-0 " : "-z-10 pointer-events-none CardRotate-y-180 "
        } duration-300 ease-in-out `}
      >
        {/* <p className="data-h3 !text-xl text-center m-0 ">{titleText.value}</p> */}
        <div className="md:hidden" dangerouslySetInnerHTML={{ __html: desc.length > 460 ? desc.substring(0, 460) + "..." : desc }}></div>
        <div className="hidden md:block" dangerouslySetInnerHTML={{ __html: desc }}></div>
        {CTALink && <ChartwellLink href={`${CTALink}`} label={CTAText} tailwindStyles="!mt-0 mb-4" textStyles="text-ChartwellWhite" />}
      </div>
    </li>
  );
};
