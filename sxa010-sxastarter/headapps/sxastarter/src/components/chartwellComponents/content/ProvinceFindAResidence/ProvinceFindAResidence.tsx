import { useState, useEffect, useCallback, useRef } from "react";
import React from "react";

import { useRouter } from "next/router";

import { getCareServices, getProvinceId, getRowsByCityAndResidenceName, getRowsByProvince, getRowsForPostalCode } from "lib/helpers/residence-helpers";
import { ResidenceSearchInput } from "../../ui/ResidenceSearchInput/ResidenceSearchInput";
import { FilterOptions } from "components/chartwellComponents/ui/FilterOptions/FilterOptions";
import { RangeInput } from "components/chartwellComponents/ui/RangeInput/RangeInput";

import { useI18n } from "next-localization";
import { RenderResidencesByTypes } from "./RenderResidencesByTypes";
import { isThisPostalCode } from "lib/helpers/utils/postalcode-matcher";
import { RenderProvinceUniqueCities } from "./RenderProvinceUniqueCities";
import { MobileModalFilterOptions } from "components/chartwellComponents/ui/FilterOptions/MobileModalFilterOptions";
import { useMediaQuery } from "react-responsive";
import { MobileFilterOptionButton } from "components/chartwellComponents/ui/FilterOptions/MobileFilterOptionButton";
import { useSitecoreContext } from "lib/sitecore/useSitecoreContext";

const areFilterOptionsEqual = (a: any[], b: any[]) => {
  if (a.length !== b.length) return false;
  return a.every((option, index) => {
    const next = b[index];
    return option.id === next.id && option.disabled === next.disabled && option.selected === next.selected;
  });
};

const ProvinceFindAResidence = () => {
  const router = useRouter();
  const { t: dictionary } = useI18n();
  const { sitecoreContext } = useSitecoreContext();

  const [maxDistance, setMaxDistance] = useState(25);
  const [isSearching, setIsSearching] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilterOptions, setSelectedFilterOptions] = useState<any[]>([]);
  const [ResidencesList, setResidencesList] = useState<any[]>([]);
  const resultsRef = useRef<HTMLDivElement>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 767 });

  const selectedOptions = selectedFilterOptions.filter((option) => option.selected);
  const routerLocale = router.locale;
  const routerAsPath = router.asPath;
  const routeName = sitecoreContext?.route?.name;

  useEffect(() => {
    let isMounted = true;
    const provinceId = getProvinceId(router, sitecoreContext);
    const fetchData = async () => {
      try {
        let data = [];

        if (searchTerm && isSearching && isThisPostalCode(searchTerm)) {
          data = await getRowsForPostalCode(searchTerm, maxDistance, sitecoreContext, router, provinceId);
        } else if (provinceId && !isSearching && !isThisPostalCode(searchTerm)) {
          data = getRowsByProvince(searchTerm, sitecoreContext, router, provinceId);
        } else {
          data = getRowsByCityAndResidenceName(searchTerm, sitecoreContext, router, provinceId);
        }

        if (isMounted) setResidencesList(data);
      } catch (error) {
        console.error("Error fetching residences:", error);
      }
    };

    fetchData();
    return () => {
      isMounted = false; // Avoid updating state on unmounted component
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, maxDistance, isSearching, routerLocale, routerAsPath, routeName]);
  const FilterCareOptions = useCallback(() => {
    const commonCareOptions = getCareServices(router, sitecoreContext) || [];
    const residenceLivingOptions =
      ResidencesList?.flatMap((res) =>
        res.searchType === "city" || res.searchType === "residence" || isThisPostalCode(searchTerm)
          ? res.livingOptions?.map((option: any) => option.id)
          : res.residences?.flatMap((lpRes: any) => lpRes.livingOptions?.map((option: any) => option.id))
      ) || [];

    const uniqueLivingOptions = [...new Set(residenceLivingOptions)];
    const uniqueFilterOption = commonCareOptions.filter((option: any) => uniqueLivingOptions.includes(option.id));

    const disabledFilterOption = commonCareOptions.map((option: any) => ({
      ...option,
      disabled: !uniqueFilterOption.some((uniqueOption: any) => uniqueOption.id === option.id),
      selected: false,
    }));

    const nextOptions = sitecoreContext?.route?.name !== "british-columbia" ? disabledFilterOption.filter((option: any) => option.itemName !== "Long Term Care") : disabledFilterOption;

    setSelectedFilterOptions((prev) => (areFilterOptionsEqual(prev, nextOptions) ? prev : nextOptions));
  }, [searchTerm, ResidencesList, routerLocale, routeName]);

  useEffect(() => {
    FilterCareOptions();
  }, [FilterCareOptions]);

  const handlerFilterOption = useCallback((e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    e.stopPropagation();
    setSelectedFilterOptions((prevOptions) => {
      const newFilterOptions = [...prevOptions];
      newFilterOptions[index].selected = e.target.checked;
      return newFilterOptions;
    });
  }, []);

  useEffect(() => {
    const raw = router.query?.postalcode;
    if (!raw) return;

    // Decode URL-encoded values (e.g. "%M8z%" → "M8z")
    const decoded = decodeURIComponent(String(raw));

    // Remove all non-alphanumeric characters (keep letters/numbers only)
    const cleanedPostalCode = decoded.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();

    // Stop if cleaned value is too short
    if (cleanedPostalCode.length < 3) return;

    // Optional: validate Canadian postal code pattern

    if (cleanedPostalCode) {
      setSearchTerm(cleanedPostalCode);
      setIsSearching(true);
    }
  }, [router.query?.postalcode]);

  return (
    <>
      {isMobile && (
        <MobileModalFilterOptions
          isMobile={isMobile}
          isFilterOpen={isFilterOpen}
          setIsFilterOpen={setIsFilterOpen}
          setMaxDistance={setMaxDistance}
          selectedFilterOptions={selectedFilterOptions}
          setSelectedFilterOptions={setSelectedFilterOptions}
          ResidencesList={ResidencesList}
          resultsRef={resultsRef}
          handlerFilterOption={handlerFilterOption}
        />
      )}
      <div className="w-full px-6 relative">
        <div className="relative w-full">
          <div className="md:flex justify-center bg-ChartwellPlum p-3 w-full">
            <ResidenceSearchInput
              styles={` ${isThisPostalCode(searchTerm) ? " md:translate-x-[-10%]" : " md:translate-x-[0]"} mx-auto md:mx-0 duration-300  `}
              setIsSearching={setIsSearching}
              setSearchTerm={setSearchTerm}
              maxDistance={maxDistance}
              searchTerm={searchTerm}
              setMaxDistance={setMaxDistance}
            />
            {isThisPostalCode(searchTerm) && (
              <div className={`flex items-center justify-center ${isThisPostalCode(searchTerm) ? "opacity-100" : "opacity-0 pointer-events-none"} duration-300 ease-in-out`}>
                <RangeInput setDistance={setMaxDistance} />
              </div>
            )}
          </div>
          {isMobile
            ? ResidencesList.length > 0 && <MobileFilterOptionButton isFilterOpen={isFilterOpen} setIsFilterOpen={setIsFilterOpen} selectedFilterOptions={selectedFilterOptions} />
            : ResidencesList.length > 0 && (
                <FilterOptions
                  isMobile={isMobile}
                  isFilterOpen={isFilterOpen}
                  setIsFilterOpen={setIsFilterOpen}
                  ref={resultsRef}
                  filterOptions={selectedFilterOptions}
                  onChange={handlerFilterOption}
                />
              )}
        </div>

        <div className=" py-0 relative">{!isSearching && <RenderProvinceUniqueCities residences={ResidencesList} selectedOptions={selectedOptions} />}</div>

        {isSearching && (
          <div className="py-8">
            {isSearching &&
              !isThisPostalCode(searchTerm) &&
              ResidencesList?.length > 0 &&
              [...new Set(ResidencesList?.filter((res: any) => res?.searchType === "subCity" || res.searchType === "city")?.map((res: any) => res.cityNameDisplay))].map((cityName) => {
                return (
                  <RenderResidencesByTypes
                    key={cityName}
                    residences={ResidencesList?.filter((res: any) => res?.cityNameDisplay === cityName && (res?.searchType === "subCity" || res.searchType === "city"))}
                    selectedOptions={selectedOptions}
                    type={"ByCity"}
                    cityName={cityName}
                  />
                );
              })}

            {isSearching && !isThisPostalCode(searchTerm) && ResidencesList?.length > 0 && ResidencesList?.every((x: any) => x?.searchType !== "city") && (
              <RenderResidencesByTypes type="ByResidenceName" residences={ResidencesList?.filter((x: any) => x?.searchType === "residence")} selectedOptions={selectedOptions} />
            )}

            {isSearching && isThisPostalCode(searchTerm) && ResidencesList?.length > 0 && (
              <RenderResidencesByTypes type="DynamicDisplayingNearMe" residences={ResidencesList} selectedOptions={selectedOptions} nearMePostalCode={searchTerm} maxDistance={maxDistance} />
            )}
            {isSearching && ResidencesList?.length === 0 && (
              <div className="w-full flex items-center justify-center ">
                <h3 className="data-h3">{dictionary("NoResultsFound")}</h3>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default ProvinceFindAResidence;
