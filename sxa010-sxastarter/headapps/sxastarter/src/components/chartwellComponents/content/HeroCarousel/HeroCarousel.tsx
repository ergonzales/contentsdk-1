import { TextField, LinkField, Field, withDatasourceCheck } from "@sitecore-content-sdk/nextjs";
import { ComponentProps } from "lib/component-props";
import { ChartwellLink } from "components/chartwellComponents/ui/link/ChartwellLink";
import { useState, useEffect, JSX } from "react";
import { HeroImagesBg } from "./HeroImagesBg";
import { HeadingLevel } from "../../ui/HeadingLevel/HeadingLevel";

type HeroCarouselProps = ComponentProps & {
  fields: {
    Heading: Field<string>;
    BlockText: TextField;
    "CTA Text": TextField;
    ["CTA Target"]?: Field<string>;
    "CTA Link": LinkField;
    ["CTA Style"]: Field<string>;
    Images: Array<any>;
    "Heading Level": Field<string>;
  };
};

const HeroCarousel = (props: HeroCarouselProps): JSX.Element => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const titleText = props?.fields?.Heading;
  const headingLevel = props.fields && props?.fields["Heading Level"];
  const BlockText = props?.fields?.BlockText?.value;
  const CTAText = props.fields && props.fields["CTA Text"]?.value;
  const CTALink = props.fields && props.fields["CTA Link"]?.value.href;
  const CTATarget = props.fields && props.fields["CTA Target"]?.value;
  const CTAStyle = (props.fields && props.fields["CTA Style"]?.value != undefined ? props.fields["CTA Style"].value : "plum on clear background").replace(/\s/g, "-");
  const Images = props?.fields?.Images;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(currentIndex + 1 === Images.length ? 0 : currentIndex + 1);
    }, 8000);
    return () => clearInterval(interval);
  }, [Images.length, currentIndex]);

  return (
    <div className="w-full relative">
      <div className={`heroSection  max-h-300px md:max-h-500px lg:max-h-500px xl:max-h-700px relative`}>
        {Images.map(({ fields }, index) => {
          const Images = fields?.displayImage?.value;
          const bgPosition = fields && fields["Background Position"]?.value;

          return <HeroImagesBg key={index} index={index} currentIndex={currentIndex} Images={Images} bgPosition={bgPosition} />;
        })}
      </div>
      <div className={`lg:absolute   lg:top-[65%] lg:right-0 lg:translate-y-[-50%]  align-middle flex flex-col justify-center m-0 p-6 xl:p-8  w-screen lg:w-[40%] plum-bkg flex-auto `}>
        <HeadingLevel headingLevel={headingLevel} titleText={titleText} styles="text-center" />
        {BlockText && <div className=" mx-auto text-center" dangerouslySetInnerHTML={{ __html: String(BlockText) }}></div>}
        {
          <ChartwellLink
            href={CTALink}
            target={CTATarget}
            label={`${CTAText}`}
            tailwindStyles={` border-ChartwellWhite text-center mx-auto chartwellCTAs mt-0 ${CTAStyle}`}
            textStyles={`text-ChartwellWhite`}
          />
        }
      </div>
    </div>
  );
};

export default withDatasourceCheck()<HeroCarouselProps>(HeroCarousel);
