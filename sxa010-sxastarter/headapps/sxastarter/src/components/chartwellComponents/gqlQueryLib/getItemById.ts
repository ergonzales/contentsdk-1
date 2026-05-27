import { gql } from "graphql-request";
import clientFactory from "lib/graphql-client-factory";

interface ItemField {
  name: string;
  jsonValue: any;
}

interface Item {
  id: string;
  name: string;
  fields?: ItemField[];
}

interface GetItemByIdResponse {
  item?: Item;
}

export const getItemById = async (id: string, language: string, ownFields?: boolean): Promise<ItemField[] | undefined> => {
  const queryParams = { id, language, ownFields };
  const query = gql`
    query ($id: String!, $language: String!, $ownFields: Boolean) {
      item(path: $id, language: $language) {
        id(format: "B")
        name
        ... on Item {
          fields(ownFields: $ownFields) {
            name
            jsonValue
          }
        }
      }
    }
  `;
  const data = await clientFactory({}).request<GetItemByIdResponse>(query, queryParams);
  return data?.item?.fields;
};
