import { JSX } from "react";
import { Field, withDatasourceCheck, RichText as JssRichText } from "@sitecore-content-sdk/nextjs";
import { ComponentProps } from "lib/component-props";
import { HeadingLevel } from "../../ui/HeadingLevel/HeadingLevel";

import { ChevronRightIcon, ChevronLeftIcon } from "@heroicons/react/24/outline";
import { CardFlow } from "./CardFlow";
import { useEffect, useState } from "react";
type CardFlowHolderProps = ComponentProps & {
  fields: {
    Heading: Field<string>;
    "Heading Level": Field<string>;
    Subtitle: Field<string>;
    "Subtitle Level": Field<string>;
    Description: Field<string>;
    Cards: Array<any>;
  };
};
const CardFlowHolder = (props: CardFlowHolderProps): JSX.Element => {
  const [truncateLength, setTruncateLength] = useState(155);
  const handleSliderScroll = (scrollOffset: number) => {
    const slider = document.getElementById("slider");
    if (slider) {
      slider.scrollLeft += scrollOffset;
    }
  };

  useEffect(() => {
    const updateTruncateLength = () => {
      if (window.innerWidth >= 768) {
        setTruncateLength(155);
      } else {
        setTruncateLength(105);
      }
    };

    updateTruncateLength();

    window.addEventListener("resize", updateTruncateLength);

    return () => window.removeEventListener("resize", updateTruncateLength);
  }, []);

  const headingLevel = props?.fields && props.fields["Heading Level"];
  const titleText = props?.fields?.Heading;
  const desc = props.fields?.Description;
  const Cards = props?.fields?.Cards;

  return (
    <div className="ChartwellContainer SectionPadding ">
      <HeadingLevel headingLevel={headingLevel} titleText={titleText} styles={"text-center mb-4 md:mb-6"} />
      {desc && <JssRichText field={desc} tag="div" className="mt-4 ChartwellText text-center" />}

      <div className="flex items-center gap-4">
        <div className="hidden md:block">
          <button
            onClick={() => {
              handleSliderScroll(-1150);
            }}
            type="button"
            className=" bg-ChartwellBlue p-2 rounded-full flex item-center justify-center hover:bg-ChartwellPlum duration-300 ease-in-out"
          >
            <span className="sr-only">Previous</span>
            <ChevronLeftIcon className="w-6 h-6 text-ChartwellWhite  " />
          </button>
        </div>

        <div className="overflow-hidden relative">
          <ul
            id="slider"
            className={" flex  mt-2 overflow-y-hidden overflow-x-scroll scroll scroll-smooth scrollbar-hide gap-4 bg-ChartwellGrey-10 p-4  max-h-[490px] md:max-h-[530px] lg:max-h-[555px] relative"}
          >
            {Cards?.map(({ fields }, index) => {
              const Image = fields?.Image;
              // const SubtitleHeadingLevel = fields && fields["Subtitle Level"];
              const SubtitleText = fields?.Subtitle;
              const headingLevel = fields && fields["Heading Level"];
              const titleText = fields?.Heading;
              const desc = fields?.Description;
              const CTAText = fields && fields["CTA Text"]?.value;
              const CTATarget = fields && fields["CTA Target"]?.value;
              const CTALink = fields && fields["CTA Link"]?.value?.href;
              return (
                <CardFlow
                  key={index}
                  Image={Image}
                  truncateLength={truncateLength}
                  // SubtitleHeadingLevel={SubtitleHeadingLevel}
                  SubtitleText={SubtitleText}
                  headingLevel={headingLevel}
                  titleText={titleText}
                  desc={desc}
                  CTALink={CTALink}
                  CTAText={CTAText}
                  CTATarget={CTATarget}
                />
              );
            })}
          </ul>
          <div className="w-full flex items-center justify-between gap-4 md:hidden mt-4 absolute bottom-1/3 ">
            <button
              onClick={() => {
                handleSliderScroll(-316);
              }}
              type="button"
              className=" bg-ChartwellBlue p-2 rounded-full flex item-center justify-center "
            >
              <span className="sr-only">Previous</span>
              <ChevronLeftIcon className="w-4 h-4 text-ChartwellWhite  " />
            </button>
            <button
              onClick={() => {
                handleSliderScroll(316);
              }}
              type="button"
              className="bg-ChartwellBlue p-2 rounded-full flex item-center justify-center  "
            >
              <span className="sr-only">Next</span>
              <ChevronRightIcon className="w-4 h-4  text-ChartwellWhite" />
            </button>
          </div>
        </div>

        <div className="hidden md:block ">
          <button
            onClick={() => {
              handleSliderScroll(1150);
            }}
            type="button"
            className="bg-ChartwellBlue p-2 rounded-full flex item-center justify-center hover:bg-ChartwellPlum duration-300 ease-in-out "
          >
            <span className="sr-only">Next</span>
            <ChevronRightIcon className="w-6 h-6  text-ChartwellWhite" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default withDatasourceCheck()<CardFlowHolderProps>(CardFlowHolder);
