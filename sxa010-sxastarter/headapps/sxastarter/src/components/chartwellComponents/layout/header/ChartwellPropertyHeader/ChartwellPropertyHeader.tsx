import { useEffect, useState, JSX } from "react";
import { withDatasourceCheck } from "@sitecore-content-sdk/nextjs";
import LanguageSwitcher from "../LanguageSwitcher";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/router";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Bars3Icon } from "@heroicons/react/24/outline";
import Phone from "../../../../../../public/bi_telephone.svg";
import { BookATourButton } from "../ChartwellPropertyHeader/BookATourButton";
import PropertyTopNavLinks from "../ChartwellPropertyHeader/TopNavLinks";
import { CorpNavItem, PropertyHeaderProps } from "src/models/PropertyHeaderNav";
import { NavModal } from "../../../ui/modal/NavModal";
import { DesktopNav } from "../ChartwellPropertyHeader/DesktopNav";
import { MobileNav } from "../ChartwellPropertyHeader/MobileNav";
import { PropertyLogo } from "../../../ui/PropertyLogo";
import { PropertyLogoHomeName } from "components/chartwellComponents/ui/PropertyLogoHomeName";
import MapleLeaf from "../MapleLeaf";
import { useSitecoreContext } from "lib/sitecore/useSitecoreContext";

const DynamicChartwellNavModal = dynamic(() => Promise.resolve(NavModal), {
  ssr: false,
});
// const DynamicChartwellModal = dynamic(() => Promise.resolve(ChartwellModal), {
//   ssr: false,
// });

const getPropertyParentInfo = (ci: any, isPropertyPage: boolean) => {
  if (isPropertyPage) {
    return { path: ci?.url?.path, id: ci?.id };
  }
  const parent = !ci?.parent?.parent?.fields?.length ? ci?.parent : ci?.parent?.parent;
  return { path: parent?.url?.path, id: parent?.id };
};

const extractFields = (fields: any[]): { [key: string]: any } => {
  return fields?.reduce((acc: { [key: string]: any }, item: any) => {
    if (item?.name) {
      acc[item.name] = fields?.find((field: any) => field.name === item.name)?.jsonValue || [];
    }
    return acc;
  }, {});
};

const ChartwellPropertyHeader = (props: any): JSX.Element => {
  const { ds, ci } = props?.fields.data || {};

  const { sitecoreContext } = useSitecoreContext();
  const [open, setOpen] = useState<boolean>(false);
  const [openMobile, setOpenMobile] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
  const router = useRouter();

  const dsCorpNavItems = ds?.fields?.find((item: CorpNavItem) => item?.name === "CorpNavItems" && item?.jsonValue)?.jsonValue ?? [];

  const isPropertyPage = sitecoreContext.route?.templateName === "PropertyPage";

  const propertyNavItems = isPropertyPage ? extractFields(ci?.fields || []) : extractFields((!ci?.parent?.parent?.fields?.length ? ci?.parent?.fields : ci?.parent?.parent?.fields) || []);

  const parentInfo = getPropertyParentInfo(ci, isPropertyPage);

  /**
   * - Simplifies the logic for extracting the page logo by directly checking for the existence of `pageLevelLogoField?.value?.asset`.
   * - This avoids unnecessary type checks and nested property access, making the code more readable and maintainable.
   * - The previous version included multiple type and null checks, which were redundant given the structure of the data.
   * - The revised version ensures that only valid logo assets are used, falling back to `null` if not present.
   */
  const pageLogo = (sitecoreContext.route?.fields?.PageLevelLogo as any)?.value?.asset ? sitecoreContext.route?.fields?.PageLevelLogo : null;

  const isCustomAddress: boolean = sitecoreContext.route?.fields?.CustomAddress && (sitecoreContext.route?.fields?.CustomAddress as any)?.value ? true : false;

  useEffect(() => {
    const ogTitleMeta = document.getElementById("MetaTitle");
    const content = ogTitleMeta?.getAttribute("content") || "";
    if (ogTitleMeta) {
      ogTitleMeta.setAttribute("content", content);
    }
    setQuery(content);
  }, [router.asPath]);

  const searchHandler = () => {
    if (router.pathname !== "/search") {
      if (router.locale === "en") {
        router.push(`/search?query=${query}`);
      } else {
        router.push(`/recherche?query=${query}`);
      }
    } else {
      router.reload();
    }
  };

  const propertyPageFields: PropertyHeaderProps = {
    bilingual: propertyNavItems?.Bilingual?.value,
    propertyBookaTour: propertyNavItems?.BookATour?.[0],

    propertyContactNumber: propertyNavItems?.["Contact Number"]?.value,
    propertyLogo: pageLogo || propertyNavItems?.["Property Logo"],
    propertyName: propertyNavItems?.["Property Name"]?.value,
    propertyOverviewLink: parentInfo.path,
    propertyId: parentInfo.id,
    homePageLink: "/",
    propertySubNavItems: propertyNavItems?.SubNavigationItems,
    propertyLivingOptions: propertyNavItems?.["Living Option"],
    residence: propertyNavItems,
  };

  return (
    <>
      <DynamicChartwellNavModal open={openMobile} setOpen={setOpenMobile}>
        <MobileNav
          openMobile={openMobile}
          setOpenMobile={setOpenMobile}
          BookATour={propertyPageFields?.propertyBookaTour}
          setOpen={setOpen}
          bilingual={propertyPageFields.bilingual}
          propertyContactNumber={propertyPageFields?.propertyContactNumber}
          residence={isCustomAddress ? sitecoreContext.route?.fields : propertyNavItems}
          open={open}
          bottomLink={propertyPageFields?.propertySubNavItems}
          propertyId={propertyPageFields?.propertyId ?? ""}
          coprNavItems={dsCorpNavItems}
          propertyOverviewLink={propertyPageFields?.propertyOverviewLink ?? ""}
          propertyLogo={propertyPageFields?.propertyLogo}
          propertyName={propertyPageFields?.propertyName ?? ""}
        />
      </DynamicChartwellNavModal>

      <div className={`component !z-50 relative w-full !block`} id="ChartwellHeader">
        <div className=" py-2 px-4">
          <div className="flex items-center justify-center lg:justify-between border-b-2 pb-2">
            <div className="flex items-center">
              <div className=" lg:hidden">
                <PropertyLogoHomeName href={propertyPageFields?.propertyOverviewLink ?? ""} logo={propertyPageFields?.propertyLogo} title={propertyPageFields?.propertyName ?? ""} />
              </div>
              <PropertyLogo homePageLinkUrl={"/"} propertyId={propertyPageFields?.propertyId ?? ""} styles={"hidden lg:block"} title="Home" />
              <ul className="hidden lg:flex items-center gap-6 ml-6 ChartwellText text-[0.875rem]">
                <PropertyTopNavLinks corpNavItems={dsCorpNavItems} />
              </ul>
            </div>
            <div className="hidden lg:flex items-center">
              <MapleLeaf></MapleLeaf>
              <MagnifyingGlassIcon
                onClick={searchHandler}
                title="Search"
                className="w-[20px] h-[20px] text-ChartwellPlum hover:text-ChartwellPlum-100 focus:text-ChartwellPlum-100 cursor-pointer mr-8"
              />
              <LanguageSwitcher styles={`!ml-0`} />
            </div>
          </div>
          <div className="flex lg:hidden justify-between pt-2 gap-1">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setOpenMobile(!openMobile)}
                className="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              >
                <span className="sr-only">Open menu</span>
                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
              </button>

              <PropertyLogo homePageLinkUrl={"/"} propertyId={propertyPageFields?.propertyId ?? ""} title={propertyPageFields?.propertyName ?? ""} />
            </div>
            <div className="flex items-center gap-2">
              <Link href={`tel:${propertyPageFields?.propertyContactNumber}`} className="text-ChartwellPlum font-semibold   hover:text-ChartwellPlum-100   focus:text-ChartwellPlum-100">
                <svg width="25" height="25" className="block">
                  <image href={`${Phone.src}`} width="25" height="25" className="" />
                </svg>
              </Link>
              {propertyPageFields?.propertyBookaTour?.length !== 0 && <BookATourButton BookATour={propertyPageFields?.propertyBookaTour} />}
            </div>
          </div>
          <div className="hidden lg:block">
            <DesktopNav
              phoneNumber={propertyPageFields?.propertyContactNumber}
              BookATour={propertyPageFields?.propertyBookaTour}
              href={propertyPageFields?.propertyOverviewLink ?? ""}
              logo={propertyPageFields?.propertyLogo}
              bottomLink={propertyPageFields?.propertySubNavItems}
              title={propertyPageFields?.propertyName ?? ""}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default withDatasourceCheck()(ChartwellPropertyHeader);
