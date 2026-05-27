import { gql } from "graphql-request";
import clientFactory from "lib/graphql-client-factory";

export type PropertyPageFooterProps = {
  propertyItemId: string;
  propertyName: string;
  propertyStreetNameAndNumber: string;
  propertyCity: string;
  propertyProvince: string;
  propertyPostalCode: string;
  bookTour: string;
  bookTourLink: string;
  contactNumber: string;
};

export const PropertyPageFooter = async (propertyItemId: string | undefined, templateName: string | undefined): Promise<PropertyPageFooterProps | any> => {
  const propertyPageFooterQuery = gql`
    fragment proprertyPageFooterFields on Item {
      ... on PropertyPage {
        propertyName {
          value
        }
        contactNumber {
          value
        }        
        streetNameAndNumber {
          value
        }
        city {
          targetItems {
            id
            cityName: field(name: "City Name") {
              value
            }
          }
        }
        province {
          targetItems {
            province: field(name: "Province Name") {
              value
            }
          }
        }
        postalCode {
          value
        }
        children(includeTemplateIDs: "{32B39BD7-1D1E-4BCB-944A-0F9F59FA61D7}") {
          results {
            name
            bookTourLink: url {
              url
            }
          }
        }
      }
    }

    query {
      searchResult: search(
        where: {
          name: "_path"
          value: "${propertyItemId}"
          operator: EQ
          AND: { name: "_templates", value: "{8A4FBFEA-94DC-41CF-B6B8-CECA339490B1}", operator: EQ, AND: { name: "_language", value: "en", operator: EQ } }
        }

        # defaults to 10
        first: 15
      ) {
        total
        pageInfo {
          endCursor
          hasNext
        }
        results {
          propertyItemId: id
          ...proprertyPageFooterFields
        }
      }
    }
  `;

  const propertyChildPageFooterQuery = gql`
    fragment proprertyPageFooterFields on Item {
      ... on PropertyPage {
        propertyName {
          value
        }
        contactNumber {
          value
        }         
        streetNameAndNumber {
          value
        }
        city {
          targetItems {
            id
            cityName: field(name: "City Name") {
              value
            }
          }
        }
        province {
          targetItems {
            province: field(name: "Province Name") {
              value
            }
          }
        }
        postalCode {
          value
        }
        children(includeTemplateIDs: "{32B39BD7-1D1E-4BCB-944A-0F9F59FA61D7}") {
          results {
            name
            bookTourLink: url {
              url
            }
          }
        }
      }
    }

    query {
      searchResult: search(
        where: {
          name: "_path"
          value: "${propertyItemId}"
          operator: EQ
          AND: { name: "_templates", value: "{32B39BD7-1D1E-4BCB-944A-0F9F59FA61D7}", operator: EQ, AND: { name: "_language", value: "en", operator: EQ } }
        }

        # defaults to 10
        first: 15
      ) {
        total
        pageInfo {
          endCursor
          hasNext
        }
        results {
          parent {
            propertyItemId: id
            ...proprertyPageFooterFields            
          }
        }
      }
    }  
  `;

  const data: any = await clientFactory({})
    .request(templateName === "PropertyPage" ? propertyPageFooterQuery : propertyChildPageFooterQuery)
    .then((result) => {
      return result;
    });

  if (templateName == "PropertyChildPage") {
    data.searchResult.results = data.searchResult.results.filter((res: any) => {
      return res.parent.hasOwnProperty("children");
    });
  }

  const results: PropertyPageFooterProps = data?.searchResult?.results.map((result: any) => {
    if (result.hasOwnProperty("parent")) {
      result = result.parent;
    }
    return {
      propertyItemId: result?.propertyItemId,
      propertyName: result?.propertyName?.value,
      propertyStreetNameAndNumber: result?.streetNameAndNumber?.value,
      propertyCity: result?.city.targetItems[0].cityName?.value,
      propertyProvince: result?.province.targetItems[0]?.province?.value,
      propertyPostalCode: result?.postalCode?.value,
      bookTour: result?.children.results.filter((t: any) => t.name === "suite-plans")[0].name,
      bookTourLink: result?.children.results.filter((t: any) => t.name === "suite-plans")[0].bookTourLink.url,
      contactNumber: result?.contactNumber?.value,
    };
  });
  return { results };
};

export type PropertyHeaderProps = {
  homePageLink: string;
  propertyLogo: string;
  propertyName: string;
  propertyId: string;
  propertyOverviewLink: string;
  propertyBookaTour: string;
  propertyContactNumber: string;
  propertyChildItems: PropertyChildProps[];
};

export type PropertyChildProps = {
  propertyChildItemId: string;
  propertyChildItemName: string;
  propertyChildItemUrl: string;
  includeInNavigation: string;
};

export const PropertyNavItems = async (contextID: string | undefined, contextTemplateID: string | undefined, contextLanguage: string | undefined): Promise<PropertyHeaderProps | any> => {
  const queryParams = {
    propertyContextID: contextID,
    propertyPageTemplateID: contextTemplateID,
    language: contextLanguage,
  };

  const propertyNavQuery = gql`
    fragment propertyNavigation on Item {
      homePageLink: parent {
        url {
          homePageLinkUrl: path
        }
      }
      language {
        name
      }
      ... on PropertyPage {
        propertyId: id
        propertyName: field(name: "Property Name") {
          value
        }
        propertyLogo: field(name: "Property Logo") {
          value
        }
        propertyOverviewUrl: url {
          path
        }
        contactNumber: field(name: "Contact Number") {
          value
        }
        children(includeTemplateIDs: "{32B39BD7-1D1E-4BCB-944A-0F9F59FA61D7}") {
          propertyNavProps: results {
            propertyNavUrl: url {
              path
            }
            propertyChildItemName: name
            propertyChildItemId: id
            propertyNavTitle: field(name: "Title") {
              value
            }
            includeInNavigation: field(name: "Include in property Navigation") {
              value
            }
          }
        }
      }
    }
    query ($propertyContextID: String!, $propertyPageTemplateID: String!, $language: String!) {
      search(
        where: {
          name: "_path"
          value: $propertyContextID
          operator: EQ
          AND: [{ name: "_templates", value: $propertyPageTemplateID, operator: EQ, AND: { name: "_language", value: $language, operator: EQ } }]
        }
      ) {
        results {
          ...propertyNavigation
        }
      }
    }
  `;

  const data: any = await clientFactory({})
    .request(propertyNavQuery, queryParams)
    .then((result) => {
      return result;
    });

  const results: PropertyHeaderProps = data?.search?.results.map((result: any) => {
    return {
      homePageLink: result?.homePageLink,
      propertyName: result?.propertyName,
      propertyLogo: result?.propertyLogo,
      propertyId: result?.propertyId,
      propertyOverviewUrl: result?.propertyOverviewUrl,
      contactNumber: result?.contactNumber,
      propertyBookaTour: result?.propertyBookaTour,
      propertyChildItems: result?.children.propertyNavProps,
    };
  });
  return { results };
};
