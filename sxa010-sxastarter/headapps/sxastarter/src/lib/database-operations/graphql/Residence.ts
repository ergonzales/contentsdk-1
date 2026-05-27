import { gql } from "graphql-request";
import { Residence, ResidenceQueryList } from "src/models/Residence";
import clientFactory from "lib/graphql-client-factory";

function getStartingPrice(result: any): number | null {
  const plans = result.propertySuitPlans?.targetItems;
  if (!plans?.length) return null;

  const now = new Date();
  const prices: number[] = [];

  for (const plan of plans) {
    const regular = parseFloat(plan.regularPrice?.value);
    const promo = parseFloat(plan.promoPrice?.value);
    const promoStart = plan.promoStartDate?.jsonValue?.value ? new Date(plan.promoStartDate.jsonValue.value) : null;
    const promoEnd = plan.promoEndDate?.jsonValue?.value ? new Date(plan.promoEndDate.jsonValue.value) : null;

    const promoActive = !isNaN(promo) && promo > 0 && promoStart && promoEnd && now >= promoStart && now <= promoEnd;

    const effectivePrice = promoActive ? promo : regular;

    if (!isNaN(effectivePrice) && effectivePrice > 0) {
      prices.push(effectivePrice);
    }
  }

  return prices.length ? Math.min(...prices) : null;
}

export const getValueFromField = (fields: any[], target: string): any => {
  return fields?.filter((field: any) => field?.name === target)?.[0]?.value;
};

export const getAllResidence = async (provinceId: string, language: string): Promise<Residence[]> => {
  const maxIteration = 1000;
  let cumulativeResults: Residence[] = [];
  let endCursor = "";
  for (let i = 0; i < maxIteration; i++) {
    const currentResults: ResidenceQueryList = await getResidence(provinceId, language, endCursor);
    cumulativeResults = cumulativeResults.concat(currentResults.residenceList);
    endCursor = currentResults.endCursor;

    if (!currentResults.hasNext) {
      break;
    }
  }
  return cumulativeResults;
};

export const getResidence = async (provinceId: string, language: string, endCursorInput?: string): Promise<ResidenceQueryList> => {
  if (!provinceId) {
    return {
      residenceList: [],
      endCursor: "",
      hasNext: false,
    };
  }
  language;

  const query = gql`
    query {
      search(
        where: {
          name: "_path",
          value: "{5D5A7068-7CAD-4BD7-B973-64F3697C0BFD}",
          operator: CONTAINS
          AND: {
            name: "_templates",
            value: "{8A4FBFEA-94DC-41CF-B6B8-CECA339490B1}"
            operator: CONTAINS
            AND:{
              name: "Province"
              value: "${provinceId}"
              operator: EQ
              # AND:{
              #   name: "_language",
              #   value: "en",
              #   operator: EQ
              #   OR:{name: "_language", value: "fr", operator: EQ}
              # }
            }
          }
        }
        first: 160
        after: "${endCursorInput}"
      ) {
        results {
          id
          name
          path
          ... on PropertyPage {
            bilingual{
              value
            }
            language {
              name
            }
            url {
              path
            }
            contactNumber {
              value
            }
            propertyID {
              value
            }
            propertyName {
              value
            }
            navigationTitle {
              value
            }
         livingOption {
  name
  value
  ...on MultilistField {
    targetItems {
      name
      fields {
        name
        value
      }
    }
  }
}
            streetNameAndNumber {
              value
            }
            province {
              value
            }
            postalCode {
              value
            }
            latitude {
              name
              value
            }
            longitude {
              name
              value
            }
            propertySuitPlans: field(name: "Property Suit Plans") {
  ... on MultilistField {
    targetItems {
      id
      regularPrice: field(name: "Regular SuitePrice") {
        value
      }
      promoPrice: field(name: "Promotion Price") {
        value
      }
      promoStartDate: field(name: "Start Date") {
        jsonValue
      }
      promoEndDate: field(name: "End Date") {
        jsonValue
      }
    }
  }
}

            
            careServicesAvailable: field (name: "Care Services Available") {
            value
          }
            city {
              targetItems {
                id
                name
                fields {
                  id
                  name
                  value
                }
              }
            }
            province {
              targetItems {
                name
              }
            }
            thumbnailPhoto{
              jsonValue
            }
            assignedPromotions {
              targetItems {
                id
                fields {
                  value
                  name
                  id
                }
              }
            }
            children {
              results {
                name
                id
                path
                url {
                  path
                }
                fields {
                  name
                  value
                }
              }
            } 
            bookATour{
              ... on MultilistField{
                targetItems{
                  url{
                    path
                  }
                }
              }
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

  const endCursor = data?.search?.pageInfo?.endCursor;
  const hasNext = data?.search?.pageInfo?.hasNext;
  const results: Residence[] = data?.search?.results.map((result: any) => {
    return {
      id: result.id,
      bilingual: result.bilingual.value,
      careServicesAvailable: result.careServicesAvailable?.value,
      language: result.language?.name,
      name: result.name,
      propertyID: result.propertyID.value,
      startingPrice: getStartingPrice(result),
      path: result.path,
      url: result.language?.name === "fr" ? "/fr" + result.url?.path : result.url?.path,
      title: result.navigationTitle?.value,
      imageUrl: result.thumbnailPhoto?.jsonValue.value.src,
      propertyCareServices:
        result.livingOption?.targetItems
          ?.map((item: any) => item.fields?.find((f: any) => f.name === "Value" || f.name === "Title" || f.name === "Living Option Name")?.value ?? item.name)
          .filter(Boolean)
          .join("|") ?? "",
      streetNameAndNumber: result.streetNameAndNumber?.value,
      phone: result.contactNumber?.value,
      city: {
        id: result.city?.targetItems?.[0]?.id,
        name: getValueFromField(result.city?.targetItems?.[0]?.fields, "City Name"),
        latitude: getValueFromField(result.city?.targetItems?.[0]?.fields, "Lat"),
        longitude: getValueFromField(result.city?.targetItems?.[0]?.fields, "Lng"),
      },
      province: result.province?.targetItems?.[0]?.name,
      postalCode: result.postalCode?.value,
      promotions:
        result.assignedPromotions?.targetItems?.length > 0
          ? {
              promoId: result.assignedPromotions?.targetItems.map((item: any) => item.id)?.[0],
              title: result.assignedPromotions?.targetItems.map((item: any) => getValueFromField(item.fields, "Promotion Title"))?.[0],
              startDateTime: result.assignedPromotions?.targetItems.map((item: any) => getValueFromField(item.fields, "StartDate"))?.[0],
              endDateTime: result.assignedPromotions?.targetItems.map((item: any) => getValueFromField(item.fields, "EndDate"))?.[0],
            }
          : null,
      bookATourLink: getBookATourLink(result), //result.bookATour?.targetItems[0]?.url.path || "",
      // result.bilingual.value === "1" && result.language?.name === "fr"
      //   ? result.children?.results?.filter((item: any) => item.name === "planifier-une-visite")?.[0]
      //   : result.children?.results?.filter((item: any) => item.name === "book-a-tour")?.[0],
      latitude: result.latitude?.value,
      longitude: result.longitude?.value,
    };
  });
  return { residenceList: results, endCursor: endCursor, hasNext: hasNext };
};

function getBookATourLink(result: any): any {
  if (!result.bookATour?.targetItems.length) {
    return "";
  }
  if (result.bilingual.value === "1") {
    if (result.language.name === "en") {
      return `${result.url?.path}/book-a-tour`; //result.children?.results?.filter((item: any) => item.name === "book-a-tour")?.[0];
    } else {
      return `/fr${result.url?.path}/planifier-une-visite`; //result.children?.results?.filter((item: any) => item.name === "planifier-une-visite")?.[0];
    }
  } else if (result.language.name === "en") {
    return `${result.url?.path}/book-a-tour`; //result.children?.results?.filter((item: any) => item.name === "book-a-tour")?.[0];
  } else {
    return `/fr${result.url?.path}/planifier-une-visite`; //result.children?.results?.filter((item: any) => item.name === "planifier-une-visite")?.[0];
  }
}
