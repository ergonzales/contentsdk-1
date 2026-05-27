import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import ChartwellLinkWithQS from "components/chartwellComponents/ui/link/ChartwellLinkWithQS"; // Adjust the import path as necessary
import { CheckIcon } from "@heroicons/react/24/outline";
import { useSitecoreContext } from "lib/sitecore/useSitecoreContext";


interface ResourceFiltersProps {
  uniquePersonalizationCategories: any[];
  contextItemPath: any;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}
const ResourceFilters: React.FC<ResourceFiltersProps> = ({ uniquePersonalizationCategories, contextItemPath, setCurrentPage }) => {
  const router = useRouter();
  const { sitecoreContext } = useSitecoreContext();
  const [activeCategoryName, setActiveCategoryName] = useState<string>("");
  const [activeUrl, setActiveUrl] = useState<string>("");

  const getActiveUrl = useCallback(() => {
    const url = sitecoreContext?.route?.fields?.category ? (sitecoreContext.route.fields.category as any)?.fields?.url?.value?.href : contextItemPath;
    setActiveUrl(url);
  }, [contextItemPath, sitecoreContext]);

  useEffect(() => {
    getActiveUrl();
  }, [getActiveUrl]);

  const determineActive = useCallback(() => {
    const urlParams = router.query.qs;
    if (!urlParams) {
      setActiveCategoryName("");
      return;
    }

    const category = uniquePersonalizationCategories?.find((cat: any) => urlParams === cat.displayName);
    if (category) {
      setActiveCategoryName(Array.isArray(urlParams) ? urlParams[0] : urlParams);
      getActiveUrl();
    } else {
      setActiveCategoryName("");
      setCurrentPage(1);
    }
  }, [getActiveUrl, router.query.qs, setCurrentPage, uniquePersonalizationCategories]);

  useEffect(() => {
    determineActive();
  }, [determineActive]);

  const setFilter = (categoryName: string) => {
    if (!categoryName || activeCategoryName?.trim() === categoryName.trim()) {
      setActiveCategoryName("");
      setCurrentPage(1);

      delete router.query.qs;
      router.replace(
        {
          pathname: router.pathname,
          query: router.query,
        },
        activeUrl
      );
      return;
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2  p-12 gap-8 sm:gap-24 items-center justify-center w-full mx-auto pt-2">
      {uniquePersonalizationCategories?.map((personalCategory: any, personalCategoryIndex: number) => {
        return (
          <React.Fragment key={personalCategory.displayName}>
            <div className={`${personalCategoryIndex == 0 ? "sm:place-self-end place-self-center" : "sm:place-self-start place-self-center"}`}>
              <div onClick={() => setFilter(personalCategory.displayName)}>
                <ChartwellLinkWithQS
                  href={{
                    url: activeUrl,
                    query: { qs: personalCategory.displayName },
                  }}
                  label={
                    <div className="flex justify-center items-center">
                      {personalCategory.displayName === activeCategoryName && <CheckIcon className="-ml-0.5 h-8 w-8 mr-3" aria-hidden="true" />}
                      {personalCategory?.fieldValue}
                    </div>
                  }
                  ariaLabel={personalCategory?.fieldValue}
                  color="plum"
                  textStyles={
                    personalCategory.displayName === activeCategoryName
                      ? "!text-white !bg-ChartwellPlum items-center justify-center w-[294px] p-4"
                      : "xs: mx-auto items-center justify-center w-[294px] p-4"
                  }
                  scroll={false}
                />
              </div>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default ResourceFilters;
