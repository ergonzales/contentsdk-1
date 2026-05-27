import { ImageField } from "@sitecore-content-sdk/nextjs";
import { checkIsItPromo } from "lib/helpers/utils/checkIsItPromo";
import { getLocalizedFormattedPrice } from "lib/helpers/utils/getLocalizedFormattedPrice";
import { GroupedSuitePlans, SuitePlan } from "src/models/SuitePlans";

export function getGroupedSuitePlans({
  sitecoreContext,
  selectedCareLevel,
  currentIndex,
  dictionary,
  // isChatBot = false,
  excludeCareLevels,
}: {
  sitecoreContext: any;
  selectedCareLevel: number;
  currentIndex: number;
  dictionary: <X extends Record<string, any> | any[]>(key: string | (string | number)[], params?: X | undefined, lang?: string) => string;
  // isChatBot?: boolean;
  excludeCareLevels?: any;
}): {
  data: {
    suiteDictItems: {
      DisclaimerText: string;
      keyFeaturesText: string;
      hospitalityServicesText: string;
      suiteHospitalityRentInclusion: string;
      suiteHospitalityAdditionalServices: string;

      optionalServicesText: string;
      regularPriceDictItem: string;
      suiteMonth: string;
      suiteDetailsBTN: string;
      suiteSelectLivingOption: string;
    };
    suitePlans: any;
    selectedSuitePlan: any;
    careLevels: string[];
    careLevelObj: { id: any; name: string; icon: ImageField }[];
  };
} {
  const suitePlanPlaceHolder = sitecoreContext?.route?.placeholders?.["headless-main"]?.find((ph: any) => ph.componentName === "PropertySuitePlans") || {};
  const suitePlansData =
    excludeCareLevels && excludeCareLevels?.length > 0
      ? suitePlanPlaceHolder?.fields?.data?.ds?.children?.results?.filter((plan: any) => !excludeCareLevels?.some((exclude: any) => exclude.name === plan?.name))
      : suitePlanPlaceHolder?.fields?.data?.ds?.children?.results || [];

  const groupedSuitePlans =
    suitePlansData &&
    suitePlansData
      ?.flatMap((x: SuitePlan) => ((x.children?.results?.length ?? 0) > 0 ? x.children?.results : [x]))
      ?.reduce((acc: GroupedSuitePlans, plan: SuitePlan) => {
        const careLevel = plan?.fields?.find((item: any) => item?.name === "Care Level")?.jsonValue?.fields?.["Suite Care Level"]?.value; //careLevel?.targetItem?.field.value;
        if (careLevel) {
          acc[careLevel] = acc[careLevel] || [];
          acc[careLevel].push(plan);
        }
        return acc;
      }, {} as GroupedSuitePlans);

  const suiteDictItems = {
    DisclaimerText: dictionary("suitePlansDisclaimer"),
    keyFeaturesText: dictionary("suiteKeyFeatures"),
    hospitalityServicesText: dictionary("Hospitality"),
    suiteHospitalityRentInclusion: dictionary("suiteHospitalityRentInclusion"),
    suiteHospitalityAdditionalServices: dictionary("suiteHospitalityAdditionalServices"),
    optionalServicesText: dictionary("suiteOptionalServices"),
    regularPriceDictItem: dictionary("suitePricetextFormat"),
    suiteMonth: dictionary("suiteMonth"),
    suiteDetailsBTN: dictionary("suiteDetailsBTN"),
    suiteSelectLivingOption: dictionary("suiteSelectLivingOption"),
  };
  const careLevels = Object.keys(groupedSuitePlans ?? {});

  const careLevelObj = careLevels.map((level) => {
    const firstPlan = groupedSuitePlans[level]?.[0];
    const id = firstPlan?.fields?.find((item: any) => item?.name === "Care Level")?.jsonValue?.id || "";
    // plan?.fields?.find((item: any) => item?.name === "Care Level")?.jsonValue?.fields?.["Suite Care Level Icon"]?.value;
    const careLevelIcon = firstPlan?.fields?.find((item: any) => item?.name === "Care Level")?.jsonValue?.fields?.["Suite Care Level Icon"]?.value || "";
    return { id, name: level, icon: careLevelIcon };
  });
  const suitePlans = (groupedSuitePlans?.[careLevels[selectedCareLevel]] || []).map((plan: any) => {
    const regularPriceField = plan?.fields?.find((item: any) => item?.name === "Regular SuitePrice")?.jsonValue?.value;
    const promoPriceField = plan?.fields?.find((item: any) => item?.name === "Promotion Price")?.jsonValue?.value;
    const startDateField = plan?.fields?.find((item: any) => item?.name === "Start Date")?.jsonValue?.value;
    const endDateField = plan?.fields?.find((item: any) => item?.name === "End Date")?.jsonValue?.value;

    return {
      ...plan,
      formattedRegularPrice: regularPriceField ? getLocalizedFormattedPrice(sitecoreContext, regularPriceField) : "",
      formattedPromoPrice: promoPriceField ? getLocalizedFormattedPrice(sitecoreContext, promoPriceField) : "",
      textRegularPrice: regularPriceField ? dictionary("suitePricetextFormat", { amount: getLocalizedFormattedPrice(sitecoreContext, regularPriceField) }) : "",
      textHospitalityServicesRegularPrice: regularPriceField ? dictionary("suiteHospitalityPriceTextFormat", { amount: getLocalizedFormattedPrice(sitecoreContext, regularPriceField) }) : "",
      textHospitalityServicesPromoPrice: promoPriceField ? dictionary("suiteHospitalityPromoPriceTextFormat", { amount: getLocalizedFormattedPrice(sitecoreContext, promoPriceField) }) : "",
      textPromoPrice: promoPriceField ? dictionary("suitePromoPricetextFormat", { amount: getLocalizedFormattedPrice(sitecoreContext, promoPriceField) }) : "",
      suiteCustomPromo: plan?.fields?.find((item: any) => item?.name === "SuiteCustomPromo")?.jsonValue?.value,
      isPromo: checkIsItPromo(startDateField, endDateField),
    };
  });

  return { data: { suiteDictItems, suitePlans, selectedSuitePlan: suitePlans[currentIndex], careLevels, careLevelObj } };
}
