import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/router";
import { useI18n } from "next-localization";


import { FindAResidenceCard } from "../FindAResidence/FindAResidenceCard";
import { GoogleMapWrapper } from "../ProvinceFindAResidence/GooleMap/GoogleMapWrappe";
import { Selector } from "./Selector";
import { HeadingLevel } from "components/chartwellComponents/ui/HeadingLevel/HeadingLevel";
import { NearMeButton } from "components/chartwellComponents/ui/NearMeButton/NearMeButton";

import { ResidenceListModel } from "src/models/Residence";
import { deStructureProps, getRowsForPostalCode, getUniqueCities, populateModelData } from "lib/helpers/residence-helpers/index";
import { isThisPostalCode } from "lib/helpers/utils/postalcode-matcher";
import { fetchItemById } from "lib/helpers/helper";

import ChartwellMarkerPlum from "../../../../../public/stories/Map Banner/chartwell_pin.svg";
import { useSitecoreContext } from "lib/sitecore/useSitecoreContext";

type ProvinceOption = {
  id: string;
  language: string;
  name: string;
  provinceAbbr?: string;
  provinceItemName?: string;
  provinceSearchLink?: string;
};

type CityOption = any; // Keeps compatibility with existing `Selector` usage

type ProvinceResidenceSelectorProps = {
  // Keep loose to avoid breaking JSS typing
  [key: string]: any;
};

type ResidenceResultsProps = {
  residences: ResidenceListModel[];
  isGoogleMapAvailable: boolean;
  setIsGoogleMapAvailable: (value: boolean) => void;
};

const ResidenceResults = ({ residences, isGoogleMapAvailable, setIsGoogleMapAvailable }: ResidenceResultsProps) => {
  const { t: dictionary } = useI18n();
  if (!residences?.length)
    return (
      <div className="ChartwellContainer  flex items-center justify-center mt-6">
        <p className="data-h3">{dictionary("ProvinceResidenceSelectorNotFound")}</p>
      </div>
    );

  return (
    <div className="sm:grid md:grid-cols-6 mt-6 ">
      <ul className={`${isGoogleMapAvailable ? "col-span-4  sm:grid-cols-2 xl:grid-cols-3" : "col-span-6  md:grid-cols-3 xl:grid-cols-4"}  residence-list px-8 grid grid-cols-1 h-fit gap-6 py-6`}>
        {residences.map((residence) => (
          <FindAResidenceCard key={residence.residenceId} {...residence} />
        ))}
      </ul>

      {isGoogleMapAvailable && (
        <div className="col-span-2 hidden md:block">
          <div className="sticky top-0">
            <GoogleMapWrapper setIsGoogleMapAvailable={setIsGoogleMapAvailable} residences={residences} />
          </div>
        </div>
      )}
    </div>
  );
};

const ProvinceResidenceSelector = (props: ProvinceResidenceSelectorProps) => {
  const router = useRouter();
  const { sitecoreContext } = useSitecoreContext();
  const { t: dictionary } = useI18n();

  const [citySelected, setCitySelected] = useState<CityOption | []>([]);
  const [residencesListByPostalCode, setResidencesListByPostalCode] = useState<ResidenceListModel[]>([]);
  const [provinceList, setProvinceList] = useState<ProvinceOption[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isClick, setIsClick] = useState<boolean>(false);
  const [maxDistance, setMaxDistance] = useState<number>(25);
  const [isGoogleMapAvailable, setIsGoogleMapAvailable] = useState(true);
  const [provinceSelected, setProvinceSelected] = useState<ProvinceOption | null>(null);

  const data = useMemo(() => (sitecoreContext.route?.placeholders?.["headless-main"]?.find((component: any) => component.componentName === "ResidenceObjData") as any) || {}, [sitecoreContext.route]);

  const deStructuredProps = useMemo(() => deStructureProps(data), [data]);
  const residenceData = deStructuredProps?.ResidenceData;

  // Derived synchronously — no intermediate state needed
  const residencesList = useMemo(
    () => (residenceData ? populateModelData(residenceData, router, provinceSelected?.id) : []),
    // router.locale is the only router property that affects output
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [residenceData, provinceSelected, router.locale]
  );

  const uniqueCitiesList = useMemo(
    () => getUniqueCities(residencesList, router),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [residencesList, router.locale]
  );

  // Memoize city options to avoid a new array reference on every render
  const cityOptions = useMemo(() => uniqueCitiesList.map((el: any) => ({ ...el, name: el.cityDisplayName })), [uniqueCitiesList]);

  // Auto-select province if there's only one
  useEffect(() => {
    if (provinceList.length === 1) {
      setProvinceSelected(provinceList[0]);
    }
  }, [provinceList]);

  // Load provinces — re-runs only when the data source or locale changes, not on every navigation
  useEffect(() => {
    const combinedProvinces = residenceData?.combinedProvinces;
    if (!combinedProvinces) return;

    const fetchProvinces = async () => {
      const provinces = await Promise.all(
        combinedProvinces
          ?.flatMap((p: any) => p.languages)
          ?.filter((el: any) => el.language.name === router.locale)
          ?.map(async (el: any) => {
            let name = el?.field?.value ?? "";

            try {
              const fetchedItem = await fetchItemById(el.id, el.language.name, false);
              if (fetchedItem) {
                name = fetchedItem.find((f: any) => f.name === "Province Name")?.jsonValue?.value || "";
              }
            } catch {
              // Fallback to original name if fetch fails
              name = el?.field?.value ?? "";
            }

            return {
              id: el.id,
              language: el.language.name,
              name,
              provinceAbbr: el.provinceAbbreviation?.value,
              provinceItemName: el?.provinceItemName,
              provinceSearchLink: el?.searchLink?.url,
            } as ProvinceOption;
          }) || []
      );

      setProvinceList(provinces);
    };

    fetchProvinces();
  }, [residenceData?.combinedProvinces, router.locale]);

  // Reset city selection on route change
  useEffect(() => {
    setCitySelected([]);
  }, [router.asPath]);

  // Batch all province-change resets into one callback — avoids the render cycle where
  // stale city/postal data is visible for one frame before the reset useEffect fires
  const handleProvinceChange = useCallback((province: ProvinceOption | null) => {
    setProvinceSelected(province);
    setCitySelected([]);
    setResidencesListByPostalCode([]);
    setIsClick(false);
  }, []);

  // Postal code search — router.locale is the only router property that matters here
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (isThisPostalCode(searchTerm)) {
          const rows = await getRowsForPostalCode(searchTerm, maxDistance, sitecoreContext, router);
          setResidencesListByPostalCode(rows);
          setCitySelected([]);
        }
      } catch (error) {
        console.error("Error during fetching data:", error);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, maxDistance, router.locale]);

  if (!props) return null;

  const hasCitySelected = Array.isArray(citySelected) ? citySelected.length !== 0 : !!citySelected?.residences?.length;

  return (
    <div className="w-full SectionPadding bg-ChartwellGrey/5 ">
      <HeadingLevel headingLevel={props?.fields?.data?.ci?.ciHeadingLevel} titleText={props?.fields?.data?.ci?.ciHeading} styles="text-center mb-4 md:mb-6" />

      <div className="md:flex gap-4 justify-center items-center py-8 px-4">
        <NearMeButton
          icon={ChartwellMarkerPlum.src}
          setSearchTerm={setSearchTerm}
          setIsSearching={setIsClick}
          setMaxDistance={setMaxDistance}
          styleText="text-ChartwellPlum !text-[1.4rem]"
          BTNStyle="decoration-ChartwellPlum"
          iconSize={36}
        />

        {/* Province Selector */}
        {provinceList.length > 1 && (
          <div>
            <Selector label={dictionary("SelectProvince")} value={provinceSelected} options={provinceList} onChange={handleProvinceChange} />
          </div>
        )}

        {/* City Selector */}
        <div className="mt-4 md:mt-0">
          <Selector
            boxStyles={`${provinceList.length === 1 ? "!min-w-[300px]" : ""}`}
            ListboxButtonStyle={`${provinceList.length === 1 ? "py-3 !text-[1.1rem]" : ""}`}
            label={dictionary("SelectCity")}
            value={citySelected}
            options={cityOptions}
            onChange={setCitySelected}
            disabled={provinceSelected === null}
          />
        </div>
      </div>

      {/* Residence List by City */}
      {hasCitySelected && <ResidenceResults residences={citySelected?.residences ?? []} isGoogleMapAvailable={isGoogleMapAvailable} setIsGoogleMapAvailable={setIsGoogleMapAvailable} />}

      {/* Residence List by Postal Code */}
      {isClick && !hasCitySelected && <ResidenceResults residences={residencesListByPostalCode} isGoogleMapAvailable={isGoogleMapAvailable} setIsGoogleMapAvailable={setIsGoogleMapAvailable} />}
    </div>
  );
};

export default ProvinceResidenceSelector;
