//import { form } from "@sitecore-cloudsdk/events/browser";

import DOMPurify from "dompurify";
import type { SitecoreContextValue } from "lib/sitecore/types";

// used so we can preserve Datalayers historical records when property names change
export const getResidenceNameExceptions = (resName: string) => {
  const exceptionsAndCorrections: any = [
    // { exception: "Victoria Harbour by Chartwell", correction: "Chartwell Victoria Harbour" },
    // { exception: "Edgewater by Chartwell", correction: "Chartwell Edgewater   Edgewater Care" },
  ];
  const found = exceptionsAndCorrections.find((item: { exception: string; correction: string }) => item.exception === resName)?.correction;
  return found || resName;
};

// Flattens all language objects from combinedProvinces
export const flattenCombinedProvincesLanguages = (allResidenceData: any, provinceId?: string, language?: string) => {
  const combinedProvinces = allResidenceData?.ResidenceData?.combinedProvinces;
  if (!Array.isArray(combinedProvinces)) {
    console.warn("combinedProvinces is not an array:", combinedProvinces);
    return "";
  }

  // Flatten all languages from all provinces
  const allLanguages = combinedProvinces.reduce((acc: any[], prov: any) => {
    if (Array.isArray(prov.languages)) {
      return acc.concat(prov.languages);
    }
    console.warn("languages is not an array for province:", prov);
    return acc;
  }, []);

  // Find the language object for the given provinceId and language
  const match = allLanguages.find((ele: any) => ele.id == provinceId && ele.language?.name === language);
  const provinceName = match?.field?.value;
  if (!provinceName) return "";
  return language === "en" ? provinceName : `(${provinceName})`;
};

export const shortenPropNames = (str: any) => {
  //for residence name normalization
  const regexToReplace = [
    new RegExp(/ résidence pour retraités/gim),
    new RegExp(/ residence pour retraites/gim),
    new RegExp(/ retirement residence/gim),
    new RegExp(/ retirement community/gim),
    new RegExp(/ care residence/gim),
    new RegExp(/ pour retraites/gim),
    new RegExp(/ pour retraités/gim),
    //new RegExp(/ by chartwell/gim),
  ];
  let tmpStr = str;
  regexToReplace.forEach((rx) => {
    tmpStr = tmpStr?.replace(rx, "");
  });
  return tmpStr?.trim();
};

export const normalize = (str: any) => {
  //for residence name normalization
  if (str) {
    let tmpStr = decodeURI(str)
      .toString()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/['"]/gm, " ")
      .replace(/[.,\/#!$%&\^\*;:{}`~()+]/gm, " ");

    tmpStr = shortenPropNames(tmpStr);
    return tmpStr; //getResidenceNameExceptions(tmpStr);
  }
  return str;
};

export const waitForElement = (selector: string): Promise<Element> => {
  return new Promise((resolve) => {
    const observer = new MutationObserver((_mutations, obs) => {
      const element = document.querySelector(selector);
      if (element) {
        resolve(element);
        obs.disconnect();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Optional: Timeout to reject the promise if the element is not found within a certain time
    setTimeout(() => {
      observer.disconnect();
    }, 20000); // 20 seconds timeout
  });
};

export const sanitizeInputs = (form: HTMLFormElement) => {
  const FormInputs = (form as HTMLFormElement)?.querySelectorAll("input, textarea");
  if (FormInputs) {
    Array.from(FormInputs).forEach((inp) => {
      (inp as HTMLInputElement).addEventListener("blur", () => {
        // const regex = /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)/gi;
        (inp as HTMLInputElement).value = DOMPurify.sanitize((inp as HTMLInputElement).value, { ALLOWED_TAGS: [], ALLOWED_ATTR: [], FORBID_ATTR: ["href", "src"] }); //.replace(regex, "");
      });
    });
  }
};

const setInputValue = (name: string, value: string) => {
  const input = document.querySelector(`input[name="${name}"]`);
  if (input) {
    input.setAttribute("value", value);
  }
};

export const getSetUtmValues = () => {
  //get utm values from sessionStorage if they exist
  const utmFromSession = sessionStorage.getItem("chartwell_utm_params");
  const utmFromCookies = getUTMValuesFromCookies();

  //cookies if they exist take precedence over sessionStorage
  if (utmFromCookies) {
    const utm_source = utmFromCookies.find((ele: string[]) => ele[0] === "utmcsr");
    const utm_campaign = utmFromCookies.find((ele: string[]) => ele[0] === "utmccn");
    const utm_medium = utmFromCookies.find((ele: string[]) => ele[0] === "utmcmd");
    const utm_term = utmFromCookies.find((ele: string[]) => ele[0] === "utmctr");

    if (utm_source) {
      setInputValue("utm_source", utm_source[1]);
    }
    if (utm_campaign) {
      setInputValue("utm_campaign", utm_campaign[1]);
    }
    if (utm_medium) {
      setInputValue("utm_medium", utm_medium[1]);
    }
    if (utm_term) {
      setInputValue("utm_term", utm_term[1]);
    }
    const utm_content = utmFromCookies.map((ele: string[]) => ele.join("=")).join(",");
    setInputValue("utm_content", utm_content);
  } else {
    if (utmFromSession) {
      const utm_values = JSON.parse(utmFromSession);
      Object.keys(utm_values).forEach((key) => {
        const input = document.querySelector(`input[name="${key}"]`);
        if (input) {
          input.setAttribute("value", utm_values[key]);
        }
      });
      if (document.querySelector('input[name="utm_content"]')) {
        let utm_content = ""; //`utmcsr=google,utmcmd=cpc,utmccn=(not set),utmgclid=CjwKCAjw7-SvBhB6EiwAwYdCAV3CiCCQq4JiHcEsYpb6w7c8u`;
        Object.keys(utm_values).forEach((key) => {
          switch (key) {
            case "utm_source":
              utm_content += `utmcsr=${utm_values[key]},`;
              break;
            case "utm_medium":
              utm_content += `utmcmd=${utm_values[key]},`;
              break;
            case "utm_campaign":
              utm_content += `utmccn=${utm_values[key]},`;
              break;
            default:
              utm_content += `${key}=${utm_values[key]},`;
          }
        });
        document.querySelector('input[name="utm_content"]')?.setAttribute("value", utm_content || "");
      }
    }
  }

  //we will also set google and eloqua cookie ids from session and cookies if they exits.
  const ga4SessionId = sessionStorage.getItem("ga4_session_id");
  const ga4ClientId = sessionStorage.getItem("ga4_client_id");
  //console.log("ga4SessionId:", ga4SessionId, "ga4ClientId:", ga4ClientId);

  //when the document is loaded, wait 2 seconds and then set the values of the hidden fields for ga4SessionId and eloquaGuid if they exist
  //these field names are: ga4clientid for ga4ClientId, ga4sessionid for ga4SessionId
  setTimeout(() => {
    const ga4SessionField = document.querySelector('input[name="ga4sessionid"]') as HTMLInputElement | null;
    const ga4ClientField = document.querySelector('input[name="ga4clientid"]') as HTMLInputElement | null;
    if (ga4SessionId && ga4SessionField) {
      ga4SessionField.setAttribute("value", ga4SessionId);
      //console.log("ga4SessionField value set via setAttribute:", ga4SessionField.getAttribute("value"));
    }
    if (ga4ClientId && ga4ClientField) {
      ga4ClientField.setAttribute("value", ga4ClientId);
      //console.log("ga4ClientField value set via setAttribute:", ga4ClientField.getAttribute("value"));
    }
  }, 2000);
};

export const getUTMValuesFromCookies = () => {
  const utmCookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith("__utmzz="))
    ?.replace("__utmzz=", "")
    ?.split("|");

  const cookieKeyValues: any = utmCookie?.map((index) => index.split("=")) || [];
  return cookieKeyValues;
};

export const setFieldsForSharedYardiIDProperties = (residenceInfo?: any, yardiID?: string) => {
  // Wait for the input field to exist before setting its value
  //waitForElement("[name='propertyIdAndName']").then((el) => {
  const residenceIdNameField = document.querySelector("[name='propertyIdAndName']") as HTMLInputElement;
  if (residenceIdNameField && yardiID && residenceInfo?.propertyName?.value) {
    residenceIdNameField.setAttribute("value", JSON.stringify({ id: yardiID, name: residenceInfo?.propertyName.value }));
    console.log("Set propertyIdAndName field value to:", residenceIdNameField.getAttribute("value"));
  } else {
    residenceIdNameField.setAttribute("value", "");
    console.log("Set propertyIdAndName field value to empty string");
  }
  //});
};

export const getLocalizedResidenceAddress = (yardiID: string, allResidenceData: any, lang?: string): any => {
  if (typeof yardiID != undefined) {
    //const resInfo = (allResidenceData as any).ResidenceData?.combinedResidences?.find((res: any) => res.propertyId.value == (yardiID != "11279" ? yardiID : "11280"));
    const resInfoArr = (allResidenceData as any).ResidenceData?.combinedResidences?.filter(
      (res: any) => res.propertyId.value == (yardiID != "11279" ? yardiID : "11280") && res.language.name == document.querySelector("html")?.getAttribute("lang")
    );
    const pathName = typeof window !== "undefined" ? window.location.pathname : "";
    const resInfo = resInfoArr.length == 1 ? resInfoArr[0] : resInfoArr.find((res: any) => pathName.includes(res.url.path));
    const contextLocalizedProvince = flattenCombinedProvincesLanguages(allResidenceData, resInfo?.province.targetItems[0]?.id, lang);

    const localizedAddress = {
      streetAddress:
        resInfo?.streetNameAndNumber.value +
        ", " +
        (resInfo?.city.targetItems?.[0]?.languages.find((ele: any) => ele.language.name == resInfo?.language.name)?.field.value + ", " || "") +
        contextLocalizedProvince +
        " " +
        resInfo?.postalCode.value,
    };
    return localizedAddress;
  }
  return {};
};

export const getPropertyDetailsByID = (yardiID: string, allResidenceData: any) => {
  console.log("getPropertyDetailsByID called with yardiID:", yardiID);
  //console.log("allResidenceData in getPropertyDetailsByID:", allResidenceData);
  if (typeof yardiID != undefined) {
    //get pathname from url
    const pathName = typeof window !== "undefined" ? window.location.pathname : "";
    const resInDropdown = document.querySelector(`#ResidenceSelect`) as HTMLSelectElement;
    const selectedResInDropdown = resInDropdown?.options[resInDropdown.selectedIndex]?.text || "";

    //exception for Edgewater
    const resInfoArr = (allResidenceData as any).ResidenceData?.combinedResidences?.filter(
      (res: any) => res.propertyId.value == (yardiID != "11279" ? yardiID : "11280") && res.language.name == document.querySelector("html")?.getAttribute("lang")
    );

    // if there are multiple residences with the same yardi ID, it means it's a shared ID situation
    // and we will need to use the dropdown selection to determine which residence it is, otherwise
    // we can find the residence by url path as we have unique paths for each residence
    const isSharedId = resInfoArr.length > 1 ? true : false;
    let resInfo: any = {};
    //console.log("resInfoArr:", resInfoArr, "isSharedId:", isSharedId, "pathName:", pathName, "selectedResInDropdown:", selectedResInDropdown);

    if (pathName == "/book-a-tour" || pathName == "/fr/planifiez-une-visite") {
      //console.log("on book a tour page, finding residence by dropdown selection");
      if (isSharedId) resInfo = resInfoArr.find((res: any) => res.propertyName.value.toLowerCase().includes(selectedResInDropdown.toLowerCase()));
      else resInfo = resInfoArr[0]; // if it's not a shared ID, we can just take the first one as they should all be the same residence. This is to avoid issues with url path not including residence name for some properties with shared IDs
      // console.log(
      //   "isSharedId:",
      //   isSharedId,
      //   "resInfo found by dropdown selection:",
      //   resInfo,
      //   "property name in resInfo:",
      //   resInfo?.propertyName?.value,
      //   "selectedResInDropdown:",
      //   selectedResInDropdown,
      //   "found in txt:",
      //   resInfo?.propertyName?.value.toLowerCase().includes(selectedResInDropdown.toLowerCase())
      // );
    } else {
      //console.log("not on corp book a tour page, finding residence by url path");
      resInfo = isSharedId ? resInfoArr.find((res: any) => pathName.includes(res.url.path)) : resInfoArr[0];
      //console.log("resInfo found by url path:", resInfo);
    }
    console.log("isSharedId:", isSharedId, "resInfo:", resInfo, "YardiID:", yardiID);
    if (isSharedId && resInfo && yardiID) {
      setFieldsForSharedYardiIDProperties(resInfo, yardiID);
    } else {
      setFieldsForSharedYardiIDProperties(); // if not a shared id, we will set the field to an empty string to avoid confusion
    }

    const residenceIdAndNameField = document.querySelector("[name='propertyIdAndName']") as HTMLInputElement;
    if (residenceIdAndNameField) {
      //add event listeners to the field, and alert every time the value changes
      const handleResidenceFieldChange = () => {
        const val = residenceIdAndNameField.value;
        if (val) {
          const resInfo = JSON.parse(val);
          alert(`Residence ID: ${resInfo.id}, Residence Name: ${resInfo.name}`); // Replace with your desired action
        }
      };
      residenceIdAndNameField.addEventListener("input", handleResidenceFieldChange);
      residenceIdAndNameField.addEventListener("change", handleResidenceFieldChange);
    }

    //console.log("allResidenceData:", allResidenceData, "resInfo:", resInfo);
    //if is an expansion page, use the following yardi Ids
    //11284 – Prescott 2
    //11282 – Mille-Îles 2
    const isExpansionPage = getIsExpansionPage();
    if (isExpansionPage) {
      resInfo.propertyId.value = getExpansionPageYardiID(yardiID);
    }

    const PropDetails = {
      fullName: resInfo?.propertyName.value,
      name: normalize(resInfo?.propertyName.value),
      id: resInfo?.propertyId.value,
      prov: normalize(resInfo?.provAbbr.targetItems[0].abbr.value), // if user selected province see excel for value, if not use 'corporate'
      city: normalize(resInfo?.city.targetItems[0].name), // if user selected city see excel for value, if not use 'corporate'
      lang: resInfo?.languages.length > 1 ? "Bilingual" : resInfo?.language.name == "en" ? "English" : "French", // Bilingual, language if unilingual otherwise if not use 'corporate'
      isPriorityProperty: resInfo?.isPriorityProperty.boolvalue ? "Yes" : "No", // priorityProperty Yes/No
      streetAddress:
        resInfo?.streetNameAndNumber.value +
        ", " +
        (resInfo?.city.targetItems?.[0]?.languages.find((ele: any) => ele.language.name == resInfo?.language.name)?.field.value + ", " || "") +
        resInfo?.provAbbr.targetItems[0].abbr.value +
        " " +
        resInfo?.postalCode.value,
    };
    return PropDetails;
  }
  return {};
};

export const getIsPropertyPage = (template: string) => {
  return template?.toLowerCase().includes("property") ? true : false;
};

export const setLivingOptionsFieldValues = (CareServicesAll: any, residence: string, residenceData: any, lang: string) => {
  const LvOptsField: HTMLInputElement = document.querySelector("[name='dropdownMenu']") as HTMLInputElement;
  if (LvOptsField) LvOptsField.value = "";

  const livingOptionsFields: any = LvOptsField?.parentElement?.parentElement?.querySelector(".form-select-option-container")?.children;
  livingOptionsFields &&
    Array.from(livingOptionsFields as HTMLCollection)?.forEach((i: HTMLElement) => {
      if (i.getAttribute("data-value") == "LTC" || i.getAttribute("data-value") == "SA" || i.getAttribute("data-value") == "TH") {
        i.classList.add("superHidden");
      }
    });
  if (residence) {
    const ResData = residenceData.ResidenceData.combinedResidences.find((res: any) => res.propertyId.value === residence);
    const ResLivingOptions = ResData?.livingOption;

    ResLivingOptions?.targetItems.forEach((lo: any) => {
      if (CareServicesAll.some((c: any) => c.id == lo.id)) {
        const tmp = CareServicesAll.find((c: any) => c.id == lo.id).languages.find((i: any) => i.language.name == lang).field?.value;
        livingOptionsFields &&
          Array.from(livingOptionsFields as HTMLCollection)?.forEach((i: HTMLElement) => {
            if (i?.innerText?.toLowerCase().includes(tmp?.toLowerCase())) {
              i.classList.remove("superHidden");
            }
          });
      }
    });
  }
};

export const getIsAmIReady = (sitecoreContext?: SitecoreContextValue) => {
  const itemPath = sitecoreContext ? (sitecoreContext?.itemPath as string) : typeof window !== "undefined" ? window.location.pathname : "";
  return itemPath.includes("/am-i-ready/outcome") || itemPath.includes("/suis-je-pret/resultat") ? true : false;
};

export const getIsItTime = (sitecoreContext?: SitecoreContextValue) => {
  const itemPath = sitecoreContext ? (sitecoreContext?.itemPath as string) : typeof window !== "undefined" ? window.location.pathname : "";
  return itemPath.includes("/is-it-time/outcome") || itemPath.includes("/est-ce-le-moment/resultat") ? true : false;
};

export const getIsASurvey = (sitecoreContext?: SitecoreContextValue) => {
  const itemPath = sitecoreContext ? (sitecoreContext?.itemPath as string) : typeof window !== "undefined" ? window.location.pathname : "";

  // Regex: matches any string with "quiz", then a "/", then another "quiz"
  const quizRegex = /quiz[^/]*\/[^/]*quiz/i;

  return itemPath.includes("/outcome") || itemPath.includes("/resultat") || quizRegex.test(itemPath) ? true : false;
};

export const getIsBookATour = (sitecoreContext?: SitecoreContextValue) => {
  const itemPath = sitecoreContext ? (sitecoreContext?.itemPath as string) : typeof window !== "undefined" ? window.location.pathname : "";

  const bookATourPaths = [
    "/book-a-tour",
    "/planifier-une-visite",
    "/planifiez-une-visite",
    "/am-i-ready/outcome-independent",
    "/suis-je-pret/resultat-autonome",
    "/am-i-ready/outcome-ready",
    "/suis-je-pret/resultat-pret",
    "/is-it-time/outcome-independent",
    "/est-ce-le-moment/resultat-autonome",
    "/is-it-time/outcome-ready",
    "/est-ce-le-moment/resultat-pret",
    "/expansion",
  ];

  // Regex: matches any string with "quiz", then a "/", then another "quiz"
  //const quizRegex = /quiz[^/]*\/[^/]*quiz/i;

  //const isBookATour = bookATourPaths.some((key) => itemPath.includes(key)) || (sitecoreContext?.route?.fields?.isBookATourPage as any)?.value;
  const isBookATour =
    bookATourPaths.some((key) => itemPath.includes(key)) ||
    //quizRegex.test(itemPath) ||
    (sitecoreContext?.route?.fields?.isBookATourPage as any)?.value;

  if (isBookATour) {
    return true;
  }
  return false;
};

export const getIsEloquaForm = () => {
  const eForm = document.querySelector(".cwEloquaFormContainer");
  return eForm ? true : false;
};

export const getIsContactUs = (sitecoreContext?: SitecoreContextValue) => {
  const itemPath = sitecoreContext ? (sitecoreContext?.itemPath as string) : typeof window !== "undefined" ? window.location.pathname : "";
  const contactUsPaths = ["contact-us", "contactez-nous", "/am-i-ready/outcome-not-time", "/suis-je-pret/resultat-pas-le-moment"];

  return contactUsPaths.some((key) => itemPath.includes(key));
};

export const getIsResourcePage = (sitecoreContext: SitecoreContextValue) => {
  return sitecoreContext.itemPath?.toString().includes("/ressources") || sitecoreContext.itemPath?.toString().includes("/senior-living-resources");
};

export const getIsSubscribePage = (sitecoreContext: SitecoreContextValue) => {
  return sitecoreContext.itemPath?.toString().match(new RegExp(/s((ubscrib)|(\-abonner\-a\-notre\-infolettr))e/gm)) ? true : false;
};

export const getIsThankYouPage = (sitecoreContext?: SitecoreContextValue) => {
  let istypage = false;
  if (sitecoreContext) {
    istypage = sitecoreContext?.route?.name === "thank-you" || sitecoreContext?.itemPath?.toString().match(new RegExp(/(merci)|(thank\-you)$/gm)) ? true : false;
  } else {
    istypage = typeof window !== "undefined" && window.location.pathname.match(new RegExp(/(merci)|(thank\-you)$/gm)) ? true : false;
  }
  return istypage;
};

export const getIsOpenHousePage = (sitecoreContext?: SitecoreContextValue) => {
  if (sitecoreContext) return sitecoreContext?.itemPath?.toString().includes("/openhouse") || sitecoreContext?.itemPath?.toString().includes("/portesouvertes") ? true : false;
  else {
    return typeof window !== "undefined" && (window.location.pathname.includes("/openhouse") || window.location.pathname.includes("/portesouvertes")) ? true : false;
  }
};

export const getIsBlogPage = (sitecoreContext?: SitecoreContextValue) => {
  if (sitecoreContext) return sitecoreContext?.itemPath?.toString().includes("/blog/") || sitecoreContext?.itemPath?.toString().includes("/blogue/") ? true : false;
  else {
    return typeof window !== "undefined" && (window.location.pathname.includes("/blog/") || window.location.pathname.includes("/blogue/")) ? true : false;
  }
};

export const getIsExpansionPage = (sitecoreContext?: SitecoreContextValue) => {
  const isExpPg = (sitecoreContext?.route?.fields?.isExpansionPage as any)?.value;
  if (isExpPg) return isExpPg;
  else {
    return sitecoreContext?.itemPath?.toString().includes("/expansion") ? true : false;
  }
};

export const getHasAddressField = () => {
  //console.log(document.querySelector("[name='mailStreetAddress']"));
  const hasAddressField = document.querySelector("[name='mailStreetAddress']") ? true : false;
  return hasAddressField;
};

export const setSurveyFields = () => {
  //reordering of columns on survey forms
  document.querySelectorAll("byoc-sitecore-form form div.row-slot-wrapper.lp-flex-container div.landing-page-slot.lp-flex-container.lp-flex-direction-vertical.HALF").forEach((ele: HTMLElement) => {
    ele?.classList.add("IsSurveyForm");
  });

  //fill in survey hidden fields if they exist and there are values
  const urlParams = window.location.search;
  const params = new URLSearchParams(urlParams);
  const score = params.get("s") || "";
  const outcome = params.get("o") || "";
  const participantId = params.get("i") || "";
  const timeframe = params.get("w") || "";

  const participantField = document.querySelector("[name='SurveyParticipantId']") as HTMLInputElement;
  const scoreField = document.querySelector("[name='SurveyScore']") as HTMLInputElement;
  const outcomeField = document.querySelector("[name='SurveyOutcome']") as HTMLInputElement;
  const timeframeField = document.querySelector("[name='Timeframe']") as HTMLInputElement;
  if (participantField) participantField.value = participantId;
  if (scoreField) scoreField.value = score;
  if (outcomeField) outcomeField.value = outcome;
  if (timeframeField) timeframeField.value = timeframe;
};

export const dlDebug = (pageParams: any) => {
  if (window.location.href.includes("localhost")) {
    const dlDebug: any = {};
    dlDebug.debug = {
      page: window.location.href,
      propertyPage: pageParams.isPropertyPage,
      bookATour: pageParams.isBookATour,
      thankYouPage: pageParams.isThankYouPage,
      contactUs: pageParams.isContactUs,
      resourcePage: pageParams.isResourcePage,
      amIReady: pageParams.isAmIReady,
      subscribePage: pageParams.isSubscribePage,
      openHousePage: pageParams.isOpenHousePage,
      blogPage: pageParams.isBlogPage,
      src: pageParams.src,
    };
    if (window.dataLayer) {
      window.dataLayer.push(dlDebug);
    }
  }
};

const removeAddressError = () => {
  const form = document.querySelector("form[data-formid]");
  const submitButton: HTMLButtonElement = (form as HTMLFormElement)?.querySelector("button.lp-flex-container.submit-button") as HTMLButtonElement;
  submitButton.disabled = false;
  document.querySelector("#addressErrorMessage")?.remove(); // Remove error message if present
};

const displayFormError = (config: any, ele: HTMLElement) => {
  const form = document.querySelector("form[data-formid]");
  const submitButton: HTMLButtonElement = (form as HTMLFormElement)?.querySelector("button.lp-flex-container.submit-button") as HTMLButtonElement;
  submitButton.disabled = true;

  const message = config.errorMsg;
  const errDiv = document.createElement("div"); //("Please select an address from the suggestions.");
  errDiv.classList.add("form-error-message");
  errDiv.setAttribute("id", "addressErrorMessage");
  errDiv.setAttribute("title", message);
  errDiv.innerHTML = `<span class="mdi mdi-alert-circle" aria-hidden="true"></span> ${message}`;
  errDiv.style.zIndex = "999999";
  ele?.parentElement?.appendChild(errDiv);
  // submitButton.innerText = "Please select an address from the suggestions.";
};

// Function to display suggestions
export const displaySuggestions = (config: any, suggestions: any) => {
  document.querySelector("#suggestionsContainer")?.remove();
  const tmpContainer = document.createElement("div");
  tmpContainer.setAttribute("id", "suggestionsContainer");

  const cityField = document.querySelector("input[name='city']") as HTMLInputElement;
  const stateProvField = document.querySelector("input[name='stateProv']") as HTMLInputElement;
  const postalCodeField = document.querySelector("input[name='PostalCode']") as HTMLInputElement;
  const mailStreetAddress = document.querySelector("input[name='mailStreetAddress']") as HTMLInputElement;

  mailStreetAddress.parentElement?.classList.add("relative");
  mailStreetAddress.parentElement?.appendChild(tmpContainer);
  let offset = mailStreetAddress.getBoundingClientRect().height + 2;

  const suggestionsContainer = document.getElementById("suggestionsContainer") as HTMLElement;
  suggestionsContainer.classList.add("bg-white", "w-full", "absolute");
  suggestionsContainer.style.top = offset + "px";
  suggestionsContainer.innerHTML = ""; // Clear previous suggestions

  removeAddressError();
  displayFormError(config, suggestionsContainer);

  const errMsg = document.getElementById("addressErrorMessage") as HTMLElement;
  if (errMsg) {
    offset = offset + errMsg.getBoundingClientRect().height;
  }
  suggestionsContainer.style.top = offset + "px";
  const suggestionItems: HTMLElement[] = [];
  suggestions.forEach((suggestion: { Text: string; Description: string; Next: string }, idx: number) => {
    const suggestionItem = document.createElement("div");
    suggestionItem.classList.add("p-1", "cursor-pointer", "hover:bg-gray-100", "px-2", "cpostSuggestionItem");
    suggestionItem.innerHTML = suggestion.Text + "<br/> " + suggestion.Description;
    suggestionItem.setAttribute("tabindex", "0"); // Make focusable
    suggestionItem.setAttribute("role", "option");
    suggestionItems.push(suggestionItem);
    suggestionsContainer.appendChild(suggestionItem);

    // Click handler
    const selectSuggestion = () => {
      mailStreetAddress.value = suggestion.Text + " " + suggestion.Description;
      if (suggestion.Next == "Retrieve") {
        const addressArray = suggestion.Description.split(", ");
        cityField?.setAttribute("value", addressArray[0]);
        stateProvField?.setAttribute("value", addressArray[1]);
        const postalCode = (suggestion.Description.match(/[A-Z]\d[A-Z] \d[A-Z]\d/)?.[0] as string).toUpperCase();
        postalCodeField?.setAttribute("value", postalCode);
        suggestionsContainer.innerHTML = ""; // Clear suggestions after selection
        document.querySelector("#addressErrorMessage")?.remove(); // Remove error message if present

        if (mailStreetAddress.value.trim() !== "" && cityField.value.trim() !== "" && stateProvField.value.trim() !== "" && postalCodeField.value.trim() !== "") {
          removeAddressError();
        }
      } else {
        getAddressSuggestions(config, suggestion);
      }
    };
    suggestionItem.addEventListener("click", selectSuggestion);

    // Keyboard handler
    suggestionItem.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        selectSuggestion();
        suggestionItem.blur();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        if (idx < suggestionItems.length - 1) {
          suggestionItems[idx + 1].focus();
        }
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (idx > 0) {
          suggestionItems[idx - 1].focus();
        } else {
          mailStreetAddress.focus();
        }
      }
    });
  });
  //if the user clears mailStreetAddress, reset the city, stateProv and postalCode fields
  mailStreetAddress?.addEventListener("input", () => {
    // if the user has cleared the address field, it's valid. Reset the other fields
    if (mailStreetAddress.value.trim().length === 0) {
      document.querySelector("#addressErrorMessage")?.remove(); // Remove error message if present
      mailStreetAddress?.setAttribute("value", "");
      cityField?.setAttribute("value", "");
      stateProvField?.setAttribute("value", "");
      postalCodeField?.setAttribute("value", "");
      removeAddressError();
    }
    suggestionsContainer.innerHTML = ""; // Clear suggestions if input is empty
  });

  // mailStreetAddress?.addEventListener("input", () => {
  //   isValidAddress = false; // Reset validity flag on input change
  //   displayFormError(config, suggestionsContainer);

  //   // // mailing address is not empty, but the other fields are empty
  //   // if (mailStreetAddress.value.trim().length != 0 || cityField.value.trim().length == 0 || stateProvField.value.trim().length == 0 || postalCodeField.value.trim().length == 0) {
  //   //   isValidAddress = false;
  //   // }
  //   // // if the user has cleared the address field, it's valid. Reset the other fields
  //   // if (mailStreetAddress.value.trim().length === 0) {
  //   //   document.querySelector("#addressErrorMessage")?.remove(); // Remove error message if present
  //   //   cityField?.setAttribute("value", "");
  //   //   stateProvField?.setAttribute("value", "");
  //   //   postalCodeField?.setAttribute("value", "");
  //   //   isValidAddress = true; // Reset the validity flag
  //   // }
  //   // if (!isValidAddress) {
  //   //   // clear address fields
  //   //   cityField?.setAttribute("value", "");
  //   //   stateProvField?.setAttribute("value", "");
  //   //   postalCodeField?.setAttribute("value", "");
  //   //   mailStreetAddress?.setAttribute("value", "");

  //   //   const form = document.querySelector("form[data-formid]");
  //   //   const submitButton: HTMLButtonElement = (form as HTMLFormElement)?.querySelector("button.lp-flex-container.submit-button") as HTMLButtonElement;
  //   //   submitButton.disabled = false;
  //   // }
  //   // suggestionsContainer?.remove(); // Clear suggestions if input is empty
  //   // console.log("isvalid: ", isValidAddress, "city:", cityField.value, "prov:", stateProvField.value, "postal:", postalCodeField.value, "complete:", mailStreetAddress.value);
  // });
};

export const customizeJulesVerneResidence = (formState: any) => {
  if (formState.propPageYardiID == undefined && document.location.href.includes("/le-jules-verne/condos-locatifs/planifier-une-visite")) {
    formState.propPageYardiID = "11277";
    (document.querySelector("[name='residenceofInterest1']") as HTMLInputElement).setAttribute("value", formState.propPageYardiID);

    const livingOptionsField = document.querySelector("[name='dropdownMenu']") as HTMLInputElement;
    const livingOptionsFieldID = `${livingOptionsField.getAttribute("data-id")}`;
    document.getElementById(livingOptionsFieldID)?.setAttribute("style", "display: none !important;");

    const addressField = document.querySelector("[name='mailStreetAddress']") as HTMLInputElement;
    const addressFieldID = `${addressField.getAttribute("data-id")}`;
    document.getElementById(addressFieldID)?.classList.add("!basis-full");
  }

  // jules verne non condo book a tour page
  if (document.location.href.includes("/le-jules-verne/planifier-une-visite")) {
    const livingOptionsField = document.querySelector("[name='dropdownMenu']") as HTMLInputElement;
    //console.log("livingOptionsField:", livingOptionsField);

    const livingOptionsFieldOptions: any = livingOptionsField?.parentElement?.parentElement?.querySelector(".form-select-option-container")?.children;
    //console.log("livingOptionsFields:", livingOptionsFieldOptions);
    livingOptionsFieldOptions &&
      Array.from(livingOptionsFieldOptions as HTMLCollection)?.forEach((i: HTMLElement) => {
        //console.log("living option item:", i);
        if (i.getAttribute("data-value") === "SA") {
          i.classList.remove("superHidden");
        }
      });

    livingOptionsField?.addEventListener("blur", () => {
      const selectedValue = livingOptionsField.getAttribute("data-value");
      if (selectedValue === "SA") {
        document.querySelector("[name='isCondoPage']")?.setAttribute("data-value", "Yes");
        document.querySelector("[name='isCondoPage']")?.setAttribute("value", "Yes");
        // console.log("isCondoPage set to Yes", document.querySelector("[name='isCondoPage']"));
      } else {
        document.querySelector("[name='isCondoPage']")?.setAttribute("data-value", "No");
        document.querySelector("[name='isCondoPage']")?.setAttribute("value", "No");
        // console.log("isCondoPage set to No", document.querySelector("[name='isCondoPage']"));
      }
    });
  }
};

export const getAddressSuggestions = (config: any, searchTerm?: any) => {
  const mailStreetAddress = document.querySelector("input[name='mailStreetAddress']") as HTMLInputElement;
  const url = "https://ws1.postescanada-canadapost.ca/addresscomplete/interactive/find/v2.10/json3.ws";
  const Key = config.apiKey;
  let params = "";
  params += "&Key=" + encodeURIComponent(Key);
  params += "&SearchTerm=" + encodeURIComponent(searchTerm ? searchTerm.text : mailStreetAddress.value);
  params += "&LastId=" + encodeURIComponent(searchTerm ? searchTerm.Id : "");
  params += "&SearchFor=" + encodeURIComponent("Everything");
  params += "&Country=" + encodeURIComponent("CAN");
  params += "&LanguagePreference=" + encodeURIComponent("EN");
  params += "&MaxSuggestions=" + encodeURIComponent(10);
  params += "&MaxResults=" + encodeURIComponent(10);
  params += "&Origin=" + encodeURIComponent("");
  params += "&Bias=" + encodeURIComponent("");
  params += "&Filters=" + encodeURIComponent("");
  params += "&GeoFence=" + encodeURIComponent("");

  if (mailStreetAddress.value.trim().length > 0) {
    const http = new XMLHttpRequest();
    http.open("POST", url, true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.onreadystatechange = function () {
      if (http.readyState == 4 && http.status == 200) {
        const response = JSON.parse(http.responseText);
        removeAddressError();
        // Test for an error
        if (response.Items.length == 1 && typeof response.Items[0].Error !== "undefined") {
          // Show the error message
          alert(response.Items[0].Description);
        } else {
          // Check if there were any items found
          if (response.Items.length == 0) {
            (document.querySelector("input[name='mailStreetAddress']") as HTMLInputElement).value = "";
            displayFormError(config.noResultsMsg, mailStreetAddress);
          } else {
            // Display suggestions
            displaySuggestions(config, response.Items);
          }
        }
      }
    };
    http.send(params);
  }
};

export const getSiteCoreFormStyling = () => {
  //const isPropPage = (document.querySelector("#cwLayoutContainer") as HTMLInputElement).classList.contains("PropertyChildPage");
  const isBookATour = getIsBookATour();
  const isContactUs = getIsContactUs();
  const isOpenHouse = getIsOpenHousePage();
  const isBlogPage = getIsBlogPage();
  const isAmIReady = getIsAmIReady();
  const isItTime = getIsItTime();

  const mailStreetAddress = document.querySelector("input[name='mailStreetAddress']") as HTMLInputElement;
  if (mailStreetAddress) {
    mailStreetAddress.classList.add("basis-1/2");
  }

  if (isBookATour) {
    const livOptsContainer = document.querySelector('[name="dropdownMenu"]') as HTMLInputElement;
    if (!livOptsContainer) {
      waitForElement('[name="dropdownMenu"]').then(() => {
        getSiteCoreFormStyling();
      });
    }
    const livOptsContainerID = livOptsContainer?.getAttribute("data-id") as string;
    document.getElementById(livOptsContainerID)?.classList.add("basis-1/2");
  }
  if (window.location.href.includes("subscribe") || window.location.href.includes("s-abonner-a-notre-infolettre")) {
    const selector = window.location.href.includes("s-abonner-a-notre-infolettre") ? '[name="contacttype"]' : '[name="contactType"]';
    const contactTypeContainer = document.querySelector(selector) as HTMLInputElement;
    if (!contactTypeContainer) {
      waitForElement(selector).then(() => {
        getSiteCoreFormStyling();
      });
    }
    const contactTypeContainerID = contactTypeContainer?.getAttribute("data-id") as string;
    document.getElementById(contactTypeContainerID)?.classList.add("basis-1/2");
  }
  if (isContactUs) {
    let selectors: any[] = [];
    if (!isAmIReady && !isItTime) {
      selectors = ['[name="type"]', '[name="subject"]'];
    }
    if (isAmIReady || isItTime) {
      selectors = ['[name="dropdownMenu"]']; //'[name="yourselforLovedone"]',
    }
    selectors.forEach((selector) => {
      const selectorContainer = document.querySelector(selector) as HTMLInputElement;
      if (!selectorContainer) {
        waitForElement(selector).then(() => {
          getSiteCoreFormStyling();
        });
      }
      const selectorContainerID = selectorContainer?.getAttribute("data-id") as string;
      document.getElementById(selectorContainerID)?.classList.add("basis-1/2");
    });
  }
  if (isOpenHouse) {
    const byocForm = document.querySelector("byoc-sitecore-form") as HTMLElement;
    const formWrapper = document.querySelector(".main-form-wrapper.lp-flex-container") as HTMLElement;
    const rowWrappers = document.querySelectorAll(".row-slot-wrapper.lp-flex-container") as NodeListOf<HTMLElement>;
    const openHouseForm = document.querySelector("form.content.lp-flex-container") as HTMLFormElement;
    const contactTypeField = (document.querySelector("[name='contactType']") as HTMLInputElement).getAttribute("data-id") as string;
    (document.getElementById(contactTypeField) as HTMLElement).classList.add("!w-full", "!basis-full");

    byocForm?.classList.add("flex", "flex-col", "gap-4", "w-full", "items-center", "justify-center", "bg-ChartwellPlum", "p-8", "!max-w-full");
    formWrapper?.classList.add("container", "mx-auto");
    openHouseForm?.classList.add("chartwell-sc-2-col-form");
    rowWrappers.forEach((rowWrapper) => {
      rowWrapper.classList.add("!justify-center");
    });
  }
  if (isBlogPage) {
    const blogForm = document.querySelector("byoc-sitecore-form form") as HTMLFormElement;
    blogForm?.classList.add("blogForm");
  }
  if (isAmIReady || isItTime) {
    const surveyForm = document.querySelector("byoc-sitecore-form form") as HTMLFormElement;
    surveyForm?.classList.add("surveyForm");
  }
};

//given a set of placeholders (obj) e.g. {"headless-header": ..., "headless-main": ..., "headless-footer": ...}
//recursively searches for a component by name and returns the component
export const searchPlaceHoldersForComponent = (obj: any, componentName: string): any => {
  let results: any = null;

  function recursiveSearch(node: any) {
    if (Array.isArray(node)) {
      node.forEach(recursiveSearch);
    } else if (node && typeof node === "object") {
      if (node.componentName === componentName) {
        results = node;
        return; // Stop searching once the component is found
      }
      Object.values(node).forEach(recursiveSearch);
    }
  }

  recursiveSearch(obj);
  return results; // Return null if no matches found
};

export const getExpansionPageYardiID = (pID: string, sitecoreContext?: any) => {
  const isExpansionPage = getIsExpansionPage(sitecoreContext);
  const customYardiID = sitecoreContext?.route?.fields?.CustomYardiID?.value;
  if (isExpansionPage) {
    waitForElement("[name='residenceofInterest1']").then(() => {
      const residenceofInterest1 = document.querySelector("[name='residenceofInterest1']") as HTMLInputElement;
      // console.log("expansion page yardi id:", tmpID, "residenceofInterest1:", residenceofInterest1);
      if (residenceofInterest1) residenceofInterest1.value = customYardiID;
    });
  }
  return isExpansionPage ? customYardiID : pID;
};
