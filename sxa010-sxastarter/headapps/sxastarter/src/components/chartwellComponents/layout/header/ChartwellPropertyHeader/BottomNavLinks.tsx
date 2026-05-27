import Link from "next/link";
import { useRouter } from "next/router";

interface IProps {
  bottomLink: NavigationItem[];
}

interface NavigationItem {
  id: string;
  url: string;
  fields: { NavigationTitle: { value: string } };
}

export const BottomNavLinks = ({ bottomLink }: IProps) => {
  const router = useRouter();
  const seen = new Set<string>();
  const uniqueBottomLinks = (bottomLink || []).filter((link) => {
    const key = `${link?.id || ""}|${link?.url || ""}`;
    if (!key || seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });

  return (
    <>
      {uniqueBottomLinks.map((link) => (
        <li key={link.id} className="relative group border-t lg:border-t-0">
          <Link
            href={link.url || ""}
            locale={router.locale}
            passHref
            className={`${
              router.asPath === link.url ? "text-ChartwellPlum isActive" : ""
            } hover:text-ChartwellPlum focus:text-ChartwellPlum active:text-ChartwellPlum duration-500 ChartwellText block propTopNavLink my-1 md:my-0 px-2 md:px-4 xxl:px-5 py-3 !rounded-[4px] text-[0.875rem]`}
          >
            {link.fields.NavigationTitle.value}
          </Link>
          {/* <span
            className={`hidden lg:block absolute bottom-[-20%] left-0 w-full h-[1px] bg-ChartwellPlum scale-0 group-hover:scale-100 duration-300 opacity-0 group-hover:opacity-100 ${
              router.asPath === link.url ? "opacity-100 scale-100" : ""
            }`}
          ></span> */}
        </li>
      ))}
    </>
  );
};
