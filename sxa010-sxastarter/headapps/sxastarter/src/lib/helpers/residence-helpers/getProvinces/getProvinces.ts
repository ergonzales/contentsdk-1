
import { modelData } from "../modelData/modelData";
import type { SitecoreContextValue } from "lib/sitecore/types";

export function getProvinces(router: any, context: SitecoreContextValue) {
  const model = modelData(context, router) || [];
  const provinces = model?.find((f: any) => f.provinces)?.provinces || "";
  return provinces;
}
