import { JSX } from "react";
import { Field, withDatasourceCheck, ImageField, LinkField } from "@sitecore-content-sdk/nextjs";
import { ComponentProps } from "lib/component-props";
import { ChartwellLink } from "components/chartwellComponents/ui/link/ChartwellLink";

import { BackgroundImage } from "components/chartwellComponents/ui/BackgroundImage/BackgroundImage";
import { getAbsolutePosition, getBgColor } from "lib/helpers/layoutOption";
type FormRedirectProps = ComponentProps & {
  fields: {
    "background image": ImageField;
    Title: Field<string>;
    Desc: Field<string>;
    ["CTA Text"]: Field<string>;
    ["CTA Link"]: LinkField;
    ["CTA Style"]: Field<string>;
    "TextBlock Background Color": Field<string>;
    TextBlockLocation: Field<string>;
    ["CTA isBookATour"]: Field<string>;
  };
};

const FormRedirect = (props: FormRedirectProps): JSX.Element => {
  const fields = props?.fields;
  const position = fields?.TextBlockLocation?.value;
  const Title = fields?.Title?.value || "";
  const Text = fields?.Desc?.value || "";
  const CTALink = fields?.["CTA Link"]?.value;
  const CTAText = fields?.["CTA Text"]?.value;
  const CTAStyle = (fields?.["CTA Style"]?.value ?? "plum on clear background").replace(
    /\s/g,
    "-"
  );
  const BgValue = fields?.["TextBlock Background Color"]?.value;
  const stylePosition = getAbsolutePosition(position);
  const isBookATourBtn = fields?.["CTA isBookATour"]?.value != undefined ? "isBookATourBtn" : "";

  const COLORIZER = {
    blue: "bg-ChartwellBlue-100",
    plum: "bg-ChartwellPlum-100",
    white: "bg-ChartwellWhite-100",
  };

  const TextBorderBgColorsAccent = {
    white: {
      TextIncludeHover: "text-ChartwellWhite group-hover:text-ChartwellWhite-100 group-focus:text-ChartwellWhite-100 group-active:text-ChartwellWhite-100",
      OnlyText: "!text-ChartwellWhite",
      BorderBgIncludeHover: "border-ChartwellWhite  hover:bg-ChartwellWhite-100 hover:border-ChartwellWhite-100 focus:bg-ChartwellWhite-100 focus:border-ChartwellWhite-100",
    },
    plum: {
      TextIncludeHover: "text-ChartwellPlum group-hover:text-ChartwellPlum-100 group-focus:text-ChartwellPlum-100 group-active:text-ChartwellPlum-100",
      OnlyText: "text-ChartwellPlum",
      BorderBgIncludeHover: "border-ChartwellPlum hover:bg-ChartwellPlum-100 hover:border-ChartwellPlum-100 focus:bg-ChartwellPlum-100 focus:border-ChartwellPlum-100",
    },
    blue: {
      BorderBgIncludeHover: "border-ChartwellBlue !bg-ChartwellBlue hover:!bg-ChartwellPlum-100 hover:border-ChartwellBlue-100 focus:bg-ChartwellBlue-100 focus:border-ChartwellBlue-100",
    },
  };
  const BgColor = getBgColor(BgValue, COLORIZER);
  const accentColor = BgColor === COLORIZER.blue || BgColor === COLORIZER.plum ? "white" : "plum";
  const accentColorCTaLink = BgColor === COLORIZER.plum || BgColor === COLORIZER.white ? "blue" : "plum";

  return (
    <>
      {/* <div className="ChartwellContainer  lg:hidden">
        <div className={` ${BgColor} p-8 flex flex-col items-center `}>
          {Title.length !== 0 && <h2 className={` text-center  ChartwellTitleH3 text-[1.5625rem] ${TextBorderBgColorsAccent[accentColor].OnlyText}`}>{Title}</h2>}
          {Text.length !== 0 && (
            <p className={` m-0 mt-2 sm:mt-4 mb-2 p-2 ChartwellText text-[0.75rem] sm:text-[1.0625rem] w-full text-center  ${TextBorderBgColorsAccent[accentColor].OnlyText}`}>{Text}</p>
          )}
          {CTALink && CTALink.href && CTALink.href.length !== 0 && (
            <ChartwellLink
              href={CTALink.href}
              label={CTAText}
              textStyles={`${TextBorderBgColorsAccent[accentColor].OnlyText}`}
              tailwindStyles={` mt-2 mt-4 ${CTAStyle || TextBorderBgColorsAccent[accentColorCTaLink].BorderBgIncludeHover}`}
              linkId={CTALink.id as string}
            />
          )}
        </div>
      </div> */}
      <div className="relative  w-full lg:h-[550px] ">
        <BackgroundImage
          styles="hidden lg:block"
          src={(fields?.["background image"]?.value?.src as string) || ""}
          alt={(fields?.["background image"]?.value?.alt as string) || ""}
          priority={false}
          bgPosition={""}
        />
        <div className="ChartwellContainer SectionPadding  relative h-full ">
          <div className={` lg:absolute ${stylePosition} ${BgColor} p-8   lg:min-w-[50%] flex flex-col items-center `}>
            {Title.length > 0 && <h2 className={` text-center  ChartwellTitleH3 text-[1.5625rem] ${TextBorderBgColorsAccent[accentColor].OnlyText}`}>{Title}</h2>}
            {Text.length > 0 && (
              <p className={` m-0 mt-2 sm:mt-4 mb-2 p-2 ChartwellText text-[0.75rem] sm:text-[1.0625rem] w-full text-center  ${TextBorderBgColorsAccent[accentColor].OnlyText}`}>{Text}</p>
            )}
            {CTALink && CTALink.href && CTALink.href.length !== 0 && (
              <ChartwellLink
                href={CTALink.href}
                label={CTAText}
                textStyles={`${TextBorderBgColorsAccent[accentColor].OnlyText}`}
                tailwindStyles={` mt-2 mt-4 ${CTAStyle || TextBorderBgColorsAccent[accentColorCTaLink].BorderBgIncludeHover} ${isBookATourBtn}`}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default withDatasourceCheck()<FormRedirectProps>(FormRedirect);
