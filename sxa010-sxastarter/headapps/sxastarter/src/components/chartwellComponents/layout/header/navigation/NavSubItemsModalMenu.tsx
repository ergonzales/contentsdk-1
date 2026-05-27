import { JSX } from "react";
import { Dispatch, SetStateAction } from "react";
import { Transition } from "@headlessui/react";
import { useI18n } from "next-localization";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/router";

import Link from "next/link";
//

interface IProps {
  navigationItems: any;
  openMobile: boolean;
  openSubMenu: boolean;
  setOpenMobile: Dispatch<SetStateAction<boolean>>;
  setOpenSubMenu: Dispatch<SetStateAction<boolean>>;
  currentNavTitle: string;
  currentHref: string;
  // currentId: string;
}
export const NavSubItemsModalMenu = ({ navigationItems, openMobile, setOpenMobile, setOpenSubMenu, openSubMenu, currentHref, currentNavTitle }: IProps): JSX.Element => {
  const router = useRouter();
  const { t } = useI18n();

  const prepend = [
    {
      item: { en: "Experiences", fr: "L’expérience Chartwell" },
      text: { en: "Explore Our Experiences", fr: "Explorez nos expériences" },
    },
    {
      item: { en: "Living Options", fr: "Options d’hébergement" },
      text: { en: "Discover Living Options", fr: "Découvrez nos options d’hébergement" },
    },
    {
      item: { en: "Resources", fr: "Ressources" },
      text: { en: "Browse Resources", fr: "Parcourez nos ressources" },
    },
    {
      item: { en: "About Us", fr: "À propos de nous" },
      text: { en: "Learn About Us", fr: "À propos de nous" },
    },
    {
      item: { en: "Find a Residence", fr: "Trouver une résidence" },
      text: { en: "Search Residences", fr: "Trouvez une résidence" },
    },
  ];

  type Locale = "en" | "fr";
  const locale = (router.locale === "fr" ? "fr" : "en") as Locale;
  const found = prepend.find((p) => p.item[locale] === currentNavTitle);
  const linkText = found ? found.text[locale] : currentNavTitle;

  return (
    <Transition.Root show={openSubMenu}>
      <div className="fixed  top-0 bottom-0 left-0 right-0 z-999 overflow-y-auto bg-ChartwellWhite">
        <Transition.Child enter="ease-in duration-300" enterFrom="translate-x-[100%]" enterTo="translate-x-0" leave="ease-out duration-300" leaveFrom="translate-x-0" leaveTo="translate-x-[-100%]">
          <div>
            <div className="flex items-center gap-4 px-4 bg-ChartwellPlum" onClick={() => setOpenSubMenu(false)}>
              <ArrowLeftIcon className="w-6 text-ChartwellWhite" />
              <p className="ChartwellWhite text-ChartwellWhite">{t("Back")}</p>
            </div>
            <ul className="pl-14 pr-2">
              <li className="border-b">
                <Link
                  className={`mobileNavigation ChartwellText block my-1 px-4 py-2 w-full ${
                    router.asPath.trim().toLowerCase() === currentHref.toLowerCase() && router.asPath !== "/" ? "!text-ChartwellPlum isActive" : ""
                  }`}
                  onClick={() => setOpenMobile(!openMobile)}
                  href={currentHref}
                >
                  {linkText}
                </Link>
              </li>
              {navigationItems.map((nav: any) => {
                const isActive = router.asPath.trim().toLowerCase() === nav.Href.toLowerCase() && router.asPath !== "/" ? "!text-ChartwellPlum isActive" : "";
                return (
                  <li key={nav.Id || nav.id || nav.Href} className="border-b">
                    <Link
                      className={`mobileNavigation ChartwellText block my-1 px-4 py-2 w-full ${isActive}`}
                      onClick={() => setOpenMobile(!openMobile)}
                      href={nav.Href}
                      target={nav.Id ? "_self" : "_blank"}
                    >
                      {nav.NavigationTitle.value}
                    </Link>
                  </li>
                );
              })}
              {/* {(currentId === "cababb8f-012e-4de7-aead-911ca47eed29" || currentId === "c4d2401e-d9d3-4900-b8dc-66cd915f9b0e") &&
                AboutUsExternalLinks &&
                AboutUsExternalLinks.map((nav: any) => {
                  return (
                    <li key={nav.id} className="border-b">
                      <Link className={`ChartwellText block py-3 w-full `} target="_blank" onClick={() => setOpenMobile(!openMobile)} href={nav.fields.Url.value}>
                        {nav.fields.Title.value}
                      </Link>
                    </li>
                  );
                })} */}
            </ul>
          </div>
        </Transition.Child>
      </div>
    </Transition.Root>
  );
};
