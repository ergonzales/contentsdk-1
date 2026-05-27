import { NextImage, Field, RichText as JssRichText } from "@sitecore-content-sdk/nextjs";
import { HeadingLevel } from "../../ui/HeadingLevel/HeadingLevel";
import { ChartwellLink } from "components/chartwellComponents/ui/link/ChartwellLink";

interface IProps {
  Image: any;
  // SubtitleHeadingLevel: Field<string>;
  SubtitleText: Field<string>;
  headingLevel: Field<string>;
  titleText: Field<string>;
  desc: Field<string>;
  CTALink: string;
  CTAText: string;
  CTATarget: string;
  truncateLength: number;
}
export const CardFlow = ({ Image, SubtitleText, headingLevel, titleText, desc, CTALink, CTAText, CTATarget, truncateLength }: IProps) => {
  return (
    <li className="min-w-[300px] max-w-[300px] md:min-w-[350px] md:max-w-[350px] lg:min-w-[380px] lg:max-w-[380px] shadow-md  flex ">
      <div className="bg-white divide-gray-200 hover:transform md:hover:scale-105 transition duration-300 ">
        <div className="relative flex flex-1 flex-col justify-between h-full p-6 ">
          <div className="relative xs:mb-4 mb-2">
            <div className="h-[110px] md:h-[190px] overflow-hidden">
              <NextImage field={Image} className=" " />
            </div>

            <div className="absolute bg-ChartwellPlum -bottom-8 xs:-bottom-10 xs:inset-x-5 inset-x-2 mx-auto max-w-300px text-white py-2 px-2 xs:px-6 flex justify-center items-center">
              <HeadingLevel headingLevel={headingLevel} titleText={titleText} styles={"xs:py-3 text-2xl font-semibold text-center text-white align-top"} />
            </div>
          </div>

          {desc && (
            <JssRichText
              field={{ value: desc.value.length > truncateLength ? desc.value.substring(0, truncateLength) + "..." : desc.value }}
              tag="div"
              className=" mx-auto text-sm xs:text-lg text-ChartwellGrey mt-4 pt-4 field-body text-ellipsis overflow-hidden ... min-h-36 max-h-36"
            />
          )}
          <div className="flex items-center justify-between mt-4 ">
            <ChartwellLink ariaLabel={`${CTAText} ${titleText.value}`} href={CTALink} label={CTAText} target={CTATarget} tailwindStyles="!m-0 !px-4 md:!px-6" />
            <span className={` text-lg   uppercase m-0 !text-ChartwellGrey px-1 md:px-2  bg-ChartwellGrey/5  font-semibold leading-normal`}>{SubtitleText.value}</span>
          </div>
        </div>
      </div>
    </li>
  );
};
