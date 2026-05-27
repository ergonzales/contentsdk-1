
import type { SitecoreContextValue } from "lib/sitecore/types";

// import scConfig from 'sitecore.config';

export const getAddressCompleteConfig = (sitecoreContext: SitecoreContextValue) => {
  const configNode: any = sitecoreContext.route?.placeholders?.["headless-main"]?.find((el: any) => el.componentName === "FormObjData");
  const configData = configNode?.fields?.data?.formData;
  const apiConfig = {
    apiKey: process.env.NEXT_PUBLIC_CANADA_POST_AUTO_COMPLETE_API_KEY, // || configData.apiKey?.value,
    errorMsg: configData.errorMsg?.value,
    noResultsMsg: configData.noResultsMsg?.value,
    language: sitecoreContext.language,
  };

  return apiConfig;
};
