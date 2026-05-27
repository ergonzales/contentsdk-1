// import { useMemo } from "react";
// 
// // import dynamic from "next/dynamic";
// import { renderPromoOpenHouseBannerOnCards } from "lib/helpers/residence-helpers";
// import { ChatBotData } from "components/chatOpenAi/chat-types";

// // const ChatbotWidget = dynamic(() => import("components/chatOpenAi/chatbot-widget").then((mod) => mod.ChatbotWidget), {
// //   ssr: false,
// // });
// interface PlaceholderItem {
//   componentName: string;
//   fields?: any;
// }

// interface ResidenceData {
//   livingOptions?: { targetItems: any[] };
//   ancestors?: [any];
//   childItems?: { results: any[] };
//   contextParentPropertyId?: { value: string };
//   propertyNavigationTitle?: { value: string };
//   // propertyContactNumber?: { value: string };
//   address?: { value: string };
//   city?: { targetItems: any[] };
//   province?: { targetItems: any[] };
//   postalCode?: { value: string };
//   bilingual?: { boolValue: boolean };
//   propertyShortName?: { value: string };
// }

// // Helper function moved outside of the component to be callable globally
// function extractResidenceSummaries(PropertySuitePlansData: any) {
//   const output = [];

//   for (const group of PropertySuitePlansData) {
//     const typeOfLivingOption = group.name; // e.g., "il", "mc"
//     const results = group.children?.results.length !== 0 ? group.children?.results : group.fields || [];

//     for (const result of results) {
//       const fieldMap: Record<string, any> = {};

//       for (const field of result?.fields || []) {
//         fieldMap[field.name] = field?.jsonValue?.value || "";
//       }

//       const keyFeature =
//         result?.fields?.find((el: any) => el.name === "Key Features")?.jsonValue?.map((el: { fields: { [x: string]: { value: any } } }) => el.fields?.["Key Feature Name"]?.value) || [];
//       const optionFeature =
//         result?.fields?.find((el: any) => el.name === "Optional features")?.jsonValue?.map((el: { fields: { [x: string]: { value: any } } }) => el.fields?.["Key Feature Name"]?.value) || [];
//       const typeOfBedroom = fieldMap["Type of Bedroom"] || result?.name || result?.fields?.find((el: any) => el.name === "SuiteName")?.jsonValue?.displayName?.trim() || "";

//       const priceRegular = fieldMap["Regular SuitePrice"] || result?.fields?.find((el: any) => el.name === "Regular SuitePrice")?.jsonValue?.value || "";
//       const pricePromo = fieldMap["Promotion Price"] || result?.fields?.find((el: any) => el.name === "Promotion Price")?.jsonValue?.value || "";
//       output.push({
//         name: typeOfLivingOption,
//         typeOfBedroom,
//         priceRegular,
//         pricePromo,
//         keyFeature,
//         optionFeature,
//       });
//     }
//   }

//   return output;
// }

const ChatBot = () => {
  return <></>;
  // --- HOOK CALL 1 (Unconditional) ---\

  // const { sitecoreContext } = useSitecoreContext();

  // const { route } = sitecoreContext || {};
  // const { placeholders, name: routeName, templateName: routeTemplate, fields } = route || {};

  // const contextNoIndex = (fields as any)?.["No Index"]?.value;
  // const isItPropertyPages = ["PropertyPage", "PropertyChildPage"].includes(routeTemplate ?? "");
  // const { Forms, Questions, popupMessage } = props.fields || {};

  // // --- RAW DATA EXTRACTION (Non-hook data that drives memoized values) ---
  // // These objects change reference only if 'placeholders' or 'sitecoreContext' changes
  // const PropertySuitePlansData = (placeholders?.["headless-main"]?.find((x: PlaceholderItem) => x.componentName === "PropertySuitePlans") as any)?.fields?.data?.ds?.children.results as ResidenceData;

  // const residenceData = (
  //   (placeholders?.["headless-main"]?.find((x: PlaceholderItem) => x.componentName === "PropertyHeaderNavigation") as any) ||
  //   placeholders?.["headless-header"]?.find((x: PlaceholderItem) => x.componentName === "PropertyHeaderNavigation")
  // )?.fields?.data?.item as ResidenceData;

  // const ancestors = residenceData?.ancestors?.find((x: any) => Object.keys(x).length !== 0);

  // // --- HOOK CALL 2: Memoize PropertySuitePlansSummary Array (FIXED REFERENCE ISSUE) ---
  // const PropertySuitePlansSummary = useMemo(() => {
  //   if (!isItPropertyPages) return [];

  //   return extractResidenceSummaries(Array.isArray(PropertySuitePlansData) ? PropertySuitePlansData : []);
  // }, [isItPropertyPages, PropertySuitePlansData]);

  // // --- HOOK CALL 3: Memoize livingOptions Array (FIXED REFERENCE ISSUE) ---
  // const livingOptions = useMemo(() => {
  //   if (!isItPropertyPages) return [];

  //   return residenceData?.livingOptions?.targetItems?.map((x: any) => x.name) ?? (ancestors?.livingOptions?.targetItems?.map((x: any) => x.name) || []);
  // }, [isItPropertyPages, residenceData, ancestors]);

  // // --- Memoize formattedAddress string ---
  // const formattedAddress = useMemo(() => {
  //   if (!isItPropertyPages) return undefined;

  //   const address = residenceData?.address?.value || ancestors?.address?.value;
  //   const city = residenceData?.city?.targetItems?.[0]?.cityName?.value || ancestors?.city?.targetItems?.[0]?.cityName?.value;
  //   const province = residenceData?.province?.targetItems?.[0]?.provinceName?.value || ancestors?.province?.targetItems?.[0]?.provinceName?.value;
  //   const postalCode = residenceData?.postalCode?.value || ancestors?.postalCode?.value;

  //   // Simple check to see if any address part exists
  //   if (address || city || province || postalCode) {
  //     // Concatenate parts defensively to avoid double commas/spaces
  //     const parts = [address, city, province, postalCode].filter((p) => p);
  //     if (parts.length > 0) {
  //       // If all parts exist, format them with appropriate separators
  //       return `${address || ""}, ${city || ""}, ${province || ""} ${postalCode || ""}`.trim().replace(/, *$/, "");
  //     }
  //   }
  //   return undefined;
  // }, [isItPropertyPages, residenceData, ancestors]);

  // // Derive stable scalar values
  // const propertyName = isItPropertyPages ? residenceData?.propertyNavigationTitle?.value ?? ancestors?.propertyNavigationTitle?.value : undefined;
  // // const propertyContactNumber = isItPropertyPages ? residenceData?.propertyContactNumber?.value ?? ancestors?.propertyContactNumber?.value : undefined;
  // const ResidenceID = isItPropertyPages ? residenceData?.contextParentPropertyId?.value ?? ancestors?.contextParentPropertyId?.value : undefined;
  // const customId = (ResidenceID ?? "corporate") + sitecoreContext.language;

  // const propertyShortName = residenceData?.propertyShortName?.value || ancestors?.propertyShortName?.value || "";
  // const openHouseRibbonText = renderPromoOpenHouseBannerOnCards(sitecoreContext, ResidenceID, sitecoreContext.language, propertyShortName)?.value;

  // // const residenceAnnauncment
  // // --- HOOK CALL 4: Memoize the final Data object ---
  // const Data = useMemo(() => {
  //   if (isItPropertyPages) {
  //     // Property Page Data Structure
  //     return {
  //       address: formattedAddress,
  //       livingOptions,
  //       propertyName,
  //       // propertyContactNumber,
  //       Questions,
  //       price: PropertySuitePlansSummary,
  //       isCorporate: false,
  //       residenceUpComingEvents: openHouseRibbonText,
  //       ResidenceID,
  //       Forms,
  //       customId,
  //       corporateId: "corporate" + sitecoreContext.language,
  //       popupMessage: popupMessage?.value,
  //     } as ChatBotData;
  //   } else {
  //     // Corporate Page Data Structure
  //     return {
  //       isCorporate: true,
  //       Questions,
  //       Forms,
  //       customId,
  //       popupMessage: popupMessage?.value,
  //     } as ChatBotData;
  //   }
  // }, [
  //   isItPropertyPages,
  //   formattedAddress,
  //   livingOptions,
  //   propertyName,
  //   // propertyContactNumber,
  //   Questions,
  //   PropertySuitePlansSummary,
  //   openHouseRibbonText,
  //   ResidenceID,
  //   Forms,
  //   customId,
  //   sitecoreContext.language,
  //   popupMessage,
  // ]);

  // // --- CONDITIONAL RETURN (AFTER ALL HOOKS) ---
  // if (["book-a-tour", "contact-us"].includes(routeName ?? "") || contextNoIndex) {
  //   return null;
  // }
  // console.log(Data);

  // return <ChatbotWidget data={Data} />;
};

export default ChatBot;
