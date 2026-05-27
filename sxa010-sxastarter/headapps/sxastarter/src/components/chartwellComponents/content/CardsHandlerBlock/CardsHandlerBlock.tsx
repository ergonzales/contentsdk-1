import { JSX } from "react";
import { withDatasourceCheck, RichText as JssRichText, NextImage } from "@sitecore-content-sdk/nextjs";
import { useRouter } from "next/router";
import { useSitecore } from "@sitecore-content-sdk/nextjs";
import { HeadingLevel } from "../../ui/HeadingLevel/HeadingLevel";
import { InView, useInView } from "react-intersection-observer";
import { ChartwellLink } from "components/chartwellComponents/ui/link/ChartwellLink";
import Link from "next/link";
import { getDelay, getTextPosition, getTopPaddingSize, getBottomPaddingSize, getHeadingColor, getGridCols, getColSpan, getPosition } from "lib/helpers/layoutOption/index";
import { deStructureProps, getUniqueCities, populateModelData } from "lib/helpers/residence-helpers/index";
import { resolveHref } from "lib/helpers/utils/resolve-href";

/**
 *
 * @param props uses componentQuery results as props on the CardsHandlerBlock rendering item
 * (fields.data.ds / fields.data.dsEn / fields.data.dsFr)
 * @returns
 *
 */
const CardsHandlerBlock = (props: any): JSX.Element => {
  const { page } = useSitecore();
  const sitecoreContext = page?.layout?.sitecore?.context || {};
  const route = (sitecoreContext?.route || page?.layout?.sitecore?.route) as any;

  const data = (route?.placeholders?.["headless-main"]?.find((component: any) => component.componentName === "ResidenceObjData") as any) || {};
  const { ci } = props?.fields?.data || {};

  const { ref, inView } = useInView({
    threshold: 0.5,
    delay: 200,
    triggerOnce: true,
  });
  const router = useRouter();

  const provinceId = ci?.province?.targetItems ? ci?.province?.targetItems?.[0]?.id : "";
  const residenceDataObj = deStructureProps(data);

  const uniqueCities =
    (provinceId &&
      getUniqueCities(populateModelData(residenceDataObj?.ResidenceData, router, provinceId), router)?.map((item: any) => {
        // const { resCityName, resCityLink, resRouterLanguage } = getLocalizedResidenceData(residenceDataObj?.ResidenceData?.combinedResidences, item, router, altToggle);

        return {
          cityId: item.cityId,
          cityName: item.cityDisplayName,
          cityLink: resolveHref(item.cityLandingPagePath || item.CityLandingPage),
          routerLanguage: item.cityLandingPageLanguage,
        };
      })) ||
    [];

  const backgroundImage = (ci && ci?.backgroundImage?.jsonValue?.value) ?? undefined;
  const backgroundSize = (ci && ci?.backgroundSize?.value) ?? undefined;
  const fullDivStyle = backgroundSize === "Over Entire Component" && backgroundImage ? { backgroundImage: "url(" + backgroundImage?.src + ")" } : {};
  const textOnlyStyle = backgroundSize === "Over Text Only" ? { backgroundImage: "url(" + backgroundImage?.src + ")" } : {};
  const CardsContainer = ci?.cardsContainer?.targetItems?.length ?? 0 ? ci?.cardsContainer?.targetItems : undefined;
  const NumberOfColumns = ci?.cardsContainerNumberOfColumns?.value ?? "3";
  const paddingTopSize = ci?.marginTopSize?.value;
  const paddingBottomSize = ci?.marginBottomSize?.value;
  const isAnimationTurnOn = ci?.turnOnAnimation?.boolValue;
  const HeadingColor = ci?.headingColor?.value;

  const paddingTop = getTopPaddingSize(paddingTopSize);
  const paddingBottom = getBottomPaddingSize(paddingBottomSize);
  const HeaderColor = getHeadingColor(HeadingColor);
  const gridCols = getGridCols(NumberOfColumns);

  return (
    <div className={`relative w-full bg-no-repeat bg-cover ${backgroundSize !== undefined && backgroundSize === "Over Entire Component" && "-bkg"}`} style={fullDivStyle}>
      <div
        className={`ChartwellContainer ${paddingTop} ${paddingBottom} bg-no-repeat bg-cover    ${backgroundSize !== undefined && backgroundSize === "Over Text Only" && "-bkg"}`}
        style={textOnlyStyle}
      >
        <HeadingLevel headingLevel={ci && ci?.headingLevel} titleText={ci?.heading} styles={`text-center ${HeaderColor}`} />
        <div className={`flex flex-col`}>
          {ci && ci?.cardsHandlerBlockText && ci?.cardsHandlerBlockText?.value && <JssRichText field={ci?.cardsHandlerBlockText} tag="div" className="mt-4 text-center" />}
          {uniqueCities?.length !== 0 && (
            <ul role="list" className="flex flex-wrap items-center justify-center gap-8 mt-4">
              {uniqueCities.map(
                (item: any, index: any) =>
                  item.cityLink && (
                    <li role="listitem" key={index} className="text-center">
                      <Link className="text-[20px]" href={item.cityLink} locale={item.routerLanguage || router.locale || "en"}>
                        {item.cityName}
                      </Link>
                    </li>
                  )
              )}
            </ul>
          )}
          {CardsContainer && (
            <ul ref={ref} role="list" className={`block mx-auto   md:grid   ${gridCols}`}>
              {CardsContainer?.map((fields: any, index: any) => {
                const ImageWidth = fields?.displayImage?.jsonValue?.value?.width;
                const ImageHeight = fields?.displayImage?.jsonValue?.value?.height;
                const CTAStyle = (fields && fields?.ctaStyle !== undefined && fields?.ctaStyle?.value != undefined ? fields && fields?.ctaStyle?.value : "plum on clear background").replace(
                  /\s/g,
                  "-"
                );
                return (
                  <li
                    role="listitem"
                    key={index}
                    className={`flex  ${getColSpan(fields?.columnSpan?.value.length !== 0 ? fields?.columnSpan?.value : "1")} ${
                      fields.imagePosition.value === "Below BlockText" ? "flex-col-reverse" : "flex-col"
                    }  p-4 `}
                  >
                    {fields?.displayImage?.jsonValue?.value.hasOwnProperty("src") && (
                      <InView
                        as="div"
                        className={`${inView && isAnimationTurnOn ? "scale-100 " : ` scale-0   `} relative ${getDelay(index)}  duration-300  ease-in-out  ${getPosition(fields.imageAlignment.value)}`}
                      >
                        <NextImage field={fields.displayImage?.jsonValue?.value} width={ImageWidth} height={ImageHeight} />
                      </InView>
                    )}

                    <div className={` ${getTextPosition(fields.textAlignment?.value)}`}>
                      <HeadingLevel headingLevel={fields.headlingLevel} titleText={fields.title} styles="mt-4 text-center" />
                      {fields.imageDescription?.value?.length !== 0 && <JssRichText field={fields.imageDescription} className="m-0 mt-4 ChartwellText " />}
                    </div>

                    {fields.ctaLink?.url?.length !== 0 && (
                      <ChartwellLink
                        href={fields.ctaLink?.url}
                        label={`${fields.ctaText?.value}`}
                        target={`${fields.ctaTarget?.value}`}
                        tailwindStyles={` mt-auto p-2 block  ${getPosition(fields.imageAlignment?.value)} ${CTAStyle}`}
                        linkId={fields.ctaLink?.id}
                      />
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default withDatasourceCheck()(CardsHandlerBlock);
