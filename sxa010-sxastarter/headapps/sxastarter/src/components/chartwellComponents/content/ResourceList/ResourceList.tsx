import React, { useEffect, useState, useRef, useMemo } from "react";
import ResourceCard2 from "../Card/ResourceCard2";
import { ComponentRendering } from "@sitecore-content-sdk/nextjs";
import { useI18n } from "next-localization";
import { useRouter } from "next/router";
import LoadMore from "./LoadMore";
import ResourceFilters from "../ResourceFilters/ResourceFilters";
// import CategoryComponent from "../CategoryComponent/CategoryComponent";
import HRDivider from "../HRDivider/HRDivider";
import {
  filterResourceListByCategory,
  filterResourceListByPersonalizationCategory,
  getPersonalizationCategories,
  getUniqueCategories,
  // sortResourceListByDate,
  transformResources,
} from "lib/helpers/helper";
import { ContextFields, Resources } from "src/models/ResourceCard";
import { useSitecoreContext } from "lib/sitecore/useSitecoreContext";

interface ResourceListProps {
  fields: {
    data?: {
      ds?: {
        children?: {
          results: Resources[];
        };
      };
      ci?: any;
    };
  };
}

interface CategoryItem {
  targetItems: Array<{
    id: string;
    contextPath: string;
    // Add other relevant fields
  }>;
}

interface SitecoreComponent {
  componentName: string;
  fields: {
    data: {
      ds: {
        categories?: CategoryItem;
        children?: {
          results: Array<any>;
        };
      };
    };
  };
}

const ITEMS_PER_PAGE_DEFAULT = 9;
const ITEMS_PER_PAGE_FEATURED = 8;

const ResourceList: React.FC<ResourceListProps> = ({ fields }) => {
  const { sitecoreContext } = useSitecoreContext();
  const { t: dict } = useI18n();
  const router = useRouter();
  const resourceListRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadMore, setIsLoadMore] = useState(false);

  // Extract urlParams
  const urlParams = typeof router.query.qs === "string" ? router.query.qs : Array.isArray(router.query.qs) ? router.query.qs[0] : "";
  const contextFields: ContextFields = sitecoreContext.route?.fields || {};

  // Memoized extraction of categories and resources
  const { resourcesCategories, personalizationCategories, resourceProps } = useMemo(() => {
    try {
      const headlessMain = sitecoreContext.route?.placeholders?.["headless-main"] || [];
      const isSitecoreComponent = (item: any): item is SitecoreComponent => item && typeof item.componentName === "string" && item.fields?.data?.ds;
      const components = headlessMain.filter(isSitecoreComponent);
      const categoryComponent = components.find((item: any): item is ComponentRendering => (item as ComponentRendering).componentName === "CategoryComponent");
      const personalizationComponent = components.find((item: any): item is ComponentRendering => (item as ComponentRendering).componentName === "ResourcePersonalizationCategory");
      return {
        resourcesCategories: (categoryComponent?.fields?.data as any)?.ds?.categories?.targetItems || [],
        personalizationCategories: (personalizationComponent?.fields?.data as any)?.ds?.children?.results || [],
        resourceProps: fields?.data?.ds?.children?.results || [],
      };
    } catch (error) {
      console.error("Error processing Sitecore components:", error);
      return {
        resourcesCategories: [],
        personalizationCategories: [],
        resourceProps: [],
      };
    }
  }, [sitecoreContext.route, fields]);

  const uniqueCategories = useMemo(() => getUniqueCategories(resourcesCategories ?? [], { fields }), [resourcesCategories, fields]);
  const uniquePersonalizationCategories = useMemo(() => getPersonalizationCategories(personalizationCategories ?? []), [personalizationCategories]);

  // Filter and sort resources
  const filteredAndSortedResources = useMemo(() => {
    const resourceList = transformResources(resourceProps) ?? [];
    // if (!resourceList.length) return [];
    const byCategory = contextFields?.category?.id ? filterResourceListByCategory(resourceList, contextFields?.category?.id.replaceAll("-", "").toUpperCase()) : resourceList;
    const personalized = urlParams ? filterResourceListByPersonalizationCategory(byCategory, urlParams) : byCategory;
    return personalized;
    // return sortResourceListByDate(personalized);
    // return resourceList;
  }, [contextFields.category?.id, resourceProps, urlParams]);

  // Pagination logic
  const { currentItems, totalPages }: { currentItems: Resources[]; totalPages: number } = useMemo(() => {
    // Determine per-page count for first page
    // const isFeature = filteredAndSortedResources.length > 0 && filteredAndSortedResources[0].featured;
    const firstPageCount = ITEMS_PER_PAGE_FEATURED;
    const subsequentPageCount = ITEMS_PER_PAGE_DEFAULT;

    let endIdx = 0;
    if (currentPage === 1) {
      endIdx = firstPageCount;
    } else {
      endIdx = firstPageCount + (currentPage - 1) * subsequentPageCount;
    }
    const currentItems = filteredAndSortedResources.slice(0, endIdx);

    // Calculate total pages
    let totalPages = 1;
    if (filteredAndSortedResources.length > firstPageCount) {
      totalPages = Math.ceil((filteredAndSortedResources.length - firstPageCount) / subsequentPageCount) + 1;
    }

    return {
      currentItems,
      totalPages,
    };
  }, [filteredAndSortedResources, currentPage]);

  // Reset page on urlParams change
  useEffect(() => {
    setCurrentPage(1);
    setIsLoadMore(false);
  }, [urlParams]);

  // Scroll to top of resource list when currentPage changes
  useEffect(() => {
    if (!isLoadMore && resourceListRef.current) {
      resourceListRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentPage, isLoadMore]);

  // Only render if resources exist
  if (!fields?.data?.ds?.children?.results || !fields?.data?.ci) return null;

  const handleLoadMore = (page: number) => {
    setIsLoadMore(true);
    setCurrentPage(page);
  };

  // console.log(currentItems);

  return (
    <>
      <HRDivider />
      <ResourceFilters
        uniquePersonalizationCategories={uniquePersonalizationCategories}
        contextItemPath={uniqueCategories?.find((category: any) => category.contextPath)?.contextPath}
        setCurrentPage={handleLoadMore}
      />
      <div ref={resourceListRef} className="items-center justify-center mx-auto resource-list py-12">
        <div className="py-12 xs:px-12 px-3 w-full bg-ChartwellGrey-10">
          <div className="mx-auto md:px-4 text-center">
            {currentItems.length > 0 ? (
              <ul role="list" className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 3xl:grid-cols-4">
                {currentItems.map((resourceCard: Resources, index: number) => {
                  // Only treat as featured if it's the first item AND there are multiple items
                  const isFeatured = index === 0 && currentItems.length > 1;

                  return (
                    <li
                      key={`${resourceCard.resourceCardId}-${index}`}
                      className={`${
                        // Update condition here
                        isFeatured ? "md:col-span-2 col-span-1" : ""
                      } mb-5 flex flex-col shadow-card p-6 bg-white divide-gray-200 hover:transform hover:scale-105 transition duration-300 relative`}
                    >
                      {/* Update prop here */}
                      <ResourceCard2 featured={isFeatured} {...resourceCard} />
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="flex justify-center mt-4">
                <span className="px-4 py-2 mx-2">{dict("noResultsFound")}</span>
              </div>
            )}
            <div ref={loadMoreRef}>
              <LoadMore totalPages={totalPages} currentPage={currentPage} handleLoadMore={handleLoadMore} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResourceList;
