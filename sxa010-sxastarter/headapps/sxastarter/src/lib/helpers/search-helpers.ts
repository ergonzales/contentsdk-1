import { GeonamesService } from "lib/geonames-service";
import { CareService } from "src/models/CareService";
import { MapOrigin } from "src/models/MapLocation";
import { Province } from "src/models/Province";
import { Residence } from "src/models/Residence";
import { calculateDistanceBetweenTwoPoints } from "./utils/haversine";
import { getSetIntersection } from "./helper";
// import { normalizeString } from "./normalize-string";
import { isThisPostalCode } from "./utils/postalcode-matcher";
import { getFilterStringArray } from "./utils/transform-filters";
import { removeNonIntegersFromId, transformIdToDashWithCurlyBrackets } from "./utils/transform-id";

import { PropertyHeaderProps } from "src/models/PropertyHeaderNav";
import { haversineDistance } from "./utils/haverDistance";
import { normalizeString } from "./residence-helpers/normalizeString/normalizeString";

export const getSearchParams = (): URLSearchParams | undefined => {
  if (!window?.location?.href) {
    return;
  }
  return new URL(window.location.href).searchParams;
};

export const getMapOrigin = async (cityorPostalCode: string): Promise<MapOrigin | undefined> => {
  let outputMapOrigin;
  const geonamesService = new GeonamesService();
  try {
    if (isThisPostalCode(cityorPostalCode.trim()) || cityorPostalCode.trim().length === 3) {
      const response = await geonamesService.searchPostalCode(cityorPostalCode);
      outputMapOrigin = {
        latitude: response.postalCodes[0]?.lat,
        longitude: response.postalCodes[0]?.lng,
        city: response.postalCodes[0]?.placeName,
        province: response.postalCodes[0]?.adminName1,
      };
    } else {
      const response = await geonamesService.searchCity(cityorPostalCode);

      let responseOnlyIncludeCities = response?.geonames?.filter((geoname: any) => {
        const fclName = geoname["fclName"];
        if (fclName) {
          return fclName.includes("city") || fclName.includes("village") || fclName.includes("state") || fclName.includes("region");
        }
      });

      responseOnlyIncludeCities = responseOnlyIncludeCities?.sort((geonameA: any, geonameB: any) => geonameB?.population - geonameA?.population);
      const filterOnParamValue = responseOnlyIncludeCities?.filter((x: any) => {
        if (
          normalizeString(cityorPostalCode).includes(normalizeString(x.name)) &&
          (x.fcode.includes("PPL") || x.fcode === "ADM3" || x.fcode === "ADMD") &&
          (x.adminName1.toLowerCase() === "alberta" || x.adminName1.toLowerCase() === "british columbia" || x.adminName1.toLowerCase() === "quebec" || x.adminName1.toLowerCase() === "ontario")
        ) {
          return x;
        }
      });
      outputMapOrigin = {
        latitude: Number(filterOnParamValue?.[0]?.lat),
        longitude: Number(filterOnParamValue?.[0]?.lng),
        city: filterOnParamValue?.[0]?.name,
        province: filterOnParamValue?.[0]?.adminName1,
      };
    }
  } catch (e) {
    console.error("Error during geonamesService: ", e);
  } finally {
    return outputMapOrigin;
  }
};

export const fetchResidenceByProvinceName = async (inputProvinceName: string, language?: null | string): Promise<Residence[] | undefined> => {
  const allProvinceList = await (await fetch(`/api/v1/province?language=${language}`)).json();
  let targetProvinceId = "";
  allProvinceList.data.map((province: Province) => {
    if (province.value?.toLowerCase() === inputProvinceName?.toLowerCase()) {
      targetProvinceId = province.id;
    }
  });
  if (!targetProvinceId || targetProvinceId === "") {
    return;
  }
  targetProvinceId = transformIdToDashWithCurlyBrackets(targetProvinceId);
  const residenceByProvince = (await (await fetch(`/api/v1/residence?language=${language}&provinceid=${targetProvinceId}`)).json()).data;
  return residenceByProvince;
};

export const fetchItemByIdAndFieldName = async (language: string | undefined, itemid: string, fieldname: string): Promise<any | undefined> => {
  const item = (await (await fetch(`/api/v1/promos?language=${language}&itemid=${itemid}&fieldname=${fieldname}`)).json()).data;
  return (item && item) || "";
};

export const alternateUrl = async (language: string | "en", itemid: string | "", itemName: string | ""): Promise<any | ""> => {
  if (itemid === "" || itemName === undefined || itemName === "404") return;

  const res =
    (await fetch(`/api/v1/alternateUrl?language=${language}&itemid=${itemid}`)
      .then((res) => res.json())
      .then((data) => data)) || "";
  return (res && res?.data?.data) || "";
};

export const fetchBreadCrumbs = async (itemid: string | "", language: string | "en"): Promise<any | ""> => {
  const result =
    (await fetch(`/api/v1/breadcrumb?itemid=${itemid}&language=${language || ""}`)
      .then((res) => res.json())
      .then((data) => data)) || "";
  return (result && result?.data?.results) || "";
};

export const getPropertyNavItems = async (language: string | "", itemid: string | ""): Promise<PropertyHeaderProps | undefined> => {
  const res = await fetch(`/api/v1/propertyheadernav?language=${language}&itemid=${itemid}`);
  const data = await res.json();
  return data || undefined;
};

export const fetchSearchHeader = async (language: string | undefined, searchterm: string): Promise<string | undefined> => {
  const normalizeSearchtermParam = normalizeString(searchterm);

  const fetchSearchHeaderData = await fetch(`/api/v1/headers?language=${language}&searchterm=${normalizeSearchtermParam}`)
    .then((res) => res.json())
    .then((data) => data);

  const searchHeader = fetchSearchHeaderData?.data?.data?.search?.results?.find((x: { field: { value: string } }) => normalizeSearchtermParam.includes(normalizeString(x.field.value)))?.field?.value;

  return searchHeader;
};

export const fetchStaticPageDescendants = async (itemID: string, language?: null | string): Promise<any[] | undefined> => {
  const staticLandingPageDescendants = (await (await fetch(`/api/v1/proviencecitystaticpage?landingPageItemId=${itemID}&language=${language}`)).json()).data?.data;
  return staticLandingPageDescendants;
};

export const sortByDistance = (residenceLocationList: Residence[], mapOrigin: MapOrigin): Residence[] => {
  return residenceLocationList?.sort((residenceA, residenceB) => {
    return (
      calculateDistanceBetweenTwoPoints(Number(residenceA.latitude), Number(residenceA.longitude), mapOrigin.latitude, mapOrigin.longitude) -
      calculateDistanceBetweenTwoPoints(Number(residenceB.latitude), Number(residenceB.longitude), mapOrigin.latitude, mapOrigin.longitude)
    );
  });
};

export const filterByDistance = (residenceList: Residence[], mapOrigin: MapOrigin, maxDistance: number): Residence[] => {
  return residenceList.filter(
    (residence) => calculateDistanceBetweenTwoPoints(Number(residence.latitude), Number(residence.longitude), Number(mapOrigin.latitude), Number(mapOrigin.longitude)) < maxDistance
  );
};

export const filterByCareServices = (residenceLocationList: Residence[], appliedFilters: string, availableCareServices: CareService[]): Residence[] => {
  if (!appliedFilters || appliedFilters === "") {
    return residenceLocationList;
  }

  const careServiceIdToValue: { [key: string]: string } = {};
  availableCareServices.forEach((availableCareService) => {
    careServiceIdToValue[availableCareService.id] = availableCareService.value;
  });
  const appliedFiltersArray = getFilterStringArray(appliedFilters);

  return residenceLocationList.filter((residenceLocation) => {
    if (!residenceLocation.propertyCareServices) {
      return;
    }
    const residenceLocationCareServicesIdsArray = residenceLocation.propertyCareServices.split("|").map((id) => removeNonIntegersFromId(id.trim()));
    const residenceLocationCareServicesValuesArray = residenceLocationCareServicesIdsArray.filter((id) => careServiceIdToValue.hasOwnProperty(id)).map((id) => careServiceIdToValue[id.trim()]);

    const appliedFiltersArraySet = new Set(appliedFiltersArray.map((id) => id.replaceAll("_", " ").replaceAll("-", " ").toLowerCase().trim()));
    const residenceLocationCareServicesValuesArraySet = new Set(residenceLocationCareServicesValuesArray.map((id) => id.replaceAll("_", " ").replaceAll("-", " ").toLowerCase().trim()));
    return getSetIntersection(appliedFiltersArraySet, residenceLocationCareServicesValuesArraySet).size > 0;
  });
};

export const convertCareServiceIdsToValue = (propertyCareServicesField: string, availableCareServices: CareService[]): string => {
  // Ex. propertyCareServicesFields = "{85089944-F847-4A4B-A420-31933D9F4285}|{2A8714CD-1147-400C-9315-3927117DB70E}"
  // Ex. availableCareServices = {id: "E82C154E1F34432AA2D1FCAEAB804523", value: "assisted_living"}
  return propertyCareServicesField
    .split("|")
    .filter((careServiceFieldElement) => {
      return availableCareServices.map((careService) => transformIdToDashWithCurlyBrackets(careService.id.trim())).includes(careServiceFieldElement);
    })
    .map((careServiceFieldElement) => {
      return availableCareServices.filter((careService) => careService.id.trim() === removeNonIntegersFromId(careServiceFieldElement))[0].value;
    })
    .join("|");
};

export const translateProvinceName = (target: string, language: string) => {
  const provinceMap: { [key: string]: { [key: string]: string } } = {
    alberta: { en: "Alberta", fr: "Alberta" },
    "british columbia": { en: "British Columbia", fr: "Colombie-Britannique" },
    "colombie-britannique": { en: "British Columbia", fr: "Colombie-Britannique" },
    "colombie britannique": { en: "British Columbia", fr: "Colombie-Britannique" },
    ontario: { en: "Ontario", fr: "Ontario" },
    quebec: { en: "Quebec", fr: "Québec" },
    québec: { en: "Quebec", fr: "Québec" },
  };

  const province = target.toLowerCase();
  const provinceTranslations = provinceMap[province];
  if (provinceTranslations) {
    return provinceTranslations[language] || target;
  }
  return target;
};

export const getLanguageSpecificCareServiesFromUrlParams = (target: string) => {
  const careServicesMap: { [key: string]: string } = {
    memory_care: "unité_de_soins",
    independent_living: "autonome",
    assisted_living: "semi-autonome",
    seniors_apartments: "appartements",
    long_term_care: "soins_de_longue_durée",
    unité_de_soins: "memory_care",
    autonome: "independent_living",
    "semi-autonome": "assisted_living",
    appartements: "seniors_apartments",
    soins_de_longue_durée: "long_term_care",
  };

  let finalStr = "";
  target.split("|").forEach((careService) => {
    finalStr += `|${careServicesMap[careService] || ""}`;
  });

  return finalStr.substring(1);
};

export const getLanguageSpecificResourceCategoryFromUrlParams = (target: string) => {
  const languageSpecificMap: { [key: string]: string } = {
    "for-you": "pour-moi",
    "pour-moi": "for-you",
    "for-a-loved-one": "pour-un-proche",
    "pour-un-proche": "for-a-loved-one",
  };

  return languageSpecificMap[target]?.replaceAll(" ", "+") || "";
};

export function getFallbackImage(result: any) {
  const regex = /<asset><!\[CDATA\[(.*?)\]\]><\/asset>/;
  const fallbackImage = JSON.parse(result?.jsonValue?.value?.toString().match(regex)?.[1] || "");
  return fallbackImage;
}

/**
 * Filters residences by distance.
 * @param model - The model containing the residences.
 * @param searchTerm - The search term used to filter the residences.
 * @param maxDistance - The maximum distance allowed for a residence to be included.
 * @returns An array of residences filtered by distance.
 */
export const filterResidencesByDistance = async (model: any, searchTerm: string, maxDistance: any) => {
  if (!searchTerm) return;
  const geonamesService = new GeonamesService();

  //avoid API call if postal code is already in the model, take the Lat & Lng from the model and calculate the distance
  const modelPostalCode = model?.filter((residence: any) => normalizeString(residence.postalCode).startsWith(normalizeString(searchTerm))) || [];

  try {
    const { postalCodes } = (!modelPostalCode?.length && (await geonamesService.searchPostalCode(searchTerm))) || { postalCodes: [] };
    if (postalCodes.length === 0 && !modelPostalCode) return;

    const postalCodeLat = parseFloat(postalCodes?.[0]?.lat) || modelPostalCode?.[0]?.Lat;
    const postalCodeLng = parseFloat(postalCodes?.[0]?.lng) || modelPostalCode?.[0]?.Lng;

    const res: any[] = [];
    for (const residence of model) {
      const residenceLat = parseFloat(residence.cityLat);
      const residenceLng = parseFloat(residence.cityLng);
      const distance = haversineDistance(residenceLat, residenceLng, postalCodeLat, postalCodeLng);
      if (distance <= maxDistance) {
        res.push({ ...residence, distance });
      }
    }
    res.sort((a: any, b: any) => a.distance - b.distance);
    return res;
  } catch (error) {
    console.log(error);
    return [];
  }
};
