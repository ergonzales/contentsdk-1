import Link from "next/link";
import { useRouter } from "next/router";
interface LinkType {
  id: string;
  fields: {
    Url?: {
      value: string;
    };
    Title?: {
      value: string;
    };
    NavigationTitle?: {
      value: string;
    };
  };
  url: string;
}

export const MiceTypeLink = ({ listStyle, LinkStyle, link }: { listStyle?: string; LinkStyle?: string; link: LinkType }) => {
  const router = useRouter();
  return (
    <li className={listStyle}>
      {/* <Link target={`${isExternalLink ? "_blank" : "_self"}`} href={`${isExternalLink ? link.fields?.Url?.value : link.url}`} locale={router.locale} passHref className={LinkStyle}>
        {isExternalLink ? link.fields?.Title?.value : link.fields?.NavigationTitle?.value}
      </Link> */}
      <Link target={`${"_self"}`} href={`${link.url}`} locale={router.locale} passHref className={LinkStyle}>
        {link.fields?.NavigationTitle?.value}
      </Link>
    </li>
  );
};
