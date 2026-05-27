import { gql } from "graphql-request";
import clientFactory from "lib/graphql-client-factory";

export const GetCultureSpecificPromos = async (language: string | undefined, itemid: string | undefined, fieldname: string | undefined): Promise<any> => {
  const queryParams = {
    language: language,
    itemid: itemid,
    fieldname: fieldname,
  };

  const query = gql`
    query ($language: String!, $itemid: String!, $fieldname: String!) {
      item(path: $itemid, language: $language) {
        field(name: $fieldname) {
          value
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
