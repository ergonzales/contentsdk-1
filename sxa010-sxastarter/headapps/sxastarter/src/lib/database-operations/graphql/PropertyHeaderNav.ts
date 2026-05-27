import { gql } from "graphql-request";
import { PropertyHeaderProps } from "src/models/PropertyHeaderNav";
import clientFactory from "lib/graphql-client-factory";

export const PropertyNavItems = async (language: string | undefined, itemid: string | undefined): Promise<PropertyHeaderProps> => {
  const queryParams = {
    itemid,
    language,
  };

  const propertyNavQuery = gql`
    query PropertyNavItems($itemid: String!, $language: String!) {
      propertyPageFields: item(path: $itemid, language: $language) {
        url {
          contextItemPath: path
          contextItemFullyQualifiedUrl: url
        }
        contextItemDisplayName: displayName
        contextItemTemplateName: template {
          name
        }
        ...propertyPageFields
        ancestors(hasLayout: true, includeTemplateIDs: ["{8A4FBFEA-94DC-41CF-B6B8-CECA339490B1}"]) {
          ...propertyPageFields
        }
      }
    }

    fragment propertyPageFields on PropertyPage {
      propertyId: propertyID {
        value
      }
      propertyName: propertyName {
        value
      }
      propertyHomePage: url {
        path
      }
      propertyId: propertyID {
        value
      }
      propertyLogo: propertyLogo {
        jsonValue
      }
      livingOption {
        jsonValue
      }
      subNavigationItems {
        jsonValue
      }
      bookATour: bookATour {
        jsonValue
      }
      propertyContactNumber: contactNumber {
        value
      }
      bilingual {
        boolValue
      }
    }
  `;

  const propertyPageFields: any = await clientFactory({})
    .request(propertyNavQuery, queryParams)
    .then((result) => {
      return result;
    });
  const contextTemplate = propertyPageFields?.contextItemTemplateName?.name;

  const getPropertyFieldValue = (field: string, isPropertyPage: boolean) => {
    if (isPropertyPage) {
      return propertyPageFields?.[field];
    } else {
      return propertyPageFields?.ancestors[0]?.[field];
    }
  };

  const propertyHeaderProps: PropertyHeaderProps = {
    homePageLink: "/",
    propertyName: getPropertyFieldValue("propertyName", contextTemplate === "PropertyPage")?.value,
    propertyLogo: getPropertyFieldValue("propertyLogo", contextTemplate === "PropertyPage")?.jsonValue,
    propertyId: getPropertyFieldValue("propertyId", contextTemplate === "PropertyPage")?.value,
    propertyOverviewLink: getPropertyFieldValue("propertyHomePage", contextTemplate === "PropertyPage")?.path,
    propertyContactNumber: getPropertyFieldValue("propertyContactNumber", contextTemplate === "PropertyPage")?.value,
    propertyLivingOptions: getPropertyFieldValue("livingOption", contextTemplate === "PropertyPage")?.jsonValue,
    propertyBookaTour: getPropertyFieldValue("bookATour", contextTemplate === "PropertyPage")?.jsonValue,
    propertySubNavItems: getPropertyFieldValue("subNavigationItems", contextTemplate === "PropertyPage")?.jsonValue,
    bilingual: getPropertyFieldValue("bilingual", contextTemplate === "PropertyPage")?.boolValue,
    residence: "",
    //propertyAddress: getPropertyFieldValue("address", contextTemplate === "PropertyPage")?.value,
  };

  return propertyHeaderProps;
};
