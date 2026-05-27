import { gql } from "graphql-request";
import { Province, ProvinceQueryResult } from "src/models/Province";
import clientFactory from "lib/graphql-client-factory";

export const getAllProvince = async (language: string): Promise<Province[]> => {
  const maxIteration = 1000;
  let cumulativeResults: Province[] = [];
  let endCursor = "";
  for (let i = 0; i < maxIteration; i++) {
    const currentResults: ProvinceQueryResult = await getProvince(language, endCursor);
    cumulativeResults = cumulativeResults.concat(currentResults.provinceList);
    endCursor = currentResults.endCursor;

    if (!currentResults.hasNext) {
      break;
    }
  }
  return cumulativeResults;
};

export const getProvince = async (language: string, endCursorInput?: string): Promise<ProvinceQueryResult> => {
  const query = gql`
    query {
      searchResult: search(
        where: {
          name: "_path"
          value: "{005FA961-EDA6-4C2F-A35D-7F771BF36E61}"
          operator: CONTAINS
          AND: {
            name: "_templates"
            value: "{B48E8F9F-B5F9-48C4-9682-F5A12EE7A67E}"
            operator: EQ
            AND: { name: "_language", value: "${language}", operator: ${language != "null" ? "CONTAINS" : "NEQ"} }
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
  const results: Province[] = data?.searchResult?.results.map((result: any) => {
    if (result?.fields?.filter((field: any) => field?.name === "Province Name").length > 0) {
      return {
        id: result.id,
        value: result?.fields?.filter((field: any) => field?.name === "Province Name")[0]?.value,
      };
    } else return;
  });

  return { provinceList: results, endCursor: endCursor, hasNext: hasNext };
};
