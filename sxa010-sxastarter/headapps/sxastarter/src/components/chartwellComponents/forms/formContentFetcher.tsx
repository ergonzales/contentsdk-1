import { useCallback, useState, useEffect, SetStateAction } from "react";

import { filterArrayByDuplicateKeyWithPriorityLanguage, uniqueByProperty } from "lib/helpers/helper";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/router";
import { deStructureProps, populateModelData } from "lib/helpers/residence-helpers";
import { useSitecoreContext } from "lib/sitecore/useSitecoreContext";

export const FormContentFetcher = () => {
  const router = useRouter();
  const context = useSitecoreContext();

  const residenceData = deStructureProps(context?.sitecoreContext?.route?.placeholders["headless-main"]?.find((component: any) => component.componentName == "ResidenceObjData") as any);

  // const provinces =
  //   residenceData?.ResidenceData?.combinedProvinces
  //     ?.filter((province: any) => province.language === context?.sitecoreContext?.language)
  //     .map((province: any) => ({
  //       text: {
  //         en: residenceData?.ResidenceData?.combinedProvinces?.find((x: any) => x.language === "en" && x.id === province.id)?.name,
  //         fr: residenceData?.ResidenceData?.combinedProvinces?.find((x: any) => x.language === "fr" && x.id === province.id)?.name,
  //       },
  //       value: province.name,
  //       shortVal: province.provinceAbbr,
  //     })) || [];

  const provinces =
    residenceData?.ResidenceData?.combinedProvinces
      ?.flatMap((p: any) => p.languages)
      ?.filter((el: any) => el.language.name === router.locale)
      .map((province: any) => ({
        text: {
          en: residenceData?.ResidenceData?.combinedProvinces?.flatMap((p: any) => p.languages)?.find((x: any) => x.language.name === "en" && x.id === province.id)?.field.value,
          fr: residenceData?.ResidenceData?.combinedProvinces?.flatMap((p: any) => p.languages)?.find((x: any) => x.language.name === "fr" && x.id === province.id)?.field.value,
        },
        value: province.field.value,
        shortVal: province.provinceAbbreviation.value,
      })) || [];

  const [formLoaded, setFormLoaded] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const [allProvinceResidenceList, setAllResidenceList] = useState<any[]>([]);
  const [residenceList, setResidenceList] = useState<any[]>([]);
  const [residenceListByCity, setResidenceListbyCity] = useState<any[]>([]);
  const [cityList, setCityList] = useState<any[]>([]);
  const [city, setCityValue] = useState("");
  const [residenceValue, setResidenceValue] = useState("");
  const [tyPageURL, setTyPageURL] = useState("");

  const getResidencesForProvince = useCallback(
    (prov: string) => {
      const provinceId = residenceData?.ResidenceData?.combinedProvinces?.find((x: any) => x.name === prov)?.id;
      const residences = populateModelData(residenceData?.ResidenceData, router, provinceId);

      setCityList([]);
      const cleanResList: SetStateAction<any[]> = [];
      residences?.forEach((res: any) => {
        const row = {
          id: res.residenceId,
          text: {
            en: res.residenceName,
            fr: res.residenceName,
          },
          value: res.propertyId,
          city: res.cityNameDisplay,
          province: res.provinceName,
          bookATourLink: res.bookATourLink,
          language: res.language,
          latitude: res.Lat,
          longitude: res.Lng,
          careServicesAvailable: res.careServiceAvailable,
        };
        cleanResList.push(row);
      });
      setAllResidenceList(cleanResList);
    },
    [residenceData, router]
  );

  const cleanupScSelects = (select: HTMLInputElement) => {
    const parent = select.parentElement?.parentElement as HTMLElement;
    if (parent.children && parent.querySelector(".form-select-option-container")) {
      parent?.removeChild(parent.querySelector(".form-select-option-container") as HTMLElement);
      parent?.removeChild(parent.querySelector(".mdi.mdi-menu-down ") as HTMLElement);
    }
    select.classList.add("hidden");
  };

  //to create the temporary inputs.
  const createOrUpdateHiddenField = (inputName: string, value: string) => {
    const selector = `input[name='${inputName}___cw']`;
    if (!document.querySelector(selector)) {
      const newHiddenField = document.createElement("input");
      newHiddenField.setAttribute("name", inputName + "___cw");
      newHiddenField.setAttribute("value", value);
      newHiddenField.setAttribute("type", "hidden");
      document.querySelector("form.content.lp-flex-container")?.append(newHiddenField);
    } else {
      (document.querySelector(selector) as HTMLInputElement).setAttribute("value", value);
    }
  };

  const createOptionDropdowns = (options: any, select: HTMLInputElement) => {
    const parent = select.parentElement?.parentElement as HTMLElement;

    const newSelect = document.createElement("select");
    const newSelectName = select.name + "_" + uuidv4();
    newSelect.setAttribute("id", newSelectName);
    newSelect.setAttribute("name", newSelectName);
    newSelect.setAttribute("data-input", select.getAttribute("data-id") || "");

    const firstOption = document.createElement("option");
    firstOption.innerText = router.locale == "en" ? "Please select..." : "Veuillez sÃ©lectionner...";
    firstOption.setAttribute("value", "");
    firstOption.setAttribute("style", "opacity: 0.5");
    newSelect.appendChild(firstOption);

    for (const option of options) {
      // create a new div element
      const newOption = document.createElement("option");

      newOption.setAttribute("value", option.value);
      newOption.innerText = option.text[router?.locale as string] || option.text["en"];

      newSelect.appendChild(newOption);
    }
    parent.appendChild(newSelect);
    return newSelect;
  };

  //following appends params to the thank you page url. To be used for Datalayers
  const createParams = () => {
    const current = document.location.origin + document.location.pathname;
    const currParams = new URLSearchParams(document.location.search);
    const a = document.createElement("a") as HTMLAnchorElement;
    const hasTyPage = document.querySelector("form:not(.elq-form) [name='thankYouPageURL']") as HTMLInputElement;
    a.href = !hasTyPage || !hasTyPage.value.includes("http") ? current + (router.locale == "en" ? "/thank-you" : "/merci") : hasTyPage.value;

    const params = new URLSearchParams(a.search);
    currParams.forEach((value, field) => {
      params.set(field, value);
    });

    const forWho = document.querySelector('form:not(.elq-form) [name="yourselforLovedone"]') as HTMLSelectElement;
    const forWhoElse = document.querySelector('form:not(.elq-form) select[name="type"]') as HTMLSelectElement;
    let contactType = document.querySelector('form:not(.elq-form) [name="contactType"]') as HTMLInputElement;
    if (document.querySelector('form:not(.elq-form) [name="contacttype"]')) contactType = document.querySelector('[name="contacttype"]') as HTMLInputElement;

    const regEx = new RegExp("se?lf");

    if (forWho) {
      params.set("fw", regEx.test(forWho.value.toLowerCase()) ? "SLF" : "CHI");
    }
    if (forWhoElse) {
      params.set("fw", regEx.test(forWhoElse.value.toLowerCase()) ? "SLF" : "CHI");
    }
    if (contactType) {
      params.set("fw", contactType.value);
    }

    const reasons = document.querySelector('form:not(.elq-form) [name="subject"]') as HTMLInputElement;
    if (reasons) {
      params.set("rs", encodeURI(reasons.value));
    }
    const prov = document.querySelector("form:not(.elq-form) #ProvSelect") as HTMLSelectElement;
    if (prov) {
      params.set("p", encodeURI(prov.value));
    } else {
      params.set("p", "corporate");
    }

    const city = document.querySelector("form:not(.elq-form) #CitySelect") as HTMLSelectElement;
    if (city) {
      params.set("c", encodeURI(city.value));
    } else {
      params.set("c", "corporate");
    }

    const residence = document.querySelector("form:not(.elq-form) #ResidenceSelect") as HTMLSelectElement;
    if (residence) {
      const regex = /(c|C)hartwell /;
      params.set("h", encodeURI(residence.options[residence.selectedIndex].text.replace(regex, "")));
      params.set("b", residence.options[residence.selectedIndex].getAttribute("data-bilingual") || "false");
      params.set("ip", residence.options[residence.selectedIndex].getAttribute("data-ispriorityproperty") || "No");
      params.set("ri", residence.value);
    }

    a.search = params.toString();
    setTyPageURL(a.href);
  };

  const getOpts = (formEle: HTMLElement) => {
    const currSelects: NodeList = formEle.parentElement?.parentElement?.querySelectorAll("div.form-select-option-container div.form-select-option") as NodeList;
    const Options: any[] = [];

    currSelects.forEach((s: HTMLElement) => {
      const v = s.getAttribute("data-value");
      const t = { en: "", fr: "" };
      t[router.locale == "en" ? "en" : "fr"] = s.querySelector(".text-indicator")?.textContent as string;
      Options.push({ value: v, text: t });
    });

    return Options;
  };

  const createSelect = (selector: string) => {
    if (document.querySelector(selector)) {
      const Select: HTMLInputElement = document.querySelector(selector) as HTMLInputElement;
      const opts = getOpts(document.querySelector(selector) as HTMLElement);
      cleanupScSelects(Select);
      const newSelect = createOptionDropdowns(opts, Select);

      newSelect.addEventListener("change", () => {
        Select.setAttribute("value", newSelect.value);
        createOrUpdateHiddenField(Select.name, Select.value);
      });
    }
  };

  useEffect(() => {
    if (residenceList && residenceList.length > 0) {
      let tmp: any[] = residenceList;
      tmp = tmp.filter((res: any) => res.bookATourLink != "");
      const allCityList: any[] = tmp?.map((residence: any) => {
        return {
          id: residence.id,
          name: residence.city,
          latitude: residence.latitude,
          longitude: residence.longitude,
        };
      });
      const uniqueCityList: [] = uniqueByProperty(allCityList, "name");
      uniqueCityList.sort((a: any, b: any) => {
        const A = a.name?.toUpperCase();
        const B = b.name?.toUpperCase();
        return A < B ? -1 : B > A ? 1 : 0;
      });
      const citiesInProv: any[] = [];
      uniqueCityList.forEach((city: any) => {
        const row = {
          id: city.id,
          text: {
            en: city.name,
            fr: city.name,
          },
          value: city.name,
        };
        citiesInProv.push(row);
      });
      setCityList(citiesInProv);
    } else {
      setCityList([]);
    }
  }, [residenceList]);

  useEffect(() => {
    document.querySelector("[name^='CitySelect_']")?.remove();
    if (document.querySelector("[name='CitySelect']")) {
      const cSelect: HTMLInputElement = document.querySelector("[name='CitySelect']") as HTMLInputElement;
      //const citySelectInputs: HTMLElement = cSelect?.parentElement?.parentElement?.querySelector(".form-select-option-container") as HTMLElement;
      const newSelect = createOptionDropdowns(cityList, cSelect);
      if (cityList.length > 0) {
        newSelect.removeAttribute("disabled");
      }

      newSelect.addEventListener("change", () => {
        cSelect.value = newSelect.value;
        setCityValue(newSelect.value);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cityList]);

  useEffect(() => {
    const filteredResidences = residenceList.filter((res) => res.city === city);
    let tmp: any = filteredResidences;
    tmp = tmp.filter((res: any) => res.bookATourLink != "");
    setResidenceListbyCity(tmp);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [city]);

  useEffect(() => {
    document.querySelector("form:not(.elq-form) [name^='ResidenceSelectTmp_']")?.remove();
    if (document.querySelector("form:not(.elq-form) [name='ResidenceSelectTmp']")) {
      const Select: HTMLInputElement = document.querySelector("[name='ResidenceSelectTmp']") as HTMLInputElement;
      //const SelectInputs: HTMLElement = Select?.parentElement?.parentElement?.querySelector(".form-select-option-container") as HTMLElement;
      const newSelect = createOptionDropdowns(residenceListByCity, Select);
      if (residenceListByCity.length == 0) {
        newSelect.removeAttribute("disabled");
      }
      newSelect.addEventListener("change", () => {
        Select.value = newSelect.value;
        setResidenceValue(newSelect.value);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [residenceListByCity]);

  useEffect(() => {
    //console.log(residenceValue);
    document.querySelector("form:not(.elq-form) [name='ResidenceSelect']")?.setAttribute("value", residenceValue);
    document.querySelector("form:not(.elq-form) [name='residence']")?.setAttribute("value", residenceValue);
    //console.log(document.querySelector("[name='ResidenceSelect']")?.getAttribute("value"));
  }, [residenceValue]);

  useEffect(() => {
    setResidenceListbyCity([]);

    if (allProvinceResidenceList && allProvinceResidenceList.length > 0) {
      const filteredResidenceLocationList = filterArrayByDuplicateKeyWithPriorityLanguage(allProvinceResidenceList, "id", router.locale);
      setResidenceList(filteredResidenceLocationList);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allProvinceResidenceList]);

  useEffect(() => {
    document.querySelector("form:not(.elq-form).content .submit-button")?.addEventListener("click", (e: Event) => {
      e.preventDefault();
      return false;
    });

    // convert the non accessible selects
    // careful, do this only for selects that update hidden fields and nothing else
    const selectors = [
      "form:not(.elq-form) [name='contactType']", // contact type
      "form:not(.elq-form) [name='contacttype']", // contact type
      "form:not(.elq-form) [name='type']", // contact type
      "form:not(.elq-form) [name='yourselforLovedone']", // contact type
      "form:not(.elq-form) [name='dropdownMenu']", //living options
      "form:not(.elq-form) [name='subject']", //reason for contact
      "form:not(.elq-form) [name='preferredTime1']", //preferred time
    ];
    selectors.forEach((selector) => {
      createSelect(selector);
    });

    if (document.querySelector("form:not(.elq-form) [name='preferredDate']")) {
      const currDate = new Date();
      const minDate = new Date(currDate.setDate(currDate.getDate() + 2));
      const calendarMin = minDate.getFullYear() + "-" + (minDate.getMonth() + 1) + "-01";
      document.querySelector("form:not(.elq-form) [name='preferredDate']")?.setAttribute("min", calendarMin);
      document.querySelector("form:not(.elq-form) [name='preferredDate']")?.setAttribute("value", minDate.getFullYear() + "-" + (minDate.getMonth() + 1) + "-" + minDate.getDate());
    }

    if (document.querySelector("form:not(.elq-form) [name='ProvSelect']")) {
      const pSelect: HTMLInputElement = document.querySelector("form:not(.elq-form) [name='ProvSelect']") as HTMLInputElement;
      //const provSelectInputs: HTMLElement = pSelect?.parentElement?.parentElement?.querySelector(".form-select-option-container") as HTMLElement;
      cleanupScSelects(pSelect);
      const newSelect = createOptionDropdowns(provinces, pSelect);
      newSelect.addEventListener("change", async () => {
        pSelect.value = newSelect.value;
        return getResidencesForProvince(newSelect.value);
      });
    }

    if (document.querySelector("form:not(.elq-form) [name='CitySelect']")) {
      const cSelect: HTMLInputElement = document.querySelector("form:not(.elq-form) [name='CitySelect']") as HTMLInputElement;
      //const citySelectInputs: HTMLElement = cSelect?.parentElement?.parentElement?.querySelector(".form-select-option-container") as HTMLElement;
      cleanupScSelects(cSelect);
      const newSelect = createOptionDropdowns(cityList, cSelect);
      newSelect.setAttribute("disabled", "disabled");
    }

    if (document.querySelector("form:not(.elq-form) [name='ResidenceSelectTmp']")) {
      const Select: HTMLInputElement = document.querySelector("form:not(.elq-form) [name='ResidenceSelectTmp']") as HTMLInputElement;
      //const SelectInputs: HTMLElement = Select?.parentElement?.parentElement?.querySelector(".form-select-option-container") as HTMLElement;
      cleanupScSelects(Select);
      const newSelect = createOptionDropdowns(cityList, Select);
      newSelect.setAttribute("disabled", "disabled");
    }

    //residence of interest
    if (document.querySelector("form:not(.elq-form) [name='residenceofInterest1']")) {
      const placeHolders: any = context.sitecoreContext?.route?.placeholders;
      const contextPlaceholder = placeHolders["headless-header"].filter((x: { componentName: string }) => x.componentName === "PropertyHeaderNavigation")[0];
      const yardiID =
        contextPlaceholder && contextPlaceholder?.fields?.data?.item?.contextParentPropertyId
          ? contextPlaceholder?.fields?.data?.item?.contextParentPropertyId?.value
          : contextPlaceholder?.fields?.data?.item?.ancestors[0].contextParentPropertyId?.value;

      const resInput: HTMLInputElement = document?.querySelector("form:not(.elq-form) input[name='residenceofInterest1']") as HTMLInputElement;
      resInput.value = yardiID;
    }

    // if (document.querySelector("form:not(.elq-form) [name='thankYouPageURL']")) {
    //   (document.querySelector("form:not(.elq-form) [name='thankYouPageURL']") as HTMLInputElement).value = "thank-you";
    // }

    //for who
    /* the value from this has to be transformed in the contactus api. Key is contactType */

    //living options
    /* the value from this has to be transformed in the contactus api. Key is 'dropdownMenu' */

    //optin
    if (document.querySelector("form:not(.elq-form) [name='optin']")) {
      //const Optin: HTMLElement = (document.querySelector("[name='optin']") as HTMLElement).parentElement as HTMLElement;
      document.querySelector("form:not(.elq-form) [name='optin'][value='Yes']")?.setAttribute("value", "On");
      document.querySelector("form:not(.elq-form) [name='optin'][value='No']")?.setAttribute("value", "Off");
      document.querySelector("form:not(.elq-form) [name='optin'][value='Oui']")?.setAttribute("value", "On");
      document.querySelector("form:not(.elq-form) [name='optin'][value='Non']")?.setAttribute("value", "Off");
    }

    if (document.querySelector("form:not(.elq-form) [name='singleCheckbox']")) {
      //const Optin: HTMLElement = (document.querySelector("[name='optin']") as HTMLElement).parentElement as HTMLElement;
      document.querySelector("form:not(.elq-form) [name='singleCheckbox'][value='Yes']")?.setAttribute("value", "On");
      document.querySelector("form:not(.elq-form) [name='singleCheckbox'][value='No']")?.setAttribute("value", "Off");
      document.querySelector("form:not(.elq-form) [name='singleCheckbox'][value='Oui']")?.setAttribute("value", "On");
      document.querySelector("form:not(.elq-form) [name='singleCheckbox'][value='Non']")?.setAttribute("value", "Off");
    }

    //telephone country default to Canada
    if (document.querySelector(".iti__flag-container .iti__selected-flag")) {
      document.querySelector(".iti__flag-container .iti__selected-flag .iti__flag")?.classList.remove("iti__us");
      document.querySelector(".iti__flag-container .iti__selected-flag .iti__flag")?.classList.add("iti__ca");
    }

    //get utm values from sessionStorage if they exist
    const utmFromSession = sessionStorage.getItem("chartwell_utm_params");
    if (utmFromSession) {
      const utm_values = JSON.parse(utmFromSession);
      if (document.querySelector('form:not(.elq-form) input[name="utm_campaign"]')) {
        document.querySelector('form:not(.elq-form) input[name="utm_campaign"]')?.setAttribute("value", utm_values.utm_campaign || "");
      }
      if (document.querySelector('form:not(.elq-form) input[name="utm_source"]')) {
        document.querySelector('form:not(.elq-form) input[name="utm_source"]')?.setAttribute("value", utm_values.utm_source || "");
      }
      if (document.querySelector('form:not(.elq-form) input[name="utm_medium"]')) {
        document.querySelector('form:not(.elq-form) input[name="utm_medium"]')?.setAttribute("value", utm_values.utm_medium || "");
      }
      if (document.querySelector('form:not(.elq-form) input[name="utm_content"]')) {
        document.querySelector('form:not(.elq-form) input[name="utm_content"]')?.setAttribute("value", utm_values.utm_content || "");
      }
      if (document.querySelector('form:not(.elq-form) input[name="utm_term"]')) {
        document.querySelector('form:not(.elq-form) input[name="utm_term"]')?.setAttribute("value", utm_values.utm_term || "");
      }
    }

    //fallback for above, those parameters are stored in a cookie called "__utmzz". If the cookie is found, set those values
    //const tmpCookie = "__utmzz=utmcsr=google|utmcmd=organic|utmccn=(not set)|utmctr=(not provided)";
    const utmCookie = document.cookie //tmpCookie
      .split("; ")
      .find((row) => row.startsWith("__utmzz="))
      ?.replace("__utmzz=", "")
      ?.split("|");
    const cookieKeyValues: any = [];

    if (utmCookie && utmCookie.length > 0) {
      utmCookie.map((index) => {
        cookieKeyValues.push(index.split("="));
      });
      const src = cookieKeyValues.find((ele: string) => ele[0] == "utmcsr");
      const campaign = cookieKeyValues.find((ele: string) => ele[0] == "utmccn");
      const medium = cookieKeyValues.find((ele: string) => ele[0] == "utmcmd");
      const term = cookieKeyValues.find((ele: string) => ele[0] == "utmctr");

      if (document.querySelector('form:not(.elq-form) input[name="utm_campaign"]') && campaign) {
        document.querySelector('form:not(.elq-form) input[name="utm_campaign"]')?.setAttribute("value", campaign[1] || "");
      }
      if (document.querySelector('form:not(.elq-form) input[name="utm_source"]') && src) {
        document.querySelector('form:not(.elq-form) input[name="utm_source"]')?.setAttribute("value", src[1] || "");
      }
      if (document.querySelector('form:not(.elq-form) input[name="utm_medium"]') && medium) {
        document.querySelector('form:not(.elq-form) input[name="utm_medium"]')?.setAttribute("value", medium[1] || "");
      }
      if (document.querySelector('form:not(.elq-form) input[name="utm_term"]') && term) {
        document.querySelector('form:not(.elq-form) input[name="utm_term"]')?.setAttribute("value", term[1] || "");
      }
      //for this last one we put the entire cookie value into content to ensure we don't miss anything
      if (document.querySelector('form:not(.elq-form) input[name="utm_content"]')) {
        document.querySelector('form:not(.elq-form) input[name="utm_content"]')?.setAttribute("value", utmCookie.toString() || "");
      }
    }

    //push to datalayer
    const DataLayerPush = (dlObject: any) => {
      const dataLayer = (window.dataLayer = window.dataLayer || []);
      dlObject.page_lang = context.sitecoreContext.route?.itemLanguage?.toUpperCase() || "";
      dataLayer.push(dlObject);
    };

    const getDLPropertyInfo = () => {
      const obj: any = {};
      obj.pID = "";
      obj.propertyName = "";
      obj.province = "";
      obj.city = "";
      obj.isBilingual = "";
      obj.isPriorityProperty = "";

      const sitecoreContext = context.sitecoreContext;

      if (sitecoreContext.route?.templateName === "PropertyPage") {
        obj.pID = sitecoreContext.route?.fields?.PropertyID;
        obj.propertyName = sitecoreContext.route?.fields?.["Short Property Name"];
        const prov = (sitecoreContext.route?.fields?.Province as any)?.[0].fields["Province Abbreviation"]?.value;
        obj.province = provinces.find((p: any) => p.value == prov);
        const cityfield: any = sitecoreContext.route?.fields?.City;
        obj.city = (cityfield[0].fields["City Name"] as any)?.value;
        obj.isBilingual = (sitecoreContext.route?.fields?.Bilingual as any)?.value;
        obj.isPriorityProperty = (sitecoreContext.route?.fields?.isPriorityProperty as any)?.value;
      } else {
        const placeholder: any = sitecoreContext.route?.placeholders["headless-header"]?.filter((comp: any) => comp.componentName === "PropertyHeaderNavigation");
        const infoNode: any = placeholder?.[0]?.fields?.data?.item?.ancestors[0];
        obj.pID = (infoNode?.contextParentPropertyId as any).value;
        obj.propertyName = infoNode?.propertyShortName.value != "" ? infoNode?.propertyShortName.value : infoNode?.propertyNavigationTitle;
        obj.province = provinces.find((p: any) => p.value === infoNode?.province?.targetItems?.[0]?.name)?.value || "";
        obj.city = infoNode?.city?.targetItems?.[0]?.name;
        obj.isBilingual = infoNode?.bilingual?.boolValue;
        obj.isPriorityProperty = infoNode?.isPriorityProperty?.boolValue;
      }
      return obj;
    };

    const normalize = (str: any) => {
      if (str) {
        return decodeURI(str)
          .toString()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[.,\/#!$%\^\*;:{}`~()\'\"+]/g, " ");
      }
      return str;
    };

    //events for when the surname or email address is filled in and valid
    const updateEvent = (field: HTMLInputElement, evtName: string) => {
      const tmp: any = {};
      tmp.ecommerce = null;
      DataLayerPush(tmp);

      const isPropertyPage = context.sitecoreContext.route?.templateName?.toLowerCase().includes("property") ? true : false;
      const regex = new RegExp(field.getAttribute("pattern") as string);
      if (field.value.length > 0 && regex.test(field.value)) {
        const itm = {
          item_name: "corporate",
          item_id: "corporate",
          price: "1.00",
          item_variant: "",
          item_category: "corporate",
          item_category2: "corporate",
          item_category3: "corporate",
          item_category4: "corporate",
          quantity: "1",
        };

        if (isPropertyPage) {
          const itm_vals = getDLPropertyInfo();
          itm.item_name = (itm_vals.propertyName.hasOwnProperty("value") ? normalize(itm_vals.propertyName.value) : normalize(itm_vals.propertyName)).replace("Chartwell ", "");
          itm.item_id = itm_vals.pID;
          itm.item_category = normalize(provinces.find((p: any) => p.value === itm_vals.province)?.shortval);
          itm.item_category2 = normalize(itm_vals.city);
          itm.item_category3 = itm_vals.isBilingual ? "Bilingual" : context.sitecoreContext.language == "en" ? "English" : "French";
          itm.item_category4 = itm_vals.isPriorityProperty ? "Yes" : "No";
        }

        tmp.event = evtName;
        tmp.ecommerce = {
          items: [],
        };
        tmp.ecommerce.items.push(itm);
        DataLayerPush(tmp);
      }
    };

    const surnameField = document.querySelector("form:not(.elq-form) [name='lastName']") as HTMLInputElement;
    const emailField = document.querySelector("form:not(.elq-form) [name='emailAddress']") as HTMLInputElement;
    const isBookATour = context.sitecoreContext.route?.name == "book-a-tour" ? true : false;

    isBookATour &&
      //WHEN USER ADDS SURNAME AND STARTS FILLING NEXT FIELD, FIRE EVENT
      surnameField?.addEventListener("blur", () => {
        updateEvent(surnameField, "add_to_cart");
      });

    isBookATour &&
      //WHEN USER ADDS EMAIL ADDRESS AND STARTS FILLING NEXT FIELD, FIRE EVENT
      emailField?.addEventListener("blur", () => {
        updateEvent(emailField, "begin_checkout");
      });

    document.querySelector("form.content")?.addEventListener("change", () => {
      createParams();
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formLoaded]);

  useEffect(() => {
    //console.log("submitted?", formSubmitted);
    const hasTyPage = document.querySelector("form:not(.elq-form) [name='thankYouPageURL']") || document.querySelector("form:not(.elq-form) [name='thankYouPageUrl']");
    if (formSubmitted && hasTyPage) {
      document.location.href = tyPageURL;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formSubmitted]);

  useEffect(() => {
    //const provSelect: HTMLInputElement = document.querySelector("input[name='ProvSelect']") as HTMLInputElement;
    setResidenceList([]);
    const obsvConfig = {
      attributes: true,
      childList: true,
      subtree: true,
      characterData: true,
    };
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        const target: any = mutation.target;
        if (target.textContent?.includes(".main-form-wrapper")) {
          if (document?.querySelector(".main-form-wrapper")) {
            setFormLoaded(true);
            //observer.disconnect();
          }
        }

        if (target?.classList?.contains("success-popup")) {
          if ((document?.querySelector(".success-popup") as HTMLDivElement).style.display == "block") {
            setFormSubmitted(true);
            observer.disconnect();
          }
        }
      });
    });

    const target: Node = document.querySelector("#content") as Node;
    target && observer?.observe(target, obsvConfig);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
