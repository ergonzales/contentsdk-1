
import { modelData } from "../modelData/modelData";
import { normalizeString } from "../normalizeString/normalizeString";
import type { SitecoreContextValue } from "lib/sitecore/types";

export function getProvinceId(router: any, context: SitecoreContextValue) {
  const model = modelData(context, router) || [];
  const provinceId =
    model?.find((f: any) => f.provinces)?.provinces?.find((province: any) => normalizeString(province?.provinceItemName) === normalizeString(context?.route?.name as string))?.id || "";
  return provinceId;
}
