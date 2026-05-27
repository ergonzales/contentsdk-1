
import { modelData } from "../modelData/modelData";
import type { SitecoreContextValue } from "lib/sitecore/types";

export function getCareServices(router: any, context: SitecoreContextValue) {
  const model = modelData(context, router) || [];
  const careServices = model?.find((f: any) => f.careServices)?.careServices || "";
  return careServices;
}
