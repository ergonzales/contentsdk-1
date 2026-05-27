
import { normalizeString } from "../normalizeString/normalizeString";
import { populateModelData } from "../populateModelData/populateModelData";
import { deStructureProps } from "../deStructureProps/deStructureProps";
import type { SitecoreContextValue } from "lib/sitecore/types";

export function getResidenceObj(router: any, context: SitecoreContextValue) {
  const data = (context.route?.placeholders["headless-main"]?.find((component: any) => component.componentName === "ResidenceObjData") as any) || {};
  const { ResidenceData } = deStructureProps(data);
  const provinceId =
    ResidenceData.combinedProvinces.find((province: any) => normalizeString(province?.provinceItemName) === normalizeString(context?.route?.name as string) && province.language === router.locale)
      ?.id || "";

  const model = provinceId ? populateModelData(ResidenceData, router, provinceId) : populateModelData(ResidenceData, router, "");
  return {
    ...(Array.from(new Set(model.map((residence: any) => residence.cityId)))
      .map((cityId: string) => {
        const matchingResidences = model.find((residence: any) => residence.cityId === cityId);
        const { targetItem: cityLandingPage } = matchingResidences?.cityLandingPageItem?.[0]?.city?.targetItems?.[0]?.cityLandingPage || {};
        return {
          id: matchingResidences?.cityId,
          name: matchingResidences?.cityNameDisplay,
          language: cityLandingPage?.cityLandingPageLinks?.length === 1 ? cityLandingPage?.cityLandingPageLinks?.[0]?.language?.name : router.locale,
          cityLandingPageHref:
            cityLandingPage?.cityLandingPageLinks?.length === 1
              ? cityLandingPage?.cityLandingPageLinks?.[0]?.url?.path
              : cityLandingPage?.cityLandingPageLinks?.find((l: any) => l.language.name === router.locale)?.url?.path || "",
          landingPageResidences: cityLandingPage?.residences?.targetItems?.map((residence: any) => {
            return {
              ...residence,
              livingOptions: model
                ?.find((f: any) => f.residenceId === residence.residenceId)
                ?.livingOptions.map((option: any) => ({
                  name: option?.careService?.value,
                  id: option?.id,
                })),
            };
          }),
        };
      })
      ?.filter((city: any) => city.cityLandingPageHref)
      .sort((a: any, b: any) => a.name.localeCompare(b.name)) || []),
    residencesObj: model,
    provincesObj: ResidenceData.combinedProvinces,
    careServicesObj: ResidenceData.combinedCareServices,
    promotionsObj: ResidenceData.combinedPromotions,
  };
}
