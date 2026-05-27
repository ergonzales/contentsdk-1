import type { SitecoreContextValue } from "lib/sitecore/types";


export function parseCurrencyToNumber(value: string): number {
  if (!value) return 0;
  // Remove common currency symbols and whitespace, then parse
  return Number(
    value
      .replace(/[$,]/g, "") // Remove $ and commas
      .replace(/CA\\$|CAD|C\\$/gi, "") // Remove CA$, CAD, C$
      .replace(/\s/g, "") // Remove all whitespace
      .trim()
  );
}

export function getLocalizedFormattedPrice(sitecoreContext: SitecoreContextValue, suitePrice: number | null | undefined | string): string {
  const language = sitecoreContext.language === "en" ? "en-CA" : "fr-CA";
  const parsedPrice = parseCurrencyToNumber(suitePrice?.toString() || "");
  const price = parsedPrice === null || parsedPrice === undefined || Number.isNaN(parsedPrice) ? 0 : parsedPrice;

  return new Intl.NumberFormat(language, {
    style: "currency",
    currency: "CAD",
    minimumFractionDigits: 0,
  }).format(price);
}
