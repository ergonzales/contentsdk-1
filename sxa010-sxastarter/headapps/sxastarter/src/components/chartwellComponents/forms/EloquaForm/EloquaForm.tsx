import { JSX } from "react";
import { useState, useEffect } from "react";
import { Field } from "@sitecore-content-sdk/nextjs";
import { ComponentProps } from "lib/component-props";
import Script from "next/script";
import { ClipLoader } from "react-spinners";
import ResidenceLocationSelector from "./ResidenceLocationSelector";
import { YardiValueChanger } from "./YardiValueChanger";
import { normalize, getSetUtmValues, getIsPropertyPage, getIsAmIReady } from "lib/helpers/form/formAndDatalayerHelpers";
import { useSitecoreContext } from "lib/sitecore/useSitecoreContext";

type EloquaFormProps = ComponentProps & {
  fields: {
    PageHeading: Field<string>;
    PageHtml?: Field<string>;
    EloquaID: Field<string>;
    FormName: Field<string>;
    FormHTML: Field<string>;
    FormHeading?: Field<string>;
    FormHeadingLevel?: Field<string>;
    FormBackground?: Field<string>;
    ProvinceSelector?: Array<any>;
    ProvinceSelectLabel?: Field<string>;
    CitySelectLabel?: Field<string>;
    ResidenceSelectLabel?: Field<string>;
    isTwoColumns: Field<boolean>;
    ColumnRatio: Field<string>;
  };
};

const EloquaForm = (props: EloquaFormProps): JSX.Element => {
  const pageContext = useSitecoreContext();
  const isPropertyPage = getIsPropertyPage(pageContext.sitecoreContext.route?.templateName as string);
  const isAmIReady = getIsAmIReady(pageContext.sitecoreContext);

  const placeHolders: any = pageContext.sitecoreContext?.route?.placeholders;
  const contextPlaceholder = placeHolders["headless-header"].filter((x: { componentName: string }) => x.componentName === "PropertyHeaderNavigation")[0];
  const ancestor = contextPlaceholder?.fields?.data?.item?.ancestors?.find((a: any) => a.hasOwnProperty("contextParentPropertyId")) || "";
  const isTwoColumns = props?.fields?.isTwoColumns?.value;
  const yardiID =
    contextPlaceholder && contextPlaceholder?.fields?.data?.item?.contextParentPropertyId
      ? contextPlaceholder?.fields?.data?.item?.contextParentPropertyId?.value
      : ancestor.contextParentPropertyId?.value;

  const propertyAddress =
    `${ancestor?.address?.value ? `${ancestor?.address?.value}, ` : ""}${ancestor?.city?.targetItems?.[0]?.cityName?.value ? `${ancestor?.city?.targetItems?.[0]?.cityName?.value}, ` : ""}${
      ancestor?.province?.targetItems?.[0]?.field?.value ? `${ancestor?.province.targetItems[0].field.value} ` : ""
    }${ancestor?.postalCode?.value ?? ""}` || "";

  const propertyNameHeading = (isPropertyPage && contextPlaceholder && ancestor?.propertyNavigationTitle?.value) || contextPlaceholder?.fields?.["Property Name"]?.value || "";
  const hideResSelectSnippet = yardiID ? `document.querySelector("select[name='residenceofInterest1']").closest('.form-element-layout').classList.add('superHidden');` : ``;

  const formAction = "https://trk.living.chartwell.com/e/f2";
  const additionalFormFields = '<input type="hidden" name="elqCustomerGUID" value=""/><input type="hidden" name="elqCookieWrite" value="0"/></form>';
  const PageHTML = props.fields && props.fields?.PageHtml != undefined ? props.fields && props.fields?.PageHtml.value : "";
  const [finalFormHTML, setFormHTML] = useState("");
  const [formHandlerScript, setFormHandler] = useState("");
  const [formReady, setFormReady] = useState(false);
  const [isEloquaJsLoaded, setEloquaJsLoaded] = useState(false);
  const [hasResidenceField, setHasResidenceField] = useState(false);

  YardiValueChanger();

  //SET LOCAL STORAGE FOR PERSONALIZATION
  const setLocalStorageSubmitter = () => {
    const SubmitterName: any = (document.querySelector("#eloquaForm form input[name='firstName']") as HTMLInputElement)?.value.concat(
      " ",
      (document.querySelector("#eloquaForm form input[name='lastName']") as HTMLInputElement)?.value
    );

    let residenceName = "";
    let residenceAddress = "";

    if (isPropertyPage) {
      //property book a tours will have this value on page
      residenceName = (document.querySelector("#residenceName") as HTMLDivElement).innerText;
      residenceAddress = (document.querySelector("#residenceAddress") as HTMLDivElement).innerText;
    }

    localStorage.setItem("chartwellSubmitter", JSON.stringify({ name: SubmitterName.trim() }));
    localStorage.setItem("chartwellBookTourResidence", JSON.stringify({ resName: residenceName, resAddress: residenceAddress }));
  };

  useEffect(() => {
    let cwForm = props.fields && props.fields?.FormHTML?.value;
    cwForm = cwForm.replace("https://s1816836.t.eloqua.com/e/f2", formAction).replace("</form>", additionalFormFields);
    cwForm = cwForm.replace(/<style([\s\S]+?)<\/style>/g, "");
    cwForm = cwForm.replace(/~~eloqua..type--([\s\S]+?)~~/g, "");
    cwForm = cwForm.replace(/style="([\s\S]+?)"/g, "");

    cwForm = cwForm.replace(
      /<input type="text" class="elq-item-input" name="preferredDate"/,
      '<input type="date" id="dateSelector" class="elq-item-input" value=""><input type="text" class="elq-item-input hidden" name="preferredDate"'
    );
    cwForm = cwForm.replace(/<input type="hidden" name="language" id="\S+" value="">/, `<input type="hidden" name="language" id="fe591" value="${pageContext.sitecoreContext?.language}">`);

    if (pageContext.sitecoreContext.route?.templateName == "PropertyChildPage") {
      cwForm = cwForm.replace(`<option value="${yardiID}"`, `<option value="${yardiID}" selected="selected"`);
    }
    const extractedScript = /<script>(.+)<\/script>/gi.exec(cwForm);
    cwForm = extractedScript ? cwForm.replace(extractedScript[0], "") : cwForm;
    setFormHTML(cwForm);
    if (extractedScript != null && extractedScript.length > 0) {
      const scriptSrc = extractedScript[0].replace("<script>", "").replace("</script>", "");
      setFormHandler(scriptSrc);
    }
  }, [formHandlerScript, pageContext.sitecoreContext?.language, pageContext.sitecoreContext.route?.templateName, props.fields, props.fields?.FormHTML, yardiID]);

  useEffect(() => {
    if (!formReady) {
      setFormReady(finalFormHTML != "" && formHandlerScript != "" && isEloquaJsLoaded ? true : false);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finalFormHTML, formHandlerScript, isEloquaJsLoaded]);

  const provinces = [
    { name: "Alberta", value: "AB" },
    { name: "British Columbia", value: "BC" },
    { name: "Ontario", value: "ON" },
    { name: "Quebec", value: "QC" },
    { name: "Colombie-Britannique", value: "BC" },
  ];

  const DataLayerPush = (dlObject: any) => {
    const dataLayer = (window.dataLayer = window.dataLayer || []);
    dlObject.page_lang = pageContext.sitecoreContext.route?.itemLanguage?.toUpperCase() || "";
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

    const sitecoreContext = pageContext.sitecoreContext;
    const regexToReplace = [new RegExp(/ residence pour retraites/gim), new RegExp(/ retirement residence/gim), new RegExp(/ care residence/gim), new RegExp(/\'/g)];

    if (sitecoreContext.route?.templateName === "PropertyPage") {
      obj.pID = sitecoreContext.route?.fields?.PropertyID;
      obj.propertyName = normalize(sitecoreContext.route?.fields?.["Property Name"] as any);
      obj.propertyName = obj.propertyName.value.replace(regexToReplace[0], "").replace(regexToReplace[1], "").replace(regexToReplace[2], "").replace(regexToReplace[3], "");
      obj.province = (sitecoreContext.route?.fields?.Province as any)?.[0].fields["Province Abbreviation"]?.value;
      const cityfield: any = sitecoreContext.route?.fields?.City;
      obj.city = (cityfield[0].fields["City Name"] as any)?.value;
      obj.isBilingual = (sitecoreContext.route?.fields?.Bilingual as any)?.value;
      obj.isPriorityProperty = (sitecoreContext.route?.fields?.isPriorityProperty as any)?.value;
    } else {
      const placeholder: any = sitecoreContext.route?.placeholders["headless-header"]?.filter((comp: any) => comp.componentName === "PropertyHeaderNavigation");
      const infoNode: any = placeholder?.[0]?.fields?.data?.item?.ancestors.find((anc: any) => anc.hasOwnProperty("contextParentPropertyId"));
      obj.pID = (infoNode?.contextParentPropertyId as any).value || "123";
      const propertyName = normalize(infoNode?.propertyName.value);
      obj.propertyName = propertyName.replace(regexToReplace[0], "").replace(regexToReplace[1], "").replace(regexToReplace[2], "").replace(regexToReplace[3], "");
      obj.province = provinces.find((p) => p.name === infoNode?.province?.targetItems?.[0]?.name)?.value || "";
      obj.city = infoNode?.city?.targetItems?.[0]?.name;
      obj.isBilingual = infoNode?.bilingual?.boolValue;
      obj.isPriorityProperty = infoNode?.isPriorityProperty?.boolValue;
    }
    return obj;
  };

  useEffect(() => {
    if (formReady) {
      //events for when the surname or email address is filled in and valid
      const updateEvent = (field: HTMLInputElement, evtName: string) => {
        if (field.getAttribute("data-layer-set") === null) {
          const tmp: any = {};
          tmp.ecommerce = null;
          DataLayerPush(tmp);

          const isPropertyPage = pageContext.sitecoreContext.route?.templateName?.toLowerCase().includes("property") ? true : false;
          if (field.classList.contains("LV_valid_field")) {
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
              //itm.item_name = normalize(itm_vals.propertyName);
              itm.item_name = itm_vals.propertyName.hasOwnProperty("value") ? normalize(itm_vals.propertyName.value) : normalize(itm_vals.propertyName);
              itm.item_id = itm_vals.pID;
              itm.item_category = normalize(itm_vals.province);
              itm.item_category2 = normalize(itm_vals.city);
              itm.item_category3 = itm_vals.isBilingual ? "Bilingual" : pageContext.sitecoreContext.language == "en" ? "English" : "French";
              itm.item_category4 = itm_vals.isPriorityProperty ? "Yes" : "No";
            }

            tmp.event = evtName;
            tmp.ecommerce = {
              items: [],
            };
            tmp.ecommerce.items.push(itm);

            DataLayerPush(tmp);
            field.setAttribute("data-layer-set", "true");
          }
        }
      };
      const firstnameField = document.querySelector("input[name='firstName']") as HTMLInputElement;
      const surnameField = document.querySelector("input[name='lastName']") as HTMLInputElement;
      const emailField = document.querySelector("input[name='emailAddress']") as HTMLInputElement;
      const resSelectField = document.querySelector("#ResidenceSelect") as HTMLSelectElement;

      const isBookATour =
        pageContext.sitecoreContext.route?.name == "book-a-tour" ||
        pageContext.sitecoreContext.route?.name == "planifier-une-visite" ||
        (isAmIReady && (document.querySelector("input[name='elqFormName']") as HTMLInputElement).value.includes("am_i_ready_book_a_tour"))
          ? true
          : false;

      isBookATour &&
        //This is for personalization
        firstnameField?.addEventListener("blur", () => {
          setLocalStorageSubmitter();
        });

      isBookATour &&
        //WHEN USER ADDS SURNAME AND STARTS FILLING NEXT FIELD, FIRE EVENT
        surnameField?.addEventListener("blur", () => {
          updateEvent(surnameField, "add_to_cart");
          setLocalStorageSubmitter();
        });

      isBookATour &&
        //WHEN USER ADDS SURNAME AND STARTS FILLING NEXT FIELD, FIRE EVENT
        resSelectField?.addEventListener("blur", () => {
          setLocalStorageSubmitter();
        });

      isBookATour &&
        //WHEN USER ADDS EMAIL ADDRESS AND STARTS FILLING NEXT FIELD, FIRE EVENT
        emailField?.addEventListener("blur", () => {
          updateEvent(emailField, "begin_checkout");
        });

      //set the Living Options for Langley Gardens
      if (isPropertyPage) {
        const itm_vals = getDLPropertyInfo();
        if (itm_vals.pID == "11073") {
          const livingOptionsField = document.querySelector("[name='dropdownMenu']") as HTMLSelectElement;
          const ltcOpt = document.createElement("option");
          ltcOpt.value = "LTC";
          ltcOpt.text = pageContext.sitecoreContext.language == "en" ? "Long Term Care" : "Soins de longue durée";
          livingOptionsField.add(ltcOpt);
        }
      }
    }

    setHasResidenceField(document.querySelector("select[name*='residence']") != null ? true : false);

    getSetUtmValues();

    if (document.querySelector("form.elq-form input.submit-button-style") != null) {
      document.querySelector("form.elq-form input.submit-button-style")?.removeAttribute("disabled");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formReady]);

  const columnWidthStyle = isTwoColumns ? "columnRatio" + (props?.fields?.ColumnRatio?.value ? props?.fields?.ColumnRatio?.value : "50-50") : "";

  //following appends params to the thank you page url. To be used for Datalayers
  const createParams = (tyPage: string, args?: string) => {
    const a = document.createElement("a") as HTMLAnchorElement;
    a.href = args ? tyPage + args : tyPage;
    const params = new URLSearchParams(a.search);
    params.forEach((value, field) => {
      params.set(field, value);
    });

    const forWho = document.querySelector('[name="yourselforLovedone"]') as HTMLSelectElement;
    const contactType = document.querySelector('[name="contactType"]') as HTMLInputElement;
    const regEx = new RegExp("se?lf");
    if (forWho) {
      params.set("fw", regEx.test(forWho.value.toLowerCase()) ? "SLF" : "CHI");
    }
    if (contactType) {
      params.set("fw", contactType.value);
    }
    const forWhoElse = document.querySelector('select[name="type"]') as HTMLSelectElement;
    if (forWhoElse) {
      params.set("fw", regEx.test(forWhoElse.value.toLowerCase()) ? "SLF" : "CHI");
    }
    const reasons = document.querySelector('[name="subject"]') as HTMLInputElement;
    if (reasons) {
      params.set("rs", encodeURI(reasons.value));
    }
    const prov = document.querySelector("#ProvSelect") as HTMLSelectElement;
    if (prov) {
      const selectedprov = Array.from(prov.options).find((p: any) => p.value == prov.value) as any;
      const provAbbr = provinces.find((p) => p.name == selectedprov.getAttribute("data-val")) as any;
      params.set("p", encodeURI(provAbbr?.value));
    } else {
      params.set("p", "corporate");
    }

    const city = document.querySelector("#CitySelect") as HTMLSelectElement;
    if (city) {
      const selectedcity = Array.from(city.options).find((c: any) => c.value == city.value) as any;
      params.set("c", encodeURI(selectedcity.innerText));
    } else {
      params.set("c", "corporate");
    }

    const residence = document.querySelector("#ResidenceSelect") as HTMLSelectElement;
    if (residence) {
      params.set("h", encodeURI(residence.options[residence.selectedIndex].text));
      params.set("b", residence.options[residence.selectedIndex].getAttribute("data-bilingual") || "false");
      params.set("ip", residence.options[residence.selectedIndex].getAttribute("data-ispriorityproperty") || "No");
      params.set("ri", residence.value);
    }

    !isPropertyPage && params.set("crp", "1");

    a.search = params.toString();
    return a;
  };

  //updating the thank you page url.
  //uses function above to append params for Datalayers
  useEffect(() => {
    if (formReady) {
      const has_HTTP = new RegExp("http(s*)://");
      isPropertyPage &&
        document.addEventListener("submit", (event: SubmitEvent) => {
          if ((event.target as HTMLFormElement).name.includes("bookatour")) {
            const args = window.location.search;
            const tyPage = has_HTTP.test((document.querySelector("input[name='thankYouPageURL']") as HTMLInputElement)?.value)
              ? (document.querySelector("input[name='thankYouPageURL']") as HTMLInputElement)?.value.replace("https://chartwell.com", window.location.origin)
              : window.location.origin +
                (document.querySelector("#thankYouPageURL") as HTMLInputElement)?.value +
                ("/" + (document.querySelector("input[name='thankYouPageURL']") as HTMLInputElement)?.value).replace("//", "/");
            const a = createParams(tyPage, args);
            (document.querySelector("input[name='thankYouPageURL']") as HTMLInputElement)?.setAttribute("value", a.href.toString());
          }

          //edgewater
          const itm_vals = getDLPropertyInfo();
          if (itm_vals.pID == "11280") {
            const livingOptSelected = (document.querySelector("[name='dropdownMenu']") as HTMLSelectElement).value;
            if (livingOptSelected == "AL" || livingOptSelected == "MC") {
              (document.querySelector("[name='residenceofInterest1']") as HTMLSelectElement).value = "11279";
            }
          }
        });

      !isPropertyPage &&
        document.addEventListener("submit", () => {
          //edgewater
          const YardiID = (document.querySelector("#ResidenceSelect") as HTMLSelectElement)?.value;
          if (YardiID == "11280") {
            const livingOptSelected = (document.querySelector("[name='dropdownMenu']") as HTMLSelectElement).value;
            if (livingOptSelected == "AL" || livingOptSelected == "MC") {
              (document.querySelector("[name='residenceofInterest1']") as HTMLSelectElement).value = "11279";
            }
          }

          const a = document.createElement("a") as HTMLAnchorElement;
          a.href = window.location.href.endsWith("/") ? window.location.href.slice(0, -1) : window.location.href;
          const currLoc = a.origin + a.pathname;
          const existingParams = a.search;
          if (document.querySelector("input[name='thankYouPageURL']")) {
            const pgPath = ("/" + (document.querySelector("input[name='thankYouPageURL']") as HTMLInputElement).value).replace("//", "/");
            const tyPage = has_HTTP.test((document.querySelector("input[name='thankYouPageURL']") as HTMLInputElement).value)
              ? (document.querySelector("input[name='thankYouPageURL']") as HTMLInputElement).value.replace("https://chartwell.com", window.location.origin)
              : currLoc + pgPath;
            const a = createParams(tyPage, existingParams);
            (document.querySelector("input[name='thankYouPageURL']") as HTMLInputElement).setAttribute("value", a.href.toString());
          }

          if (document.querySelector("input[name='thankYouPageUrl']")) {
            const pgPath = ("/" + (document.querySelector("input[name='thankYouPageUrl']") as HTMLInputElement).value).replace("//", "/");
            const tyPage = has_HTTP.test((document.querySelector("input[name='thankYouPageUrl']") as HTMLInputElement).value)
              ? (document.querySelector("input[name='thankYouPageUrl']") as HTMLInputElement).value.replace("https://chartwell.com", window.location.origin)
              : currLoc + pgPath;
            const a = createParams(tyPage, existingParams);
            (document.querySelector("input[name='thankYouPageUrl']") as HTMLInputElement).setAttribute("value", a.href.toString());
          }
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
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formReady]);

  return (
    <>
      <div className={`w-full ${isTwoColumns ? "" : "bg-ChartwellPlum p-8"} cwEloquaFormContainer`}>
        <div className={`container ${isTwoColumns ? "  md:mt-100px" : ""} mx-auto`}>
          <div className={`mx-auto grid max-w-7xl grid-cols-1 gap-1 md:gap-6 ${isTwoColumns ? "lg:grid-cols-2" : ""} cwEloquaFormRowOrCol ${columnWidthStyle}`}>
            <div className="p-6 md:p-2 elqFormTextContainer">
              {
                // for regular forms, this will be the topmost part of the page, we want it to have an H1
                pageContext.sitecoreContext.route?.templateName !== "BlogArticle" && props.fields?.PageHeading?.value && (
                  <div className="formTitleLeft">
                    <h1 className={`${isTwoColumns ? "" : "text-ChartwellWhite text-center"}`}>
                      {`${props.fields?.PageHeading?.value}`}
                      <br />
                      {isPropertyPage && <span id="residenceName">{propertyNameHeading}</span>}
                    </h1>
                    {isPropertyPage && (
                      <address className="not-italic text-ChartwellGrey font-semibold" id="residenceAddress">
                        {propertyAddress}
                      </address>
                    )}
                  </div>
                )
              }
              {
                // for blog articles, this form appears at the botom. we DO NOT want to have the H1
                pageContext.sitecoreContext.route?.templateName === "BlogArticle" && <h2 className="text-ChartwellWhite text-center">{`${props.fields?.PageHeading?.value}`}</h2>
              }
              <input type="hidden" id="thankYouPageURL" value={`${(pageContext.sitecoreContext.language == "fr" ? "/fr" : "") + pageContext.sitecoreContext?.itemPath}`} />
              <div
                id="eloquaFormPageContent"
                dangerouslySetInnerHTML={{
                  __html: `${PageHTML}`,
                }}
              />
            </div>
            <div className={`ChartwellContainer relative ${isTwoColumns ? " px-0 p-6 md:px-6 lg:px-6 flex-col" : " p-0"}`}>
              <div id="BT" className="mb-[60px] lg:mb-0"></div>
              <div className={`p-6 eloquaForm bg-no-repeat bg-cover  ${props.fields?.FormBackground?.value}`}>
                {
                  // for regular forms, this will be the topmost part of the page, we want it to have an H1
                  pageContext.sitecoreContext.route?.templateName !== "BlogArticle" && props.fields?.PageHeading?.value && (
                    <div className="formTitleRight">
                      <h2 className={`${isTwoColumns ? "" : "text-ChartwellWhite text-center"}`}>
                        {`${props.fields?.PageHeading?.value}`}
                        <br />
                        {isPropertyPage && <span id="residenceName">{propertyNameHeading}</span>}
                      </h2>
                    </div>
                  )
                }
                {formReady && (
                  <>
                    <div
                      id="eloquaForm"
                      className="w-100 bootlegBootstrapContainer"
                      dangerouslySetInnerHTML={{
                        __html: finalFormHTML,
                      }}
                    />
                    {!isPropertyPage && hasResidenceField && <ResidenceLocationSelector />}
                    <Script id="eloquaFormTracking" type="text/javascript">{`
                    <!--//
                    if (document.querySelector("input[id='dateSelector']")){
                      var someDate = new Date();
                      var numberOfDaysToAdd = 2;
                      var minDate = someDate.setDate(someDate.getDate() + numberOfDaysToAdd);
                      document.querySelector("input[id='dateSelector']").addEventListener("change", (event)=>{
                        var chosenDate = new Date(event.target.value + " 00:00:00");
                        if (!isNaN(chosenDate.getTime())){
                          var newDateOptions = {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit"
                          }
                          var dateValue = chosenDate.toLocaleString("en-US", newDateOptions );           
                          document.querySelector("input[name='preferredDate']").setAttribute("value", dateValue);                 
                          var evt = new Event('change', { bubbles: true });    
                        } else {
                          document.querySelector("input[name='preferredDate']").setAttribute("value","");                                       
                        }      
                      });
                      document.querySelector("input[id='dateSelector']").setAttribute("min",new Date(minDate).toISOString().slice(0, 10));                
                    }                        
                   
                    function elqGetCookie(name) {
                        var cookies = document.cookie.split(';');
                        for (var i = 0; i < cookies.length; i++) {
                            var position = cookies[i].indexOf('=');
                            if (position > 0 && position < cookies[i].length - 1) {
                                var x = cookies[i].substr(0, position);
                                var y = cookies[i].substr(position + 1);
                                x = x.replace(/^\s+|\s+$/g, '');
                                if (x == name) {
                                    return unescape(y);
                                }
                            }
                        }
                        return '';
                    }
                    function elqGetCookieSubValue(name, subKey) {
                        var cookieValue = elqGetCookie(name);
                        if (cookieValue == null || cookieValue == '')
                            return '';
                        var cookieSubValue = cookieValue.split('&');
                        for (var i = 0; i < cookieSubValue.length; i++) {
                            var pair = cookieSubValue[i].split('=');
                            if (pair.length > 1) {
                                if (pair[0] == subKey) {
                                    return pair[1];
                                }
                            }
                        }
                        return '';
                    }
                    function elqSetCustomerGUID() {
                        var elqCustomerGuid = elqGetCookieSubValue('ELOQUA', 'GUID');
                        if (elqCustomerGuid != null && elqCustomerGuid != '')
                          document.querySelector("input[name='elqCustomerGUID']").setAttribute("value", elqCustomerGuid);
                          //document.forms['contact_general'].elements['elqCustomerGUID'].value = elqCustomerGuid;
                        return;
                    }
                    elqSetCustomerGUID();
                    ${formHandlerScript} //this is the form validation. DO NOT DELETE THIS.                                     
                    //-->
                  `}</Script>
                    {isPropertyPage && (
                      <>
                        <Script id="eloquaFormSetResidenceval" type="text/javascript" strategy="afterInteractive">
                          {`
                        <!-- //           
                        ${hideResSelectSnippet}
                        document.addEventListener("submit", (event) => {
                          var has_HTTP = new RegExp("http(s*):\/\/");
                          if (event.target.name.includes('bookatour')){
                            var tyPage = has_HTTP.test(document.querySelector("input[name='thankYouPageURL']").value) ? document.querySelector("input[name='thankYouPageURL']").value.replace("https://chartwell.com", window.location.origin) : window.location.origin + document.querySelector("#thankYouPageURL").value + ("/" + document.querySelector("input[name='thankYouPageURL']").value).replace("//","/");

                            if (document.querySelector("input[name='thankYouPageURL']")){
                              document.querySelector("input[name='thankYouPageURL']").setAttribute("value",tyPage);
                            }                    
                          }
                        });
                        //-->
                      `}
                        </Script>
                      </>
                    )}
                  </>
                )}

                {!formReady && (
                  <div className="w-full h-12 flex justify-center items-center">
                    <ClipLoader size={72} color={"#fff"} loading={!formReady} />
                  </div>
                )}
              </div>
            </div>
          </div>
          <Script
            id="Eloquaformvalidation"
            type="text/javascript"
            src={`/js/livevalidation_chartwell.js?time=${new Date().valueOf()}`}
            strategy="afterInteractive"
            onLoad={() => {
              setEloquaJsLoaded(true);
            }}
          />
        </div>
      </div>
    </>
  );
};
export default EloquaForm;
