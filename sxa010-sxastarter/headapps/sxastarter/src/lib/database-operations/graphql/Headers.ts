import { gql } from "graphql-request";
import clientFactory from "lib/graphql-client-factory";

export const GetSearchHeader = async (language: string | undefined, itemid: string | undefined): Promise<any> => {
  const queryParams = {
    language: language,
    searchterm: itemid,
  };

  const query = gql`
    query ($language: String!, $searchterm: String!) {
      search(
        where: {
          name: "_path"
          value: "{CCFAD2D8-211E-4EFE-9011-2D45CF09C4EA}"
          operator: EQ
          AND: [
            {
              name: "_language"
              value: $language
              operator: EQ
              AND: [{ name: "_templates", value: "{F1CBC684-7F3A-4141-B194-BF295C121580}", operator: EQ, AND: [{ name: "_name", value: $searchterm, operator: CONTAINS }] }]
            }
          ]
        }
        first: 50
        orderBy: { name: "_name", direction: ASC }
      ) {
        results {
          field(name: "City Name") {
            value
          }
        }
      }
    }
  `;
  const data: any = await clientFactory({})
    .request(query, queryParams)
    .then((result) => {
      return result;
    });

  return { data };
};
