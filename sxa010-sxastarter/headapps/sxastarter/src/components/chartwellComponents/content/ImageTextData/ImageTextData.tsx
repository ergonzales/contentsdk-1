import { Field, NextImage } from "@sitecore-content-sdk/nextjs";
import { ChartwellLink } from "components/chartwellComponents/ui/link/ChartwellLink";
import { HeadingLevel } from "../../ui/HeadingLevel/HeadingLevel";
import { InView, useInView } from "react-intersection-observer";
import { useMemo } from "react";

import { ComponentProps } from "lib/component-props";
import { getIsBookATour } from "lib/helpers/form/formAndDatalayerHelpers";
import BookATourPersonalization from "components/chartwellComponents/forms/EloquaForm/BookATourPersonalization";
import { renderPromoOpenHouseBannerOnCards } from "lib/helpers/residence-helpers";
import { useSitecoreContext } from "lib/sitecore/useSitecoreContext";

type IProps = ComponentProps & {
  fields: {
    Description?: Field<string>;
    "CTA Link"?: Field<{ href: string; id: string; text: string; target: string; class: string; title: string }>;
    BottomImageAlignment?: Field<string>;
    BorderPosition?: Field<string>;
    ImagePosition?: Field<string>;
    Image?: Field<{ src: string; height?: number; width?: number }>;
    BackgroundImage?: Field<{ src: string }>;
    heading?: Field<string>;
    "Heading Level"?: Field<string>;
    "CTA Text"?: Field<string>;
    "CTA Target"?: Field<string>;
    "CTA Style"?: Field<string>;
  };
  params?: {
    imageVerticalAlignment?: string;
    customImageWidth?: boolean;
    syncWithPromoBanner?: boolean;
  };
};

const ImageTextData = ({ fields, params }: IProps) => {
  const { ref, inView } = useInView({ threshold: 0.4, triggerOnce: true });
  const scContext = useSitecoreContext().sitecoreContext;
  const syncWithPromoBanner = Boolean(params?.syncWithPromoBanner) || false;
  // Memoize derived values (do NOT append localStorageData to heading here)
  const { CTAText, CTALink, CTATarget, CTAStyle, BottomImageAlignment, BorderPosition, ImageDAM, BackgroundImage, StyleOrder, ImageVAlignment, ImageCustomWidth, Text, isBookATour, propertyData } =
    useMemo(() => {
      const ImageVAlignment = params?.imageVerticalAlignment === "bottom" ? "mt-auto" : "";
      const ImageCustomWidth = params?.customImageWidth ? "-mb-4 sm:-mb-10" : "";
      const CTAText = fields?.["CTA Link"]?.value?.text || fields?.["CTA Text"]?.value;
      const CTALink = fields?.["CTA Link"]?.value?.href;
      const CTATarget = fields?.["CTA Link"]?.value?.target || fields?.["CTA Target"]?.value;
      const CTAStyleValue = fields?.["CTA Link"]?.value?.class || fields?.["CTA Style"]?.value || "plum on clear background";
      const CTAStyle = CTAStyleValue.replace(/\s/g, "-");
      const BottomImageAlignment = fields?.BottomImageAlignment?.value;
      const BorderPosition = fields?.BorderPosition?.value;
      const OrderImage = fields?.ImagePosition?.value;
      const ImageDAM = fields?.Image?.value;
      const BackgroundImage = fields?.BackgroundImage?.value;
      const StyleOrder = OrderImage === "Left" ? "flex-row-reverse " : "";
      const isBookATour = getIsBookATour(scContext);

      // const heading = fields?.heading; // Only original heading here

      const { ci } = (scContext?.route?.placeholders["headless-header"]?.find((x: { componentName: string }) => x.componentName === "PropertyHeaderNavigation") as any)?.fields?.data || {};

      const propertyData =
        scContext?.route?.templateName === "PropertyChildPage"
          ? (scContext?.route?.placeholders["headless-header"]?.find((x: { componentName: string }) => x.componentName === "PropertyHeaderNavigation") as any)?.fields?.data?.item?.ancestors?.find(
              (x: any) => Object.keys(x).length > 0
            )
          : null;

      const Text = propertyData
        ? typeof fields?.Description?.value === "string"
          ? fields?.Description?.value.replace("1-855-461-0685", ci && ci.customPhoneNumber?.value ? ci.customPhoneNumber.value : propertyData?.propertyContactNumber?.value || "1-855-461-0685")
          : ""
        : fields?.Description?.value;

      return {
        CTAText,
        CTALink,
        CTATarget,
        CTAStyle,
        BottomImageAlignment,
        BorderPosition,
        OrderImage,
        ImageDAM,
        BackgroundImage,
        StyleOrder,
        ImageVAlignment,
        ImageCustomWidth,
        ci,
        propertyData,
        Text,
        isBookATour,
      };
    }, [fields, params, scContext]);

  // Calculate image dimensions after ImageDAM is available
  let height = 480;
  let width = 640;
  if (ImageDAM?.src) {
    const imgHeight = Number(ImageDAM?.height);
    const imgWidth = Number(ImageDAM?.width);
    const useDefaultDims = !imgHeight && !imgWidth;
    height = useDefaultDims ? 480 : imgHeight || 480;
    width = useDefaultDims ? 640 : imgWidth || 640;
  }

  const valid = syncWithPromoBanner ? renderPromoOpenHouseBannerOnCards(scContext, scContext.itemId?.replace(/-/g, "")) : true; // if not syncing, treat as valid by default

  if (!valid) {
    return null; // don't render component at all
  }

  return (
    <div className={`bg-white ${BackgroundImage?.src ? "" : "lg:px-0"} w-full bg-no-repeat bg-cover`} style={{ backgroundImage: BackgroundImage?.src ? `url(${BackgroundImage.src})` : undefined }}>
      <div
        className={`ChartwellContainer SectionPadding ${StyleOrder} lg:flex lg:items-center gap-12 justify-between ${
          BorderPosition ? (BorderPosition === "Below BlockText" ? "border-b-[12px] border-ChartwellPlum" : "border-t-[12px] border-ChartwellPlum") : ""
        }`}
      >
        <div className="lg:w-1/2 flex flex-col items-center lg:block">
          {!isBookATour || (scContext?.route?.name !== "thank-you" && scContext?.route?.name !== "merci") ? (
            fields?.["Heading Level"] && fields?.heading?.value && <HeadingLevel headingLevel={fields["Heading Level"]} styles="mb-2 md:md-4" titleText={fields?.heading} />
          ) : (
            <BookATourPersonalization scContext={scContext} propertyData={propertyData} fields={fields} />
          )}
          {Text && <div className="m-0 mt-2 ChartwellText text-center lg:text-left md:mb-6" dangerouslySetInnerHTML={{ __html: Text }}></div>}
          {CTAText && (
            <ChartwellLink
              href={CTALink}
              label={CTAText}
              target={CTATarget}
              ariaLabel={fields?.["CTA Link"]?.value?.title || CTAText}
              tailwindStyles={`p-3 px-8 text-[0.875rem] md:text-[1.0625rem] mt-4 duration-300 chartwellCTAs mb-6 ${CTAStyle}`}
              linkId={fields?.["CTA Link"]?.value?.id as string}
            />
          )}
        </div>
        <div className="lg:w-1/2 h-full">
          <div ref={ref} className={`mt-4 h-full relative ${ImageVAlignment || BottomImageAlignment ? "flex" : ""} ${fields?.heading?.value?.length !== 0 ? "lg:mt-0" : "lg:mt-4"}`}>
            {ImageDAM?.src && (
              <InView
                as="div"
                className={`${inView ? "opacity-100" : "opacity-0"} ${
                  BottomImageAlignment ? "mt-auto -mb-4 sm:-mb-10 flex flex-col" : "flex justify-center"
                } ${ImageVAlignment} ${ImageCustomWidth} ease-in-out duration-600`}
              >
                <NextImage field={ImageDAM} height={height} width={width} />
              </InView>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageTextData;
