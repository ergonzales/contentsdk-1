import { Dispatch, SetStateAction, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useI18n } from "next-localization";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { GlobeAmericasIcon } from "@heroicons/react/24/solid";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import ChartwellMarker from "../../../../../../public/stories/Map Banner/chartwell_pin.svg";
import { getSearchUrl } from "lib/helpers/helper";
import LanguageSwitcher from "../LanguageSwitcher";
import { NavSubItemsModalMenu } from "./NavSubItemsModalMenu";
import MapleLeaf from "../MapleLeaf";

import Phone from "../../../../../../public/bi_telephone.svg";
import Logo from "../../../ui/Logo";
import { BookATourButton } from "../ChartwellPropertyHeader/BookATourButton";
interface IProps {
  navigationItems: any;
  open: boolean;
  openMobile: boolean;
  setOpenMobile: Dispatch<SetStateAction<boolean>>;
  setOpen: Dispatch<SetStateAction<boolean>>;
  bookATour: any;
}
interface NavigationItem {
  Id: string;
  Href: string;
  NavigationTitle: { value: string };
  Children?: NavigationItem[];
}
export const MobileNavigation = ({ navigationItems, open, setOpen, openMobile, setOpenMobile, bookATour }: IProps) => {
  const router = useRouter();
  const [openSubMenu, setOpenSubMenu] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { t: dict } = useI18n();

  return (
    <>
      <NavSubItemsModalMenu
        openSubMenu={openSubMenu}
        setOpenSubMenu={setOpenSubMenu}
        openMobile={openMobile}
        setOpenMobile={setOpenMobile}
        currentHref={navigationItems[currentIndex]?.Href}
        currentNavTitle={navigationItems[currentIndex]?.NavigationTitle.value}
        // currentId={navigationItems[currentIndex]?.Id}
        navigationItems={navigationItems[currentIndex]?.Children}
      />
      <div className="bg-ChartwellLightPurple h-[100dvh] max-h-[100dvh] w-full overflow-y-auto">
        <div className="flex items-center justify-between space-x-2 py-4 px-2 min-h-58 bg-ChartwellWhite">
          <div className=" ">
            <div className="flex items-center">
              <button
                type="button"
                onClick={() => setOpenMobile(!openMobile)}
                className="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
              <Logo />
            </div>
          </div>
          <div className="flex lg:hidden items-center gap-2">
            <a href="tel:18554610685" className="text-ChartwellPlum font-bold hover:text-ChartwellPlum-100 focus:text-ChartwellPlum-100" title="telephone">
              <svg width="25" height="25" className="block">
                <image href={`${Phone.src}`} width="25" height="25" />
              </svg>
            </a>
            {bookATour && bookATour.url && bookATour.fields.NavigationTitle.value && (
              <BookATourButton
                BookATour={bookATour}
                className={`hard-link ml-auto font-normal bg-ChartwellBlue sm:px-4 uppercase ${
                  router.locale === "en" ? "text-[0.75rem] px-4 py-3" : "text-[0.625rem] px-[7px] py-4"
                } md:text-[1rem] flex items-center text-center text-white hover:bg-ChartwellBlue-100 hover:text-white`}
              />
            )}
          </div>
        </div>
        <div className=" px-3   bg-ChartwellWhite">
          <div className="flex items-center justify-between py-2 border-t border-ChartwellGrey-200 bg-ChartwellWhite">
            <address className="flex md:flex-row flex-col items-center flex-wrap ">
              <button type="button" className="flex items-center -ml-2 gap-2" onClick={getSearchUrl(setOpenMobile, router)}>
                <svg width="34" height="40" className="block">
                  <image href={`${ChartwellMarker.src}`} width="40" height="40" className="" />
                </svg>
                <span className="not-italic ChartwellText">{dict(`Near Me`)}</span>
              </button>
            </address>
            <Link href="tel:1-855-461-0685" className="text-ChartwellPlum-100 flex items-center gap-2" onClick={() => setOpenMobile(false)}>
              <span className="font-bold">1-855-461-0685</span>
            </Link>
          </div>
        </div>
        <ul className="px-3 bg-ChartwellWhite">
          {navigationItems.map((nav: NavigationItem, index: number) => {
            const isActive = router.asPath.trim().split("/").includes(nav.Href.toLowerCase().replaceAll("/", "")) && router.asPath != "/" ? "text-ChartwellPlum isActive" : "";
            if (nav.Id === "485cffc6-68d1-4a43-9e13-a06ccf6cf635") {
              return null;
            }
            return nav.Id !== "1e376c67-c946-4092-8783-a52c36ad872a" ? (
              <li
                className={`flex justify-between border-t items-center border-ChartwellGrey-200 ChartwellText py-1 ${isActive}`}
                onClick={() => {
                  setOpenSubMenu(!openSubMenu), setCurrentIndex(index);
                }}
                key={nav.Id}
              >
                <span className={`px-4 py-2 my-1 mobileNavigation ${isActive}`}>{nav.NavigationTitle.value}</span>
                <ChevronDownIcon className="h-5 w-5 fill-ChartwellGrey -rotate-90" aria-hidden="true" />
              </li>
            ) : (
              <li className="flex justify-between border-t border-ChartwellGrey-200 items-center" key={nav.Id}>
                <Link onClick={() => setOpenMobile(!openMobile)} className={`mobileNavigation ChartwellText w-full block py-3 ${isActive}`} href={nav.Href}>
                  {nav.NavigationTitle.value}
                </Link>
              </li>
            );
          })}
          {/* EXTERNAL LINK */}
          {/* <li className="border-t border-ChartwellGrey-200">
            <Link target="_blank" className="ChartwellText py-3 block" href={jobLink.fields.Url.value} onClick={() => setOpenMobile(false)}>
              {jobLink.fields.Title.value}
            </Link>
          </li> */}
        </ul>
        <div className=" px-3 bg-ChartwellLightPurple" onClick={() => setOpen(!open)}>
          <div className="flex items-center gap-3 py-3">
            <MagnifyingGlassIcon className="w-6 text-ChartwellPlum" />
            <span className="text-[1rem] ChartwellText text-ChartwellPlum">{dict("CTAText")}</span>
          </div>
        </div>
        <div className=" px-3 bg-ChartwellLightPurple">
          <div className="flex items-center gap-3 py-3 border-t border-ChartwellGrey-200  ">
            <GlobeAmericasIcon className="w-6 text-ChartwellGrey-100" />
            <LanguageSwitcher styles={`!ml-0 ChartwellText`} />
          </div>
        </div>
        <div className=" px-3 bg-ChartwellLightPurple">
          <div className="flex items-center gap-3 py-3 border-t border-ChartwellGrey-200  ">
            <MapleLeaf></MapleLeaf>
          </div>
        </div>
      </div>
    </>
  );
};
