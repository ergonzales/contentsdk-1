import { JSX } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { NavigationItem } from "src/models/PropertyHeaderNav";

interface PropertyTopNavLinksProps {
  corpNavItems: NavigationItem[];
}

const PropertyTopNavLinks = ({ corpNavItems }: PropertyTopNavLinksProps): JSX.Element => {
  const { locale } = useRouter();
  const seen = new Set<string>();
  const uniqueCorpNavItems = (corpNavItems || []).filter((item) => {
    const key = `${item?.id || ""}|${item?.url || ""}`;
    if (!key || seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });

  return (
    <>
      {uniqueCorpNavItems.map(({ id, url, fields: { NavigationTitle } }) => (
        // <li key={id} className="border-t py-3 lg:border-0 lg:py-0 border-ChartwellGrey-200 relative group lg:border-t-0">
        <li key={id} className="border-t py-3 lg:border-0 lg:py-0 lg:pt-1 border-ChartwellGrey-200">
          <Link
            href={url}
            locale={locale}
            passHref
            className="ChartwellText hover:text-ChartwellPlum focus:text-ChartwellPlum active:text-ChartwellPlum duration-300 leading-[1.25] xl:whitespace-nowrap sm:px-2 md:px-3 xxl:px-4 py-2 !rounded-[4px] text-[0.875rem] propTopmostNav"
          >
            {NavigationTitle?.value}
          </Link>
          {/* <span
            className={`hidden lg:block absolute bottom-[-20%] left-0 w-full h-[1px] bg-ChartwellPlum scale-0 group-hover:scale-100 duration-300 opacity-0 group-hover:opacity-100`}
          ></span>          */}
        </li>
      ))}
    </>
  );
};

export default PropertyTopNavLinks;
