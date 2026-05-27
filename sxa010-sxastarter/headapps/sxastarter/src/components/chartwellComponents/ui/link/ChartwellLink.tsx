import { useRouter } from "next/router";
import { getLinkTarget } from "lib/helpers/utils/targetLink";
import { resolveHref } from "lib/helpers/utils/resolve-href";
import Link from "next/link";
interface LinkProps {
  href: any;
  label: string;
  target?: string;
  tailwindStyles?: string;
  textStyles?: string;
  locale?: string;
  ariaLabel?: string;
  linkId?: string;
}

export const ChartwellLink = ({ label = "Link to ....", href = "#", tailwindStyles, textStyles = "", target, locale, ariaLabel, linkId }: LinkProps): any => {
  const router = useRouter();
  const linkTarget = getLinkTarget(target);
  const normalizedHref = resolveHref(href);

  if (!normalizedHref || normalizedHref === "[object Object]" || !label) {
    return <></>;
  }

  linkId = linkId || "";

  return (
    <Link
      href={normalizedHref}
      locale={locale || router.locale}
      rel="noreferrer"
      target={linkTarget}
      aria-label={label || ariaLabel}
      title={ariaLabel || label}
      className={`no-underline inline-flex border-2 cursor-pointer
       plum-on-clear-background
       duration-300 ease-in-out   
       px-8 py-3
       mt-6
       !max-w-fit
        ${tailwindStyles}
       `}
    >
      {/* <span className="sr-only">{label}</span> */}
      <span className={`duration-300 ease-in-out  block text-center text-[0.9375rem] ${textStyles} uppercase`}>{label}</span>
    </Link>
  );
};
