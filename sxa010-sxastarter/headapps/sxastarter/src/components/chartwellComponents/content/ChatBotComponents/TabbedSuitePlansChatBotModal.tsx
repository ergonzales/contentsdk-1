import { ChartwellModal } from "components/chartwellComponents/ui/modal/ChartwellModal";
import { TabbedSuiteSection } from "../TabbedSuitePlans/TabbedSuiteParts/TabbedSuiteSection";
import { useSitecore } from "@sitecore-content-sdk/nextjs";

interface TabbedSuitePlansChatBotModalProps {
  setOpen: (open: boolean) => void;
  isTabbedSuitePlansOpen: boolean;
}

export const TabbedSuitePlansChatBotModal = ({ setOpen, isTabbedSuitePlansOpen }: TabbedSuitePlansChatBotModalProps) => {
  const { page } = useSitecore();
  const sitecoreContext = page?.layout?.sitecore?.context || {};
  const route = (sitecoreContext?.route || page?.layout?.sitecore?.route) as any;

  const getChatBotSuitePlans = () => {
    const placeholders = route?.placeholders?.["headless-main"];
    return placeholders?.find((x: any) => x.componentName === "TabbedSuitePlans") || placeholders?.find((x: any) => x.componentName === "PropertySuitePlans");
  };

  const chatBotSuitePlans = getChatBotSuitePlans();

  return (
    <ChartwellModal styles="bg-ChartwellWhite flex items-center justify-center overflow-y-scroll" CloseBTNPosition="m-[1%]" open={isTabbedSuitePlansOpen} setOpen={setOpen} isBackButton={true}>
      <div className="h-full">
        <TabbedSuiteSection props={chatBotSuitePlans} />
      </div>
    </ChartwellModal>
  );
};
