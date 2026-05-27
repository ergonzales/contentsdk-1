import { gql } from "graphql-request";
import clientFactory from "lib/graphql-client-factory";

export const TranslateBlogTag = async (language: string | "en"): Promise<any> => {
  language; // Since we are not using this Language param in the query and to avoid errors on the API call for missing param

  const query = gql`
    query {
      search(
        where: { name: "_templates", value: "{6B40E84C-8785-49FC-8A10-6BCA862FF7EA}", operator: EQ, AND: { name: "_path", value: "{E5C0EFC8-D292-4B25-A9D4-3EDBF759CDF8}", operator: EQ } }
        first: 100
      ) {
        results {
          id
          name
          language {
            name
          }
          displayName
          Title: field(name: "Title") {
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

  return { data };
};
