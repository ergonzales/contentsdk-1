import { JSX } from "react";
import { Field, LinkField, withDatasourceCheck, ImageField, RichText as JssRichText, NextImage } from "@sitecore-content-sdk/nextjs";
import { ComponentProps } from "lib/component-props";
import { ChartwellLink } from "components/chartwellComponents/ui/link/ChartwellLink";
import { InView, useInView } from "react-intersection-observer";
import { HeadingLevel } from "../../ui/HeadingLevel/HeadingLevel";
import { getBgColor } from "lib/helpers/layoutOption";

type PromoRibbonBlockProps = ComponentProps & {
  fields: {
    Title: Field<string>;
    "CTA text": Field<string>;
    "background Color": Field<string>;
    "CTA Link": LinkField;
    ["CTA Style"]: Field<string>;
    ["CTA Target"]?: Field<string>;
    PromoImage: { value: { src: string; alt: string; height?: number; width?: number } };
    "Background image": ImageField;
    description: Field<string>;
    "Image position": Field<string>;
    LeftPanelColor: Field<string>;
    RightPanelColor: Field<string>;
    "CTA Position": Field<string>;
    "Heading Level": Field<string>;
  };
};

const PromoRibbonBlock = (props: PromoRibbonBlockProps): JSX.Element => {
  const { ref, inView } = useInView({
    threshold: 0.8,
    triggerOnce: true,
  });
  const CTATarget = props.fields?.["CTA Target"]?.value;
  const CTAText = props.fields?.["CTA text"]?.value ?? "";
  const CTALink = props.fields?.["CTA Link"]?.value?.href;
  const CTAStyle = (props.fields && props.fields["CTA Style"] != undefined && props.fields["CTA Style"].value != undefined ? props.fields["CTA Style"].value : "plum on clear background").replace(
    /\s/g,
    "-"
  );
  const BgValue = props.fields && props.fields["background Color"]?.value;
  const BgImage = props.fields && props.fields["Background image"]?.value;

  const Img = props.fields?.PromoImage;
  const imgHeight = Number(Img?.value?.height);
  const imgWidth = Number(Img?.value?.width);
  const useDefaultDims = !imgHeight && !imgWidth;
  const height = useDefaultDims ? 480 : imgHeight || 480;
  const width = useDefaultDims ? 640 : imgWidth || 640;

  const Description = props.fields?.description;
  const ImagePosition = props.fields?.["Image position"]?.value;
  const LeftPanelColor = props.fields?.LeftPanelColor?.value;
  const RightPanelColor = props.fields?.RightPanelColor?.value;
  const CTAPosition = props.fields?.["CTA Position"]?.value ?? "";

  const COLORIZER = {
    blue: "bg-ChartwellBlue",
    plum: "bg-ChartwellPlum",
    white: "bg-ChartwellWhite",
  };

  const TextBorderBgColorsAccent = {
    white: {
      TextIncludeHover: "text-ChartwellWhite group-hover:text-ChartwellWhite-100 group-focus:text-ChartwellWhite-100 group-active:text-ChartwellWhite-100",
      OnlyText: "text-ChartwellWhite",
      BorderBgIncludeHover: "border-ChartwellWhite hover:bg-ChartwellWhite-100 hover:border-ChartwellWhite-100 focus:bg-ChartwellWhite-100 focus:border-ChartwellWhite-100",
    },
    plum: {
      TextIncludeHover: "text-ChartwellPlum group-hover:text-ChartwellPlum-100 group-focus:text-ChartwellPlum-100 group-active:text-ChartwellPlum-100",
      OnlyText: "text-ChartwellPlum",
      BorderBgIncludeHover: "border-ChartwellPlum hover:bg-ChartwellPlum-100 hover:border-ChartwellPlum-100 focus:bg-ChartwellPlum-100 focus:border-ChartwellPlum-100",
    },
  };
  const BgColor = getBgColor(BgValue);
  const RightBlockColor = getBgColor(RightPanelColor);
  const leftBlockColor = getBgColor(LeftPanelColor);
  const accentColor = BgColor === COLORIZER.blue || BgColor === COLORIZER.plum ? "white" : "plum";

  return (
    <>
      {props.fields && (
        <div ref={ref} className="w-full flex py-10 ">
          <div className={`${leftBlockColor}-100  w-4 flex sm:flex-auto `}></div>
          <div className="ChartwellContainer ">
            <div
              className={`flex flex-col lg:flex-row  ${ImagePosition === "Left" ? "md:flex-row-reverse flex-col-reverse" : ""} ${
                RightBlockColor.length !== 0 && leftBlockColor.length !== 0 ? "gap-4" : ""
              } `}
            >
              <div
                className={` ${BgColor} bg-no-repeat bg-cover px-12  py-4  ${
                  CTAPosition === "BottomCenter" ? "flex flex-col items-center" : "w-full flex flex-col justify-center items-center"
                } `}
                style={{ backgroundImage: BgImage ? `url(${BgImage?.src})` : "" }}
              >
                <HeadingLevel
                  headingLevel={props.fields["Heading Level"]}
                  titleText={props.fields.Title}
                  styles={`${TextBorderBgColorsAccent[accentColor].OnlyText} ${CTAPosition === "BottomCenter" ? "sm:text-center" : "text-center lg:inline"}`}
                />
                {CTALink && CTALink.length !== 0 && (
                  <ChartwellLink
                    href={CTALink}
                    label={`${CTAText}`}
                    target={`${CTATarget}`}
                    tailwindStyles={` ${CTAPosition === "BottomCenter" ? "mt-auto" : "mt-auto   md:mt-6 lg:!mt-4"}    p-2  ${CTAStyle}`}
                    linkId={props.fields["CTA Link"]?.value?.id as string}
                  />
                )}
                {Description && <JssRichText field={Description} tag="div" className={`mt-4 text-center ${TextBorderBgColorsAccent[accentColor].OnlyText}`} />}
              </div>
              <div>
                {Img?.value?.src && (
                  <InView as="div" className={`${inView ? "opacity-100" : "opacity-0"} ease-in-out duration-600`}>
                    <NextImage field={Img.value} className="w-full" height={height} width={width} />
                  </InView>
                )}
              </div>
            </div>
          </div>
          <div className={`${RightBlockColor}-100 w-4 flex sm:flex-auto`}></div>
        </div>
      )}
    </>
  );
};

export default withDatasourceCheck()<PromoRibbonBlockProps>(PromoRibbonBlock);
