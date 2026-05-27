// import { useRouter } from "next/router";
// import { useMediaQuery } from "react-responsive";
// import { useEffect, useState } from "react";
// 

// interface IProps {
//   BookATour: any;
//   style?: string;
//   className?: string;
// }
// export const BookATourButton = ({ BookATour, style, className }: IProps) => {
//   const sitecoreContext = useSitecoreContext();
//   const router = useRouter();

//   const [isTabletOrSmaller, setIsTabletOrSmaller] = useState(false);
//   const isSmOrLg = useMediaQuery({ query: "(max-width: 1023px)" });

//   useEffect(() => {
//     setIsTabletOrSmaller(isSmOrLg);
//   }, [isSmOrLg]);

//   if (!BookATour) {
//     return null;
//   }
//   const JvItemNumbers = ["40ff5767-996d-4617-8660-e31745d1c784", "08322bae-cd27-4392-a6a5-7fc63d9b0157", "374d47b2-22bd-4fca-aa1a-009b2de15c67"];
//   const isJulesVerneCondoPage = JvItemNumbers.includes(sitecoreContext.sitecoreContext.route?.itemId?.toLowerCase() || "") ? true : false;
//   const jvBaT = "/fr/qc/l-ancienne-lorette/le-jules-verne/condos-locatifs/planifier-une-visite";

//   const href =
//     router.locale == "fr" ? "/fr" + BookATour[0]?.url?.path?.replace(BookATour[0]?.name, BookATour[0]?.displayName) : BookATour[0]?.url?.path?.replace(BookATour[0]?.name, BookATour[0]?.displayName);

//   const defaultClassName = `font-normal  sm:px-4 xl:py-4 uppercase ${
//     router.locale == "en" ? "text-[0.75rem] px-4 py-3" : "text-[0.625rem] px-[7px] py-3"
//   }  md:text-[1rem] flex-inline items-center text-center text-white bg-ChartwellBlue hover:bg-ChartwellPlum  focus:bg-ChartwellPlum ease-in-out hover:text-white ${style}`;

//   if (isJulesVerneCondoPage) {
//     return (
//       <a href={`${jvBaT}${isTabletOrSmaller ? "#BT" : ""}`} className={className || defaultClassName}>
//         {`${BookATour[0]?.field?.value?.toUpperCase()}`}
//       </a>
//     );
//   }
//   return (
//     <a href={`${href}${isTabletOrSmaller ? "#BT" : ""}`} className={className || defaultClassName}>
//       {`${BookATour[0]?.field?.value?.toUpperCase()}`}
//     </a>
//   );
// };

import { useRouter } from "next/router";
import { useMediaQuery } from "react-responsive";
import { useEffect, useState } from "react";

import Link from "next/link";
import { hasAnchorInTextOnlyBlock } from "lib/helpers/helper";
import { useSitecoreContext } from "lib/sitecore/useSitecoreContext";

interface IProps {
  BookATour: {
    url: string;
    fields: { NavigationTitle: { value: string } };
  };
  isBat?: boolean;
  style?: string;
  className?: string;
}

export const BookATourButton = ({ BookATour, style = "", className, isBat = true }: IProps) => {
  const { sitecoreContext } = useSitecoreContext();
  const router = useRouter();
  const [isTabletOrSmaller, setIsTabletOrSmaller] = useState(false);
  const isSmOrLg = useMediaQuery({ query: "(max-width: 1023px)" });

  useEffect(() => {
    setIsTabletOrSmaller(isSmOrLg);
  }, [isSmOrLg]);

  if (!BookATour) return null;

  const anchorCta = hasAnchorInTextOnlyBlock(sitecoreContext?.route?.placeholders?.["headless-main"]?.find((comp: any) => comp.componentName === "TextOnlyBlock") as any);
  const hasAnchor = anchorCta?.anchor ? true : false;

  // Jules Verne Condo Page Item Numbers
  const JvItemNumbers = ["40ff5767-996d-4617-8660-e31745d1c784", "08322bae-cd27-4392-a6a5-7fc63d9b0157", "374d47b2-22bd-4fca-aa1a-009b2de15c67"];

  const isJulesVerneCondoPage = JvItemNumbers.includes(sitecoreContext.route?.itemId?.toLowerCase() || "");
  const href = isJulesVerneCondoPage ? "/fr/qc/l-ancienne-lorette/le-jules-verne/condos-locatifs/planifier-une-visite" : hasAnchor ? `${anchorCta?.href}#${anchorCta?.anchor}` : BookATour.url;
  const defaultClassName = `font-normal sm:px-4 xl:py-4 uppercase ${
    router.locale === "en" ? "text-[0.75rem] px-4 py-3" : "text-[0.625rem] px-[7px] py-3"
  } md:text-[1rem] flex-inline items-center text-center text-white bg-ChartwellBlue hover:bg-ChartwellPlum focus:bg-ChartwellPlum ease-in-out hover:text-white ${style}`;

  return (
    <Link
      href={`${href}${!hasAnchor && isTabletOrSmaller ? "#BT" : ""}`}
      {...(isBat ? { id: "ChartwellNavBAT" } : {})}
      className={`chartwellNavBATBtn ${className || defaultClassName}`}
      locale={router.locale}
      passHref
    >
      {BookATour.fields?.NavigationTitle?.value.toUpperCase()}
    </Link>
  );
};
