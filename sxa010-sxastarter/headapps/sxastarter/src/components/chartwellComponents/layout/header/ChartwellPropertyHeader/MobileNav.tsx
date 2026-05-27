import LanguageSwitcher from "../LanguageSwitcher";
import { Dispatch, SetStateAction } from "react";
import { BottomNavLinks } from "./BottomNavLinks";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { GlobeAmericasIcon } from "@heroicons/react/24/solid";
import TopNavLinks from "./TopNavLinks";

import { BookATourButton } from "./BookATourButton";
import Phone from "../../../../../../public/bi_telephone.svg";
import { PropertyLogo } from "../../../ui/PropertyLogo";
import { useI18n } from "next-localization";
import MapleLeaf from "../MapleLeaf";
import { CorpNavItem } from "src/models/PropertyHeaderNav";
import { PropertyLogoHomeName } from "components/chartwellComponents/ui/PropertyLogoHomeName";
import Link from "next/link";
import PropertyAddress from "components/chartwellComponents/content/PropertyAddress/PropertyAddress";
import { useSitecoreContext } from "lib/sitecore/useSitecoreContext";
interface IProps {
  bottomLink: any;
  open: boolean;
  BookATour: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  openMobile: boolean;
  setOpenMobile: Dispatch<SetStateAction<boolean>>;
  propertyContactNumber: string;
  bilingual: boolean;
  propertyId: string;
  coprNavItems?: any;
  propertyOverviewLink: string;
  propertyLogo: { value: object };
  propertyName: string;
  residence: any;
}

export const MobileNav = ({
  openMobile,
  setOpenMobile,
  bottomLink,
  setOpen,
  open,
  propertyContactNumber,
  propertyId,
  bilingual,
  BookATour,
  propertyOverviewLink,
  propertyLogo,
  propertyName,
  residence,
}: IProps) => {
  const linksArray = bottomLink;
  const { t } = useI18n();
  const { sitecoreContext } = useSitecoreContext();

  const propertySharedUtilityPH = sitecoreContext?.route?.placeholders?.["headless-header"]?.find((x: any) => x.componentName === "ChartwellPropertyHeader") as any;
  const { ds } = propertySharedUtilityPH?.fields?.data;
  const dsCorpNavItems = ds?.fields?.find((item: CorpNavItem) => item?.name === "CorpNavItems" && item?.jsonValue)?.jsonValue ?? [];

  return (
    <div className="h-dvh  max-h-[100dvh] w-full overflow-y-auto">
      <div className=" px-4 w-full bg-ChartwellWhite ">
        {/* Header */}
        <div className="py-2 ">
          <div className="flex items-center justify-center border-b-2 pb-2">
            <div className="flex items-center">
              <div className="lg:hidden">
                <PropertyLogoHomeName href={propertyOverviewLink ?? ""} logo={propertyLogo} title={propertyName ?? ""} />
              </div>
            </div>
          </div>
          <div className="flex lg:hidden justify-between pt-2 gap-1">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setOpenMobile(!openMobile)}
                className="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
              <PropertyLogo homePageLinkUrl={"/"} propertyId={propertyId ?? ""} title={propertyName ?? ""} />
            </div>
            <div className="flex items-center gap-2">
              <Link href={`tel:${propertyContactNumber}`} className="text-ChartwellPlum font-bold   hover:text-ChartwellPlum-100   focus:text-ChartwellPlum-100">
                <svg width="25" height="25" className="block">
                  <image href={`${Phone.src}`} width="25" height="25" className="" />
                </svg>
              </Link>
              {BookATour?.length !== 0 && <BookATourButton BookATour={BookATour} />}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between py-2 border-t">
          <PropertyAddress propertyData={residence} mapLink={true} mobile={true} />
          <a href={`tel:${propertyContactNumber?.split("-").join("")}`} className="text-ChartwellPlum-100 flex font-bold items-center gap-2 ">
            <span>{propertyContactNumber}</span>
          </a>
        </div>

        <ul className=" ">
          <BottomNavLinks bottomLink={linksArray} />
        </ul>
      </div>
      <div className="w-full p-4 h-full flex flex-col  bg-ChartwellLightPurple">
        <div className="py-2">
          <PropertyLogo homePageLinkUrl={"/"} propertyId={propertyId} styles={"w-40  block"} title="Home" />
          <ul className="mt-4">
            <TopNavLinks corpNavItems={dsCorpNavItems} />
          </ul>
        </div>
        <div
          onClick={() => {
            setOpen(!open);
            setOpenMobile(!openMobile);
          }}
          className="flex items-center gap-3 py-3  border-t border-ChartwellGrey-200"
        >
          <MagnifyingGlassIcon className={`w-6  text-ChartwellPlum`} />
          <span className="text-[1rem] text-ChartwellPlum ">{t("CTAText")}</span>
        </div>
        {bilingual && (
          <div className="flex items-center gap-3 py-3  border-t border-ChartwellGrey-200">
            <GlobeAmericasIcon className="w-6  text-ChartwellGrey-100" />
            <LanguageSwitcher styles={`!ml-0 ChartwellText`} />
          </div>
        )}
        <div className="flex shrink">
          <MapleLeaf></MapleLeaf>
        </div>
      </div>
    </div>
  );
};
