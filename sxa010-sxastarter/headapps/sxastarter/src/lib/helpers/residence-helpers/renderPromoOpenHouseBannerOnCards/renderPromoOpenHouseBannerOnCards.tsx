import { checkIsItPromo } from "../../utils/checkIsItPromo";
import { RichTextField } from "@sitecore-content-sdk/nextjs";

export function renderPromoOpenHouseBannerOnCards(sitecoreContext: any, residenceID: any, locale = "en", residenceName?: string): RichTextField | undefined {
  if (!residenceID || !sitecoreContext) return undefined;
  const contextPlaceHolders: any = sitecoreContext?.route?.placeholders;

  const bannerData = contextPlaceHolders["headless-sticky-banner"]?.find((rendering: any) => rendering?.componentName === "StickyPromoBanner");

  const localeDs = locale === "en" ? bannerData?.fields?.data?.dsEN : bannerData?.fields?.data?.dsFR;
  const StartDate = localeDs?.stickyPromoBannerStartDate.jsonValue.value || bannerData?.fields?.StarDate?.value;
  const EndDate = localeDs?.stickyPromoBannerEndDate.jsonValue.value || bannerData?.fields?.EndDate?.value;
  const stickyPromoBlockText = localeDs?.stickyPromoBlockText?.jsonValue || bannerData?.fields?.stickyPromoBlockText;
  const enItems = bannerData?.fields?.data?.dsEN?.stickyPromoExcludePages?.targetItems || [];
  const frItems = bannerData?.fields?.data?.dsFR?.stickyPromoExcludePages?.targetItems || [];
  const videoId = localeDs?.vimeoID?.jsonValue.value;

  // 2. Combine them into a single Array
  const excludedItems = [...enItems, ...frItems];
  // This is only for CHATBOT FOR NOW SINCE WE DON'T HAVE RESIDENCE TEMPLATE ID ON  SUB PAGES!!! HAVE TO REVISIT LOGIC LATER

  const IsItValidDate = checkIsItPromo(StartDate, EndDate);
  if (residenceName) {
    return IsItValidDate && !excludedItems.find((item: any) => item.name.toUpperCase().replace(/-/g, "") === residenceName.replace(/\s/g, "").toUpperCase()) ? stickyPromoBlockText : undefined;
  }
  return !videoId?.length && IsItValidDate && !excludedItems.find((item: any) => item.excludePageId.toUpperCase().replace(/-/g, "") === residenceID.toUpperCase().replace(/-/g, ""))
    ? stickyPromoBlockText
    : undefined;
}
