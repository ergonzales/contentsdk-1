import { gql } from "graphql-request";
import clientFactory from "lib/graphql-client-factory";

export const getResidencesByName = async (searchQuery?: string): Promise<any> => {
  const query = gql`
    query {
      search(
        where: {
          name: "_templates"
          value: "{8A4FBFEA-94DC-41CF-B6B8-CECA339490B1}"
          operator: EQ
          AND: [
            {
              name: "_path",
              value: "{5D5A7068-7CAD-4BD7-B973-64F3697C0BFD}",
              operator: CONTAINS,
              AND: [
                {
                  name: "_name",
                  value: "${searchQuery}",
                  operator: CONTAINS
                }
              ]
            }
          ]
        }
        first: 30
        orderBy: { name: "name", direction: ASC }
      ) {
        total
        results {
          id
          name
          path
          ... on PropertyPage {
            language {
              name
            }
            navigationTitle {
              value
            }
            url {
              path
            }
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

  return { data: data };
};
