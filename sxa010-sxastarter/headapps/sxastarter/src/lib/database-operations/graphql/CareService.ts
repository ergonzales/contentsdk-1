import { gql } from "graphql-request";
import { CareService, CareServiceQueryResult } from "src/models/CareService";
import clientFactory from "lib/graphql-client-factory";

export const getValueFromField = (fields: any[], target: string): any => {
  return fields?.filter((field: any) => field?.name === target)?.[0]?.value;
};

export const getAllCareServices = async (language: string): Promise<CareService[]> => {
  const maxIteration = 1000;
  let cumulativeResults: CareService[] = [];
  let endCursor = "";
  for (let i = 0; i < maxIteration; i++) {
    const currentResults: CareServiceQueryResult = await getCareService(language, endCursor);
    cumulativeResults = cumulativeResults.concat(currentResults.careServiceList);
    endCursor = currentResults.endCursor;

    if (!currentResults.hasNext) {
      break;
    }
  }
  return cumulativeResults;
};

export const getCareService = async (language: string, endCursorInput?: string): Promise<CareServiceQueryResult> => {
  const query = gql`
    query {
      search(
        where: {
          name: "_path"
          value: "{C684C63A-F87E-47A3-B91D-1A9E523C46C5}"
          operator: EQ
          AND: [
            {
              name: "_templates"
              value: "{0A7AA373-5ED1-4E9B-9678-22D3C5FAF6DF}"
              operator: EQ
              AND: { name: "_language", value: "${language}", operator: EQ }
            }
          ]
        }
        first: 40
        after: "${endCursorInput}"
      ) {
        results {
          id
          name
          fields {
            id
            name
            value
          }
        }
        pageInfo {
          endCursor
          hasNext
        }
        total
      }
    }
  `;
  const data: any = await clientFactory({})
    .request(query)
    .then((result) => {
      return result;
    });

  const endCursor = data?.search?.pageInfo?.endCursor;
  const hasNext = data?.search?.pageInfo?.hasNext;
  const results: CareService[] = data?.search?.results.map((result: any) => {
    return {
      id: result.id,
      name: result.name?.toLowerCase(),
      value: getValueFromField(result.fields, "Care Service").replaceAll(" ", "_").toLowerCase(),
      description: getValueFromField(result.fields, "Care Service Description"),
      legacyId: getValueFromField(result.fields, "Legacy ID"),
    };
  });
  return { careServiceList: results, endCursor: endCursor, hasNext: hasNext };
};

export const getCareServicesForProvince = async (provinceAcronym: string, language: string): Promise<CareService[]> => {
  const allCareServices = await getAllCareServices(language);

  if (!provinceAcronym || provinceAcronym === "") {
    return allCareServices;
  }

  const careServicesForProvince = allCareServices.filter(
    // care service names are prefixed with province acronym. E. on-memory-care
    (careService) => careService.name.split("-")?.[0]?.toLowerCase() === provinceAcronym.toLowerCase()
  );
  return careServicesForProvince;
};
