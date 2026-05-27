import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import { Field, NextImage, ImageField, RichText as JssRichText } from "@sitecore-content-sdk/nextjs";
import { ChartwellLink } from "../ui/link/ChartwellLink";
import { HeadingLevel } from "../ui/HeadingLevel/HeadingLevel";
import { useId } from "react";

interface IProps {
  headingLevel: Field<string>;
  titleText: Field<string>;
  isOpen: boolean;
  Image: ImageField;
  desc?: Field<string>;
  index: number;
  CTALink?: string;
  CTAText?: string;
  handleCardClick: (index: number, isOpen: boolean) => void;
}

export const TileCard = ({ headingLevel, titleText, isOpen, Image, desc, index, CTALink, CTAText, handleCardClick }: IProps) => {
  const cardId = useId();
  const detailsId = `${cardId}-details`;
  const title = titleText?.value || "card";
  const toggleLabel = `${isOpen ? "Close" : "Open"} ${title} details`;
  const handleCardKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, nextIsOpen: boolean) => {
    if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
      e.preventDefault();
      handleCardClick(index, nextIsOpen);
    }
  };

  return (
    <li
      className={`relative mt-4 first:mt-0 sm:mt-0 min-w-[340px] md:min-w-[380px] lg:min-w-[380px] xl:min-w-[400px] max-w-[340px] md:max-w-[380px] lg:max-w-[380px] xl:max-w-[400px] bg-ChartwellWhite p-8 lg:hover:scale-105 duration-300 ease-in-out shadow-md`}
    >
      {/* + - BTN */}
      {isOpen ? (
        <button
          type="button"
          aria-controls={detailsId}
          aria-expanded={isOpen}
          aria-label={toggleLabel}
          className="group absolute right-0 top-0 z-20 cursor-pointer p-2 pb-8 pl-8 focus:outline-none"
          onClick={() => handleCardClick(index, false)}
          onKeyDown={(e) => handleCardKeyDown(e, false)}
        >
          <span className="flex rounded-full border border-ChartwellPurple-70 bg-ChartwellWhite group-focus-visible:ring-2 group-focus-visible:ring-ChartwellPurple">
            <MinusIcon className="h-5 w-5" aria-hidden="true" />
          </span>
        </button>
      ) : (
        <span aria-hidden="true" className="pointer-events-none absolute right-0 top-0 z-20 p-2 pb-8 pl-8">
          <span className="flex rounded-full border border-ChartwellGrey bg-ChartwellWhite">
            <PlusIcon className="h-5 w-5" aria-hidden="true" />
          </span>
        </span>
      )}
      {!isOpen && (
        <button
          type="button"
          aria-controls={detailsId}
          aria-expanded={isOpen}
          aria-label={`Open ${title} details`}
          className="absolute inset-0 z-10 cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-ChartwellPurple/40 focus-visible:ring-offset-2"
          onClick={() => handleCardClick(index, true)}
          onKeyDown={(e) => handleCardKeyDown(e, true)}
        />
      )}
      {/* Front card side */}
      <div className={`bg-white divide-gray-200 ${isOpen ? "CardRotate-y-180 " : " CardRotate-y-0 "}  duration-300 ease-in-out flex flex-col h-full`}>
        <NextImage field={Image} className="" />
        <div className=" bg-ChartwellPlum flex items-center  py-4 px-6 h-full">
          <HeadingLevel headingLevel={headingLevel} titleText={titleText} styles={"  !text-xl  text-center  px-2 !text-white"} />
        </div>
      </div>
      {/* Back card side */}
      <div
        id={detailsId}
        className={`bg-ChartwellWhite absolute  inset-0  p-8  flex flex-col items-center overflow-x-hidden overflow-y-auto overscroll-contain [scrollbar-gutter:stable] [scrollbar-color:rgb(84_79_84)_rgba(84_79_84_/_0.05)] [scrollbar-width:auto] [&::-webkit-scrollbar]:w-5 [&::-webkit-scrollbar-track]:bg-ChartwellGrey-10 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:border-2 [&::-webkit-scrollbar-thumb]:border-ChartwellWhite [&::-webkit-scrollbar-thumb]:bg-ChartwellGrey ${
          isOpen ? "CardRotate-y-0 " : "-z-10 pointer-events-none CardRotate-y-180 "
        } duration-300 ease-in-out `}
      >
        {/* <p className="data-h3 !text-xl text-center m-0 ">{titleText.value}</p> */}
        <div className="my-auto w-full pr-2">
          {desc && <JssRichText field={desc} tag="div" />}
          {CTALink && <ChartwellLink href={`${CTALink}`} label={CTAText || ""} tailwindStyles="!mt-0 mb-4" textStyles="text-ChartwellWhite" />}
        </div>
      </div>
    </li>
  );
};
