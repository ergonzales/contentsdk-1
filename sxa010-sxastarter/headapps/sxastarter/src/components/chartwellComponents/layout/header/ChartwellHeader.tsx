import React, { useState } from "react";

import { Popover } from "@headlessui/react";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";

import Phone from "../../../../../public/bi_telephone.svg";

import { NavModal } from "components/chartwellComponents/ui/modal/NavModal";
import { DesktopNavigation } from "./navigation/DesktopNavigation";
import { MobileNavigation } from "./navigation/MobileNavigation";
import { HeaderSearchInput } from "./search/HeaderSearchInput";
import { PhoneSearchLanguageWrapper } from "./navigation/PhoneSearchLanguageWrapper";
import { ChartwellModal } from "components/chartwellComponents/ui/modal/ChartwellModal";
import Logo from "../../ui/Logo";
import { BookATourButton } from "./ChartwellPropertyHeader/BookATourButton";
import { useSitecoreContext } from "lib/sitecore/useSitecoreContext";

const DynamicChartwellModal = dynamic(() => Promise.resolve(ChartwellModal), {
  ssr: false,
});

const DynamicChartwellNavModal = dynamic(() => Promise.resolve(NavModal), {
  ssr: false,
});

// interface TopNavConfigItem {
//   name: string;
//   url: string;
//   id?: string;
//   displayName?: string;
//   fields?: {
//     NavigationTitle?: {
//       value: string;
//     };
//   };
// }

interface PropertySharedData {
  componentName: string;
  fields: {
    TopNavConfig?: any[];
  };
}

const ChartwellHeader = (props: any) => {
  const { sitecoreContext } = useSitecoreContext();
  const data = props.navData.fields;
  const [open, setOpen] = useState<boolean>(false);
  const [openMobile, setOpenMobile] = useState<boolean>(false);
  const navigationItems = Object.values(data);
  const router = useRouter();
  const PropertySharedDataPh = sitecoreContext?.route?.placeholders["headless-main"] as PropertySharedData[];

  const bat = PropertySharedDataPh?.find((el: PropertySharedData) => el.componentName === "PropertySharedData")?.fields?.TopNavConfig?.find((el: any) => el.name === "book-a-tour") || null;

  return (
    <>
      <DynamicChartwellModal open={open} setOpen={setOpen}>
        <HeaderSearchInput />
      </DynamicChartwellModal>
      <DynamicChartwellNavModal open={openMobile} setOpen={setOpenMobile}>
        <MobileNavigation open={open} setOpen={setOpen} openMobile={openMobile} setOpenMobile={setOpenMobile} navigationItems={navigationItems} bookATour={bat} />
      </DynamicChartwellNavModal>
      <div className={`component !z-50  w-full min-h-[58px]`} id="ChartwellHeader">
        <div className="flex items-center py-3 px-2">
          <Logo imgStyles={`hidden lg:block`} />

          <Popover className="relative w-full">
            <div className=" flex items-center justify-between     space-x-2">
              <div className="-my-2 -mr-2 lg:hidden">
                <div className="flex items-center">
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setOpenMobile(!openMobile)}
                      className="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                    >
                      {openMobile ? (
                        <>
                          <span className="sr-only">Close menu</span>
                          <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                        </>
                      ) : (
                        <>
                          <span className="sr-only">Open menu</span>
                          <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                        </>
                      )}
                    </button>
                  </div>
                  <Logo />
                </div>
              </div>
              <div className="flex lg:hidden items-center gap-2 ">
                <a href="tel:18554610685" className="text-ChartwellPlum  font-bold hover:text-ChartwellPlum-100  focus:text-ChartwellPlum-100" title="telephone">
                  <svg width="25" height="25" className="block">
                    <image href={`${Phone.src}`} width="25" height="25" className="" />
                  </svg>
                </a>
                <>
                  {navigationItems?.map((navItem: any) => {
                    return (
                      navItem.Id === "485cffc6-68d1-4a43-9e13-a06ccf6cf635" && (
                        <React.Fragment key={navItem.Id}>
                          {bat && (
                            <BookATourButton
                              BookATour={bat}
                              className={`hard-link ml-auto font-normal  bg-ChartwellBlue  sm:px-4  uppercase ${
                                router.locale == "en" ? "text-[0.75rem] px-4 py-3" : "text-[0.625rem] px-[7px] py-4"
                              }   md:text-[1rem] flex items-center text-center text-white hover:bg-ChartwellBlue-100 hover:text-white `}
                            />
                          )}
                        </React.Fragment>
                      )
                    );
                  })}
                </>
              </div>
              <div className="hidden lg:flex  lg:w-0 lg:flex-1">
                <DesktopNavigation navData={props.navData} styles={""}>
                  <PhoneSearchLanguageWrapper styles="flex items-center ml-4" open={open} setOpen={setOpen} />
                </DesktopNavigation>
              </div>
            </div>
          </Popover>
        </div>
      </div>
    </>
  );
};
export default ChartwellHeader;
