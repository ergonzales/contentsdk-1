import { useCallback, useState, useEffect } from "react";

import { deStructureProps, getUniqueCities, populateModelData } from "lib/helpers/residence-helpers";
import { useRouter } from "next/router";
import { ResidenceListModel } from "src/models/Residence";
import { useI18n } from "next-localization";
import { setLivingOptionsFieldValues, getIsBookATour, waitForElement, getIsOpenHousePage } from "lib/helpers/form/formAndDatalayerHelpers";
import { useSitecoreContext } from "lib/sitecore/useSitecoreContext";

const ResidenceLocationSelector = () => {
  const router = useRouter();
  const { sitecoreContext } = useSitecoreContext();
  const { t: dictionary } = useI18n();

  const [allProvinceResidenceList, setProvinceResidenceList] = useState<ResidenceListModel[]>([]);
  const [cityList, setCityList] = useState([]);
  const [residenceListByCity, setResidenceListbyCity] = useState<any[]>([]);
  const [province, setProvValue] = useState("");
  const [city, setCityValue] = useState("");
  const [residence, setResidenceValue] = useState("");
  const [isFormLoaded, setFormLoaded] = useState(false);

  const residenceData = deStructureProps(sitecoreContext?.route?.placeholders["headless-main"]?.find((component: any) => component.componentName == "ResidenceObjData") as any);
  const isBookATour = getIsBookATour(sitecoreContext);
  const excludeForOpenHouse = [11290, 11292, 11289, 11288, 11287, 11291, 11048];
  const isOpenHousePage = getIsOpenHousePage(sitecoreContext);

  const provinces = residenceData?.ResidenceData?.combinedProvinces
    ?.flatMap((p: any) => p.languages)
    ?.filter((el: any) => el.language.name === router.locale)
    ?.map((el: any) => {
      return {
        id: el.id,
        language: el.language.name,
        name: el.field.value,
        provinceAbbr: el.provinceAbbreviation?.value,
        provinceItemName: el?.provinceItemName,
        provinceSearchLink: el?.searchLink?.url,
      };
    });

  const residenceInputSelector = "input[name^='residence'][data-label='residence Hidden Field']";

  const getResidencesForProvince = useCallback(() => {
    const residencesByProvinceId = populateModelData(residenceData?.ResidenceData, router, province);

    if (isOpenHousePage) {
      const filteredResidenceList = residencesByProvinceId.filter((res: { propertyId: any }) => !excludeForOpenHouse.includes(Number(res.propertyId)));
      setProvinceResidenceList(filteredResidenceList as ResidenceListModel[]);
    } else {
      setProvinceResidenceList(residencesByProvinceId as ResidenceListModel[]);
    }
  }, [province, residenceData?.ResidenceData, router]);

  useEffect(() => {
    waitForElement("form[data-formid]").then(() => {
      setFormLoaded(true);
    });
  });

  useEffect(() => {
    const fetchData = async () => {
      getResidencesForProvince();
      setResidenceValue("");
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [province]);

  const updateCityList = useCallback(() => {
    setCityList(
      getUniqueCities(
        allProvinceResidenceList?.filter((res) => res.bookATourLink !== "" && res.bookATourLink !== undefined),
        router
      ) as any
    );
  }, [allProvinceResidenceList, router]);

  useEffect(() => {
    updateCityList();
  }, [updateCityList]);

  const updateResidenceList = useCallback(() => {
    const filteredResidences = allProvinceResidenceList
      .filter((res) => res.cityId === city && res.bookATourLink != "" && res.bookATourLink != undefined)
      .sort((a, b) => a.residenceName.localeCompare(b.residenceName));
    setResidenceListbyCity(filteredResidences);
  }, [allProvinceResidenceList, city]);

  useEffect(() => {
    updateResidenceList();
  }, [updateResidenceList]);

  useEffect(() => {
    const obj = document.querySelector(residenceInputSelector);
    if (obj) {
      const parentNode = obj.parentElement?.parentElement?.parentElement;
      if (parentNode) {
        const nodeToMove = document.getElementById("ResidenceFormSelectContainer") as HTMLElement;
        (parentNode.parentElement as HTMLElement)?.insertBefore(nodeToMove, parentNode);
        nodeToMove.classList.remove("superHidden");
      }
    }

    //custom code for edgewater LTC
    //const formSubmit = document.querySelector("form[data-formid$='-use'] button.submit-button");
    const ResSelector = document.querySelector("#ResidenceSelect");
    const lvOpts = document.querySelector("[name='dropdownMenu']") as HTMLElement;
    ResSelector?.addEventListener("change", () => {
      if (obj) {
        (obj as HTMLInputElement).value = (ResSelector as HTMLSelectElement).value;
        if ((obj as HTMLInputElement).value == "11280" && (lvOpts.getAttribute("data-value") == "MC" || lvOpts.getAttribute("data-value") == "AL")) {
          (obj as HTMLInputElement).value = "11279";
        }
      }
    });
  }, [isFormLoaded]);

  useEffect(() => {
    //need to update the selected residence in the form
    const eqResSelectElement: any = document.querySelector(residenceInputSelector) != null ? document.querySelector(residenceInputSelector) : null;
    const residenceDropdown = document.querySelector("#ResidenceSelect") as HTMLSelectElement;
    if (eqResSelectElement && residenceDropdown) {
      const eqResidenceSelected: any = Array.prototype.slice.call(residenceDropdown?.children).filter((opt) => opt.value === residence);
      eqResSelectElement.value = eqResidenceSelected[0]?.value;
    }
  }, [residence]);

  useEffect(() => {
    const CareServicesAll = residenceData.ResidenceData.combinedCareServices;
    setLivingOptionsFieldValues(CareServicesAll, residence, residenceData, sitecoreContext?.language as string);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [residence]);

  return (
    <div id="tempNode">
      <div id="ResidenceFormSelectContainer" className="layout container-fluid superHidden">
        <div className="row">
          <div className="grid-layout-col">
            <div className="layout-col col-sm-6 col-xs-12">
              <div id="ProvinceSelector" className="elq-field-style form-element-layout row">
                <div className="col-sm-12 col-xs-12">
                  <label className="elq-label" htmlFor="ProvSelect">
                    <span className="form-field-label">{isBookATour ? dictionary("ProvinceSelect") : dictionary("ProvinceSelect").replace("*", "")}</span>
                  </label>
                </div>
                <div className="col-sm-12 col-xs-12">
                  <div className="row">
                    <div className="col-xs-12">
                      <div className="field-control-wrapper">
                        <select
                          className="elq-item-select"
                          id="ProvSelect"
                          onChange={(e) => {
                            setProvValue(e.target.value);
                            setCityValue("");
                            setCityList([]);
                            setResidenceListbyCity([]);
                          }}
                        >
                          <option value=""></option>
                          {provinces.map((prov: any) => {
                            return (
                              <option value={`${prov.id}`} key={prov.id} data-val={prov.name} data-abbr={prov.provinceAbbr}>
                                {prov.name}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="grid-layout-col">
            <div className="layout-col col-sm-6 col-xs-12">
              <div id="CitySelector" className="elq-field-style form-element-layout row">
                <div className="col-sm-12 col-xs-12">
                  <label className="elq-label" htmlFor="CitySelect">
                    <span className="form-field-label">{isBookATour ? dictionary("CitySelect") : dictionary("CitySelect").replace("*", "")}</span>
                  </label>
                </div>
                <div className="col-sm-12 col-xs-12">
                  <div className="row">
                    <div className="col-xs-12">
                      <div className="field-control-wrapper">
                        <select
                          className="elq-item-select"
                          id="CitySelect"
                          onChange={(e) => {
                            setCityValue(e.target.value);
                            setResidenceListbyCity([]);
                          }}
                          disabled={!province || !cityList || cityList.length == 0 ? true : false}
                        >
                          <option value=""></option>
                          {cityList.map((city: any) => {
                            return (
                              <option value={`${city.cityId}`} key={city.cityId}>
                                {city.cityDisplayName}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="grid-layout-col">
            <div className="layout-col col-sm-6 col-xs-12">
              {residenceListByCity && residenceListByCity.length > 0 && (
                <div className="elq-field-style form-element-layout row">
                  <div className="col-sm-12 col-xs-12">
                    <label className="elq-label" htmlFor="ResidenceSelect">
                      <span className="form-field-label">{isBookATour ? dictionary("ResidenceSelect") : dictionary("ResidenceSelect").replace("*", "")}</span>
                    </label>
                  </div>
                  <div className="col-sm-12 col-xs-12">
                    <div className="row">
                      <div className="col-xs-12">
                        <div className="field-control-wrapper">
                          <select
                            className="elq-item-select"
                            id="ResidenceSelect"
                            onChange={(e) => {
                              const res = e.target as HTMLSelectElement;
                              setResidenceValue(res.value);
                              (document.querySelector("input[name^='residence']") as HTMLInputElement).value = res.value;
                              //SET LOCAL STORAGE FOR PERSONALIZATION
                              localStorage.setItem(
                                "chartwellBookTourResidence",
                                JSON.stringify({ resName: res[res.selectedIndex].innerText, resAddress: res[res.selectedIndex].getAttribute("data-addr") })
                              );
                              //only do the following line, if there are other options in the select with the same value as the currently selected option
                              const otherOptions = Array.from(res.options).filter((option) => option.value === res.value && option !== res.options[res.selectedIndex]);
                              if (otherOptions.length > 0) {
                                (document.querySelector("input[name='propertyIdAndName']") as HTMLInputElement).value = JSON.stringify({ id: res.value, name: res[res.selectedIndex].innerText });
                              } else {
                                (document.querySelector("input[name='propertyIdAndName']") as HTMLInputElement).value = "";
                              }
                            }}
                          >
                            <option value=""></option>
                            {residenceListByCity.map((Res: any) => {
                              if (Res.residenceName && Res.residenceName.length > 0) {
                                return (
                                  <option value={`${Res.propertyId}`} key={Res.residenceId} data-addr={Res.residenceAddress}>
                                    {Res.residenceName}
                                  </option>
                                );
                              } else {
                                return <></>;
                              }
                            })}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ResidenceLocationSelector;
