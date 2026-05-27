import { JSX } from "react";
import { ChartwellLink } from "components/chartwellComponents/ui/link/ChartwellLink";
import { HeadingLevel } from "../../ui/HeadingLevel/HeadingLevel";
import { checkIsItPromo } from "lib/helpers/utils/checkIsItPromo";
import { getAbsolutePosition, getBlockTextWidth } from "lib/helpers/layoutOption";

// rendered from HeroSectionTextOnly when the joy is ageless animation (renderPropertyOverviewJoyIsAgeless) is enabled, it contains only the text block without animation
const TextBlockBanner = (props: any): JSX.Element => {
  const { fields: dataSource } = (props && props) || {}; // data source
  const contextFields = props?.rendering?.fields?.data?.contextItem?.assignedPromotions?.targetItems[0] || {}; // context item

  const bookATourBtnClass = dataSource.isBookATour ? "isBookATourBtn" : "";
  const CTAStyle = `${(dataSource.CTAStyle ? dataSource.CTAStyle : "plum on clear background").replace(/\s/g, "-")} ${bookATourBtnClass}`;

  const stylePosition = getAbsolutePosition(dataSource.position);

  const blockTextWidth = getBlockTextWidth(dataSource.BlockTextWidth);
  const isPromoActive =
    contextFields && dataSource.dataSourceName === "MainHeroSection" && checkIsItPromo(contextFields.promoStartDate?.jsonValue?.value, contextFields.promoEndDate?.jsonValue?.value) ? true : false;

  const LongTitlePromoOrRegular = isPromoActive ? contextFields.longPromotionTitle.value : dataSource?.blockText;
  const CTALabelPromoOrRegular = isPromoActive ? contextFields.promoCTA?.value : dataSource?.CTAText;
  return (
    <>
      <div className="w-full relative ">
        {dataSource.heading && dataSource.heading?.value && stylePosition !== "FromLeftToRightUnderHeroImage" && (
          <div
            className={`${
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
                linkId={props?.rendering?.fields?.data?.ds?.fields?.find((field: any) => field.name === "CTA Link")?.jsonValue?.value?.id}
              />
            )}
          </div>
        )}
        {dataSource.heading && dataSource.heading?.value && stylePosition === "FromLeftToRightUnderHeroImage" && (
          <div
            className={` flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10  p-4   w-full mx-auto -bottom-8     bg-ChartwellPlum  z-20 shadowPlumBox isPromoActive-${isPromoActive}`}
          >
            {LongTitlePromoOrRegular && <div className=" text-ChartwellWhite" dangerouslySetInnerHTML={{ __html: LongTitlePromoOrRegular }}></div>}
            {dataSource?.CTALink && (
              <ChartwellLink
                href={dataSource?.CTALink}
                target={`${CTALabelPromoOrRegular}`}
                label={CTALabelPromoOrRegular}
                tailwindStyles={`!mt-0 max-w-xs  border-ChartwellWhite text-center  grow-0  chartwellCTAs ${CTAStyle}`}
                textStyles={`text-ChartwellWhite`}
                linkId={props?.rendering?.fields?.data?.ds?.fields?.find((field: any) => field.name === "CTA Link")?.jsonValue?.value?.id}
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

export default TextBlockBanner;
