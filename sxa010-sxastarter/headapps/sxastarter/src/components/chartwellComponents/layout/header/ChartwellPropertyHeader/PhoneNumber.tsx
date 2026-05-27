import { useSitecoreContext } from "lib/sitecore/useSitecoreContext";


export const PhoneNumber = ({ phoneNumber }: { phoneNumber: string }) => {
  const { sitecoreContext } = useSitecoreContext();

  const customPhoneNumber = sitecoreContext.route?.templateName === "PropertyChildPage" && (sitecoreContext.route?.fields?.CustomPhoneNumber as { value: string })?.value;

  const displayPhoneNumber = customPhoneNumber || phoneNumber;
  return (
    <a href={`tel:${displayPhoneNumber}`} className="inline-block py-2 text-ChartwellPlum font-semibold  hover:text-ChartwellPlum-100 focus:text-ChartwellPlum-100 ml-8">
      {displayPhoneNumber}
    </a>
  );
};
