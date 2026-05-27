import { gql } from "graphql-request";
import { City, CityQueryResult } from "src/models/City";
import clientFactory from "lib/graphql-client-factory";

export const getAllCity = async (language: string): Promise<City[]> => {
  const maxIteration = 1000;
  let cumulativeResults: City[] = [];
  let endCursor = "";
  for (let i = 0; i < maxIteration; i++) {
    const currentResults: CityQueryResult = await getCity(language, endCursor);
    cumulativeResults = cumulativeResults.concat(currentResults.cityList);
    endCursor = currentResults.endCursor;

    if (!currentResults.hasNext) {
      break;
    }
  }
  return cumulativeResults;
};

export const getCity = async (language: string, endCursorInput?: string): Promise<CityQueryResult> => {
  const query = gql`
  query {
    searchResult: search(
      where: {
        name: "_path"
        value: "{CCFAD2D8-211E-4EFE-9011-2D45CF09C4EA}"
        operator: EQ
        AND: {
          name: "_templates"
          value: "{F1CBC684-7F3A-4141-B194-BF295C121580}"
          operator: EQ
          AND: { name: "_language", value: "${language}", operator: EQ }
        }
      }
      # defaults to 10
      first: 30
      after: "${endCursorInput}"
    ) {
      total
      pageInfo {
        endCursor
        hasNext
      }
      results {
        id
        name
        fields {
          name
          value
        }
      }
    }
  }
  `;

  const data: any = await clientFactory({})
    .request(query)
    .then((result) => {
      return result;
    });

  const endCursor = data?.searchResult?.pageInfo?.endCursor;
  const hasNext = data?.searchResult?.pageInfo?.hasNext;
  const results = data?.searchResult?.results.map((result: any) => {
    return {
      id: result.id,
      value: result?.fields?.filter((field: any) => field?.name === "City Name")[0]?.value,
      latitude: result?.fields?.filter((field: any) => field?.name === "Lat")[0]?.value,
      longitude: result?.fields?.filter((field: any) => field?.name === "Lng")[0]?.value,
    };
  });

  return { cityList: results, endCursor: endCursor, hasNext: hasNext };
};

export const getCityById = async (language: string | undefined, cityId: string): Promise<any> => {
  const query = gql`
    query {
      item(path: "${cityId}", language: "${language}") {
        cityName: field(name: "City Name") {
          value
        }
      }
    }
  `;
  const data: any = await clientFactory({})
    .request(query)
    .then((result) => {
      return result;
    });

  const results = data.item;
  return { results };
};
