import { withDatasourceCheck, RichText as JssRichText, NextImage, ImageField, ComponentParams } from "@sitecore-content-sdk/nextjs";
import { ChartwellLink } from "components/chartwellComponents/ui/link/ChartwellLink";
import { InView, useInView } from "react-intersection-observer";
import { HeadingLevel } from "../../ui/HeadingLevel/HeadingLevel";
import { getGridCols, getColSpan, getPosition, getTextPosition, getDuration, getBgColor } from "lib/helpers/layoutOption/index";
import { memo, JSX } from "react";
import { ComponentProps } from "lib/component-props";

interface ImageContainerItem {
  columnSpan?: { value: string };
  imagePosition?: { value: string };
  bgColor?: { value: string };
  displayImage?: { jsonValue: ImageField };
  imageAlignment?: { value: string };
  textAlignment?: { value: string };
  headingLevel?: any;
  title?: any;
  imageDescription?: { value: string };
  ctaStyle?: { value: string };
  ctaText?: { value: string };
  ctaTarget?: { value: string };
  consolidatedCta?: {
    jsonValue?: {
      value?: {
        id?: string;
        href?: string;
        target?: string;
        text?: string;
        title?: string;
        class?: string;
      };
    };
  };
}

interface TextOnlyBlockData {
  backgroundImage?: { jsonValue: ImageField };
  backgroundColor?: { value: string };
  backgroundSize?: { value: string };
  ctaLink?: { url: string };
  ctaText?: { value: string };
  ctaStyle?: {
    value: string;
    imageSectionPosition?: { value: string };
  };
  ctaTarget?: { value: string };
  multiImageContainer?: { targetItems: ImageContainerItem[] };
  multiImageContainerNumberOfColoumns?: { value: string };
  includeHrLine?: { value: boolean };
  headingLevel?: any;
  heading?: any;
  blockText?: { value: string };
  consolidatedCta?: {
    jsonValue?: {
      value?: {
        id?: string;
        href?: string;
        target?: string;
        text?: string;
        title?: string;
        class?: string;
        anchor?: string;
        linktype?: string;
      };
    };
  };
}

interface TextOnlyBlockProps extends ComponentProps {
  fields: {
    data: {
      textOnlyBlock: TextOnlyBlockData;
    };
  };
  params: ComponentParams & {
    PaddingValueBottom?: string;
    PaddingValueTop?: string;
  };
}

const ImageContainer = memo(({ item, index, isDivider, inView }: { item: ImageContainerItem; index: number; isDivider: boolean; inView: boolean }) => {
  const CTAStyle = (item?.consolidatedCta?.jsonValue?.value?.class || "plum on clear background").replace(/\s/g, "-");
  const columnSpan = getColSpan(item?.columnSpan?.value || "1");
  const position = getPosition(item?.imageAlignment?.value || "");
  const textPosition = getTextPosition(item?.textAlignment?.value || "");

  // Determine image dimensions
  const imgField = item?.displayImage?.jsonValue;
  const imgHeight = Number(imgField?.value?.height);
  const imgWidth = Number(imgField?.value?.width);
  const useDefaultDims = !imgHeight && !imgWidth;
  const height = useDefaultDims ? 480 : imgHeight || 480;
  const width = useDefaultDims ? 640 : imgWidth || 640;

  return (
    <li
      className={`flex grid-cols-1 ${columnSpan} ${item?.imagePosition?.value === "Below BlockText" ? "flex-col-reverse" : "flex-col"} p-6 ${isDivider ? "first:border-0 lg:border-l px-8" : ""} ${
        item?.bgColor?.value ? getBgColor(item.bgColor.value) : ""
      }`}
    >
      {imgField && (
        <InView as="div" className={`${inView ? "opacity-100" : "opacity-0"} relative w-full h-full ease-in-out ${getDuration(index)} ${position}`}>
          <NextImage field={imgField} className={`mx-auto ${item?.imageDescription?.value && !item?.title?.value ? "mb-6" : ""} `} height={height} width={width} />
        </InView>
      )}
      <div className={textPosition}>
        <HeadingLevel headingLevel={item?.headingLevel} titleText={item?.title} styles="mt-6 mb-4" />
        {item?.imageDescription?.value && <JssRichText field={item?.imageDescription} className="m-0 ChartwellText" />}
      </div>
      {item?.consolidatedCta?.jsonValue?.value?.href && (
        <ChartwellLink
          href={item?.consolidatedCta?.jsonValue?.value?.href}
          label={item?.consolidatedCta?.jsonValue?.value?.text || item?.ctaText?.value || ""}
          target={item?.consolidatedCta?.jsonValue?.value?.target || item?.ctaTarget?.value || ""}
          ariaLabel={item?.consolidatedCta?.jsonValue?.value?.title || item?.ctaText?.value || ""}
          tailwindStyles={`mt-8 p-2 block ${position} ${CTAStyle}`}
        />
      )}
    </li>
  );
});

ImageContainer.displayName = "ImageContainer";

const TextOnlyBlock = (props: TextOnlyBlockProps): JSX.Element => {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });
  const {
    backgroundImage,
    backgroundColor,
    backgroundSize,
    ctaLink,
    ctaStyle,
    ctaTarget,
    ctaText,
    multiImageContainer,
    multiImageContainerNumberOfColoumns,
    includeHrLine,
    headingLevel,
    heading,
    blockText,
    consolidatedCta,
  } = props.fields?.data?.textOnlyBlock || {};

  const { PaddingValueBottom, PaddingValueTop } = props.params || {};
  const fullDivStyle = backgroundSize?.value === "Over Entire Component" && backgroundImage?.jsonValue?.value?.src ? { backgroundImage: `url(${backgroundImage?.jsonValue?.value?.src ?? ""})` } : {};
  const textOnlyStyle = backgroundSize?.value === "Over Text Only" && backgroundImage?.jsonValue?.value?.src ? { backgroundImage: `url(${backgroundImage?.jsonValue?.value?.src ?? ""})` } : {};
  const CTAStyle = consolidatedCta?.jsonValue?.value?.class ? consolidatedCta?.jsonValue?.value?.class.replace(/\s/g, "-") : "plum on clear background";
  const gridCols = getGridCols(multiImageContainerNumberOfColoumns?.value || "3");

  const href = consolidatedCta?.jsonValue?.value?.href
    ? `${consolidatedCta.jsonValue.value.href}${consolidatedCta.jsonValue.value.anchor ? `#${consolidatedCta.jsonValue.value.anchor}` : ""}`
    : ctaLink?.url ?? "";
  const hasImages = Array.isArray(multiImageContainer?.targetItems) && multiImageContainer.targetItems.length > 0;

  return (
    <div
      className={`${(backgroundImage?.jsonValue?.value?.src || backgroundColor?.value) && "sm:px-6 md:px-16 xl:px-8 "} relative w-full bg-no-repeat bg-cover ${
        backgroundSize?.value === "Over Entire Component" && backgroundColor?.value ? `${backgroundColor.value}-bkg` : ""
      }`}
      style={fullDivStyle}
    >
      <div
        className={`ChartwellContainer ${PaddingValueBottom || "pb-4 sm:pb-10"} ${PaddingValueTop || "pt-4 sm:pt-10"} ${
          backgroundSize?.value === "Over Text Only" && backgroundColor?.value ? `${backgroundColor.value}-bkg` : ""
        }`}
        style={textOnlyStyle}
      >
        <div className="mx-auto text-center">
          <HeadingLevel headingLevel={headingLevel} titleText={heading} styles="text-center mb-4 md:mb-6" />
          <div className={`flex ${ctaStyle?.imageSectionPosition?.value === "Above BlockText" ? "flex-col-reverse" : "flex-col"}`}>
            {blockText?.value && <JssRichText field={blockText} tag="div" className="mt-4 ChartwellText" />}
            {hasImages && (
              <ul ref={ref} className={`block mx-auto md:grid items-start ${gridCols} ${includeHrLine?.value ? "" : "gap-4"}`}>
                {multiImageContainer.targetItems.map((item, index) => (
                  <ImageContainer key={index} item={item} index={index} isDivider={!!includeHrLine?.value} inView={inView} />
                ))}
              </ul>
            )}
          </div>
        </div>
        {consolidatedCta?.jsonValue?.value?.href && (
          <div className="flex justify-center">
            <ChartwellLink
              href={href}
              target={consolidatedCta?.jsonValue?.value?.target || ctaTarget?.value || "_self"}
              label={consolidatedCta?.jsonValue?.value?.text || ctaText?.value || ""}
              ariaLabel={consolidatedCta?.jsonValue?.value?.title || ctaText?.value || ""}
              tailwindStyles={`mt-2 sm:mt-6 p-3 px-8 md:text-[1.0625rem] text-[0.875rem] mt-4 duration-300 chartwellCTAs ${CTAStyle}`}
            />
          </div>
        )}
      </div>
    </div>
  );
};

TextOnlyBlock.displayName = "TextOnlyBlock";

export default withDatasourceCheck()<TextOnlyBlockProps>(TextOnlyBlock);
