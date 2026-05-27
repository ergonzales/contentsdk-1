import { modelData } from "../modelData/modelData";
import { normalizeString } from "../normalizeString/normalizeString";

export function getRowsByCityAndResidenceName(defaultValue: any, context: any, router: any, provinceId?: string): any[] {
  if (!defaultValue) return [];
  const model = modelData(context, router);

  const filteredResidences =
    model?.filter((residence: any) => {
      return (
        normalizeString(residence.cityNameDisplay).startsWith(normalizeString(defaultValue)) ||
        normalizeString(residence.residenceName).includes(normalizeString(defaultValue)) ||
        normalizeString(residence.subCityName).startsWith(normalizeString(defaultValue))
      );
    }) || [];

  const residencesByCity = filteredResidences
    .map((residence: any) => {
      return {
        ...residence,
        searchType: normalizeString(residence.cityNameDisplay).startsWith(normalizeString(defaultValue)) ? "city" : "",
        provinces: model?.find((f: any) => f.provinces)?.provinces,
        careServices: model?.find((f: any) => f.careServices)?.careServices,
      };
    })
    ?.filter((residence: any) => residence.searchType === "city");

  const residencesSubCity = filteredResidences
    .map((residence: any) => {
      return {
        ...residence,
        searchType: normalizeString(residence.subCityName).startsWith(normalizeString(defaultValue)) ? "subCity" : "",
        provinces: model?.find((f: any) => f.provinces)?.provinces,
        careServices: model?.find((f: any) => f.careServices)?.careServices,
      };
    })
    ?.filter((residence: any) => residence.searchType === "subCity");

  const residencesBySearchType = filteredResidences
    .map((residence: any) => {
      return {
        ...residence,
        searchType: normalizeString(residence.residenceName).includes(normalizeString(defaultValue)) ? "residence" : "",
        provinces: model?.find((f: any) => f.provinces)?.provinces,
        careServices: model?.find((f: any) => f.careServices)?.careServices,
      };
    })
    ?.filter((residence: any) => residence.searchType === "residence");
  return (
    (provinceId
      ? [...residencesByCity, ...residencesSubCity, ...residencesBySearchType]?.filter((p: any) => p.provinceId === provinceId)
      : [...residencesByCity, ...residencesSubCity, ...residencesBySearchType]) || []
  );
}
