import { gql } from "graphql-request";
import { getFallbackImage } from "lib/helpers/search-helpers";

import { Resource, ResourceQueryList } from "src/models/ResourceCard";
import clientFactory from "lib/graphql-client-factory";
import { transformIdToDashWithCurlyBrackets } from "lib/helpers/utils/transform-id";

export const getValueFromField = (fields: any[], target: string): any => {
  return fields?.filter((field: any) => field?.name === target)?.[0]?.value;
};

export const getCategoryIdByName = async (categoryName: string, language: string): Promise<string | null> => {
  const query = gql`
    query SearchQuery($pageSize: Int = 100) {
      search(
        where: {
          AND: [
            { name: "_path", value: "{D83B4075-2440-450F-8EA6-C53F5BF85FC7}", operator: CONTAINS }
            { name: "_templates", value: "{6739302B-6464-4B5C-A5F2-A447BD874CB5}", operator: EQ }
            { name: "name", value: "${categoryName}", operator: CONTAINS }
            { name: "_language", value: "${language}" }
          ]
        }
        first: $pageSize
        orderBy: { name: "createAt", direction: DESC }
      ) {
        total
        results {
          id
          name
          language {
            name
          }
          fields {
            name
            value
          }
          ... on ResourceCard {
            category {
              targetItems {
                id
                name
              }
            }
          }
        }
        total
      }
    }
  `;

  const variables = {
    language: language,
  };

  const data: any = await clientFactory({})
    .request(query, variables)
    .then((result) => {
      return result;
    });
  const categoryItem = data.search.results?.find((result: any) => result.fields?.find((field: any) => field.name === "name")?.value?.toLowerCase() === categoryName?.toLowerCase());
  if (!categoryItem) {
    return null;
  }
  return transformIdToDashWithCurlyBrackets(categoryItem.id);
};

export const getAllResourceCards = async (language: string): Promise<Resource[]> => {
  const maxIteration = 1000;
  let cumulativeResults: Resource[] = [];
  let endCursor = "";
  const personalizedCategory = "";
  for (let i = 0; i < maxIteration; i++) {
    const currentResults: ResourceQueryList = await getResourceCards(language, endCursor, personalizedCategory);
    cumulativeResults = cumulativeResults.concat(currentResults.resourceList);
    endCursor = currentResults.endCursor;

    if (!currentResults.hasNext) {
      break;
    }
  }
  return cumulativeResults;
};

export const getResourceCards = async (language: string, endCursorInput?: string, personalizedCategory?: string, category?: string): Promise<ResourceQueryList> => {
  const categoryId = await getCategoryIdByName(category?.replaceAll("%20", " ").replaceAll("+", "") || "", language);

  const query = gql`
    query SearchQuery(
      $pageSize: Int = 89
      $language: String = "${language}"
      $orderDirection: OrderByDirection = DESC
      $category: String = "${categoryId}"
      $personalizationCategory: String = "${personalizedCategory}"
      $endCursorInput: String = ""
    ) {
      search(
        where: {
          AND: [
            { name: "_path", value: "{F9B41832-34F0-4BCE-B728-9A6A6555D7F3}", operator: CONTAINS }
            {
              # Item based on Folder template, e.g., Page Components
              name: "_templates"
              value: "{6D7F73F7-E7D3-4C42-B364-D27D9B84B989}"
              operator: NCONTAINS
            }
            { name: "_language", value: $language }
            { name: "category", value: $category, operator: ${category != "null" ? "CONTAINS" : "NEQ"}  }
            { name: "personalizationCategory", value: $personalizationCategory, operator: ${personalizedCategory != "null" ? "CONTAINS" : "NEQ"} }
          ]
        }
        first: $pageSize
        after: $endCursorInput
        orderBy: { name: "createAt", direction: $orderDirection }
      ) {
        total
        results {
          id
          name
          path

          url {
            path
            url
          }
          ... on ResourceCard {
            body {
              value
            }
            title {
              value
            }
            subtitle {
              value
            }
            linkToResource {
              jsonValue
              ... on LinkField {
                url
                text
              }
            }
            mediaForResource {
              ... on ImageField {
                src
                description
              }
            }

            backgroundImage {
              jsonValue
            }
            isFeatured {
              value
            }
            category {
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
            resourceCardCategory:category {
              targetItems {
                field(name: "Name"){
                  value
                }
              }
            }

            personalizationCategory {
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

  const variables = {
    language: language,
    endCursorInput: endCursorInput ?? "",
  };

  const data: any = await clientFactory({})
    .request(query, variables)
    .then((result) => {
      return result;
    });
  const endCursor = data?.search?.pageInfo?.endCursor;
  const hasNext = data?.search?.pageInfo?.hasNext;

  const results: Resource[] = data?.search?.results.map((result: Resource) => {
    return {
      id: result.id,
      name: result.name,
      category: result.category,
      personalizationCategory: result.personalizationCategory,
      isFeatured: result.isFeatured,
      linkToResource: result.linkToResource,
      mediaForResource: result.mediaForResource,
      title: result.title,
      subtitle: result.subtitle,
      body: result.body,
      backgroundImage: result.backgroundImage?.jsonValue?.value?.src ? result.backgroundImage : getFallbackImage(result.backgroundImage),
      resourceCardCategory: result.resourceCardCategory,
    };
  });

  return { resourceList: results, endCursor: endCursor, hasNext: hasNext };
};
