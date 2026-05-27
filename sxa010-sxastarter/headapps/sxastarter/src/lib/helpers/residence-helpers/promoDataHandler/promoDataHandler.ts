import { checkIsItPromo } from "../../utils/checkIsItPromo";
import { getLocalizedFormattedPrice, parseCurrencyToNumber } from "../../utils/getLocalizedFormattedPrice";

export interface PromotionData {
  promoStartDate: { jsonValue: { value: string } };
  promoEndDate: { jsonValue: { value: string } };
  promoPrice: { value: string };
  regularPrice: { value: string };
}

export interface PromoDataHandlerResultProps {
  isPromo: boolean;
  formattedPrice: string;
  textRegularPrice: string;
  promoPrices: number[];
  regularPrices: number[];
  textPromoPrice: string;
  isPromoPriceLessRegular: boolean;
  promoTextWhenPromoPriceBiggerThanRegular: string;
}

// Utility to extract field value with fallback
const extractFieldValue = (data: any, fieldName: string, fallback: string): string => {
  return data?.fields?.find((x: any) => x.name === fieldName)?.jsonValue?.value ?? fallback;
};

// Utility to get valid price numbers from array
const getValidPrices = (arr: Array<string | undefined>): number[] => {
  return arr.filter((price): price is string => !!price && price !== "").map(parseCurrencyToNumber);
};

export const promoDataHandler = (propertySuitPlans: PromotionData[], sitecoreContext: any, dictionary: (key: string, params?: any) => string): PromoDataHandlerResultProps => {
  const promoData = (propertySuitPlans ?? []).map((data) => {
    const start = new Date(extractFieldValue(data, "Start Date", data?.promoStartDate?.jsonValue?.value ?? ""));
    const end = new Date(extractFieldValue(data, "End Date", data?.promoEndDate?.jsonValue?.value ?? ""));
    const isPromo = checkIsItPromo(start, end);
    return {
      isPromo,
      start,
      end,
      regularPrice: extractFieldValue(data, "Regular SuitePrice", data?.regularPrice?.value ?? ""),
      promoPrice: isPromo ? extractFieldValue(data, "Promotion Price", data?.promoPrice?.value ?? "") : undefined,
    };
  });

  const promoPrices = getValidPrices(promoData.map((d) => d.promoPrice));
  const regularPrices = getValidPrices(promoData.map((d) => d.regularPrice));

  const smallestPromoPrice = promoPrices.length ? Math.min(...promoPrices) : Infinity;
  const smallestRegularPrice = regularPrices.length ? Math.min(...regularPrices) : Infinity;
  const isPromoPriceLessRegular = smallestPromoPrice < smallestRegularPrice;
  const smallestPrice = promoPrices.length && isPromoPriceLessRegular ? smallestPromoPrice : smallestRegularPrice;

  const formattedPrice = getLocalizedFormattedPrice(sitecoreContext, smallestPrice);
  const textRegularPrice = dictionary("suitePricetextFormat", { amount: formattedPrice });
  const textPromoPrice = dictionary("suitePromoPricetextFormat", { amount: formattedPrice });
  const promoTextWhenPromoPriceBiggerThanRegular = dictionary("PromoText");

  return {
    isPromo: promoPrices.length > 0,
    formattedPrice,
    textRegularPrice,
    isPromoPriceLessRegular,
    promoTextWhenPromoPriceBiggerThanRegular,
    promoPrices,
    regularPrices,
    textPromoPrice: isPromoPriceLessRegular ? textPromoPrice : promoTextWhenPromoPriceBiggerThanRegular,
  };
};
