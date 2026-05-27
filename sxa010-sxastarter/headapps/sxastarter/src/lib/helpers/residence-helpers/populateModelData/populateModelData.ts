// import { resolveHref } from "lib/helpers/utils/resolve-href";

export const careServiceValues = (combinedCareServices: any, language: any, careServices: any) => {
  const careServiceIds = careServices?.map((el: any) => el.id);
  const careServiceNames = combinedCareServices
    ?.flatMap((el: any) => el.languages)
    ?.filter((el: any) => careServiceIds.includes(el.id) && el.language.name === language)
    .map((el: any) => el?.careServiceName?.value || el.field.value || "");
  // ?.join(" | ");
  return careServiceNames || "";
};

export const careServiceObj = (combinedCareServices: any, language: any, careServices: any) => {
  const careServiceIds = careServices?.map((el: any) => el.id);
  const careServiceObjs = combinedCareServices
    ?.flatMap((el: any) => el.languages)
    ?.filter((el: any) => careServiceIds.includes(el.id) && el.language.name === language)
    .map((el: any) => el);
  return careServiceObjs || [];
};

export const provinceValues = (combinedProvinces: any, language: any, province: any) => {
  const provinceIds = province?.map((el: any) => el.id);
  const provinceNames = combinedProvinces
    ?.flatMap((el: any) => el.languages)
    ?.filter((el: any) => provinceIds.includes(el.id) && el.language.name === language)
    .map((el: any) => el.field.value)
    ?.join(" | ");
  return provinceNames || "";
};

export function populateModelData(residenceData: any, router: any, selectedProvinceId?: string) {
  if (!residenceData) return [];

  const mappedResidences = residenceData?.combinedResidences
    ?.map((residence: any) => {
      const localizedProvince = provinceValues(residenceData.combinedProvinces, !residence?.bilingual?.boolValue ? router.locale : residence?.language?.name, residence?.province?.targetItems) || "";
      const localizedCareService =
        careServiceValues(residenceData.combinedCareServices, !residence?.bilingual?.boolValue ? router.locale : residence?.language?.name, residence?.livingOption?.targetItems) || "";
      // const localizedPromo = promoValues(residenceData.combinedPromotions, !residence?.bilingual?.boolValue ? router.locale : residence?.language?.name, residence?.assignedPromos?.targetItems) || "";
      const localizedCareServiceObj =
        careServiceObj(residenceData.combinedCareServices, !residence?.bilingual?.boolValue ? router.locale : residence?.language?.name, residence?.livingOption?.targetItems) || [];

      return {
        propertyId: residence?.propertyId?.value,
        residence: residence,
        language: residence?.language?.name,
        bilingual: residence?.languages?.length > 1,
        residenceId: residence?.id,
        residenceName: residence?.navigationTitle?.value,
        cityId: residence?.city?.targetItems[0]?.id,
        cityName: residence?.city?.targetItems[0]?.name,
        subCityName: residence?.city?.targetItems[0]?.subCity?.targetItems[0]?.name,
        subCityId: residence?.city?.targetItems[0]?.subCity?.targetItems[0]?.id,
        propertySuitPlans: residence?.propertySuitPlans?.targetItems,
        cityNameDisplay: residence?.city?.targetItems?.[0]?.languages?.find((x: any) => x.language?.name === router.locale)?.field?.value || "",
        subCityNameDisplay: residence?.city?.targetItems?.[0]?.subCity?.targetItems[0]?.languages?.find((x: any) => x.language?.name === router.locale)?.field?.value || "",
        cityLandingPageHref: residence?.city?.targetItems[0]?.cityLandingPage?.targetItem?.cityLandingPageLinks,
        subCityLandingPageHref: residence?.city?.targetItems[0]?.subCity?.targetItems[0]?.cityLandingPage?.targetItem?.cityLandingPageLinks,
        provinceId: residence?.province?.targetItems[0]?.id,
        provinceName: localizedProvince || "",
        residenceAddress:
          (residence?.streetNameAndNumber?.value + ", " + residence?.city?.targetItems?.[0]?.languages?.find((x: any) => x.language?.name === router.locale)?.field?.value ||
            residence?.city?.targetItems[0]?.name) +
          ", " +
          (router.locale === "fr" ? "(" + localizedProvince + ") " : localizedProvince + " ") +
          residence?.postalCode?.value,
        postalCode: residence?.postalCode?.value,
        Lat: residence?.Latitude?.value,
        Lng: residence?.Longitude?.value,
        cityLat: residence?.city?.targetItems?.[0]?.languages?.[0]?.lat?.value,
        cityLng: residence?.city?.targetItems?.[0]?.languages?.[0]?.lng?.value,
        url: residence?.url?.path,
        contactNumber: residence?.contactNumber.value,
        residenceImage: residence?.thumbNailPhoto?.jsonValue?.value,
        imageSrc: residence?.thumbNailPhoto?.jsonValue?.value?.src,
        imageAlt: residence?.thumbNailPhoto?.jsonValue?.value?.alt,
        livingOption: localizedCareService || "",
        livingOptions: localizedCareServiceObj || [],
        // assignedPromos: localizedPromo || "",
        careServiceAvailable: residence?.careServiceAvailable?.boolValue,
        careServiceAvailableText: residence?.careServiceAvailableText?.value,
        bookATourLink: residence?.bookATour?.targetItems?.[0]?.bookATourUrl?.path,
      };
    })
    .filter((residence: any) =>
      selectedProvinceId ? (residence.language === router.locale || !residence.bilingual) && residence.provinceId === selectedProvinceId : residence.language === router.locale || !residence.bilingual
    )
    .sort((a: { propertyId: string }, b: { propertyId: any }) => a.propertyId.localeCompare(b.propertyId));
  return mappedResidences || [];
}
