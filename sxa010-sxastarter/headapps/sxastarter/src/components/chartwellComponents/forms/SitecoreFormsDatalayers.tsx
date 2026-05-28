import { useCallback, useState, useEffect } from "react";

import { deStructureProps } from "lib/helpers/residence-helpers/index";
import { v4 as uuidv4 } from "uuid";

import {
  getPropertyDetailsByID,
  getLocalizedResidenceAddress,
  normalize,
  getIsPropertyPage,
  setLivingOptionsFieldValues,
  getIsBookATour,
  getIsAmIReady,
  getIsItTime,
  getIsASurvey,
  getIsContactUs,
  getIsResourcePage,
  getIsSubscribePage,
  waitForElement,
  sanitizeInputs,
  getSetUtmValues,
  setSurveyFields,
  shortenPropNames,
  getSiteCoreFormStyling,
  getIsOpenHousePage,
  getIsBlogPage,
  getIsExpansionPage,
  getAddressSuggestions,
  getHasAddressField,
  customizeJulesVerneResidence,
  searchPlaceHoldersForComponent,
  getExpansionPageYardiID,
  setFieldsForSharedYardiIDProperties,
} from "../../../lib/helpers/form/formAndDatalayerHelpers";
import { getAddressCompleteConfig } from "lib/helpers/form/addressCompleteConfig";
import { getCustomLocalizedAddress } from "lib/helpers/helper";
import { useSitecoreContext } from "lib/sitecore/useSitecoreContext";
interface FormState {
  isPropertyPage: boolean;
  isAmIReady: boolean;
  isItTime: boolean;
  isASurvey: boolean;
  isBookATour: boolean;
  isContactUs: boolean;
  isResourcePage: boolean;
  isSubscribePage: boolean;
  isFormLoaded: boolean;
  isOpenHousePage: boolean;
  isBlogPage: boolean;
  hasAddressField: boolean;
  propPageYardiID: string;
  isExpansionPage: boolean;
}

interface ResidenceData {
  ResidenceData: {
    combinedCareServices: any;
    combinedResidences: any;
  };
}

const useFormState = (sitecoreContext: any) => {
  const [formState, setFormState] = useState<FormState>({
    isPropertyPage: false,
    isAmIReady: false,
    isItTime: false,
    isASurvey: false,
    isBookATour: false,
    isContactUs: false,
    isResourcePage: false,
    isSubscribePage: false,
    isFormLoaded: false,
    isOpenHousePage: false,
    isBlogPage: false,
    hasAddressField: false,
    propPageYardiID: "",
    isExpansionPage: false,
  });

  const [allResidenceData, setResidenceData] = useState<ResidenceData>({} as ResidenceData);

  useEffect(() => {
    const nextFormFlags = {
      isPropertyPage: getIsPropertyPage(sitecoreContext.route?.templateName as string),
      isAmIReady: getIsAmIReady(sitecoreContext),
      isItTime: getIsItTime(sitecoreContext),
      isASurvey: getIsASurvey(sitecoreContext),
      isBookATour: getIsBookATour(sitecoreContext),
      isContactUs: getIsContactUs(sitecoreContext),
      isResourcePage: getIsResourcePage(sitecoreContext) as boolean,
      isSubscribePage: getIsSubscribePage(sitecoreContext),
      isOpenHousePage: getIsOpenHousePage(sitecoreContext),
      isBlogPage: getIsBlogPage(sitecoreContext),
      isExpansionPage: getIsExpansionPage(sitecoreContext),
      hasAddressField: getHasAddressField(),
    };

    setFormState((prev) => {
      const hasChanged =
        prev.isPropertyPage !== nextFormFlags.isPropertyPage ||
        prev.isAmIReady !== nextFormFlags.isAmIReady ||
        prev.isItTime !== nextFormFlags.isItTime ||
        prev.isASurvey !== nextFormFlags.isASurvey ||
        prev.isBookATour !== nextFormFlags.isBookATour ||
        prev.isContactUs !== nextFormFlags.isContactUs ||
        prev.isResourcePage !== nextFormFlags.isResourcePage ||
        prev.isSubscribePage !== nextFormFlags.isSubscribePage ||
        prev.isOpenHousePage !== nextFormFlags.isOpenHousePage ||
        prev.isBlogPage !== nextFormFlags.isBlogPage ||
        prev.isExpansionPage !== nextFormFlags.isExpansionPage ||
        prev.hasAddressField !== nextFormFlags.hasAddressField;

      return hasChanged ? { ...prev, ...nextFormFlags } : prev;
    });

    const placeholder = searchPlaceHoldersForComponent(sitecoreContext.route?.placeholders as any, "ResidenceObjData");
    const nextResidenceData = deStructureProps(placeholder);

    setResidenceData((prev) => {
      if (prev === nextResidenceData) return prev;

      try {
        if (JSON.stringify(prev) === JSON.stringify(nextResidenceData)) {
          return prev;
        }
      } catch {
        // fall through and update state when serialization fails
      }

      return nextResidenceData;
    });
  }, [sitecoreContext.itemPath, sitecoreContext.route?.name, sitecoreContext.route?.placeholders, sitecoreContext.route?.templateName]);

  return { formState, setFormState, allResidenceData };
};

const useDataLayer = (pageContext: any, formState: FormState) => {
  const DataLayerPush = useCallback(
    (dlObject: any) => {
      const dataLayer = (window.dataLayer = window.dataLayer || []);
      const excludedEvents = ["request_resources", "add_to_cart", "begin_checkout", "purchase", "contact_us", "subscribe"];

      if (dlObject.event && !excludedEvents.includes(dlObject.event)) {
        dlObject.page_lang = pageContext.sitecoreContext.route?.itemLanguage?.toUpperCase();
      } else {
        if (!dlObject.hasOwnProperty("page_lang_keep") && dlObject.page_lang_keep != "true") {
          delete dlObject.page_lang;
        }
      }
      delete dlObject.page_lang_keep;
      dataLayer.push(dlObject);

      if (window.location.href.includes("localhost")) {
        const dlDebug = {
          debug: {
            page: window.location.href,
            propertyPage: formState.isPropertyPage,
            bookATour: formState.isBookATour,
            contactUs: formState.isContactUs,
            resourcePage: formState.isResourcePage,
            amIReady: formState.isAmIReady,
            isItTime: formState.isItTime,
            isASurvey: formState.isASurvey,
            subscribePage: formState.isSubscribePage,
            openHousePage: formState.isOpenHousePage,
            blogPage: formState.isBlogPage,
            src: "sitecoreFormsDatalayers",
          },
        };
        dataLayer.push(dlDebug);
      }
    },
    [pageContext.sitecoreContext.route?.itemLanguage, formState]
  );

  return { DataLayerPush };
};

const useFormHandlers = (formState: FormState, allResidenceData: ResidenceData, DataLayerPush: (dlObject: any) => void) => {
  const setLocalStorageSubmitter = useCallback(() => {
    const firstName = (document.querySelector("input[name='firstName']") as HTMLInputElement)?.value;
    const lastName = (document.querySelector("input[name='lastName']") as HTMLInputElement)?.value;
    const SubmitterName = `${firstName} ${lastName}`.trim();

    localStorage.setItem("chartwellSubmitter", JSON.stringify({ name: SubmitterName }));
  }, []);

  const updateEvent = useCallback(
    (field: HTMLInputElement, evtName: string) => {
      if (field.getAttribute("data-layer-set") === null) {
        const tmp: any = {};
        tmp.ecommerce = null;
        DataLayerPush(tmp);

        const pattern: RegExp = field.getAttribute("pattern") as unknown as RegExp;
        const value = field.value;

        if (value.match(pattern)) {
          const itm = {
            item_name: "corporate",
            item_id: "corporate",
            price: "1.00",
            item_variant: "",
            item_category: "corporate",
            item_category2: "corporate",
            item_category3: "corporate",
            item_category4: "corporate",
            item_category5: "web",
            quantity: "1",
          };

          if (formState.isPropertyPage) {
            const itm_vals: any = getPropertyDetailsByID(formState.propPageYardiID, allResidenceData);
            itm.item_name = normalize(itm_vals.name);

            let tmpYID = formState.propPageYardiID;
            const lvOpts = document.querySelector("[name='dropdownMenu']") as HTMLElement;
            if (formState.propPageYardiID == "11280" && (lvOpts.getAttribute("data-value") == "MC" || lvOpts.getAttribute("data-value") == "AL")) {
              (document.querySelector("[name='residenceofInterest1']") as HTMLInputElement).value = "11279";
              tmpYID = "11279";
            }
            if (formState.isExpansionPage) {
              tmpYID = getExpansionPageYardiID(tmpYID);
            }
            formState.propPageYardiID = tmpYID;

            itm.item_id = tmpYID;
            itm.item_category = itm_vals.prov;
            itm.item_category2 = itm_vals.city;
            itm.item_category3 = itm_vals.lang;
            itm.item_category4 = itm_vals.isPriorityProperty;
            itm.item_category5 = "web";
          }

          tmp.event = evtName;
          tmp.ecommerce = {
            items: [],
          };
          tmp.ecommerce.items.push(itm);
          console.log(tmp);
          DataLayerPush(tmp);
          field.setAttribute("data-layer-set", "true");
        }
      }
    },
    [DataLayerPush, allResidenceData, formState.isPropertyPage, formState.propPageYardiID]
  );

  return { setLocalStorageSubmitter, updateEvent };
};

const PURCHASE_LISTENER_ATTR = "data-chartwell-purchase-listener";
const PURCHASE_FIRED_ATTR = "data-chartwell-purchase-fired";

const SitecoreFormsDatalayers = () => {
  const pageContext = useSitecoreContext();
  const { formState, setFormState, allResidenceData } = useFormState(pageContext.sitecoreContext);
  const { DataLayerPush } = useDataLayer(pageContext, formState);
  const { setLocalStorageSubmitter, updateEvent } = useFormHandlers(formState, allResidenceData, DataLayerPush);
  const [yardiID, setYardiID] = useState({ id: "", name: "" });

  useEffect(() => {
    getSetUtmValues();
    const hasAddressField = getHasAddressField();
    setFormState((prev) => (prev.hasAddressField === hasAddressField ? prev : { ...prev, hasAddressField }));
  }, [formState.isFormLoaded, setFormState]);

  useEffect(() => {
    if (!formState.isFormLoaded) {
      waitForElement("form.content.lp-flex-container").then(() => {
        setFormState((prev) => ({ ...prev, isFormLoaded: true }));
        getSiteCoreFormStyling();
      });

      //we have to do this because residence select is continuously being re-rendered in the book a tour form and we need to make sure our event listener is always attached to it, we also need to make sure we are setting the correct yardi id value based on the selected residence in the select field
      const attachResidenceSelectListener: any = () => {
        const select = document.querySelector("#ResidenceSelect");
        if (select && !select.hasAttribute("data-listener-attached")) {
          select.addEventListener("change", (e) => {
            //wait for select #ResidenceSelect to be available in the DOM for book a tour form
            //and then add an eventlistener to it to handle changes in value, then setYardiID based on the selected value
            //yardiID value should be a key value pair of the value of the selected options and the text of the selected option so that we can easily use it in the datalayer and also display it in the thank you page
            const selectedYardiID = (e.target as HTMLInputElement).value;
            const selectedYardiText = (e.target as HTMLSelectElement).options[(e.target as HTMLSelectElement).selectedIndex].text;
            setYardiID({ id: selectedYardiID, name: selectedYardiText });
            //check to see if there is an identical id value in the select options, if there are multiple options with the same id,
            //then we setFieldsForSharedYardiIDProperties
            if (document.querySelectorAll(`#ResidenceSelect option[value="${selectedYardiID}"]`).length > 1) {
              setFieldsForSharedYardiIDProperties({ propertyName: { value: selectedYardiText } }, selectedYardiID);
              console.log("selected residence id:" + selectedYardiID + " selected residence text: " + selectedYardiText);
            } else {
              setFieldsForSharedYardiIDProperties();
            }
          });
          select.setAttribute("data-listener-attached", "true");
        }
      };

      // Observe the parent container for child changes
      const parent = document.querySelector("#ResidenceSelect")?.parentElement || document.body;
      const observer = new MutationObserver(() => {
        attachResidenceSelectListener();
      });
      observer.observe(parent, { childList: true, subtree: true });

      // Initial attach in case it's already present
      attachResidenceSelectListener();
    }
  }, [formState.isFormLoaded, setFormState, yardiID, yardiID.id]);

  // useEffect(() => {
  //   getPropertyDetailsByID(yardiID.id, allResidenceData);
  // }, [allResidenceData, yardiID, yardiID.name, yardiID.id]);

  useEffect(() => {
    if (formState.isPropertyPage) {
      //const placeholder: any = pageContext.sitecoreContext.route?.placeholders["headless-header"]?.filter((comp: any) => comp.componentName === "ChartwellPropertyHeader");
      // const infoNode: any = placeholder?.[0]?.fields?.data?.item?.ancestors?.filter((ancestor: any) => ancestor && Object.keys(ancestor).length > 0)?.[0];
      const placeholder = searchPlaceHoldersForComponent(pageContext.sitecoreContext.route?.placeholders as any, "ChartwellPropertyHeader");
      const infoNode: any = placeholder?.fields?.data?.ci?.parent;
      const nextYardiId = infoNode?.fields?.find((item: any) => item?.name === "PropertyID")?.jsonValue?.value || "";
      setFormState((prev) => (prev.propPageYardiID === nextYardiId ? prev : { ...prev, propPageYardiID: nextYardiId }));
    }
  }, [formState.isPropertyPage, pageContext.sitecoreContext.route?.placeholders, setFormState]);

  useEffect(() => {
    if (formState.propPageYardiID && formState.isFormLoaded) {
      (document.querySelector("[name='residenceofInterest1']") as HTMLInputElement)?.setAttribute("value", formState.propPageYardiID);

      const CareServicesAll = (allResidenceData as any).ResidenceData.combinedCareServices;
      setLivingOptionsFieldValues(CareServicesAll, formState.propPageYardiID, allResidenceData, pageContext.sitecoreContext.language as string);
    }
  }, [formState.propPageYardiID, formState.isFormLoaded, allResidenceData, pageContext.sitecoreContext.language]);

  useEffect(() => {
    if (formState.isFormLoaded) {
      const form = document.querySelector("form[data-formid]");
      const submitButton: HTMLButtonElement = (form as HTMLFormElement)?.querySelector("button.lp-flex-container.submit-button") as HTMLButtonElement;
      let purchaseSubmitButton: HTMLButtonElement | null = null;
      let purchaseClickHandler: (() => void) | null = null;
      //we sanitize all form inputs
      sanitizeInputs(form as HTMLFormElement);

      //we need to set the redirect url
      let tyURL = window.location.origin + window.location.pathname + (pageContext.sitecoreContext.language == "en" ? "/thank-you" : "/merci") + window.location.search;
      if (formState.isBlogPage) {
        tyURL = window.location.origin + (pageContext.sitecoreContext.language == "en" ? "/subscribe/thank-you" : "/fr/s-abonner-a-notre-infolettre/merci") + window.location.search;
      }
      const tyPageURLField = (form as HTMLFormElement)?.querySelector("input[name='thankYouPageURL']") as HTMLInputElement;
      if (tyPageURLField?.value.includes("http")) {
        (form as HTMLFormElement)?.setAttribute("data-success-redirect-url", tyPageURLField?.value);
      } else {
        (form as HTMLFormElement)?.setAttribute("data-success-redirect-url", tyURL);
      }

      //we need to handle date fields format: mm/dd/yyyy
      const dateFields = (form as HTMLFormElement)?.querySelectorAll("input[type='date']");
      const minDate = new Date(new Date().getTime() + 48 * 60 * 60 * 1000).toISOString().split("T")[0];
      dateFields?.forEach((field: HTMLInputElement) => {
        field.setAttribute("min", minDate);
      });

      //we need to handle postal code error messages
      submitButton?.addEventListener("click", () => {
        const hasErrors = (form as HTMLFormElement)?.querySelectorAll(".form-input-error-field").length ? true : false;
        if (hasErrors) {
          const postalCodeField = (form as HTMLFormElement)?.querySelector("input[name='PostalCode']") as HTMLInputElement;
          if (postalCodeField?.getAttribute("aria-invalid") == "true") {
            const errorDiv = Array.from(document.querySelectorAll("div.global-input-error-message.form-input-error-message")).find((div) =>
              div.textContent?.includes("Please match the requested format.")
            );

            if (errorDiv && pageContext.sitecoreContext.language == "fr") {
              // Perform actions with errorDiv, e.g., set error message
              const errorMsg = "Veuillez respecter le format requis.";
              errorDiv.setAttribute("title", errorMsg);
              errorDiv.innerHTML = `<span class="mdi mdi-alert-circle" aria-hidden="true"> ${errorMsg}</span> `;
            }
          }
        }
      });

      //This is for personalization
      const firstnameField = document.querySelector("input[name='firstName']") as HTMLInputElement;
      firstnameField?.addEventListener("blur", () => {
        setLocalStorageSubmitter();
      });

      if (formState.isAmIReady || formState.isItTime) {
        setSurveyFields();
      }

      if (formState.hasAddressField) {
        const mailingAddressField = document.querySelector("[name='mailStreetAddress']") as HTMLInputElement;
        const form = mailingAddressField?.closest("form") as HTMLFormElement;
        mailingAddressField.setAttribute("autocomplete", "off");
        const config = getAddressCompleteConfig(pageContext.sitecoreContext);
        mailingAddressField?.addEventListener("input", () => {
          getAddressSuggestions(config);
        });
        mailingAddressField &&
          form.addEventListener("submit", (e: Event) => {
            e.preventDefault(); // Always prevent default at the start
            const cityField = document.querySelector("input[name='city']") as HTMLInputElement;
            const stateProvField = document.querySelector("input[name='stateProv']") as HTMLInputElement;
            const postalCodeField = document.querySelector("input[name='PostalCode']") as HTMLInputElement;

            //if any of the fields are empty, we clear all the mailing address fields
            if (mailingAddressField.value.trim().length == 0 || cityField.value.trim().length == 0 || stateProvField.value.trim().length == 0 || postalCodeField.value.trim().length == 0) {
              cityField.value = "";
              stateProvField.value = "";
              postalCodeField.value = "";
              mailingAddressField.value = "";
            }
            form.submit(); // Submit at the end
          });
      }
      if (formState.isBookATour) {
        const surnameField = document.querySelector("input[name='lastName']") as HTMLInputElement;
        const emailField = document.querySelector("input[name='emailAddress']") as HTMLInputElement;
        const postalCodeField = document.querySelector("input[name='PostalCode']") as HTMLInputElement;
        const livingOptionsField = document.querySelector("[name='dropdownMenu']") as HTMLInputElement;
        const isSiteCoreForm = document.querySelector("byoc-sitecore-form") as HTMLInputElement;

        if (formState.isPropertyPage) {
          waitForElement("byoc-sitecore-form form.content.lp-flex-container .component.global-text h1").then(() => {
            const bookATourHeading: HTMLElement = document.querySelector("byoc-sitecore-form form.content.lp-flex-container .component.global-text h1") as HTMLElement;

            bookATourHeading?.classList.add("line-height-1");
            bookATourHeading?.setAttribute("id", "bookATourHeading");

            // exception for le Jules Verne and setting of jules verne values
            customizeJulesVerneResidence(formState);

            const propName = (getPropertyDetailsByID(formState.propPageYardiID, allResidenceData) as any).fullName;
            if (!bookATourHeading?.innerHTML.includes(shortenPropNames(propName)) && propName) {
              if (bookATourHeading) {
                bookATourHeading.innerHTML = `<span class="font-semibold">${bookATourHeading.innerHTML}</span> ${shortenPropNames(propName)}`;
              }
            }
            const propAddress = document.createElement("address");
            // let streetAddress = (getPropertyDetailsByID(formState.propPageYardiID, allResidenceData) as any).streetAddress;
            // let streetAddress = document.location.href.includes("/le-jules-verne/condos-locatifs/planifier-une-visite")
            //   ? (pageContext?.sitecoreContext?.route?.fields as any)?.["CustomAddress"]?.value
            //   : (getLocalizedResidenceAddress(formState.propPageYardiID, allResidenceData, pageContext?.sitecoreContext?.route?.itemLanguage as string) as any)?.streetAddress;
            let streetAddress =
              getCustomLocalizedAddress(pageContext?.sitecoreContext?.route?.fields, document.location.href) ||
              (getLocalizedResidenceAddress(formState.propPageYardiID, allResidenceData, pageContext?.sitecoreContext?.route?.itemLanguage as string) as any)?.streetAddress;

            if (document.querySelectorAll("#propertyAddress").length == 0) {
              document.querySelectorAll("#propertyAddress").forEach((el) => el.remove());
              propAddress.classList.add("property-address", "not-italic", "text-ChartwellGrey", "font-semibold");
              propAddress.setAttribute("id", "propertyAddress");
              propAddress.innerHTML = streetAddress;
              streetAddress = "";
            }
            if (bookATourHeading?.parentElement?.tagName == "DIV") bookATourHeading.after(propAddress);
            else bookATourHeading?.parentElement?.after(propAddress);
          });

          if (formState.isFormLoaded && isSiteCoreForm && livingOptionsField && postalCodeField) {
            const containerID = `${livingOptionsField.getAttribute("data-id")}`;
            document.getElementById(containerID)?.classList.add("basis-1/2");
          }
        }

        //WHEN USER ADDS SURNAME AND STARTS FILLING NEXT FIELD, FIRE EVENT
        surnameField?.addEventListener("blur", () => {
          updateEvent(surnameField, "add_to_cart");
          setLocalStorageSubmitter();
        });

        //WHEN USER ADDS EMAIL ADDRESS AND STARTS FILLING NEXT FIELD, FIRE EVENT
        emailField?.addEventListener("blur", () => {
          updateEvent(emailField, "begin_checkout");
        });

        //when the postalcode field is updated, we also update the mailing postal code if available
        postalCodeField?.addEventListener("blur", () => {
          if (postalCodeField.getAttribute("aria-invalid") == "false") {
            const mailingPostalCodeField = document.querySelector("[name='mailPostalCode']") as HTMLInputElement;
            mailingPostalCodeField.value = postalCodeField.value;
          }
        });

        const formEl = form as HTMLFormElement;
        const handleBookATourPurchaseClick = () => {
          if (formEl.getAttribute(PURCHASE_FIRED_ATTR) === "true") {
            return;
          }

          let yardiID = (document.querySelector("[name='residenceofInterest1']") as HTMLInputElement)?.value;
          const contactType = (document.querySelector("[name='contactType']") as HTMLInputElement)?.value == "SLF" ? "for myself" : "for a loved one";
          const propertyDetails: any = yardiID ? getPropertyDetailsByID(yardiID, allResidenceData) : {};
          const lvOpts = document.querySelector("[name='dropdownMenu']") as HTMLElement;

          //changing yardi id for memory care or assisted living
          if (yardiID == "11280" && (lvOpts.getAttribute("data-value") == "MC" || lvOpts.getAttribute("data-value") == "AL")) {
            (document.querySelector("[name='residenceofInterest1']") as HTMLInputElement).value = "11279";
            yardiID = "11279";
          }

          yardiID = formState.isExpansionPage ? getExpansionPageYardiID(yardiID) : yardiID;
          const hasErrors = formEl.querySelectorAll(".form-input-error-field").length ? true : false;

          setLocalStorageSubmitter();

          if (!hasErrors) {
            formEl.setAttribute(PURCHASE_FIRED_ATTR, "true");

            window.dataLayer = window.dataLayer || [];

            //and set residence details for thank you page
            localStorage.setItem("chartwellBookTourResidence", JSON.stringify({ resName: propertyDetails.name, resAddress: propertyDetails.streetAddress }));

            DataLayerPush({
              event: "purchase",
              ecommerce: {
                transaction_id: uuidv4(), // random number (must be unique each time)
                value: 1, // static
                currency: "CAD", // static
                items: [
                  {
                    item_name: propertyDetails.name, // if user selected residence see excel for value, if not use 'corporate'
                    //item_id: getIsPropertyPage(pageContext.sitecoreContext.route?.templateName as string) ? yardiID : "corporate", // yardi ID or static
                    item_id: "corporate", // static
                    price: "1.00", // static value
                    item_variant: contactType, // values: for myself or for a loved one, based on user selection in form, if French use EN value
                    item_category: propertyDetails.prov, // if user selected province see excel for value, if not use 'corporate'
                    item_category2: propertyDetails.city, // if user selected city see excel for value, if not use 'corporate'
                    item_category3: propertyDetails.lang, // Bilingual, "English" or "French" if unilingual otherwise if not use 'corporate'
                    item_category4: propertyDetails.isPriorityProperty, // priorityProperty Yes/No
                    item_category5: "web", //web or chatbot
                    quantity: "1", // static
                  },
                ],
              },
            });
          }
        };

        if (submitButton && !submitButton.hasAttribute(PURCHASE_LISTENER_ATTR)) {
          submitButton.setAttribute(PURCHASE_LISTENER_ATTR, "true");
          submitButton.addEventListener("click", handleBookATourPurchaseClick);
          purchaseSubmitButton = submitButton;
          purchaseClickHandler = handleBookATourPurchaseClick;
        }
      }
      if (formState.isContactUs) {
        waitForElement("button.lp-flex-container.submit-button").then(() => {
          getSiteCoreFormStyling();
          const submitBtn = document.querySelector("button.lp-flex-container.submit-button") as HTMLButtonElement;
          const frm = document.querySelector("form[data-formid]") as HTMLFormElement;
          (submitBtn as HTMLButtonElement).addEventListener("click", () => {
            const hasErrors = (frm as HTMLFormElement).querySelectorAll(".form-input-error-field").length ? true : false;
            const forWhoField = document.querySelector("[name='type']") as HTMLInputElement;
            const forWho = forWhoField?.getAttribute("data-value") == "SLF" ? "for myself" : forWhoField?.getAttribute("data-value") == "CHI" ? "for a loved one" : "";
            if (!hasErrors) {
              const dl: any = {
                event: "contact_us",
                // pageContent: "corporate", //static
                // page_lang: pageContext.sitecoreContext.language == "en" ? "EN" : "FR",
                // pageCat: "corporate", // static
                // pageType: "contact us thank you", // static
                product_code: "corporate", // static
                residence: forWho,
                reasons: formState.isAmIReady || formState.isItTime ? "survey" : (document.querySelector("[name='subject']") as HTMLInputElement).value,
              };
              DataLayerPush(dl);
            }
          });
        });
      }
      if (formState.isResourcePage) {
        submitButton?.addEventListener("click", () => {
          const hasErrors = (form as HTMLFormElement).querySelectorAll(".form-input-error-field").length ? true : false;
          const forWhoField = document.querySelector("[name='yourselforLovedone']") as HTMLInputElement;
          const forWho = forWhoField?.getAttribute("data-value") == "SLF" ? "for myself" : forWhoField?.getAttribute("data-value") == "CHI" ? "for a loved one" : "";
          if (!hasErrors) {
            DataLayerPush({
              event: "request_resources",
              // pageContent: "resources",
              // pageType: "resources thank you",
              residence: forWho,
              // pageCat: "corporate",
              // page_lang: pageContext.sitecoreContext.language == "en" ? "EN" : "FR",
            });
          }
        });
      }
      if (formState.isSubscribePage) {
        getSiteCoreFormStyling();
      }
      if (formState.isOpenHousePage) {
        submitButton?.addEventListener("click", () => {
          const hasErrors = (form as HTMLFormElement).querySelectorAll(".form-input-error-field").length ? true : false;
          if (!hasErrors) {
            const contactType = (document.querySelector("[name='contactType']") as HTMLInputElement)?.value == "SLF" ? "for myself" : "for a loved one";

            DataLayerPush({
              event: "open_house",
              page_lang: pageContext.sitecoreContext.language == "en" ? "EN" : "FR",
              residence: contactType, // user selection of "who will be leaving.."  - if French use EN value; write values as you do in the 'request_resources' or contact_us event
            });
          }
        });
      }
      if (formState.isBlogPage) {
        //for the blog card subscribe form in helpful resources
        const blogCardForm = document.querySelector("#eloquaForm form") as HTMLFormElement;
        const blogCardFormSubmit = blogCardForm?.querySelector("input[type='Submit']") as HTMLInputElement;
        blogCardFormSubmit?.addEventListener("click", () => {
          setTimeout(() => {
            const hasErrors = document.querySelectorAll("[data-valid='false']").length ? true : false;
            if (!hasErrors) {
              DataLayerPush({
                event: "subscribe",
                page_lang: pageContext.sitecoreContext.language == "en" ? "EN" : "FR",
                page_lang_keep: true,
              });
            }
          }, 500);
        });
      }

      return () => {
        if (purchaseSubmitButton && purchaseClickHandler) {
          purchaseSubmitButton.removeEventListener("click", purchaseClickHandler);
          purchaseSubmitButton.removeAttribute(PURCHASE_LISTENER_ATTR);
        }
      };
    }
  }, [
    pageContext.sitecoreContext.language,
    DataLayerPush,
    allResidenceData,
    formState.isBookATour,
    formState.isFormLoaded,
    formState.isPropertyPage,
    setLocalStorageSubmitter,
    updateEvent,
    formState.isContactUs,
    formState.isAmIReady,
    formState.isItTime,
    formState.isResourcePage,
    formState.isBlogPage,
    formState.isSubscribePage,
    formState.propPageYardiID,
    formState.isOpenHousePage,
    formState.isExpansionPage,
    formState.hasAddressField,
  ]);
};
export default SitecoreFormsDatalayers;
