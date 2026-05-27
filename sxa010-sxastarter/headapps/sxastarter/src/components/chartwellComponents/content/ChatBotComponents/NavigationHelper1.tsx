//import ChatModal from "components/chartwellComponents/content/ChatModal/ChatModal";
import { useSitecore } from "@sitecore-content-sdk/nextjs";
import dynamic from "next/dynamic";

const NavigationHelper = () => {
  const ChatModal = dynamic(() => import("components/chartwellComponents/content/ChatModal/ChatModal"), { ssr: false });
  const { page } = useSitecore();
  const sitecoreContext = page?.layout?.sitecore?.context || {};
  const route = (sitecoreContext?.route || page?.layout?.sitecore?.route) as any;
  const placeHolders: any = route?.placeholders || {};

  const contextNoIndex = (route?.fields as any)?.["No Index"]?.value;
  if (route?.name === "book-a-tour" || route?.name === "contact-us" || contextNoIndex) {
    return null;
  }

  const journeys =
    route?.templateName === "Page"
      ? placeHolders["headless-main"]
          .find((x: { componentName: string }) => x.componentName === "NavigationHelper1")
          ?.fields?.data?.ds?.children?.results?.find((x: { name: string }) => x.name === "Corporate")?.children?.results
      : placeHolders["headless-main"]
          ?.find((x: { componentName: string }) => x.componentName === "NavigationHelper1")
          ?.fields?.data?.ds?.children?.results?.find((x: { name: string }) => x.name === "Residences")?.children?.results || [];

  return journeys && <ChatModal data={journeys}></ChatModal>;
};
export default NavigationHelper;
