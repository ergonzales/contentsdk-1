import { gql } from "graphql-request";
import clientFactory from "lib/graphql-client-factory";

export const GetAlternateUrl = async (language: string | undefined, itemid: string | undefined): Promise<any> => {
  const queryParams = {
    language: language,
    itemid: itemid,
    //fieldname: fieldname,
  };

  const query = gql`
    query ($itemid: String!, $language: String!) {
      item(path: $itemid, language: $language) {
        itemId: id
        itemName: name
        itemDisplayName: displayName
        canonicalUrl: field(name: "Canonical") {
          jsonValue
        }
        itemTitle: field(name: "Title") {
          value
        }
        itemNavTitle: field(name: "NavigationTitle") {
          value
        }
        url {
          itemPath: path
          itemFullyQualifiedUrl: url
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
