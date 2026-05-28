import { useCallback, useEffect, useState } from "react";
import { useSitecoreContext } from "lib/sitecore/useSitecoreContext";

import {
  getIsAmIReady,
  getIsItTime,
  getIsASurvey,
  getIsBookATour,
  getIsContactUs,
  getIsOpenHousePage,
  getIsPropertyPage,
  getIsResourcePage,
  getIsSubscribePage,
  getIsThankYouPage,
  getIsBlogPage,
  normalize,
  searchPlaceHoldersForComponent,
  getExpansionPageYardiID,
  getIsExpansionPage,
} from "../../../lib/helpers/form/formAndDatalayerHelpers";

declare global {
  interface Window {
    dataLayer?: any;
  }
}

export const ChartwellDataLayer = () => {
  const { sitecoreContext } = useSitecoreContext();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const provinces = [
    { name: "Alberta", value: "AB" },
    { name: "British Columbia", value: "BC" },
    { name: "Ontario", value: "ON" },
    { name: "Quebec", value: "QC" },
  ];

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const DataLayer: any = {};
  const isPropertyPage = getIsPropertyPage(sitecoreContext.route?.templateName as string);
  const isThankYouPage = getIsThankYouPage(sitecoreContext);
  const isAmIReady = getIsAmIReady(sitecoreContext);
  const isItTime = getIsItTime(sitecoreContext);
  const isASurvey = getIsASurvey(sitecoreContext);
  const isResourcePage = getIsResourcePage(sitecoreContext);
  const isContactUs = getIsContactUs(sitecoreContext);
  const isBookATour = getIsBookATour(sitecoreContext);
  const isSubscribePage = getIsSubscribePage(sitecoreContext);
  const isOpenHousePage = getIsOpenHousePage(sitecoreContext);
  const isBlogPage = getIsBlogPage(sitecoreContext);

  // As part of the ContentSDK migration context object will be available under page?.layout?.sitecore?.context where page is the prop passed to the component.
  //  Example -   const { page } = useSitecore(); This hook grants acсess to the current Sitecore page and api.
  //  const sitecoreContext = page?.layout?.sitecore?.context;

  const currLang = (sitecoreContext?.language ?? sitecoreContext.route?.itemLanguage)?.toUpperCase();

  const [corporateDataLayersFired, setCorporateDataLayersFired] = useState(false);

  const DataLayerPush = useCallback(
    (dlObject: any) => {
      if (typeof window === "undefined") {
        return;
      }

      window.dataLayer = window.dataLayer || [];
      window?.dataLayer?.push(dlObject);
      if (window.location.href.includes("localhost")) {
        const dlDebug: any = {};
        dlDebug.debug = {
          page: window.location.href,
          propertyPage: isPropertyPage,
          bookATour: isBookATour,
          thankYouPage: isThankYouPage,
          contactUs: isContactUs,
          resourcePage: isResourcePage,
          amIReady: isAmIReady,
          isItTime: isItTime,
          isASurvey: isASurvey,
          subscribePage: isSubscribePage,
          openHousePage: isOpenHousePage,
          blogPage: isBlogPage,
          src: "Datalayers",
        };
        window?.dataLayer?.push(dlDebug);
      }
    },
    [
      currLang,
      isAmIReady,
      isASurvey,
      isBlogPage,
      isBookATour,
      isContactUs,
      isItTime,
      isOpenHousePage,
      isPropertyPage,
      isResourcePage,
      isSubscribePage,
      isThankYouPage,
    ]
  );

  //get data layer values for property pages
  const getPropertyDlValues = useCallback(() => {
    const Obj: any = {};
    Obj.pID = "";
    Obj.propertyName = "";
    Obj.province = "";
    Obj.city = "";
    Obj.isBilingual = "";
    Obj.isPriorityProperty = "";
    if (sitecoreContext.route?.templateName === "PropertyPage") {
      Obj.pID = (sitecoreContext.route?.fields?.PropertyID as any).value;
      Obj.propertyName = normalize(
        (sitecoreContext.route?.fields?.["CustomDataLayerPropertyName"] as any).value
          ? (sitecoreContext.route?.fields?.["CustomDataLayerPropertyName"] as any).value
          : (sitecoreContext.route?.fields?.["Property Name"] as any).value
      );
      const prov: any = sitecoreContext.route?.fields?.Province;
      Obj.province = normalize(prov?.[0].fields["Province Abbreviation"]?.value);
      const cityfield: any = sitecoreContext.route?.fields?.City;
      Obj.city = normalize(cityfield?.[0]?.fields["City Name"]?.value);
      Obj.isBilingual = (sitecoreContext.route?.fields?.Bilingual as any)?.value;
      Obj.isPriorityProperty = (sitecoreContext.route?.fields?.isPriorityProperty as any)?.value;
    } else {
      const params = new URLSearchParams(document.location.search);
      const placeholders = sitecoreContext.route?.placeholders as any;
      const placeholder = searchPlaceHoldersForComponent(placeholders, "PropertyHeaderNavigation");
      const infoNode: any = placeholder?.fields?.data?.item?.ancestors?.filter((ancestor: any) => ancestor && Object.keys(ancestor).length > 0)?.[0];
      Obj.pID = (infoNode?.contextParentPropertyId as any)?.value;
      const customName = (infoNode?.customDataLayerPropertyName as any)?.value;
      const propertyName = infoNode?.propertyName ? infoNode?.propertyName.value : params.get("h");
      Obj.propertyName = normalize(customName ? customName : propertyName);
      Obj.province = normalize(provinces.find((p) => p.name === infoNode?.province?.targetItems?.[0]?.name)?.value || "");
      Obj.city = normalize(infoNode?.city?.targetItems?.[0]?.name);
      Obj.isBilingual = infoNode?.bilingual?.boolValue;
      Obj.isPriorityProperty = infoNode?.isPriorityProperty?.boolValue;
    }
    return Obj;
  }, [provinces, sitecoreContext.route?.fields, sitecoreContext.route?.placeholders, sitecoreContext.route?.templateName]);

  //datalayer state changes
  const updateDataLayer = useCallback(async () => {
    const params = new URLSearchParams(document.location.search);

    if (!isBookATour && !isContactUs && sitecoreContext.route?.name != "subscribe" && !isThankYouPage) {
      //defaults
      DataLayer.page_lang = currLang;
      DataLayer.pageContent = "corporate";
      DataLayer.pageCat = "corporate";
      DataLayer.pageType = "corporate";
    }

    const IsFromEloqua = document.referrer.includes("eloqua") || document.referrer.includes("trk.living.chartwell.com");

    const setLocalStorageFlagForPurchaseEvent = () => {
      const propertyValues = getPropertyDlValues();
      const params = new URLSearchParams(document.location.search);
      const h = isPropertyPage ? normalize(propertyValues.propertyName) : normalize(params.get("h") || "corporate"); //retirement home
      let purchaseEvent = (localStorage.getItem("chartwellPurchaseEvt") || "") as string;
      if (!purchaseEvent.includes(h)) {
        purchaseEvent += " " + h;
        localStorage.setItem("chartwellPurchaseEvt", purchaseEvent.trim());
      }
    };

    const doPropertyBookATourThankYouDatalayers = () => {
      //const forWho = params.get("fw") === "SLF" ? "for myself" : params.get("fw") === "CHI" ? "for a loved one" : "";
      const dlValues = getPropertyDlValues();
      let yardiID = dlValues.pID;
      yardiID = getIsExpansionPage(sitecoreContext) ? getExpansionPageYardiID(yardiID) : yardiID;

      const dlChanges: any = {};
      dlChanges.pageContent = normalize(dlValues.propertyName);
      dlChanges.pageCat = "residence"; // static
      dlChanges.pageType = "book a tour thank you"; // static
      dlChanges.residence_province = normalize(dlValues.province);
      dlChanges.residence_imp = dlValues.isPriorityProperty ? "Yes" : "No";
      dlChanges.residence_code = yardiID;
      dlChanges.page_lang = currLang;
      DataLayerPush(dlChanges);

      IsFromEloqua && setLocalStorageFlagForPurchaseEvent();
    };

    const doCorporateBookATourThankYouDatalayers = () => {
      if (corporateDataLayersFired) return;
      const dlChanges: any = {};
      //dlChanges.hasCorporateDataLayersFired = corporateDataLayersFired;
      dlChanges.product_code = "corporate";
      dlChanges.pageContent = "corporate";
      dlChanges.pageCat = "corporate";
      dlChanges.pageType = "book a tour thank you";
      dlChanges.page_lang = currLang;
      if (isAmIReady || isItTime || isASurvey) {
        dlChanges.reasons = "survey";
      }
      DataLayerPush(dlChanges);
      setCorporateDataLayersFired(true);
    };

    const doCorpContactUsThankYouDatalayers = () => {
      const dlChanges: any = {};
      dlChanges.pageCat = "corporate";
      dlChanges.pageContent = "corporate";
      dlChanges.pageType = "contact us thank you";
      dlChanges.page_lang = currLang;
      DataLayerPush(dlChanges);
    };

    if (sitecoreContext.route?.templateName === "Page" || sitecoreContext.route?.templateName === "ResourceLandingPage") {
      //cleanup
      DataLayer.residence_code = null;
      DataLayer.residence_imp = null;
      DataLayer.residence_province = null;
      DataLayer.ecommerce = null;

      delete DataLayer.ecommerce;
      delete DataLayer.residence_code;
      delete DataLayer.residence_imp;
      delete DataLayer.residence_province;
      delete DataLayer.event;
      delete DataLayer.ecommerce;

      if (sitecoreContext.route?.name === "home") {
        DataLayer.pageContent = "home";
        DataLayer.pageCat = "home";
        DataLayer.pageType = "home";
        DataLayer.page_lang = currLang;
      }

      if (!isPropertyPage && !isBookATour && !isThankYouPage && !isContactUs && !isResourcePage && !isAmIReady && !isItTime && !isASurvey && !isSubscribePage) {
        DataLayerPush(DataLayer);
      }

      //Any corporate (ie not on an individual residence page) Request a tour pages - exluding thank you pages includes destination/regional pages
      if (isBookATour && !isThankYouPage) {
        const dlChanges: any = {};
        dlChanges.pageCat = "corporate";
        dlChanges.pageContent = "corporate";
        dlChanges.pageType = "book a tour";
        dlChanges.product_code = "corporate";
        dlChanges.page_lang = currLang;
        DataLayerPush(dlChanges);

        const dlChanges2: any = {};
        dlChanges2.event = "view_item";
        dlChanges2.ecommerce = { items: [] };
        dlChanges2.ecommerce.items.push({
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
        });
        DataLayerPush(dlChanges2);
      }
      //from a thank you page
      if (!isPropertyPage && !isResourcePage && isBookATour && isThankYouPage) {
        doCorporateBookATourThankYouDatalayers();
      }

      //search results pages
      if (sitecoreContext.route?.name.toString().includes("search")) {
        const removeFromParams = new RegExp(/^[a-z]+=/gm);
        const dlChanges: any = {};
        dlChanges.page_lang = currLang;
        dlChanges.pageCat = DataLayer.pageCat;
        dlChanges.pageContent = "search";
        dlChanges.search_query = normalize(params.toString()).replace(removeFromParams, "");
        dlChanges.pageType = params.toString().includes("q=")
          ? "keyword-search"
          : params.toString().includes("cityorpostalcode=")
          ? "cityorpostalcode-search"
          : params.toString().includes("province=")
          ? "province-search"
          : "keyword-search";
        DataLayerPush(dlChanges);
      }

      //contact us
      if (isContactUs && !isThankYouPage) {
        const dlChanges: any = {};
        dlChanges.pageCat = "corporate";
        dlChanges.pageContent = isAmIReady || isItTime || isASurvey ? "resources" : "corporate";
        dlChanges.pageType = "contact us";
        dlChanges.page_lang = currLang;
        DataLayerPush(dlChanges);
      }

      //subscribe
      if (sitecoreContext.route?.name === "subscribe") {
        const dlChanges: any = {};
        dlChanges.pageCat = "corporate";
        dlChanges.pageContent = "corporate";
        dlChanges.pageType = "subscribe";
        dlChanges.page_lang = currLang;
        DataLayerPush(dlChanges);
      }

      //if it is a resource thank you page
      if (isResourcePage && isThankYouPage) {
        if (!isAmIReady && !isItTime && !isASurvey) {
          const dlChanges: any = {};
          dlChanges.pageContent = "resources";
          dlChanges.pageType = "resources thank you";
          dlChanges.pageCat = "corporate";
          dlChanges.page_lang = currLang;
          DataLayerPush(dlChanges);
        } else {
          //if these are surveys, then we need to do either corp book a tour data layers or corp contact us.
          if (sitecoreContext.itemPath?.toString().includes("/outcome-not-time") || sitecoreContext.itemPath?.toString().includes("/resultat-pas-le-moment")) {
            doCorpContactUsThankYouDatalayers();
          } else {
            doCorporateBookATourThankYouDatalayers();
          }
        }
      }

      //contact us thank you
      if (!isAmIReady && !isItTime && !isASurvey && isContactUs && isThankYouPage) {
        doCorpContactUsThankYouDatalayers();
      }

      //subscribe thank you
      if (isSubscribePage && isThankYouPage) {
        const dlChanges: any = {};
        dlChanges.event = "subscribe";
        dlChanges.pageType = "subscribe thank you";
        dlChanges.pageCat = "corporate";
        dlChanges.pageContent = "corporate";
        dlChanges.page_lang = currLang;
        DataLayerPush(dlChanges);
      }
    }

    if (sitecoreContext.route?.templateName === "CityLandingPage") {
      //cleanup
      DataLayer.residence_code = null;
      DataLayer.residence_imp = null;
      DataLayer.residence_province = null;
      DataLayer.ecommerce = null;

      delete DataLayer.ecommerce;
      delete DataLayer.residence_code;
      delete DataLayer.residence_imp;
      delete DataLayer.residence_province;
      DataLayerPush(DataLayer);
    }

    //blog pages
    if (sitecoreContext.route?.templateName?.toLowerCase().includes("blog")) {
      const dlChanges: any = {};
      dlChanges.event = "blog_view";
      dlChanges.pageContent = "blog";
      dlChanges.pageCat = "corporate";
      dlChanges.pageType = "blog";
      dlChanges.page_lang = currLang;
      if (sitecoreContext.route?.templateName === "BlogCategory") {
        const fields: any = sitecoreContext.route?.fields;
        dlChanges.blog_category = fields["Category Name"] && fields["Category Name"].value;
        dlChanges.blog_type = "";
      }
      if (sitecoreContext.route?.templateName === "BlogHome") {
        dlChanges.blog_category = "home";
        dlChanges.blog_type = "";
      }
      if (sitecoreContext.route?.templateName === "BlogArticle") {
        //ancestors is already available in breadcrumbs
        const breadcrumb: any = searchPlaceHoldersForComponent(sitecoreContext.route?.placeholders as any, "MetaSeoBlock");
        const language = breadcrumb?.fields?.data?.ci?.languages.filter((e: any) => e.language.name == sitecoreContext.language);
        const category: any = language[0].ancestors[0].field.jsonValue.value;
        // const tmp = document.createElement("div");
        // tmp.innerHTML = JSON.stringify(language);
        // document.querySelector("body")?.appendChild(tmp);

        const blogArticle: any = searchPlaceHoldersForComponent(sitecoreContext.route?.placeholders as any, "BlogArticle");
        const articleLength: any = blogArticle?.fields?.Content?.value
          ? (blogArticle?.fields?.Content?.value + blogArticle?.fields["Second Content Block"].value).replace(/(<([^>]+)>)/gi, "").split(" ").length
          : 0;
        dlChanges.blog_category = normalize(category);
        dlChanges.blog_type = articleLength && articleLength <= 499 ? "short" : articleLength <= 999 ? "medium" : "long";
      }
      DataLayerPush(dlChanges);
    }

    //resources
    if (isResourcePage && !isThankYouPage) {
      DataLayer.pageContent = "resources";
      DataLayer.pageCat = "corporate";
      DataLayer.pageType = "corporate";
      DataLayer.page_lang = currLang;
      DataLayerPush(DataLayer);
    }

    //property pages
    if (isPropertyPage) {
      const propertyValues = getPropertyDlValues();

      const pID = propertyValues.pID;
      const propertyName = propertyValues.propertyName;
      const province = normalize(propertyValues.province);
      const city = normalize(propertyValues.city);
      const isBilingual = propertyValues.isBilingual;
      const isPriorityProperty = propertyValues.isPriorityProperty;
      const dlChanges: any = {};

      //not book a tour
      if (!isBookATour && !isThankYouPage) {
        dlChanges.pageType = "product"; // static
        dlChanges.residence_province = province || "";
        dlChanges.residence_code = pID || "";
        dlChanges.residence_imp = isPriorityProperty ? "Yes" : "No"; // see excel
        dlChanges.pageContent = normalize(propertyName); //property name
        dlChanges.pageCat = "residence"; // static
        dlChanges.page_lang = currLang;
        DataLayerPush(dlChanges);
      }
      //INDIVIDUAL RESIDENCE BOOK A TOUR PAGE
      else {
        if (!isThankYouPage) {
          const tmpID = getExpansionPageYardiID(pID, sitecoreContext);

          dlChanges.pageType = "book a tour"; // static
          dlChanges.residence_province = province || "";
          dlChanges.residence_code = tmpID;
          dlChanges.residence_imp = isPriorityProperty ? "Yes" : "No"; // see excel
          dlChanges.pageContent = normalize(propertyName); //property name
          dlChanges.pageCat = "residence"; // static
          dlChanges.page_lang = currLang;
          DataLayerPush(dlChanges);
        }
      }

      if (!isThankYouPage) {
        const tmpID = getIsExpansionPage(sitecoreContext) ? getExpansionPageYardiID(pID, sitecoreContext) : pID;

        const dlChanges2: any = {};
        dlChanges2.event = "view_item";
        dlChanges2.ecommerce = {
          items: [
            {
              item_name: normalize(propertyName), // see excel
              item_id: tmpID, // see excel
              price: "1.00", // static value
              item_variant: "", // leave empty
              item_category: province, // see excel
              item_category2: city, // see excel
              item_category3: isBilingual ? "Bilingual" : sitecoreContext.language == "en" ? "English" : "French", // static
              item_category4: isPriorityProperty ? "Yes" : "No", // see excel
              item_category5: "web",
              quantity: "1", // static
            },
          ],
        };
        DataLayerPush(dlChanges2);
      }

      //from a thank you page
      if (isThankYouPage) {
        doPropertyBookATourThankYouDatalayers();
      }
    }

    //open house page
    if (isOpenHousePage) {
      const dlChanges: any = {};
      dlChanges.pageContent = "corporate";
      dlChanges.pageCat = "corporate";
      dlChanges.pageType = isThankYouPage ? "open house thank you" : "corporate";
      dlChanges.page_lang = currLang;
      DataLayerPush(dlChanges);
    }
  }, [
    DataLayer,
    DataLayerPush,
    currLang,
    getPropertyDlValues,
    isAmIReady,
    isItTime,
    isBookATour,
    isContactUs,
    isOpenHousePage,
    isPropertyPage,
    isResourcePage,
    isSubscribePage,
    isThankYouPage,
    sitecoreContext.itemPath,
    sitecoreContext.language,
    sitecoreContext.route?.fields,
    sitecoreContext.route?.name,
    sitecoreContext.route?.placeholders,
    sitecoreContext.route?.templateName,
  ]);

  // const handleChatBotStateChange = (event: any) => {
  //   console.log("chatBotStateChange event detected:", event.detail, isPropertyPage);
  //   if (event.detail.isOpen) {
  //     setIsChatBotOpen(true);
  //     const chatbotDL = {
  //       event: isPropertyPage ? "property_chat" : "corporate_chat",
  //       chat_option: "open chat",
  //     }
  //     DataLayerPush(chatbotDL);
  //   }
  // };
  // const handleChatBotNewMessagesChange = (event: any) => {
  //   if (event.detail.newMessagesCount > 0) {
  //     const chatbotDL = {
  //       event: isPropertyPage ? "property_chat" : "corporate_chat",
  //       chat_option: "submit chat",
  //     }
  //     DataLayerPush(chatbotDL);
  //   }
  // }

  // // listen for chat bot open state changes
  // useEffect(() => {
  //   window.addEventListener("chatBotStateChange", handleChatBotStateChange);
  //   window.addEventListener("chatBotNewMessagesChange", handleChatBotNewMessagesChange);

  //   return () => {
  //     window.removeEventListener("chatBotStateChange", handleChatBotStateChange);
  //   };
  // }, []);

  // useEffect(() => {
  //   handleChatBotStateChange({detail: {isOpen: isChatBotOpen}});
  // }, [sitecoreContext.route?.templateName]);

  //update datalayer when navigating
  useEffect(() => {
    updateDataLayer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sitecoreContext]);

  useEffect(() => {
    const getBrochureLink = () => {
      return [...document.querySelectorAll("a")].find((a) => a?.textContent?.toLowerCase().includes("brochure") && a?.href?.toLowerCase().includes(".pdf"));
    };

    //IF USER CLICKS TO DOWNLOAD PROPERTY BROCHURE (ON ANY PAGE)
    //for brochure links
    if (isPropertyPage) {
      const brochureLink = getBrochureLink();
      brochureLink &&
        brochureLink.addEventListener("click", async () => {
          //event.preventDefault();
          const propertyValues = getPropertyDlValues();
          const pID = propertyValues.pID;
          const propertyName = normalize(propertyValues.propertyName);
          const province = normalize(propertyValues.province);
          const city = normalize(propertyValues.city);
          const isBilingual = propertyValues.isBilingual;
          const isPriorityProperty = propertyValues.isPriorityProperty;
          const dlChanges: any = {};
          dlChanges.event = "add_to_wishlist";
          dlChanges.ecommerce = {
            items: [
              {
                item_name: normalize(propertyName), // see excel
                item_id: pID, // see excel
                price: "1.00", // static value
                item_variant: "", // leave empty
                item_category: normalize(province), // see excel
                item_category2: normalize(city), // see excel
                item_category3: isBilingual ? "Bilingual" : sitecoreContext.language == "en" ? "English" : "French", // static
                item_category4: isPriorityProperty ? "Yes" : "No", // see excel
                item_category5: "web",
                quantity: "1", // static
              },
            ],
          };
          DataLayerPush(dlChanges);
        });
    }
  }, [
    DataLayerPush,
    getPropertyDlValues,
    isPropertyPage,
    provinces,
    sitecoreContext.itemId,
    sitecoreContext.language,
    sitecoreContext.route?.fields,
    sitecoreContext.route?.placeholders,
    sitecoreContext.route?.templateName,
  ]);
};
