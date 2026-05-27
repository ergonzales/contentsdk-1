import { gql } from "graphql-request";
import clientFactory from "lib/graphql-client-factory";

export const blogCategories = async (language: string | "en"): Promise<any> => {
  language; // Since we are not using this Language param in the query and to avoid errors on the API call for missing param

  const query = gql`
    query {
      search(
        where: { name: "_templates", value: "{310EC782-59FC-4F51-96E4-658DDADC7DBC}", operator: EQ, AND: { name: "_path", value: "{1E376C67-C946-4092-8783-A52C36AD872A}", operator: EQ } }
        first: 100
      ) {
        results {
          id
          name
          language {
            name
          }
          displayName
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
