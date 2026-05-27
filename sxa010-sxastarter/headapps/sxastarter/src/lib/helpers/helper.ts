
import { getLanguageSpecificCareServiesFromUrlParams, getLanguageSpecificResourceCategoryFromUrlParams, translateProvinceName } from "./search-helpers";
import { GeonamesService } from "lib/geonames-service";
import { Resources } from "src/models/ResourceCard";
import { checkIsItPromo } from "./utils/checkIsItPromo";
import { getPropertyReviewsData } from "lib/utils/propertyReviewsData";
import { getSuitePlansSchemaArr } from "./googleSchemaMarkup/googleSchemaMarkup";
import type { SitecoreContextValue } from "lib/sitecore/types";

// Checks if the anchor property exists in the TextOnlyBlock's consolidatedCta field
export function hasAnchorInTextOnlyBlock(textOnlyBlock: any): any {
  return textOnlyBlock?.fields?.data?.textOnlyBlock?.consolidatedCta?.jsonValue?.value;
}

export const uniqueByProperty = (data: any[], targetProperty: string): any => {
  const seen = new Set();
  const uniqueData = data.filter((item) => {
    const duplicate = seen.has(item[targetProperty]);
    seen.add(item[targetProperty]);
    return !duplicate;
  });

  return uniqueData;
};

export const getSetIntersection = (setA: Set<any>, setB: Set<any>): any => {
  return new Set([...setA].filter((i) => setB.has(i)));
};

export const pieceWiseCapitalize = (str: string | null): string | null => {
  if (!str || str === "") {
    return null;
  }

  return str
    .split(" ")
    .map((piece) => piece.charAt(0).toUpperCase() + piece.slice(1))
    .join(" ");
};

export const toTitleCase = (str: any): any => {
  return str?.replace(/\w\S*/g, function (txt: string) {
    return txt?.charAt(0)?.toUpperCase() + txt?.substring(1)?.toLowerCase();
  });
};

export const linkValueToLinkField = (linkValue: string): any => {
  if (!linkValue || linkValue === "") {
    return;
  }

  // the input string
  const text = linkValue.replaceAll("<link", "").replaceAll("/>", "").trim();

  // create an object to store the key-value pairs
  const obj: { [key: string]: string } = {};

  // create a regular expression pattern to match the key and its associated value
  const pattern = /(\w+)="([^"]*)"/g;

  // search for all matches in the input string
  let match;
  while ((match = pattern.exec(text))) {
    const key = match[1];
    const value = match[2];
    obj[key] = value;
  }

  return obj;
};

export const sitecoreDateTimeToDate = (dateString: string): Date | null => {
  if (!dateString) {
    return null;
  }

  const year = parseInt(dateString.substring(0, 4), 10);
  const month = parseInt(dateString.substring(4, 2), 10) - 1;
  const day = parseInt(dateString.substring(6, 2), 10);
  const hour = parseInt(dateString.substring(9, 2), 10);
  const minute = parseInt(dateString.substring(11, 2), 10);
  const second = parseInt(dateString.substring(13, 2), 10);
  return new Date(year, month, day, hour, minute, second);
};

export const removeSitecoreFromPath = (path: string, splitter: string) => {
  // example input path: /sitecore/content/sxastarter/sxastarter/chartwell anne hathaway retirement residence
  // example input splitter: 'sxastarter'
  // example output: /chartwell anne hathaway retirement residence

  const pathArray = path.split(splitter);
  return pathArray.slice(pathArray.length - 1)?.[0].replace("home/", "");
};

export const quebecTreatment = (inputString: string) => {
  let modifiedString = "";
  let lastEnIndex = -1;

  for (let i = 0; i < inputString.length; i++) {
    if (inputString.substring(i, 3) === " en") {
      lastEnIndex = i;
    }

    modifiedString += inputString[i];

    if ((inputString.substring(i, 6).toLowerCase() === "quebec" || inputString.substring(i, 6).toLowerCase() === "québec") && lastEnIndex !== -1) {
      modifiedString = modifiedString.substring(0, lastEnIndex) + " au" + modifiedString.substring(lastEnIndex + 3);
      lastEnIndex = -1;
    }
  }

  return modifiedString;
};

function isFirstLetterCapitalized(str: string) {
  if (!str) {
    return;
  }
  // Check if the first letter is the same when converted to uppercase and lowercase
  return str.charAt(0) === str.charAt(0).toUpperCase();
}

export const i18nQuebec = (inputString: string, language: string) => {
  if (!inputString) {
    return inputString;
  }

  const isCapitalized = isFirstLetterCapitalized(inputString);

  const validInput = ["quebec", "québec"];
  if (!validInput.includes(inputString.toLowerCase())) {
    return inputString;
  }

  if (language === "fr") {
    return isCapitalized ? "Québec" : "québec";
  }

  return isCapitalized ? "Quebec" : "quebec";
};

export const filterArrayByDuplicateKeyWithPriorityLanguage = (array: any | any[], key: string, priorityLanguage?: string) => {
  const uniqueValues = new Map();
  const filteredArray: any[] = [];

  array.forEach(function (item: { [x: string]: any }) {
    const value = item[key];
    const language = item["language"];

    if (!uniqueValues.has(value)) {
      uniqueValues.set(value, item);
    } else {
      const existingItem = uniqueValues.get(value);

      if (language === priorityLanguage && existingItem["language"] !== priorityLanguage) {
        uniqueValues.set(value, item);
      }
    }
  });

  uniqueValues.forEach(function (item) {
    filteredArray.push(item);
  });

  return filteredArray;
};

export function generateFinalUrl(setLanguageToggle: any, province: any, careservices: any, qs: any) {
  return (target: string) => {
    if (!target) return "";
    switch (true) {
      case target.includes("province") || target.includes("careservices"):
        return target
          .replace(`${province?.toString().replace(" ", "+") || ""}`, translateProvinceName(`${province?.toString().replace("+", " ") || ""}`, setLanguageToggle || "").toLowerCase())
          .replace(careservices?.toString() || "", getLanguageSpecificCareServiesFromUrlParams(careservices?.toString() || ""));
      case target.includes("qs"):
        return target.replace(qs?.toString() || "", getLanguageSpecificResourceCategoryFromUrlParams(qs?.toString() || ""));
      default:
        return target;
    }
  };
}

export function isPageBilingual(contextItem: any): boolean {
  const { datasource } = contextItem || {};
  if (datasource?.isPageBilingual === null || datasource?.isPageBilingual === undefined) {
    if (!datasource?.ancestors || datasource?.ancestors?.find((ancestor: any) => ancestor?.isPageBilingual) === undefined) {
      return true;
    } else {
      return datasource?.ancestors?.find((ancestor: any) => ancestor?.isPageBilingual)?.isPageBilingual?.boolValue;
    }
  } else {
    return contextItem?.datasource?.isPageBilingual?.boolValue;
  }
}

export function generateHref(sitecoreContext: SitecoreContextValue) {
  return Boolean(sitecoreContext.route?.placeholders["headless-main"]?.filter((component: any) => component.componentName === "EloquaForm" || component.componentName === "BYOCComponent").length);
}

export const getLocationAndPostalCode = async (router: any): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          if (position) {
            const searchUrl = await convertLatLngToPostalCode(position.coords.latitude, position.coords.longitude, router);
            resolve(searchUrl);
          }
        },
        () => {
          const searchUrl = router.locale === "fr" ? `/trouver-une-residence` : `/find-a-residence`;
          resolve(searchUrl);
        },
        { enableHighAccuracy: true, timeout: 60000, maximumAge: 0 }
      );
    } else {
      reject("Geolocation is not supported by this browser.");
    }
  });
};

export async function convertLatLngToPostalCode(latitude: number, longitude: number, router: any) {
  const findAResidencePath = router.locale === "fr" ? `/trouver-une-residence` : `/find-a-residence`;
  try {
    if (latitude && longitude) {
      const geonamesService = new GeonamesService();
      const data = await geonamesService.searchPostalCodeByLatLang(latitude, longitude);

      if (data.postalCodes && data.postalCodes.length > 0) {
        const postalCode = data.postalCodes[0].postalCode.toLowerCase();
        return (router.locale === "fr" ? `/trouver-une-residence?postalCode=${postalCode}` : `/find-a-residence?postalCode=${postalCode}`) as string;
      } else {
        return findAResidencePath;
      }
    } else {
      return findAResidencePath;
    }
  } catch (error: any) {
    return findAResidencePath;
  }
}

export async function convertGeoLocationCoordsToPostalCode(coords: any) {
  try {
    if (coords) {
      const geonamesService = new GeonamesService();
      const data = await geonamesService.searchPostalCodeByLatLang(coords.latitude, coords.longitude);
      if (data.postalCodes && data.postalCodes.length > 0) {
        return (data.postalCodes[0].postalCode.toLowerCase() as string) || "";
      }
    }
  } catch (error: any) {
    return console.log("Error during fetching postal code:", error);
  }
}

export function getSearchUrl(setOpenMobile: any, router: any): React.MouseEventHandler<HTMLButtonElement> | undefined {
  return async () => {
    setOpenMobile(false);
    const location = await getLocationAndPostalCode(router);
    const url = location && `${location}`;
    router.push(url, undefined, { locale: router.locale });
  };
}

export function footerCtaButton(item: any): any {
  return {
    url: { path: item?.url },
    name: item?.name,
    displayName: item?.displayName,
    field: { value: item?.fields?.NavigationTitle?.value?.toUpperCase() },
  };
}

export const addEventListeners = (element: HTMLElement, hoverColor: string, originalColor: string, province: any, provinceListToLinkField: any, router: any) => {
  const addCursorPointerClass = (element: any) => {
    element.classList.add("cursor-pointer");
  };

  element.addEventListener("mouseover", () => {
    element.classList.remove(...element.classList);
    element.classList.add(hoverColor);
    addCursorPointerClass(element);
  });
  element.addEventListener("mouseout", () => {
    element.classList.remove(...element.classList);
    element.classList.add(originalColor);
  });
  element.addEventListener("click", () => {
    const link = `${router.locale === "fr" ? `/${router.locale}` : ""}${provinceListToLinkField[province]?.value?.href}`;
    const anchorTag = document.createElement("a");
    anchorTag.href = link;
    anchorTag.click();
  });
};

export function convertStrTocamelCase(target: any) {
  // Step 1: Convert to lowercase
  const lowerCaseName = target.toLowerCase();

  // Step 2: Convert first letter of each word except the first word to uppercase
  const camelCaseName = lowerCaseName
    .split(" ")
    .map((word: any, index: any) => (index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)))
    .join("");

  // Step 3: Return the camelCase name
  return camelCaseName;
}

export function commonCareOptionsOnLandingPage(residencesByProvince: any, commonCareOptions: any) {
  const optionIdCounts: { [key: string]: number } = {};
  const optionIdCountsArray = residencesByProvince
    .flatMap((res: any) => res.livingOption?.targetItems || [])
    .reduce((counts: { [key: string]: number }, option: any) => {
      const optionId = option.id;
      counts[optionId] = (counts[optionId] || 0) + 1;
      return counts;
    }, optionIdCounts);
  return Object.entries(optionIdCountsArray)?.map((x: any) => {
    const option = commonCareOptions.find((option: any) => option.id === x[0]);
    return { ...option, count: x[1] };
  });
}

/**
 * Retrieves unique categories from a list of resources and sorts them by category sort order.
 *
 * @param resourceList - An array of resources to extract categories from.
 * @param props - Additional properties that may contain context path information.
 * @returns An array of unique categories, sorted by category sort order.
 */
export const getUniqueCategories = (resourceCategories: any, props: any): any[] => {
  const categories = (resourceCategories ?? [])
    .map((category: any) => ({
      displayName: category?.displayName,
      categoryName: category?.categoryName,
      categoryUrl: category?.categoryUrl?.url,
      categoryHoverImage: category?.categoryHoverImage?.jsonValue?.value,
      categoryImage: category?.categoryImage?.jsonValue?.value,
      categorySortOrder: category?.categorySortOrder?.value,
      contextPath: props?.fields?.data?.ci?.contextUrl?.path,
      contextId: props?.fields?.data?.ci?.contextCategory?.value.replaceAll("-", "").replace("{", "").replace("}", "").toUpperCase(),
    }))
    .filter(Boolean);

  return categories.sort((a: any, b: any) => a.categorySortOrder - b.categorySortOrder);
};

/**
 * Extracts unique personalization categories from a list of resources.
 *
 * @param resourceList - An array of resources to extract personalization categories from.
 * @returns An array of unique personalization categories, each containing a display name and field value.
 */
export const getUniquePersonalizationCategories = (personalizationCategory: any): any[] => {
  const categories = (personalizationCategory ?? [])
    .flatMap((resource: any) =>
      resource.personalizationCategory?.targetItems?.map((item: any) => ({
        displayName: item.displayName,
        fieldValue: item.field.value,
      }))
    )
    .filter(Boolean);

  return Array.from(new Set(categories.map((item: any) => JSON.stringify(item)))).map((item: any) => JSON.parse(item));
};

export const getPersonalizationCategories = (personalizationCategory: any): any[] => {
  const categories = personalizationCategory
    ?.map((resource: any) => ({
      displayName: resource?.displayName,
      fieldValue: resource?.personalizationCategory?.value,
    }))
    .filter(Boolean);
  return Array.from(new Set(categories?.map((item: any) => JSON.stringify(item)))).map((item: any) => JSON.parse(item));
};

/**
 * Filters a list of resources by a specific category ID.
 *
 * @param resourceList - The list of resources to filter.
 * @param categoryId - The ID of the category to filter by.
 * @returns A list of resources that belong to the specified category.
 */
export const filterResourceListByCategory = (resourceList: Resources[], categoryId: string): Resources[] => {
  return resourceList.filter((resource) => resource.category?.some((cat: any) => cat.id.replaceAll("-", "").toUpperCase() === categoryId));
};

/**
 * Filters a list of resources by a given personalization category display name.
 *
 * @param resourceList - The list of resources to filter.
 * @param displayName - The display name of the personalization category to filter by.
 * @returns A filtered list of resources that match the given personalization category display name.
 */
export const filterResourceListByPersonalizationCategory = (resourceList: Resources[], displayName: string): Resources[] => {
  return resourceList.filter((resource) => resource.personalizationCategory?.some((item) => item.displayName === displayName));
};

/**
 * Sorts a list of resources by their creation date in descending order.
 *
 * @param resourceList - The list of resources to be sorted.
 * @returns The sorted list of resources.
 */
export const sortResourceListByDate = (resourceList: Resources[]): Resources[] => {
  return resourceList.sort((a, b) => {
    const dateA = new Date(a.createAt ?? 0);
    const dateB = new Date(b.createAt ?? 0);
    return dateB.getTime() - dateA.getTime();
  });
};

/**
 * Transforms a list of test resources into a structured format.
 *
 * @param {Resources[]} transformResources - The list of test resources to transform.
 * @returns {Array} The transformed list of resources.
 */
export const transformResources = (resourceList: Resources[]): Array<any> => {
  // const testResourcesList = (sitecoreContext.route?.placeholders["headless-main"]?.find((item: any) => item.componentName === "PropertyReviewsTest") as any)?.fields?.data?.ds?.children?.results;

  return resourceList?.map((item: Resources) => {
    return {
      resourceCardId: item?.resourceCardId,
      title: item?.resourceCard?.find((item: any) => item.name === "title")?.jsonValue?.value,
      body: item?.resourceCard?.find((item: any) => item.name === "body")?.jsonValue?.value,
      category: item?.resourceCard?.find((item: any) => item.name === "category")?.jsonValue,
      personalizationCategory: item?.resourceCard?.find((item: any) => item.name === "personalizationCategory")?.jsonValue,
      mediaForResource: item?.resourceCard?.find((item: any) => item.name === "mediaForResource")?.jsonValue,
      linkToResource: item?.resourceCard?.find((item: any) => item.name === "linkToResource")?.jsonValue,
      backgroundImage: item?.resourceCard?.find((item: any) => item.name === "backgroundImage")?.jsonValue,
      subTitle: item?.resourceCard?.find((item: any) => item.name === "Subtitle")?.jsonValue,
      // featured: item?.resourceCard?.find((item: any) => item.name === "isFeatured")?.jsonValue?.value as boolean,
      createAt: item?.resourceCard?.find((item: any) => item.name === "createAt")?.jsonValue?.value,
    };
  });
};

/**
 * Extracts the last part of a string after the last '/'.
 * @param path - The input string.
 * @returns The last part of the string.
 */
export const extractLastPart = (path: string): string => {
  if (!path) return "";
  const parts = path.split("/");
  return parts[parts.length - 1];
};

export const fetchItemById = async (id: string, language: string, ownFields?: boolean): Promise<any | null> => {
  if (!id || !language) {
    console.error("Missing required parameters: id or language");
    return null;
  }
  try {
    const url = `/api/v1/getItemById?id=${id}&language=${language}` + (ownFields !== undefined ? `&ownFields=${ownFields}` : "");
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error fetching item: ${response.statusText}`);
    }
    const data = await response.json();
    if (!data) {
      console.error("No data returned from API");
      return null;
    }
    return data;
  } catch (error) {
    console.error("Failed to fetch item by ID:", error);
    return null;
  } finally {
    console.log("fetchItemById operation completed.");
  }
};
// Helper to recursively find the first non-empty value for a given key in a nested object/array structure
export function findNestedValue(obj: any, key: string): string | undefined {
  if (!obj || typeof obj !== "object") return undefined;
  if (obj[key]?.jsonValue?.value) return obj[key].jsonValue.value;
  if (obj[key]?.value) return obj[key].value;
  if (Array.isArray(obj)) {
    for (const item of obj) {
      const found = findNestedValue(item, key);
      if (found) return found;
    }
  } else {
    for (const prop in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, prop)) {
        const found = findNestedValue(obj[prop], key);
        if (found) return found;
      }
    }
  }
  return undefined;
}

function extractReviewsRaw(sitecoreContext: any): any {
  const mainPH = sitecoreContext?.route?.placeholders?.["headless-main"] || [];
  const propertyReviews = mainPH.find((c: any) => c.componentName === "PropertyReviews");
  if (propertyReviews?.fields?.data?.ds?.ancestors) {
    return getPropertyReviewsData(propertyReviews.fields.data.ds.ancestors);
  }
  const propertyTestimonial = mainPH.find((c: any) => c.componentName === "PropertyTestimonial");
  if (propertyTestimonial?.fields?.reviews?.value) {
    return propertyTestimonial.fields.reviews.value;
  }
  return [];
}

/**
 * Checks if breadcrumbs exist on the current page.
 * @param sitecoreContext The Sitecore context object.
 * @returns true if breadcrumbs exist, false otherwise.
 */
export function hasBreadcrumbsOnPage(sitecoreContext: any): { exists: boolean; ci: any; ancestors: any[] } {
  const allowedTemplates = ["PropertyChildPage", "ResourceLandingPage", "CityLandingPage", "BlogArticle", "BlogHome"];
  const templateName = sitecoreContext?.route?.templateName;
  if (!allowedTemplates.includes(templateName) || sitecoreContext.route?.name === "book-a-tour" || sitecoreContext.route?.name === "planifier-une-visite")
    return { exists: false, ci: null, ancestors: [] };
  const placeholders = sitecoreContext?.route?.placeholders;
  if (!placeholders) return { exists: false, ci: null, ancestors: [] };
  const metaSeoBlock = placeholders["headless-main"]?.find((component: any) => component.componentName === "MetaSeoBlock");
  const languages = metaSeoBlock?.fields?.data?.ci?.languages;
  if (!languages || !Array.isArray(languages)) return { exists: false, ci: null, ancestors: [] };
  const currentLocale = sitecoreContext?.language;
  const langObj = languages.find((lang: any) => lang?.language?.name === currentLocale);
  if (langObj && Array.isArray(langObj.ancestors) && langObj.ancestors.length > 0) {
    let ci = null;
    if (
      (templateName === "ResourceLandingPage" || templateName === "CityLandingPage" || templateName === "PropertyChildPage" || templateName === "BlogHome") &&
      sitecoreContext.route?.name !== "book-a-tour"
    ) {
      ci = { name: langObj.field.jsonValue.value, path: langObj.url.path };
    }
    return { exists: true, ci, ancestors: langObj.ancestors };
  }
  return { exists: false, ci: null, ancestors: [] };
}

export function getBreadcrumbList(sitecoreContext: any): any {
  const breadCrumbs = hasBreadcrumbsOnPage(sitecoreContext);
  if (!breadCrumbs.exists) return null;
  // Reverse ancestors array for correct navigation order
  const reversedAncestors = [...breadCrumbs.ancestors].reverse();
  // Add current page if present
  if (breadCrumbs.ci?.name && breadCrumbs.ci?.path) {
    reversedAncestors.push({
      displayName: breadCrumbs.ci.name,
      url: { path: breadCrumbs.ci.path },
    });
  }
  // Assign positions in order as they appear
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: reversedAncestors.map((ancestor: any, idx: number) => {
      let itemUrl = ancestor.url?.path || ancestor.path || "";
      if (sitecoreContext.language === "fr" && itemUrl) {
        if (itemUrl === "/") {
          itemUrl = "/fr";
        } else if (!itemUrl.startsWith("/fr")) {
          itemUrl = "/fr" + (itemUrl.startsWith("/") ? itemUrl : "/" + itemUrl);
        }
      }
      return {
        "@type": "ListItem",
        position: idx + 1,
        name: ancestor.field?.jsonValue?.value || ancestor.displayName || ancestor.name || "",
        item: "https://chartwell.com" + itemUrl,
      };
    }),
  };
}

/**
 * Flattens all blogArticles from children of blogCategories in blogPostList.
 * @param blogPostList The blogPostList object containing categories and articles.
 * @returns A flat array of all blogArticles.
 */

export function flattenBlogArticles(blogPostList: any): any[] {
  return blogPostList?.fields?.data?.item?.children?.blogCategories?.flatMap((category: any) => category?.children?.blogArticles || []) || [];
}

/**
 * Adds the product JSON-LD schema to the page.
 * @param curUrl - The current URL of the page.
 * @param sitecoreContext - The Sitecore context object.
 * @returns The product JSON-LD schema as a string.
 */

export const addProductJsonLd = (curUrl: string, sitecoreContext: SitecoreContextValue, router?: any, videos?: any[]) => {
  if (!sitecoreContext?.route) return "";

  // Helper: Get VideoObject JSON-LD
  const getVideoObjects = (videosArr: any[] = []) => {
    if (!Array.isArray(videosArr) || videosArr.length === 0) return [];
    return videosArr.map((video) => ({
      "@context": "https://schema.org",
      "@type": "VideoObject",
      name: video.name || video.title || "",
      description: video.description || "",
      embedUrl: video.embedUrl || video.url || "",
      duration: video.duration,
      thumbnailUrl: video.thumbnailUrl || video.thumb || "",
      uploadDate: video.uploadDate || video.uploadedAt || "",
      url: `https://chartwell.com${sitecoreContext.language === "fr" ? "/fr" : ""}${router?.asPath || video.url || ""}`,
      publisher: {
        "@type": "Organization",
        name: sitecoreContext.language === "fr" ? "Chartwell résidences pour retraités" : "Chartwell Retirement Residences",
      },
    }));
  };

  // Example usage: create VideoObject JSON-LD
  const videoObjectsJsonLd = getVideoObjects(videos);
  const propertyHeader = (sitecoreContext.route.placeholders?.["headless-header"]?.find((c: any) => c.componentName === "ChartwellPropertyHeader") as any)?.fields?.data?.ci;
  const { fields: ds } = sitecoreContext.route as any;

  // Helper: Clean HTML and whitespace from string
  const cleanString = (str: string) =>
    (str || "")
      .replace(/<[^>]+>/g, "")
      .replace(/&amp;/g, "&")
      .replace(/\s+/g, " ")
      .trim();

  // Helper: Format date as readable string
  const getFormattedDate = (dateStr: string | undefined) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "";
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Helper: Get FAQ JSON-LD

  const getFAQs = () => {
    const headlessMain = sitecoreContext?.route?.placeholders?.["headless-main"];
    const faqPH: any = Array.isArray(headlessMain) ? headlessMain.filter((c: any) => c.componentName === "AccordionGroupContainer") : [];
    let FAQS: any[] = [];
    if (faqPH.length === 1 && faqPH[0] && typeof faqPH[0] === "object" && "fields" in faqPH[0] && faqPH[0].fields && Array.isArray(faqPH[0].fields.data.ds.field?.targetItems)) {
      FAQS = faqPH[0].fields.data.ds.field.targetItems;
    } else {
      FAQS = faqPH.flatMap((faq: any) =>
        faq && "fields" in faq && faq.fields && Array.isArray(faq.fields.data.ds.field?.targetItems)
          ? faq.fields.data.ds.field.targetItems.map((question: any) => ({
              question: question?.fields?.find((f: any) => f.name === "Question")?.jsonValue?.value || question?.fields?.["Question"]?.value || "",
              answer: cleanString(question?.fields?.find((f: any) => f.name === "Answer")?.jsonValue?.value || question?.fields?.["Answer"]?.value || ""),
            }))
          : []
      );
    }

    return FAQS?.map((faq: any) => ({
      "@type": "Question",
      name: faq?.question || faq?.fields?.find((f: any) => f.name === "Question")?.jsonValue?.value || "",
      acceptedAnswer: {
        "@type": "Answer",
        text: faq?.answer || cleanString(faq?.fields?.find((f: any) => f.name === "Answer")?.jsonValue?.value) || "",
      },
    }));
  };

  // Helper: Get Blog Authors JSON-LD
  const getBlogAuthors = () => {
    const headlessMain = sitecoreContext.route?.placeholders?.["headless-main"] as any;
    const blogPostList = headlessMain?.find((c: any) => c.componentName === "BlogPostList");
    const contextBlogPost = flattenBlogArticles(blogPostList).find((article: any) => article.blogArticleId === sitecoreContext?.route?.itemId?.toUpperCase().replaceAll("-", ""));
    const blogAuthorsPH = headlessMain?.find((c: any) => c.componentName === "BlogArticle" || c.componentName === "BlogPostListByAuthor");
    let blogArticleFields: any = {};

    if (Array.isArray(headlessMain)) {
      if (blogAuthorsPH && "fields" in blogAuthorsPH) {
        blogArticleFields = blogAuthorsPH.fields;
      }
    }

    let blogAuthors = [];
    if (Array.isArray(blogArticleFields?.Author) && blogArticleFields.Author[0]?.fields) {
      blogAuthors = blogArticleFields.Author[0].fields;
    } else if (blogArticleFields?.data?.ci?.author?.authorInfo && Array.isArray(blogArticleFields.data.ci.author.authorInfo) && blogArticleFields.data.ci.author.authorInfo[0]?.fields) {
      blogAuthors = blogArticleFields.data.ci.author.authorInfo[0].fields;
    }

    const authorsArr = Array.isArray(blogAuthors) ? blogAuthors : blogAuthors && typeof blogAuthors === "object" ? [blogAuthors] : [];

    if (authorsArr.length === 0) {
      blogArticleFields = blogAuthorsPH?.fields as any;
    }

    const authorList =
      authorsArr?.length > 0
        ? authorsArr.map((author: any) => {
            let sameAs: string[] = [];
            const authorUrlsValue = author?.["AuthorUrls"]?.value;

            if (Array.isArray(authorUrlsValue)) {
              sameAs = authorUrlsValue.map((url: string) => url.trim()).filter(Boolean);
            } else if (typeof authorUrlsValue === "string") {
              sameAs = authorUrlsValue
                .split("|")
                .map((url: string) => url.trim())
                .filter(Boolean);
            }

            // SEO improvements: fallback and meaningful content
            const name = author?.["NavigationTitle"]?.value || author?.["AuthorName"]?.value || "Unknown Author";
            const jobTitle = author?.["AuthorJobTitle"]?.value || "Contributor";
            const description = author?.["Description"]?.value || `Learn more about ${name}, a valued contributor to Chartwell Retirement Residences.`;
            const image = author?.["BackgroundImage"]?.value?.src || "https://dam.chartwell.com/m/4b13dac67e7c074a/original/chartwell-horizontal-logo.svg";
            const url = `https://chartwell.com${sitecoreContext.language === "fr" ? "/fr" : ""}${author?.["AuthorLink"]?.value?.href || ""}`;

            return {
              "@type": "Person",
              name,
              honorificPrefix: "Dr.",
              jobTitle,
              affiliation: {
                "@type": "Organization",
                name: "Chartwell Retirement Residences",
                url: `https://chartwell.com${sitecoreContext.language === "fr" ? "/fr" : ""}`,
              },
              url,
              sameAs: sameAs,
              image,
              description,
            };
          })
        : null;

    const blogPostObj = {
      "@type": "BlogPosting",
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": curUrl,
      },
      headline: blogArticleFields?.["NavigationTitle"]?.value || "",
      description: (() => {
        const summary = cleanString(blogArticleFields?.["Content"]?.value || "");
        const sentences = summary.match(/[^.!?]+[.!?]+/g) || [summary];
        return sentences.slice(0, 2).join(" ").trim();
      })(), // image: blogArticleFields?.["BackgroundImage"]?.value?.src || "",

      author: {
        "@type": "Organization",
        name: sitecoreContext.language === "fr" ? "Chartwell résidences pour retraités" : "Chartwell Retirement Residences",
        url: `https://chartwell.com${sitecoreContext.language === "fr" ? "/fr" : ""}`,
      },

      publisher: {
        "@type": "Organization",
        name: sitecoreContext.language === "fr" ? "Chartwell résidences pour retraités" : "Chartwell Retirement Residences",
        logo: {
          "@type": "ImageObject",
          url: "https://dam.chartwell.com/m/4b13dac67e7c074a/original/chartwell-horizontal-logo.svg",
        },
      },
      datePublished: contextBlogPost?.blogCreationDate?.jsonValue?.value || "",
      dateModified: contextBlogPost?.blogUpdatedDate?.jsonValue?.value || "",
      image: {
        "@type": "ImageObject",
        url: blogArticleFields?.["BackgroundImage"]?.value?.src || "",
        width: blogArticleFields?.["BackgroundImage"]?.value?.width || "",
        height: blogArticleFields?.["BackgroundImage"]?.value?.height || "",
      },
    };

    // Return both if both are present, otherwise whichever exists
    if (authorList && authorList.length > 0 && blogPostObj.headline) {
      return [authorList, blogPostObj];
    } else if (authorList && authorList.length > 0) {
      return authorList;
    } else {
      return blogPostObj;
    }
  };

  // Helper: Get Key Features JSON-LD

  const getKeyFeatures = () =>
    (ds?.["Custom Key Features"]?.value?.split(",") || []).map((keyfeature: string) => ({
      "@type": "LocationFeatureSpecification",
      name: keyfeature.trim(),
    }));

  // Organization JSON-LD object

  const organizationJson = {
    "@type": "Organization",
    name: sitecoreContext.language === "fr" ? "Chartwell résidences pour retraités" : "Chartwell Retirement Residences",
    url: `https://chartwell.com${sitecoreContext.language === "fr" ? "/fr" : ""}`,
    logo: "https://dam.chartwell.com/m/4b13dac67e7c074a/original/chartwell-horizontal-logo.svg",
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+1-855-461-0685",
        contactType: "customer service",
        areaServed: "CA",
        availableLanguage: ["English", "French"],
      },
    ],

    sameAs: [
      sitecoreContext.language === "en" ? "https://www.facebook.com/chartwellretirement" : "https://www.facebook.com/residenceschartwell/",
      "https://www.instagram.com/chartwellretirementresidences/",
      "https://www.linkedin.com/company/chartwell-retirement-residences",
      "https://www.youtube.com/chartwellretirement",
    ],
  };

  // Get sticky promo banner fields
  let props: any = undefined;
  const headlessHeader = sitecoreContext?.route?.placeholders?.["headless-header"];

  if (Array.isArray(headlessHeader)) {
    const partialDesignDynamicPlaceholder = headlessHeader.find((c: any) => c.componentName === "PartialDesignDynamicPlaceholder" && "placeholders" in c);
    const placeholders = partialDesignDynamicPlaceholder && "placeholders" in partialDesignDynamicPlaceholder ? partialDesignDynamicPlaceholder.placeholders : undefined;

    if (placeholders) {
      const navOrFooter = placeholders["sxa-navigation"] || placeholders["sxa-property-page-footer-header"];
      if (Array.isArray(navOrFooter)) {
        const stickyPromo = navOrFooter.find((x: any) => x.componentName === "StickyPromoBanner");
        if (stickyPromo && "fields" in stickyPromo) {
          props = stickyPromo.fields;
        }
      }
    }
  }

  const pageHasPromoOrAnnouncement = hidePageBannerOrAnnouncement(sitecoreContext, props, router);
  const propertyEventData = pageHasPromoOrAnnouncement;
  const reviewsRaw = extractReviewsRaw(sitecoreContext) || [];
  const reviews = reviewsRaw.length > 0 && getStructuredReviewsSchema(JSON.parse(reviewsRaw), propertyHeader, curUrl);

  const suitePlansRaw =
    ((sitecoreContext?.route?.name === "suite-plans" || sitecoreContext?.route?.name === "plans-des-appartements") &&
      ((sitecoreContext.route.placeholders?.["headless-main"]?.find((c: any) => c.componentName === "TabbedSuitePlans") as any)?.fields?.data?.ds?.suitePlans?.targetItems ||
        (sitecoreContext.route.placeholders?.["headless-main"]?.find((c: any) => c.componentName === "PropertySuitePlans") as any)?.fields?.data?.ds?.children?.results)) ||
    [];

  const suitePlansSchemaArr = getSuitePlansSchemaArr(suitePlansRaw);

  // Build @graph array
  const graph: any[] = [];

  // Residence (main entity)
  if (sitecoreContext.route.templateName === "PropertyPage") {
    graph.push({
      "@type": "Residence",
      name: ds?.["Property Name"]?.value || ds?.NavigationTitle?.value || "",
      description: ds?.["Description"]?.value || "",
      image: ds?.["Thumbnail Photo"]?.value?.src || "",
      logo: ds?.["Property Logo"]?.value?.src || "",
      address: {
        "@type": "PostalAddress",
        streetAddress: ds?.["StreetNameAndNumber"]?.value || "",
        addressLocality: ds?.["City"]?.[0]?.fields?.["City Name"]?.value || "",
        addressRegion: ds?.["City"]?.[0]?.fields?.["Province Name"]?.[0]?.fields?.["Province Name"]?.value || "",
        postalCode: ds?.["Postal code"]?.value || "",
        addressCountry: "CA",
      },
      telephone: ds?.["Contact Number"]?.value || "",
      geo: {
        "@type": "GeoCoordinates",
        latitude: ds?.Latitude?.value || "",
        longitude: ds?.Longitude?.value || "",
      },
      containsPlace: {
        "@type": "ApartmentComplex",
        name: sitecoreContext.language === "en" ? "Retirement Living" : "Résidences pour aînés",
        amenityFeature: getKeyFeatures(),
      },
      url: curUrl,
    });

    // FAQPage
    const faqs = getFAQs();
    if (faqs.length > 0) {
      graph.push({
        "@type": "FAQPage",
        mainEntity: faqs,
      });
    }

    // Event
    if (pageHasPromoOrAnnouncement?.isActivePromo && !pageHasPromoOrAnnouncement?.isPathExclude) {
      const openHouseResult = propertyEventData?.openHouse?.children?.results?.find(Boolean);
      const openHouseChild = openHouseResult?.children?.results?.find(Boolean);
      const blockText =
        openHouseChild?.blockText?.value ||
        "<p>Join us at our <strong>next Open House event</strong> at any Chartwell retirement residence near you on <strong>June 6 &amp; 7, 2025!</strong> Take the opportunity to explore our vibrant communities, meet our friendly staff, and experience the exceptional lifestyle we offer.</p>" ||
        "";

      graph.push({
        "@type": "Event",
        name: "Chartwell Open House 2025",
        description: cleanString(blockText),
        startDate: getFormattedDate(propertyEventData?.ds?.stickyPromoBannerStartDate?.jsonValue?.value || propertyEventData?.ci?.["StarDate"]?.value),
        endDate: getFormattedDate(propertyEventData?.ds?.stickyPromoBannerEndDate?.jsonValue?.value || propertyEventData?.ci?.["EndDate"]?.value),
        eventAttendanceMode: "",
        eventStatus: "",
        location: {
          "@type": "Place",
          name: propertyEventData?.ci?.residenceName?.value || propertyEventData?.fields?.["Property Name"]?.value || "",
          address: {
            "@type": "PostalAddress",
            streetAddress: propertyEventData?.ci?.address?.value || propertyEventData?.fields?.["StreetNameAndNumber"]?.value || "",
            addressLocality: propertyEventData?.fields?.City?.find(Boolean)?.fields["City Name"]?.value || propertyEventData?.ci?.city?.targetItems?.find(Boolean)?.name?.value || "",
            addressRegion:
              propertyEventData?.ci?.province?.targetItems?.find(Boolean)?.name?.value || propertyEventData?.fields?.City?.[0]?.fields["Province Name"]?.[0]?.fields?.["Province Name"]?.value || "",
            postalCode: propertyEventData?.ci?.postalCode?.value || propertyEventData?.fields?.["Postal code"]?.value || "",
            addressCountry: propertyEventData?.fields?.City?.[0]?.fields["Country Name"]?.[0]?.fields?.["Name"]?.value || "CA",
          },
        },
        image: openHouseChild?.background?.jsonValue?.value?.src || "https://dam.chartwell.com/m/1f43cb7e9d231cad/Large_Generic_Hero_webp-prescott-seniors-activity-entertainment-01-crop.webp",
        organizer: {
          "@type": "Organization",
          name: sitecoreContext.language === "fr" ? "Chartwell résidences pour retraités" : "Chartwell Retirement Residences",
          url: `https://chartwell.com${sitecoreContext.language === "fr" ? "/fr" : ""}`,
        },
        offers: {
          "@type": "Offer",
          url: `https://chartwell.com${sitecoreContext.language === "fr" ? "/fr/portesouvertes" : "/openhouse"}`,
          price: "",
          priceCurrency: "CAD",
          availability: "",
          validFrom: getFormattedDate(propertyEventData?.ds?.stickyPromoBannerStartDate?.jsonValue?.value || propertyEventData?.ci?.["StarDate"]?.value),
        },
      });
    }

    // Reviews
    if (reviews && reviews.length > 0) {
      graph.push({ "@type": "ItemList", itemListElement: reviews });
    }

    return JSON.stringify(
      {
        "@context": "https://schema.org",
        "@graph": graph,
      },
      null,
      2
    );
  }

  // Other page types: Home, FAQ, BlogArticle, BlogAuthor
  if (
    sitecoreContext.route?.name?.toLowerCase() === "home" ||
    sitecoreContext.route?.name === "frequently-asked-questions" ||
    sitecoreContext.route?.templateName === "BlogHome" ||
    sitecoreContext?.route?.templateName === "BlogArticle" ||
    sitecoreContext?.route?.templateName === "BlogAuthor" ||
    sitecoreContext?.route?.name === "reviews-and-ratings" ||
    sitecoreContext?.route?.name === "avis" ||
    sitecoreContext.route?.name === "suite-plans" ||
    sitecoreContext.route?.name === "plans-des-appartements" ||
    sitecoreContext.route?.templateName === "ResourceLandingPage" ||
    sitecoreContext.route?.templateName === "CityLandingPage" ||
    (sitecoreContext.route?.templateName === "PropertyChildPage" && sitecoreContext.route?.name !== "book-a-tour") ||
    videoObjectsJsonLd.length > 0
  ) {
    graph.push(organizationJson);

    if (sitecoreContext.route?.name === "frequently-asked-questions") {
      const faqs = getFAQs();
      if (faqs.length > 0) {
        graph.push({
          "@type": "FAQPage",
          mainEntity: faqs,
        });
      }
    }

    if (sitecoreContext?.route?.templateName === "BlogArticle" || sitecoreContext?.route?.templateName === "BlogAuthor") {
      const authorsOrPost = getBlogAuthors();

      // Flatten nested arrays: if authorsOrPost is an array and its first element is also an array, flatten it
      if (Array.isArray(authorsOrPost) && Array.isArray(authorsOrPost[0])) {
        graph.push(...authorsOrPost[0], ...authorsOrPost.slice(1));
      } else if (Array.isArray(authorsOrPost)) {
        graph.push(...authorsOrPost);
      } else {
        graph.push(authorsOrPost);
      }
    }

    const breadcrumbList = getBreadcrumbList(sitecoreContext);
    if (breadcrumbList) {
      graph.push(breadcrumbList);
    }

    if (sitecoreContext?.route?.name === "reviews-and-ratings" || sitecoreContext?.route?.name === "avis") {
      if (reviews && reviews.length > 0) {
        graph.push({ "@type": "ItemList", itemListElement: reviews });
      }
    }

    if (sitecoreContext?.route?.name === "suite-plans" || sitecoreContext?.route?.name === "plans-des-appartements") {
      if (suitePlansSchemaArr && suitePlansSchemaArr.length > 0) {
        graph.push(...suitePlansSchemaArr);
      }
    }

    if (videoObjectsJsonLd.length > 0) {
      graph.push(...videoObjectsJsonLd);
    }

    return JSON.stringify(
      {
        "@context": "https://schema.org",
        "@graph": graph,
      },

      null,
      2
    );
  }
  return "";
};

/**
 * Extracts and returns sticky promo banner info from the Sitecore context.
 * @param sitecoreContext - The Sitecore context object.
 * @param router - The Next.js router instance (client only).
 * @returns An object with isActivePromo, isPathExclude, and hideBannerOrAnnouncement
 */
export function hidePageBannerOrAnnouncement(sitecoreContext: any, props?: any, router?: any): any {
  const { ci, dsEN, dsFR, openHouse } = (props && props.data) || {};
  const ds = sitecoreContext?.language === "fr" ? dsFR : dsEN;

  const startDateStr = ds?.stickyPromoBannerStartDate?.jsonValue?.value || props?.StarDate?.value;
  const endDateStr = ds?.stickyPromoBannerEndDate?.jsonValue?.value || props?.EndDate?.value;

  const excludePages = ds?.stickyPromoExcludePages?.targetItems || props?.["Exclude page with subpages"] || [];

  const currentPath = ci && ci?.contextUrl ? ci?.contextUrl?.path : router ? router.asPath : undefined;

  const isPathExclude: boolean =
    excludePages?.some((e: any) => currentPath?.split("/").filter(Boolean).includes(e?.displayName) || e?.name.toLowerCase() === sitecoreContext?.route?.name.toLowerCase()) || false;

  // Check if promo is active
  const isActivePromo = checkIsItPromo(new Date(startDateStr), new Date(endDateStr));

  // CTA logic
  let shouldShowCta = false;
  let ctaHref = "";
  let ctaTarget = "_self";
  let ctaLabel = "";
  let ctaLinkId = "";
  let ctaTitle = "";
  let ctaStyle = "";

  if (ci?.hasAnnouncement?.boolValue || sitecoreContext?.route?.fields?.hasAnnouncement?.value) {
    // Announcement CTA
    if (ds?.stickyPromoCtaLink?.jsonValue?.value?.text || ci?.cTAText?.jsonValue?.value) {
      shouldShowCta = true;
      ctaHref = ci?.cTALink?.jsonValue?.value?.href || "";
      ctaTarget = ci?.cTALink?.jsonValue?.value?.target || ci?.cTATarget?.jsonValue?.value || "_self";
      ctaLabel = ci?.cTALink?.jsonValue?.value?.text || ci?.cTAText?.jsonValue?.value;
      ctaLinkId = ci?.cTALink?.id || "";
      ctaTitle = ci?.cTALink?.jsonValue?.value?.title || ci?.cTAText?.jsonValue?.value || "";
      ctaStyle = ci?.cTALink?.jsonValue?.value?.class || "plum on clear background";
    }
  } else {
    // Promo CTA
    if (ds?.stickyPromoCtaLink?.jsonValue?.value?.text || ds?.stickyPromoCtaText?.jsonValue?.value || ci?.["CTA Text"]?.value) {
      shouldShowCta = true;
      ctaHref = ds?.stickyPromoCtaLink?.jsonValue?.value?.href ? ds?.stickyPromoCtaLink?.jsonValue?.value?.href : ci?.["CTA Link"]?.value?.href || "";
      ctaTarget = ds?.stickyPromoCtaLink?.jsonValue?.value?.target || ds?.stickyPromoCtaTarget?.jsonValue?.value || ci?.["CTA Target"]?.value || "_self";
      ctaLabel = ds?.stickyPromoCtaLink?.jsonValue?.value?.text || ds?.stickyPromoCtaText?.jsonValue?.value || ci?.["CTA Text"]?.value || "";
      ctaTitle = ds?.stickyPromoCtaLink?.jsonValue?.value?.title || ds?.stickyPromoCtaText?.jsonValue?.value || ci?.["CTA Text"]?.value || "";
      ctaLinkId = ds?.stickyPromoCtaLink?.jsonValue?.value?.id || ci?.["CTA Link"]?.value?.id || "";
    }
  }

  // Return object with all required values
  return {
    isActivePromo,
    isPathExclude,
    hasAnnouncement: ci?.hasAnnouncement?.boolValue || sitecoreContext?.route?.fields?.hasAnnouncement?.value || false,
    hideBannerOrAnnouncement: (!isActivePromo || isPathExclude) && !(ci?.hasAnnouncement?.boolValue || sitecoreContext?.route?.fields?.hasAnnouncement?.value),
    ci: ci || props || {},
    ds: ds,
    fields: sitecoreContext?.route?.fields || {},
    openHouse: openHouse || {},
    shouldShowCta,
    ctaHref,
    ctaTarget,
    ctaLabel,
    ctaLinkId,
    ctaTitle,
    ctaStyle,
    vimeoID: ds?.vimeoID?.jsonValue?.value,
  };
}

/**
 * Returns a structured array of reviews in schema.org format from a reviewsRaw object.
 * @param reviewsRaw - The object containing a Reviews array (e.g., from Google Places API)
 * @returns An array of reviews in schema.org structured format
 */
export function getStructuredReviewsSchema(reviewsRaw: any, propertyHeader: any, curUrl: string): any[] {
  if (!Array.isArray(reviewsRaw?.Reviews)) return [];
  return reviewsRaw.Reviews.map((item: any) => ({
    "@type": "UserReview",
    author: {
      "@type": "Person",
      name: item.author_name || item.name || "",
    },
    reviewRating: {
      "@type": "Rating",
      ratingValue: item.rating || 0,
      bestRating: 5,
      worstRating: 1,
    },
    itemReviewed: {
      "@type": "Organization",
      name:
        propertyHeader?.parent?.fields?.find((f: any) => f.name === "Property Name")?.jsonValue?.value || propertyHeader?.fields?.find((f: any) => f.name === "Property Name")?.jsonValue?.value || "",
      url: curUrl,
    },
    reviewBody: item.text || "",
    datePublished: item.time ? new Date(item.time * 1000).toISOString().split("T")[0] : "",
    publisher: {
      "@type": "Organization",
      name: "Google",
    },
  }));
}

export function shouldRenderProductJson(sitecoreContext: any, uniqueVideos: any[]): boolean {
  return (
    sitecoreContext.route?.templateName === "Page" ||
    sitecoreContext.route?.templateName === "PropertyPage" ||
    sitecoreContext.route?.name === "home" ||
    sitecoreContext.route?.name === "frequently-asked-questions" ||
    sitecoreContext.route?.name === "reviews-and-ratings" ||
    sitecoreContext.route?.name === "avis" ||
    sitecoreContext.route?.name === "suite-plans" ||
    sitecoreContext.route?.name === "plans-des-appartements" ||
    sitecoreContext.route?.templateName === "BlogAuthor" ||
    sitecoreContext.route?.templateName === "BlogArticle" ||
    sitecoreContext.route?.templateName === "BlogHome" ||
    sitecoreContext.route?.templateName === "ResourceLandingPage" ||
    sitecoreContext.route?.templateName === "CityLandingPage" ||
    sitecoreContext.route?.templateName === "PropertyChildPage" ||
    (uniqueVideos && uniqueVideos.length > 0)
  );
}

export function findFieldValue(obj: any, fieldName: string): string | undefined {
  if (!obj) return undefined;

  if (Array.isArray(obj)) {
    for (const item of obj) {
      const found = findFieldValue(item, fieldName);
      if (found) return found;
    }
  } else if (typeof obj === "object") {
    if (obj.name === fieldName && obj.jsonValue?.value) return obj.jsonValue.value;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const found = findFieldValue(obj[key], fieldName);
        if (found) return found;
      }
    }
  }
  return obj[fieldName]?.value || undefined;
}

/**
 * Returns a localized formatted custom address string from CustomAddress field.
 * @param propertyData The property data object containing address, city, province, and postal code.
 * @param path The url path.
 */
export function getCustomLocalizedAddress(propertyData: any, path: string) {
  const customAddress = (path.includes("condos-locatifs") && findFieldValue(propertyData, "CustomAddress")) || "";
  return customAddress || "";
}

export function updateAnchorOffset(headerSelector = ".component", bannerSelector = ".stickyPromoUniversal") {
  const header = document.querySelector(headerSelector) as HTMLElement | null;
  const banner = document.querySelector(bannerSelector) as HTMLElement | null;
  const headerHeight = header ? header.offsetHeight : 0;
  const bannerHeight = banner ? banner.offsetHeight : 0;
  const offset = headerHeight + bannerHeight;
  document.documentElement.style.setProperty("--anchor-offset", `${offset}px`);
}
