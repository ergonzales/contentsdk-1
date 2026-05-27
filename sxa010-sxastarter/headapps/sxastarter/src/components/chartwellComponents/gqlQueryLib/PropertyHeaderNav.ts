import { gql } from "graphql-request";
import clientFactory from "lib/graphql-client-factory";

export const siteSearch = async (searchTerm: string | undefined, language: string | undefined): Promise<any | undefined> => {
  const siteSearchQueryParams = {
    contextSearchTerm: searchTerm,
    contextLanguage: language,
  };

  // {32B39BD7-1D1E-4BCB-944A-0F9F59FA61D7} Property Child Page
  // {EC54E991-9F61-4131-8B8F-5A5B1C02A948} ResourceLandingPage
  // {5D15799F-7E03-41AD-8970-2461290D05A1} ResourceContentPage
  // {4DC22A55-E4CA-4234-B909-2242CA35E62E} BlogArtice
  // {D758E869-8963-42B9-9B3E-809429924F39} Page

  const siteSearchQuery = gql`
    query ($contextSearchTerm: String!, $contextLanguage: String!) {
      search(
        where: {
          AND: [
            { name: "_path", value: "002777A3-0826-4EDE-BBEC-75F81E54E273", operator: CONTAINS }
            { name: "_language", value: $contextLanguage, operator: EQ }
            { name: "_name", value: "thank-you", operator: NEQ }
            { name: "_name", value: "book-a-tour", operator: NEQ }
            {
              OR: [
                { name: "_templates", value: "{32B39BD7-1D1E-4BCB-944A-0F9F59FA61D7}", operator: EQ }
                { name: "_templates", value: "{EC54E991-9F61-4131-8B8F-5A5B1C02A948}", operator: EQ }
                { name: "_templates", value: "{5D15799F-7E03-41AD-8970-2461290D05A1}", operator: EQ }
                { name: "_templates", value: "{4DC22A55-E4CA-4234-B909-2242CA35E62E}", operator: EQ }
                { name: "_templates", value: "{D758E869-8963-42B9-9B3E-809429924F39}", operator: EQ }
              ]
            }
            {
              OR: [
                { name: "Content", value: $contextSearchTerm, operator: CONTAINS }
                { name: "Title", value: $contextSearchTerm, operator: CONTAINS }
                { name: "Description", value: $contextSearchTerm, operator: CONTAINS }
                { name: "PageHeading", value: $contextSearchTerm, operator: CONTAINS }
                { name: "NavigationTitle", value: $contextSearchTerm, operator: CONTAINS }
              ]
            }
          ]
        }
        # defaults to 10
        first: 25
        orderBy: { name: $contextSearchTerm, direction: ASC }
      ) {
        total
        pageInfo {
          endCursor
          hasNext
        }
        results {
          id
          name
          template {
            name
          }
          url {
            url
            path
          }
          name
          Content: field(name: "Content") {
            value
          }
          Title: field(name: "Title") {
            value
          }
          NavTitle: field(name: "NavigationTitle") {
            value
          }
          Description: field(name: "Description") {
            value
          }
          PageHeading: field(name: "Page Heading") {
            value
          }
        }
      }
    }
  `;
  const data: any = await clientFactory({})
    .request(siteSearchQuery, siteSearchQueryParams)
    .then((result) => {
      return result;
    });

  return data;
};
