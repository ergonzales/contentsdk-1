import React from "react";

interface InfoWindowContentProps {
  residence: {
    imageSrc: string;
    url: string;
    residenceName: string;
    isPromo: boolean;
    textPrice: string;
    residenceAddress: string;
    contactNumber: string;
    livingOption: string[];
    livingOptionsObj: Record<string, any>;
  };
  dictionary: (key: string, params?: any) => string;
  // getCareServicesIcon: (option: string, w: number, h: number) => React.ReactNode;
  getCareServicesBgColorIcon: (option: string) => { bgColor: string; textColor: string };
}

/**
 * Renders the content for a Google Maps info window displaying details about a residence.
 *
 * @param props - The props for the InfoWindowContent component.
 * @param props.residence - The residence data including image, name, address, contact number, living options, and pricing.
 * @param props.dictionary - A function to retrieve localized dictionary strings.
 * @param props.getCareServicesBgColorIcon - A function that returns background and text color classes for care service icons.
 *
 * @returns The JSX element representing the info window content.
 *
 * @remarks
 * - Displays the residence image, living options as icons with tooltips, name, price, address, and contact number.
 * - Includes a call-to-action button linking to the residence URL.
 * - Uses Tailwind CSS classes for styling.
 */
const InfoWindowContent: React.FC<InfoWindowContentProps> = ({ residence, dictionary, getCareServicesBgColorIcon }) => {
  const getIconSrc = (icon: any): string => {
    if (!icon) return "";
    if (typeof icon === "string") return icon;
    return icon?.src || icon?.value?.src || icon?.url || "";
  };

  return (
    <div className="max-w-[320px]">
      <div className="relative overflow-hidden">
        <img src={residence.imageSrc} alt="residence image" className="w-full h-[200px] xl:h-[240px] object-cover object-center" />
        <ul className="flex gap-2 absolute top-0 right-0 p-1">
          {residence.livingOption.map((option) => {
            const icon = residence.livingOptionsObj.find((item: any) => item?.careServiceName?.value === option)?.careServiceIcon?.jsonValue?.value || "";
            const iconSrc = getIconSrc(icon);
            const { bgColor, textColor } = getCareServicesBgColorIcon(option);
            return (
              iconSrc && (
                <li key={option} className="text-[1rem] flex gap-1 p-1 bg-ChartwellWhite rounded-full">
                  <div className="group relative cursor-pointer">
                    <img src={iconSrc} alt={option} width={26} height={26} />
                    <div
                      className={`group-hover:translate-x-0 eas-in-out duration-300 ${bgColor} p-2 text-[0.9rem] ${textColor} font-bold rounded-md absolute right-0 top-1/2 translate-x-[200%] mt-6 z-10 text-center whitespace-nowrap`}
                    >
                      {option}
                    </div>
                  </div>
                </li>
              )
            );
          })}
        </ul>
      </div>
      <div className="p-2">
        <div className="mt-4">
          <a className="no-underline text-ChartwellPlum font-bold text-[1.3rem]" href={residence.url}>
            {residence.residenceName}
          </a>
          <p className={`${residence.isPromo ? "text-ChartwellBlue font-semibold" : "text-ChartwellPlum"} text-[1rem] !mt-0`} dangerouslySetInnerHTML={{ __html: residence.textPrice }} />
          <address className="not-italic text-[0.9rem]">{residence.residenceAddress}</address>
          <a
            href={`tel:${residence.contactNumber}`}
            className="text-ChartwellBlue hover:text-ChartwellPlum-100 no-underline focus:text-ChartwellPlum-100 text-[0.9rem] font-semibold"
            title="telephone"
          >
            {residence.contactNumber}
          </a>
        </div>
        <div className="gap-2 mt-4">
          <a
            className="no-underline text-center block text-ChartwellWhite bg-ChartwellPlum hover:text-ChartwellPlum hover:bg-ChartwellWhite border-2 border-ChartwellPlum ease-in-out duration-300 p-2 font-bold text-[1.2rem]"
            href={residence.url}
          >
            {dictionary("DynamicMapCTA")}
          </a>
        </div>
      </div>
    </div>
  );
};

export default InfoWindowContent;
