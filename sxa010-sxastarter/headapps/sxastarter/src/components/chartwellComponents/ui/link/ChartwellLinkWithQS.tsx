import { JSX } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { ReactNode } from "react";
interface LinkProps {
  href: any;
  label: ReactNode;
  color?: string;
  className?: string;
  textStyles?: string;
  ariaLabel?: string;
  scroll?: boolean;
}

export const ChartwellLinkWithQS = ({ label = "Link to ....", href = { url: "#", query: {} }, textStyles = "", color, ariaLabel, scroll }: LinkProps): JSX.Element => {
  const router = useRouter();

  return (
    <Link
      href={{ pathname: href.url, query: href.query }}
      locale={router.locale}
      scroll={scroll}
      color={color}
      aria-label={(ariaLabel || label) as string}
      className={`no-underline inline-flex border-2 cursor-pointer
       plum-on-clear-background
       duration-300 ease-in-out
       mt-6
       !max-w-fit
       `}
    >
      {/* <span className="sr-only">{label}</span> */}
      <span className={`duration-300 ease-in-out  block text-center text-[0.9375rem] ${textStyles} uppercase`}>{label}</span>
    </Link>
  );
};
export default ChartwellLinkWithQS;
