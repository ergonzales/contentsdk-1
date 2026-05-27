import { RichText } from "@sitecore-content-sdk/nextjs";
import { useCallback, useEffect, useState, JSX, useRef } from "react";
import { useRouter } from "next/router";
import { NextImageBkg } from "components/chartwellComponents/ui/BackgroundImage/BackgroundImage";
import { getCareServices, getProvinces, getRowsByCityAndResidenceName, getRowsForPostalCode } from "lib/helpers/residence-helpers/index";

import { CareServices } from "src/models/Residence";
import { ResidenceSearchInput } from "../../ui/ResidenceSearchInput/ResidenceSearchInput";
import { ChartwellModal } from "components/chartwellComponents/ui/modal/ChartwellModal";
import { NearMeButton } from "components/chartwellComponents/ui/NearMeButton/NearMeButton";
import { RangeInput } from "../../ui/RangeInput/RangeInput";
import { FakeSearchInput } from "./FakeSearchInput";
import { FilterOptions } from "components/chartwellComponents/ui/FilterOptions/FilterOptions";
import { useI18n } from "next-localization";
import { ChartwellLink } from "components/chartwellComponents/ui/link/ChartwellLink";
import { FindAResidenceCardList } from "./FindAResidenceCardList";

import ChartwellMarker from "../../../../../public/white_chartwell_marker.svg";
import ChartwellMarkerPlum from "../../../../../public/stories/Map Banner/chartwell_pin.svg";
import { isThisPostalCode } from "lib/helpers/utils/postalcode-matcher";
import { checkIsItPromo } from "lib/helpers/utils/checkIsItPromo";
import { getAbsolutePosition, getPromoBlockTextColor } from "lib/helpers/layoutOption";
import { useMediaQuery } from "react-responsive";
import { MobileFilterOptionButton } from "components/chartwellComponents/ui/FilterOptions/MobileFilterOptionButton";
import { MobileModalFilterOptions } from "components/chartwellComponents/ui/FilterOptions/MobileModalFilterOptions";
import { useSitecoreContext } from "lib/sitecore/useSitecoreContext";
import { resolveHref } from "lib/helpers/utils/resolve-href";

const areFilterOptionsEqual = (a: CareServices[], b: CareServices[]) => {
  if (a.length !== b.length) return false;
  return a.every((option, index) => {
    const next = b[index];
    return (
      option.id === next.id &&
      option.disabled === next.disabled &&
      option.selected === next.selected
    );
  });
};

// Utility function to get the value of a field by name from a fields array
const getFieldValueByName = (fields: any[], name: string, valueKey = "jsonValue") => {
  if (!Array.isArray(fields)) return undefined;
  const field = fields.find((f: any) => f.name === name);
  if (!field) return undefined;

  // Special case for 'title' to return the full jsonValue object
  if (name === "title") return field.jsonValue;

  const valueObj = field[valueKey];
  if (valueObj && typeof valueObj === "object" && valueObj !== null) {
    return "value" in valueObj ? valueObj.value : valueObj;
  }
  return valueObj;
};

const FindAResidence = (props: any): JSX.Element => {
  const { sitecoreContext } = useSitecoreContext();
  const { t: dictionary } = useI18n();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilterOptions, setSelectedFilterOptions] = useState<CareServices[]>([]);
  const [maxDistance, setMaxDistance] = useState(25);
  const [isSearching, setIsSearching] = useState(false);
  const [ResidencesList, setResidencesList] = useState<any[]>([]);
  const resultsRef = useRef<HTMLDivElement>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 767 });
  // Memoize selected options
  const selectedOptions = selectedFilterOptions.filter((option) => option.selected);
  const routerLocale = router.locale;
  const routerAsPath = router.asPath;

  // Fetch data on searchTerm or maxDistance change
  // Use stable primitives (locale, asPath) instead of router/sitecoreContext objects to avoid infinite re-renders
  useEffect(() => {
    if (!searchTerm?.trim()) {
      setIsSearching(false);
      setResidencesList([]);
      return;
    }

    const fetchData = async () => {
      try {
        if (isThisPostalCode(searchTerm)) {
          setResidencesList(await getRowsForPostalCode(searchTerm, maxDistance, sitecoreContext, router));
        } else {
          setResidencesList(getRowsByCityAndResidenceName(searchTerm, sitecoreContext, router));
        }
      } catch (error) {
        console.error("Error during fetching data:", error);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, maxDistance, routerLocale, routerAsPath]);

  // Province list
  const provinceList = getProvinces(router, sitecoreContext);

  // Filter care options
  const handleFilterCareOptions = useCallback(() => {
    const commonCareOptions: CareServices[] = getCareServices(router, sitecoreContext) || [];
    const residenceLivingOptions = ResidencesList?.flatMap((res: any) => res?.livingOptions?.map((option: CareServices) => option.id));
    const uniqueLivingOptions = residenceLivingOptions?.length > 1 ? [...new Set(residenceLivingOptions)] : [];
    const uniqueFilterOption =
      uniqueLivingOptions?.length > 1 ? commonCareOptions.filter((option: CareServices) => option.language.name === router.locale && uniqueLivingOptions.includes(option.id)) : [];
    const disabledFilterOption = commonCareOptions.map((option) => ({
      ...option,
      disabled: !uniqueFilterOption.some((uniqueOption) => uniqueOption.id === option.id),
      selected: false,
    }));
    setSelectedFilterOptions((prev) =>
      areFilterOptionsEqual(prev, disabledFilterOption) ? prev : disabledFilterOption
    );
  }, [ResidencesList, routerLocale, routerAsPath, sitecoreContext.route?.name]);

  useEffect(() => {
    handleFilterCareOptions();
  }, [handleFilterCareOptions]);

  // Handle filter option change
  const handlerFilterOption = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    e.stopPropagation();
    setSelectedFilterOptions((prev) => prev.map((opt, i) => (i === index ? { ...opt, selected: e.target.checked } : opt)));
  };

  // Set search term from router query
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

  // Get promotion data (avoid array index)
  const getFirstTruthy = (arr: any) => (Array.isArray(arr) ? arr.find(Boolean) : arr);
  const promotionData = getFirstTruthy(props?.fields?.Promotions)?.fields || getFirstTruthy(props.fields?.data?.ds?.promoData?.targetItems) || null;

  // Helper to get fallback value from multiple sources
  const getFallback = (...args: any[]) => args.find((v) => v !== undefined && v !== null);

  const promoPosition = getAbsolutePosition(getFallback(getFieldValueByName(props.fields?.data?.ds?.fields, "PromotionsTextBoxPosition"), props.fields?.PromotionsTextBoxPosition?.value));
  const promoTheme = getPromoBlockTextColor(
    getFallback(getFieldValueByName(props.fields?.data?.ds?.fields, "PromotionsTextBoxBackgroundColour"), props.fields?.PromotionsTextBoxBackgroundColour?.value)
  );
  const isPromoActive = Boolean(
    promotionData &&
      checkIsItPromo(getFallback(promotionData?.StartDate?.value, promotionData?.startDate?.jsonValue?.value), getFallback(promotionData?.EndDate?.value, promotionData?.endDate?.jsonValue?.value))
  );

  const promoData = (() => {
    if (!isPromoActive) {
      const fallbackImg = getFieldValueByName(props.fields?.data?.ds?.fields, "backgroundImage");
      return {
        position: "",
        theme: "",
        backgroundImageSrc: fallbackImg || props.fields?.["backgroundImage"],
      };
    }
    return {
      position: getAbsolutePosition(getFallback(getFieldValueByName(props.fields?.data?.ds?.fields, "PromotionsTextBoxPosition"), props.fields?.PromotionsTextBoxPosition?.value)),
      theme: getPromoBlockTextColor(getFallback(getFieldValueByName(props.fields?.data?.ds?.fields, "PromotionsTextBoxBackgroundColour"), props.fields?.PromotionsTextBoxBackgroundColour?.value)),
      backgroundImageSrc: getFallback(promotionData?.promoBackgroundImage?.jsonValue, promotionData?.["Promo Bkg Image"]?.jsonValue),
    };
  })();

  const isHeroSection = sitecoreContext.route?.name === "home" && getFallback(getFieldValueByName(props.fields?.data?.ds?.fields, "isHeroSection"), props.fields?.["isHeroSection"]?.value);

  const bgPosition = getFieldValueByName(props.fields?.data?.ds?.fields, "Background Position") || props.fields?.["Background Position"]?.value;

  // Render
  return (
    <>
      {/* Result UI */}
      <ChartwellModal open={isSearching} setOpen={setIsSearching} setMaxDistance={setMaxDistance} styles=" flex flex-col justify-center items-center relative ">
        <div className="bg-ChartwellWhite w-11/12 md:w-[95%] h-[90%] md:h-[95%] overflow-hiddenrounded-[0.5rem]">
          <div>
            <div className="md:flex justify-center bg-ChartwellPlum p-3">
              <ResidenceSearchInput
                styles={` ${isThisPostalCode(searchTerm) ? " md:translate-x-[-10%]" : " md:translate-x-[0]"} mx-auto md:mx-0 duration-300  `}
                maxDistance={maxDistance || 25}
                isSearchingDefault={true}
                setIsSearching={setIsSearching}
                setSearchTerm={setSearchTerm}
                searchTerm={searchTerm}
                setMaxDistance={setMaxDistance}
              />
              {isThisPostalCode(searchTerm) && (
                <div className={`flex items-center justify-center ${searchTerm.length ? "opacity-100" : "opacity-0 pointer-events-none"} duration-300 ease-in-out`}>
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

          <div className="w-full h-[calc(100%-150px)] sm:h-[calc(100%-210px)] md:h-[calc(100%-200px)] lg:h-[calc(100%-140px)]">
            <div className="h-full overflow-y-auto">
              {/* Residences by City */}
              {ResidencesList.length > 0 &&
                !isThisPostalCode(searchTerm) &&
                [...new Set(ResidencesList.filter((res: any) => res?.searchType === "subCity" || res.searchType === "city").map((res: any) => res.cityNameDisplay))].map((cityName) => (
                  <FindAResidenceCardList
                    key={cityName}
                    residences={ResidencesList.filter((res: any) => res?.cityNameDisplay === cityName && (res?.searchType === "subCity" || res.searchType === "city"))}
                    selectedOptions={selectedOptions}
                    type={"ByCity"}
                    city={cityName}
                  />
                ))}
              {/* Filter Residences by Name */}
              {!isThisPostalCode(searchTerm) && ResidencesList.length > 0 && ResidencesList.every((x: any) => x?.searchType !== "city") && (
                <FindAResidenceCardList type={"ByResidenceName"} residences={ResidencesList.filter((x: any) => x?.searchType === "residence")} selectedOptions={selectedOptions} />
              )}
              {/* Filter Residences by Postal Code */}
              {isThisPostalCode(searchTerm) && ResidencesList.length !== 0 && (
                <FindAResidenceCardList type={"DynamicDisplayingNearMe"} residences={ResidencesList} selectedOptions={selectedOptions} nearMePostalCode={searchTerm} maxDistance={maxDistance} />
              )}

              {isSearching && !ResidencesList.length && (
                <div className="flex flex-col  items-center ">
                  <div className="flex flex-col gap-4 items-center justify-center">
                    <h3 className="data-h3 text-center">{dictionary("NoResultsFound")}</h3>
                    <NearMeButton
                      icon={ChartwellMarkerPlum.src}
                      setSearchTerm={setSearchTerm}
                      setIsSearching={setIsSearching}
                      setMaxDistance={setMaxDistance}
                      styleText="text-ChartwellPlum"
                      BTNStyle="decoration-ChartwellPlum"
                      iconSize={36}
                    />
                  </div>
                  <h3 className="text-ChartwellGrey  mt-6">{dictionary("allResults")}</h3>
                  <ul className="flex flex-wrap items-center justify-center gap-2">
                    {provinceList &&
                      provinceList.map((province: any, index: any) => (
                        <li key={index} className=" ">
                          <ChartwellLink href={resolveHref(province?.searchLink?.url || province?.searchLink)} label={province?.field?.value} />
                        </li>
                      ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </ChartwellModal>
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

      {/* Initial UI */}
      {isHeroSection ? (
        // home page
        <>
          <div className="heroSection min-h-[30vh] sm:max-h-[35vh] md:max-h-[40vh] lg:max-h-[75vh] xl:max-h-[70vh]  relative lg:bg-fixed">
            <NextImageBkg field={promoData.backgroundImageSrc} bgPosition={bgPosition} />
            {isPromoActive ? (
              <div className={`absolute ${promoPosition} hidden md:block ${promoTheme.bgColor} p-6 xl:p-8 flex flex-col justify-center  `}>
                <p id="PromoTitleFindAResidence" className={`whitespace-normal  data-h1 !font-semibold !m-0   ${promoTheme.textColor} `}>
                  {getFallback(promotionData?.promoTitle?.jsonValue?.value, promotionData?.["Promotion Title"]?.value)}
                </p>

                <RichText field={getFallback(promotionData?.announcement?.jsonValue, promotionData?.AnnouncementContent)} className={`m-0 ChartwellText ${promoTheme.textColor}`} />
                {getFallback(promotionData?.promoCTALink?.jsonValue?.value?.href, promotionData?.CTALink?.value?.href) && (
                  <ChartwellLink
                    href={getFallback(promotionData?.promoCTALink?.jsonValue?.value?.href, promotionData?.CTALink?.value?.href)}
                    label={getFallback(promotionData?.promoCTA?.jsonValue?.value, promotionData?.PromoCTA?.value)}
                    tailwindStyles={`w ${promoTheme.CTAStyle} !mt-2 md:!mt-6`}
                  />
                )}
              </div>
            ) : (
              <div
                className={`  hidden md:flex flex-col items-center bg-ChartwellPlum lg:bg-ChartwellPlum/95 justify-center absolute py-8 px-14 right-0 bottom-0 md:bottom-[10%] duration-300 ease-in-out`}
              >
                <div className="flex items-center flex-col  gap-4">
                  <RichText tag="p" field={getFallback(props?.fields?.title, getFieldValueByName(props.fields?.data?.ds?.fields, "title"))} className=" !m-0  !text-white   data-h2"></RichText>
                  <FakeSearchInput setSearchTerm={setSearchTerm} setIsSearching={setIsSearching} />
                  <NearMeButton icon={ChartwellMarker.src} setSearchTerm={setSearchTerm} setIsSearching={setIsSearching} setMaxDistance={setMaxDistance} styleText="text-ChartwellWhite " />
                </div>
              </div>
            )}
          </div>
          {isPromoActive && (
            <div className={` md:hidden  ${promoTheme.bgColor} flex flex-col justify-center p-4 mx-auto w-full`}>
              <p id="PromoTitleFindAResidence" className={`whitespace-normal data-h1 !font-semibold !m-0 !mb-4  text-center ${promoTheme.textColor}`}>
                {getFallback(promotionData?.promoTitle?.jsonValue?.value, promotionData?.["Promotion Title"]?.value)}
              </p>

              <div className="flex flex-col items-center gap-2  border px-4 pb-4 border-ChartwellPlum">
                <RichText field={getFallback(promotionData?.announcement?.jsonValue, promotionData?.AnnouncementContent)} className={`!m-0 ChartwellText ${promoTheme.textColor}`} />
                {getFallback(promotionData?.promoCTALink?.jsonValue?.value?.href, promotionData?.CTALink?.value?.href) && (
                  <ChartwellLink
                    href={getFallback(promotionData?.promoCTALink?.jsonValue?.value?.href, promotionData?.CTALink?.value?.href)}
                    label={getFallback(promotionData?.promoCTA?.jsonValue?.value, promotionData?.PromoCTA?.value)}
                    tailwindStyles={`w ${promoTheme.CTAStyle} !mt-2 md:!mt-6`}
                  />
                )}
              </div>
            </div>
          )}
          <div className={`  ${isPromoActive ? " " : "md:hidden flex-col"} w-full flex  items-center bg-ChartwellPlum lg:bg-ChartwellPlum/95 justify-center p-4 duration-300 ease-in-out`}>
            <div className={`${isPromoActive ? " gap-8" : "  gap-2"} md:flex-row flex items-center  flex-col`}>
              <RichText
                tag="p"
                field={getFallback(props?.fields?.title, getFieldValueByName(props.fields?.data?.ds?.fields, "title"))}
                className=" !m-0  !text-white whitespace-normal  data-h2"
              ></RichText>
              <FakeSearchInput setSearchTerm={setSearchTerm} setIsSearching={setIsSearching} />
              <NearMeButton icon={ChartwellMarker.src} setSearchTerm={setSearchTerm} setIsSearching={setIsSearching} setMaxDistance={setMaxDistance} styleText="text-ChartwellWhite " />
            </div>
          </div>
        </>
      ) : (
        // Find A Residence page
        <div className="flex flex-col md:flex-row w-full items-center bg-ChartwellPlum lg:bg-ChartwellPlum/95 justify-center  px-4 py-3 lg:p-24 lg:py-8 xl:p-24 xl:py-8 right-0 bottom-0 md:bottom-[10%] duration-300 ease-in-out">
          <div className="xs:flex flex-col md:flex-row gap-2 md:gap-5 lg:gap-8 items-center">
            <RichText
              tag="p"
              field={getFallback(props?.fields?.title, getFieldValueByName(props.fields?.data?.ds?.fields, "title"))}
              className=" !m-0 text-center  !text-white whitespace-normal  data-h3 lg:data-h2"
            ></RichText>

            <FakeSearchInput setSearchTerm={setSearchTerm} setIsSearching={setIsSearching} />
            <NearMeButton icon={ChartwellMarker.src} setSearchTerm={setSearchTerm} setMaxDistance={setMaxDistance} setIsSearching={setIsSearching} styleText="text-ChartwellWhite " />
          </div>
        </div>
      )}
    </>
  );
};
export default FindAResidence;
