import { ResidenceListModel } from "src/models/Residence";
// import { resolveHref } from "lib/helpers/utils/resolve-href";

export function getUniqueCities(ResidencesList: ResidenceListModel[], router: any) {
  const uniqCity = [...new Set(ResidencesList.flatMap((residence) => [residence.cityId, residence?.subCityId].filter((id) => id !== undefined)))];

  const uniqCityWithRelatedResidences = uniqCity.map((cityId) => {
    const city = ResidencesList.find((residence) => residence.cityId === cityId);
    const subCity = ResidencesList.find((residence) => residence.subCityId === cityId);
    const defaultCityLandingPageLink = city?.cityLandingPageHref?.[0]?.url?.path || subCity?.subCityLandingPageHref?.[0]?.url?.path || "";
    const cityLandingPageLanguage = city?.cityLandingPageHref?.length === 1 ? city?.cityLandingPageHref?.[0]?.language.name || subCity?.subCityLandingPageHref?.[0]?.language.name : router.locale;

    const localizedCityLandingPage =
      city?.cityLandingPageHref?.find((item: any) => item.language.name === router.locale) ||
      subCity?.subCityLandingPageHref?.find((item: any) => item.language.name === router.locale) ||
      defaultCityLandingPageLink;

    // const cityLandingPagePath = resolveHref(localizedCityLandingPage);

    return {
      cityName: city?.cityName || subCity?.subCityName || "", // Fallback empty string
      cityId: cityId || "",
      cityDisplayName: city?.cityNameDisplay || subCity?.subCityNameDisplay || "", // Fallback empty string

      CityLandingPage: localizedCityLandingPage,
      defaultCityLandingPageLink,
      cityLandingPageLanguage,
      residences: ResidencesList.filter((residence) => residence.cityId === cityId || residence.subCityId === cityId),
    };
  });

  return uniqCityWithRelatedResidences.sort((a, b) => a.cityName.localeCompare(b.cityName));
}
