import { ComponentRendering } from "@sitecore-content-sdk/nextjs";
import { ChartwellLink } from "components/chartwellComponents/ui/link/ChartwellLink";
import { HeadingLevel } from "../../ui/HeadingLevel/HeadingLevel";
import { useI18n } from "next-localization";
import { promoDataHandler } from "lib/helpers/residence-helpers";
import { NextImageBkg } from "components/chartwellComponents/ui/BackgroundImage/BackgroundImage";
import { JSX } from "react";
import { useSitecoreContext } from "lib/sitecore/useSitecoreContext";

interface SuitePlanPlaceholder {
  fields?: {
    data?: {
      ds?: {
        suitePlans?: {
          targetItems?: any[];
        };
        children?: {
          results?: any[];
        };
      };
    };
  };
}

const SuitePromoPriceBlock = (props: any): JSX.Element => {
  const { sitecoreContext } = useSitecoreContext();
  const { t: dictionary } = useI18n();

  // Extract suite plans from the main placeholder
  const suitePlanPlaceHolder =
    (sitecoreContext?.route?.placeholders?.["headless-main"]?.find((ph: any) => (ph as ComponentRendering)?.componentName === "PropertySuitePlans") as SuitePlanPlaceholder) || {};
  const propertySuitPlans = suitePlanPlaceHolder?.fields?.data?.ds?.suitePlans?.targetItems ?? suitePlanPlaceHolder?.fields?.data?.ds?.children?.results ?? [];

  // Extract data source fields
  const {
    "Heading Level": headingLevel,
    Heading: heading,
    "CTA Text": CTAText,
    "CTA Link": CTALink,
    "CTA Target": CTATarget,
    "CTA Style": rawCTAStyle,
    BlockText: blockText,
    "Promotion background Image": PromoBgImage,
    "background Image": RegularBgImage,
  } = props?.fields || {};

  const CTAStyle = (rawCTAStyle?.value || "plum on clear background").replace(/\s/g, "-");

  // Process promo data
  const { isPromo, textRegularPrice, textPromoPrice, promoPrices, regularPrices } =
    promoDataHandler(
      propertySuitPlans?.flatMap((plan: any) => plan.children?.results || []),
      sitecoreContext,
      dictionary
    ) || {};

  const bgImage = isPromo ? PromoBgImage : RegularBgImage;

  return (
    <div className="w-full min:h-[540px] md:min-h-[460px]  relative">
      <div className="w-full h-full bg-gradient-to-b from-ChartwellGradient-100 to-ChartwellGradient-70 lg:bg-none">
        <div className="ChartwellContainer SectionPadding  h-full">
          <NextImageBkg styles="hidden lg:block" field={bgImage} bgPosition="" />
          <div className={`w-full h-full relative flex  items-center ${isPromo ? "justify-start" : "justify-end"} `}>
            <div className={`  lg:basis-1/2 flex flex-col items-center`}>
              <HeadingLevel headingLevel={headingLevel} titleText={heading} styles="text-center" />
              {promoPrices?.length || regularPrices?.length ? (
                <p
                  className={`m-0 mt-4 sm:mt-6 mb-2 ${
                    isPromo ? "bg-ChartwellBlue" : "bg-ChartwellPlum"
                  } p-2 ChartwellText text-[0.875rem] sm:text-[1.0625rem] w-full py-3 text-center text-ChartwellWhite`}
                >
                  {isPromo ? textPromoPrice : textRegularPrice}
                </p>
              ) : null}
              {blockText && <div className="text-center mt-4" dangerouslySetInnerHTML={{ __html: blockText.value }}></div>}
              {CTALink?.value?.href && (
                <ChartwellLink
                  href={CTALink.value.href}
                  target={CTATarget?.value}
                  label={CTAText?.value}
                  tailwindStyles={`mt-2 sm:mt-6 p-3 px-8 text-[0.875rem] md:text-[1.0625rem] mt-4 duration-300 chartwellCTAs ${CTAStyle}`}
                  linkId={CTALink?.value?.id}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuitePromoPriceBlock;
