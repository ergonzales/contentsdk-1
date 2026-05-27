import { deStructureProps } from "../deStructureProps/deStructureProps";
import { populateModelData } from "../populateModelData/populateModelData";

export function modelData(context: any, router: any) {
  // Destructure to avoid repeated property access

  const { route } = context;
  const placeholders = route?.placeholders ?? {};
  const headlessMain = placeholders["headless-main"] ?? [];
  const data = headlessMain?.find((item: any) => item.componentName === "ResidenceObjData") || {};

  // Destructure data for cleaner access
  const { ResidenceData } = deStructureProps(data);
  const { combinedProvinces, combinedCareServices } = ResidenceData;

  // Filter operations optimized by directly accessing properties
  const provincesObj = combinedProvinces?.flatMap((p: any) => p.languages)?.filter((l: any) => l.language.name === router.locale);
  const careServicesObj = combinedCareServices
    ?.flatMap((p: any) => p.languages)
    ?.filter((l: any) => l.language.name === router.locale)
    ?.map((c: any) => ({ ...c, sortOrder: combinedCareServices?.find((f: any) => f.id === c.id)?.sortOrder?.value }))
    .sort((a: any, b: any) => a.sortOrder - b.sortOrder);
  // Return statement optimized for readability
  return [...populateModelData(ResidenceData, router, ""), { provinces: provincesObj }, { careServices: careServicesObj }];
}
