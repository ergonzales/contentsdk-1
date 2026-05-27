import { JSX } from "react";
import { ChartwellLink } from "components/chartwellComponents/ui/link/ChartwellLink";
import { HeadingLevel } from "../../ui/HeadingLevel/HeadingLevel";
import { checkIsItPromo } from "lib/helpers/utils/checkIsItPromo";
import { getAbsolutePosition, getImageSize, getBlockTextWidth } from "lib/helpers/layoutOption";

import { NextImageBkg } from "components/chartwellComponents/ui/BackgroundImage/BackgroundImage";
import HeroAnimatedSlide from "../HeroAnimatedSlide/HeroAnimatedSlide";
import TextBlockBanner from "./TextBlockBanner";

const HeroSectionTextOnly = (props: any): JSX.Element => {
  const { fields: dataSoureFields } = (props && props?.fields?.data?.ds) || {}; // data source
  const { fields: joyIsAgeless } = props?.fields?.data?.joyIsAgeless || {}; // joy is ageless context item
  const contextFields = props?.fields?.data?.contextItem?.assignedPromotions?.targetItems[0] || {}; // context item

  const dataSource =
    (dataSoureFields && {
      dataSourceName: props?.fields?.data?.ds?.name,
      templateName: props?.fields?.data?.contextItem?.template?.name,
      headingLevel: dataSoureFields.find((field: any) => field?.name === "Heading Level")?.jsonValue,
      heading: dataSoureFields.find((field: any) => field?.name === "Heading")?.jsonValue,
      ImageSize: dataSoureFields.find((field: any) => field?.name === "Image size")?.jsonValue?.value,
      position: dataSoureFields.find((field: any) => field?.name === "BlockText Position")?.jsonValue?.value,
      CTAText: dataSoureFields.find((field: any) => field?.name === "CTA Text")?.jsonValue?.value,
      CTALink: dataSoureFields.find((field: any) => field?.name === "CTA Link")?.jsonValue?.value.href,
      CTATarget: dataSoureFields.find((field: any) => field?.name === "CTA Target")?.jsonValue?.value,
      isBgFixed: dataSoureFields.find((field: any) => field?.name === "fixed background")?.jsonValue?.value,
      BgPosition: dataSoureFields.find((field: any) => field?.name === "Background Position")?.jsonValue?.value,
      CTAStyle: dataSoureFields.find((field: any) => field?.name === "CTA Style")?.jsonValue?.value,
      PromotionDataSource: dataSoureFields.find((field: any) => field?.name === "PromotionDataSource")?.jsonValue,
      blockText: dataSoureFields.find((field: any) => field?.name === "BlockText")?.jsonValue?.value,
      bgImage: dataSoureFields.find((field: any) => field?.name === "Background")?.jsonValue,
      BlockTextWidth: dataSoureFields.find((field: any) => field?.name === "BlockTextWidth")?.jsonValue?.value,
      isBookATour: dataSoureFields.find((field: any) => field?.name === "CTA isBookATour")?.jsonValue?.value,
      renderJoyIsAgeless: joyIsAgeless?.find((field: any) => field.name === "renderPropertyOverviewJoyIsAgeless")?.jsonValue?.value || false, // renderJoyIsAgeless is determined by the joyIsAgeless item field named "renderPropertyOverviewJoyIsAgeless", it will be true if that field is true, otherwise false.
    }) ||
    {};

  const bookATourBtnClass = dataSource.isBookATour ? "isBookATourBtn" : "";
  const CTAStyle = `${(dataSource.CTAStyle ? dataSource.CTAStyle : "plum on clear background").replace(/\s/g, "-")} ${bookATourBtnClass}`;

  const stylePosition = getAbsolutePosition(dataSource.position);

  const blockTextWidth = getBlockTextWidth(dataSource.BlockTextWidth);
  const isPromoActive =
    contextFields && dataSource.dataSourceName === "MainHeroSection" && checkIsItPromo(contextFields.promoStartDate?.jsonValue?.value, contextFields.promoEndDate?.jsonValue?.value) ? true : false;

  const LongTitlePromoOrRegular = isPromoActive ? contextFields.longPromotionTitle.value : dataSource?.blockText;
  const CTALabelPromoOrRegular = isPromoActive ? contextFields.promoCTA?.value : dataSource?.CTAText;

  const HeroImageSize = getImageSize(dataSource.ImageSize);

  if (dataSource.renderJoyIsAgeless && dataSource.templateName === "PropertyPage") {
    return (
      <>
        <HeroAnimatedSlide rendering={props?.rendering} params={props?.params} fields={joyIsAgeless} />
        <TextBlockBanner rendering={props?.rendering} params={props?.params} fields={dataSource} />
      </>
    );
  }

  return (
    <>
      <div className="w-full relative ">
        <div className={` relative heroSection ${dataSource.isBgFixed ? "lg:bg-fixed" : " "}  ${HeroImageSize}  `}>
          <NextImageBkg field={dataSource?.bgImage} bgPosition={dataSource?.BgPosition} styles={" "} />
        </div>
        {dataSource.heading && dataSource.heading?.value && stylePosition !== "FromLeftToRightUnderHeroImage" && (
          <div
            className={` md:absolute  ${
              stylePosition.length !== 0 ? `${stylePosition}` : "right-0 bottom-0"
            } align-middle lg:flex flex-col justify-center m-0 p-4 md:p-8 xl:p-50px  plum-bkg ${blockTextWidth} flex-auto`}
          >
            <HeadingLevel headingLevel={dataSource.headingLevel} titleText={dataSource.heading} styles="text-center" />
            {dataSource.blockText && <div className="heroTextBlock" dangerouslySetInnerHTML={{ __html: dataSource.blockText }}></div>}
            {dataSource?.CTALink && (
              <ChartwellLink
                href={dataSource?.CTALink}
                target={`${dataSource.CTATarget}`}
                label={dataSource.CTAText}
                tailwindStyles={`mt-6 max-w-xs  border-ChartwellWhite text-center  grow-0 mx-auto chartwellCTAs ${CTAStyle}`}
                textStyles={`text-ChartwellWhite`}
                linkId={dataSoureFields.find((field: any) => field?.name === "CTA Link")?.jsonValue?.value?.id}
              />
            )}
          </div>
        )}
        {dataSource.heading && dataSource.heading?.value && stylePosition === "FromLeftToRightUnderHeroImage" && (
          <div
            className={` lg:absolute flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10  p-4   w-full mx-auto -bottom-8     bg-ChartwellPlum  z-20 shadowPlumBox isPromoActive-${isPromoActive}`}
          >
            {LongTitlePromoOrRegular && <div className=" text-ChartwellWhite" dangerouslySetInnerHTML={{ __html: LongTitlePromoOrRegular }}></div>}
            {dataSource?.CTALink && (
              <ChartwellLink
                href={dataSource?.CTALink}
                target={`${CTALabelPromoOrRegular}`}
                label={CTALabelPromoOrRegular}
                tailwindStyles={`!mt-0 max-w-xs  border-ChartwellWhite text-center  grow-0  chartwellCTAs ${CTAStyle}`}
                textStyles={`text-ChartwellWhite`}
                linkId={dataSoureFields.find((field: any) => field.name === "CTA Link")?.jsonValue?.value?.id}
              />
            )}
          </div>
        )}
      </div>
      {stylePosition === "FromLeftToRightUnderHeroImage" && (
        <div className="w-full">
          <HeadingLevel headingLevel={dataSource.headingLevel} titleText={dataSource.heading} styles="text-center mx-auto mt-2 md:mt-12" />
        </div>
      )}
    </>
  );
};

export default HeroSectionTextOnly;
