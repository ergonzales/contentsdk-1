import { getPropertyReviewsData } from "lib/utils/propertyReviewsData";
import { checkIsItPromo } from "../utils/checkIsItPromo";

type SitecoreContextValue = any;

const cleanString = (str: string): string =>
  (str || "")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();

const getFormattedDate = (dateStr?: string): string => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return isNaN(date.getTime()) ? "" : date.toLocaleString("en-US", { year: "numeric", month: "long", day: "numeric" });
};

const getStickyBannerData = (sitecoreContext: SitecoreContextValue): any => {
  const header = sitecoreContext?.route?.placeholders?.["headless-header"];
  if (!Array.isArray(header)) return undefined;

  const dynamicPlaceholder = header.find((c: any) => c.componentName === "PartialDesignDynamicPlaceholder" && "placeholders" in c);

  const placeholders = dynamicPlaceholder?.placeholders;
  const navOrFooter = placeholders?.["sxa-navigation"] || placeholders?.["sxa-property-page-footer-header"];
  const stickyPromo = Array.isArray(navOrFooter) ? navOrFooter.find((x: any) => x.componentName === "StickyPromoBanner") : undefined;

  return stickyPromo?.fields;
};

const getEventSchema = (stickyBannerData: any, isActivePromo: boolean, hasAnnouncement: boolean, isPathExclude: boolean, sitecoreContext: SitecoreContextValue): object | null => {
  if (!stickyBannerData || !isActivePromo || hasAnnouncement || isPathExclude) return null;

  const openHouseResult = stickyBannerData?.data?.openHouse?.children?.results?.[0];
  const openHouseChild = openHouseResult?.children?.results?.[0];

  const blockText = openHouseChild?.blockText?.value || "";

  return {
    "@type": "Event",
    name: "Chartwell Open House 2025",
    description: cleanString(blockText),
    startDate: getFormattedDate(stickyBannerData?.data?.ds?.stickyPromoBannerStartDate?.jsonValue?.value),
    endDate: getFormattedDate(stickyBannerData?.data?.ds?.stickyPromoBannerEndDate?.jsonValue?.value),
    location: {
      "@type": "Place",
      name: stickyBannerData?.data?.ci?.residenceName?.value || "",
      address: {
        "@type": "PostalAddress",
        streetAddress: stickyBannerData?.data?.ci?.address?.value || "",
        addressLocality: stickyBannerData?.data?.ci?.city?.targetItems?.[0]?.name?.value || "",
        addressRegion: stickyBannerData?.data?.ci?.province?.targetItems?.[0]?.name?.value || "",
        postalCode: stickyBannerData?.data?.ci?.postalCode?.value || "",
        addressCountry: "CA",
      },
    },
    image: openHouseChild?.background?.jsonValue?.value?.src || "",
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
      validFrom: getFormattedDate(stickyBannerData?.data?.ds?.stickyPromoBannerStartDate?.jsonValue?.value),
    },
  };
};

const getFAQSchema = (faqPH: any[], isActivePromo: boolean, hasAnnouncement: boolean, isPathExclude: boolean): object[] => {
  if (!isActivePromo && hasAnnouncement && isPathExclude) return [];

  const faqs = faqPH.flatMap(
    (faq: any) =>
      faq?.fields?.FAQS?.map((q: any) => ({
        "@type": "Question",
        name: q?.fields?.["Question"]?.value || "",
        acceptedAnswer: {
          "@type": "Answer",
          text: cleanString(q?.fields?.["Answer"]?.value || ""),
        },
      })) || []
  );

  return faqs;
};

const getBlogAuthorsSchema = (blogAuthors: any, language: string): object[] => {
  const authorsArr = Array.isArray(blogAuthors) ? blogAuthors : blogAuthors && typeof blogAuthors === "object" ? [blogAuthors] : [];

  return authorsArr.map((author: any) => {
    const authorUrls =
      typeof author?.["AuthorUrls"]?.value === "string"
        ? author?.["AuthorUrls"]?.value
            .split("|")
            .map((url: string) => url.trim())
            .filter(Boolean)
        : [];

    return {
      "@type": "Person",
      name: author?.["NavigationTitle"]?.value || "",
      honorificPrefix: "Dr.",
      jobTitle: author?.["AuthorJobTitle"]?.value || "",
      affiliation: {
        "@type": "Organization",
        name: "Chartwell Retirement Residences",
        url: "https://chartwell.com",
      },
      url: `https://chartwell.com${language === "fr" ? "/fr" : ""}${author?.["AuthorLink"]?.value?.href || ""}`,
      sameAs: authorUrls,
      image: author?.["BackgroundImage"]?.value?.src || "",
      description: author?.["Description"]?.value || "",
    };
  });
};

const getOrganizationSchema = (language: string): object => ({
  "@type": "Organization",
  name: language === "fr" ? "Chartwell résidences pour retraités" : "Chartwell Retirement Residences",
  url: `https://chartwell.com${language === "fr" ? "/fr" : ""}`,
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
    language === "en" ? "https://www.facebook.com/chartwellretirement" : "https://www.facebook.com/residenceschartwell/",
    "https://www.instagram.com/chartwellretirementresidences/",
    "https://www.linkedin.com/company/chartwell-retirement-residences",
    "https://www.youtube.com/chartwellretirement",
  ],
});

const getResidenceSchema = (ds: any, curUrl: string, language: string): object => ({
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
    name: language === "en" ? "Retirement Living" : "Résidences pour aînés",
    amenityFeature: (ds?.["Custom Key Features"]?.value?.split(",") || []).map((feature: string) => ({
      "@type": "LocationFeatureSpecification",
      name: feature.trim(),
    })),
  },
  url: curUrl,
});

const getReviewSchema = (reviewsRaw: any, curUrl: string, ds: any): object[] => {
  let reviewsArr: any[] = [];
  if (typeof reviewsRaw === "string") {
    try {
      reviewsArr = (JSON.parse(reviewsRaw) as any)?.Reviews || [];
    } catch {
      reviewsArr = [];
    }
  } else if (Array.isArray(reviewsRaw)) {
    reviewsArr = reviewsRaw;
  } else if (typeof reviewsRaw === "object" && reviewsRaw !== null) {
    if (Array.isArray(reviewsRaw)) {
      reviewsArr = reviewsRaw;
    } else {
      reviewsArr = Object.values(reviewsRaw);
    }
  }
  if (!Array.isArray(reviewsArr)) {
    reviewsArr = [];
  }
  // Sort reviews by review.time descending (most recent first)
  reviewsArr = reviewsArr.sort((a, b) => {
    const timeA = a.time || 0;
    const timeB = b.time || 0;
    return timeB - timeA;
  });
  // Only return non-empty review objects
  return reviewsArr
    ?.map((review) => {
      const author = review.author || review.author_name || "";
      const reviewBody = review.reviewBody || review.text || "";
      const ratingValue = review.ratingValue || review.rating || "";
      if (!author && !reviewBody && !ratingValue) return undefined;
      return {
        "@type": "UserReview",
        author: {
          "@type": "Person",
          name: author,
        },
        datePublished: review.datePublished || (review.time ? new Date(review.time * 1000).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : ""),
        itemReviewed: {
          "@type": "Residence",
          name: ds?.["Property Name"]?.value || ds?.NavigationTitle?.value || "",
          url: curUrl || "",
        },
        reviewBody: reviewBody,
        name: review.name || "",
        reviewRating: {
          "@type": "Rating",
          ratingValue: ratingValue,
          bestRating: "5",
          worstRating: "1",
        },
      };
    })
    .filter((r): r is NonNullable<typeof r> => r !== undefined);
};

// Helper to get comma-separated key features string from a suite's fields
const getKeyFeaturesString = (fields: any[]): string => {
  const keyFeaturesField = fields?.find((f: any) => f.name === "Key Features");
  if (!keyFeaturesField || !Array.isArray(keyFeaturesField.jsonValue)) return "";
  return keyFeaturesField.jsonValue
    .map((kf: any) => kf.fields?.["Key Feature Name"]?.value)
    .filter(Boolean)
    .join(", ");
};

// Helper to map suitePlansRaw to Product schema (handle categories)
export const getSuitePlansSchemaArr = (suitePlansRaw: any[]): object[] => {
  if (!Array.isArray(suitePlansRaw) || suitePlansRaw.length === 0) return [];

  return suitePlansRaw.flatMap((category: any) => {
    const suites = category?.children?.results;
    if (!Array.isArray(suites) || suites.length === 0) return [];

    // Try to get category name from the first suite, fallback to empty string
    const firstSuite = suites[0];
    let categoryName = "";
    if (firstSuite?.fields) {
      const careLevelField = firstSuite.fields.find((f: any) => f.name === "Care Level");
      categoryName = careLevelField?.jsonValue?.fields?.["Suite Care Level"]?.value || "";
    }

    // Only return valid objects, filter out nulls before returning
    return suites
      .map((plan: any) => {
        if (!plan?.fields) return null;
        const suiteNameField = plan.fields.find((f: any) => f.name === "SuiteName");
        const suiteName = suiteNameField?.jsonValue?.fields?.suiteType?.value || "";
        const keyFeatures = getKeyFeaturesString(plan.fields);
        const priceField = plan.fields.find((f: any) => f.name === "Regular SuitePrice");
        const price = priceField?.jsonValue?.value || "";
        const offerName = priceField?.name || "";

        return {
          "@type": "Product",
          name: suiteName,
          category: categoryName,
          keywords: keyFeatures,
          image: plan.fields.find((f: any) => f.name === "background Image")?.jsonValue?.value?.src || "",
          description: plan.fields.find((f: any) => f.name === "Description")?.jsonValue?.value || "",
          offers: [
            {
              "@type": "Offer",
              name: offerName,
              price: price,
              priceCurrency: "CAD",
              availability: "https://schema.org/InStock",
            },
          ],
        };
      })
      .filter(Boolean) as object[];
  });
};

export const addProductJsonLd = (curUrl: string, sitecoreContext: SitecoreContextValue, router: any, hasAnnouncement: boolean): string => {
  if (!sitecoreContext?.route) return "";

  const ds = (sitecoreContext.route as any).fields;

  const faqPH = sitecoreContext.route.placeholders?.["headless-main"]?.filter((c: any) => c.componentName === "AccordionGroupContainer") || [];
  const blogAuthorsPH = sitecoreContext.route.placeholders?.["headless-main"]?.find((c: any) => c.componentName === "BlogArticle" || c.componentName === "BlogPostListByAuthor")?.fields || {};
  const blogAuthors = blogAuthorsPH?.Author?.[0]?.fields || blogAuthorsPH?.data?.ci?.author?.authorInfo?.[0]?.fields || [];

  // Use the utility function to get reviewsRaw from the deeply nested structure (Property OverviewPage)

  // Helper to extract reviews from either PropertyReviews or PropertyTestimonial
  function extractReviewsRaw(): any {
    const mainPH = sitecoreContext.route.placeholders?.["headless-main"] || [];
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

  const reviewsRaw = extractReviewsRaw();
  const reviewsSchemaArr = getReviewSchema(reviewsRaw, curUrl, ds);

  // const suitePlansRaw = sitecoreContext.route.placeholders?.["headless-main"]?.find((c: any) => c.componentName === "TabbedSuitePlans")?.fields?.data?.ds?.suitePlans?.targetItems || [];
  const suitePlansRaw =
    ((sitecoreContext?.route?.name === "suite-plans" || sitecoreContext?.route?.name === "plans-des-appartements") &&
      (sitecoreContext.route.placeholders?.["headless-main"]?.find((c: any) => c.componentName === "TabbedSuitePlans")?.fields?.data?.ds?.suitePlans?.targetItems ||
        sitecoreContext.route.placeholders?.["headless-main"]?.find((c: any) => c.componentName === "PropertySuitePlans")?.fields?.data?.ds?.children?.results)) ||
    [];
  const suitePlansSchemaArr = getSuitePlansSchemaArr(suitePlansRaw);

  const stickyBannerData = getStickyBannerData(sitecoreContext);
  const isActivePromo = checkIsItPromo(
    new Date(stickyBannerData?.data?.ds?.stickyPromoBannerStartDate?.jsonValue?.value),
    new Date(stickyBannerData?.data?.ds?.stickyPromoBannerEndDate?.jsonValue?.value)
  );

  const excludePages = stickyBannerData?.data?.ds?.stickyPromoExcludePages?.targetItems;
  const isPathExclude = excludePages?.some((e: any) => router.asPath?.split("/").filter(Boolean).includes(e?.displayName) || e?.name === sitecoreContext.route?.name) || false;

  const graph: object[] = [];

  if (sitecoreContext.route.templateName === "PropertyPage") {
    graph.push(getResidenceSchema(ds, curUrl, sitecoreContext.language));
    const faqs = getFAQSchema(faqPH, isActivePromo, hasAnnouncement, isPathExclude);
    if (faqs.length > 0) graph.push({ "@type": "FAQPage", mainEntity: faqs });
    if (reviewsSchemaArr.length > 0) {
      graph.push({
        "@type": "ItemList",
        itemListElement: reviewsSchemaArr,
      });
    }
    const event = getEventSchema(stickyBannerData, isActivePromo, hasAnnouncement, isPathExclude, sitecoreContext);
    if (event) graph.push(event);
  } else if (
    (!hasAnnouncement && !isPathExclude && ["home", "frequently-asked-questions"].includes(sitecoreContext.route.name?.toLowerCase())) ||
    ["BlogArticle", "BlogAuthor"].includes(sitecoreContext.route.templateName) ||
    ["reviews-and-ratings", "avis"].includes(sitecoreContext.route.name.toLowerCase()) ||
    ["suite-plans", "plans-des-appartements"].includes(sitecoreContext.route.name.toLowerCase())
  ) {
    graph.push(getOrganizationSchema(sitecoreContext.language));
    if (reviewsSchemaArr.length > 0) {
      graph.push({
        "@type": "ItemList",
        itemListElement: reviewsSchemaArr,
      });
    }
    // Add suite plans Product schema
    if (suitePlansSchemaArr.length > 0) {
      graph.push(...suitePlansSchemaArr);
    }

    if (sitecoreContext.route.name === "frequently-asked-questions") {
      const faqs = getFAQSchema(faqPH, isActivePromo, hasAnnouncement, isPathExclude);
      if (faqs.length > 0) graph.push({ "@type": "FAQPage", mainEntity: faqs });
    }
    if (["BlogArticle", "BlogAuthor"].includes(sitecoreContext.route.templateName)) {
      graph.push(...getBlogAuthorsSchema(blogAuthors, sitecoreContext.language));
    }
  }

  return graph.length > 0 ? JSON.stringify({ "@context": "https://schema.org", "@graph": graph }, null, 2) : "";
};

// For debugging/component identification in React DevTools
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
addProductJsonLd.displayName = "addProductJsonLd";
