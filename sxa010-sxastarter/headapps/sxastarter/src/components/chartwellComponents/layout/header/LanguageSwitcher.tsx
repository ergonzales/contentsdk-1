import { JSX } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

import { generateFinalUrl, generateHref, toTitleCase } from "lib/helpers/helper";
import { useMemo } from "react";
import { useSitecoreContext } from "lib/sitecore/useSitecoreContext";

interface Language {
  language: {
    name: string;
    nativeName: string;
  };
  url?: {
    path: string;
  };
}

interface IProps {
  styles?: string;
}

export const LanguageSwitcher = ({ styles }: IProps): JSX.Element => {
  const router = useRouter();
  const { sitecoreContext } = useSitecoreContext();
  const { province, careservices, qs } = router.query;

  // Memoize the context item languages to prevent unnecessary recalculations
  const { languages: contextItemLanguages } = useMemo(() => {
    const metaSeoBlock = sitecoreContext.route?.placeholders["headless-main"].find((component: any) => component.componentName === "MetaSeoBlock");
    return (metaSeoBlock as any)?.fields?.data?.ci || {};
  }, [sitecoreContext.route?.placeholders]);

  const bilingual = useMemo(() => contextItemLanguages?.length === 2, [contextItemLanguages?.length]);
  const setLanguageToggle = useMemo(() => (!bilingual ? "" : router.locale === "en" ? "fr" : "en") || "", [bilingual, router.locale]);

  // Memoize the alternate language info
  const altContextItemLanguage = useMemo(() => {
    if (!bilingual) return {};
    return contextItemLanguages?.find((lang: Language) => lang.language.name === setLanguageToggle) || {};
  }, [bilingual, contextItemLanguages, setLanguageToggle]);

  // Memoize the language switcher URL
  const languageSwitcherUrl = useMemo(() => {
    if (!altContextItemLanguage?.url?.path) return "";

    if (sitecoreContext?.language === "en") {
      return altContextItemLanguage.url.path === "/" ? "/fr" : `/fr${altContextItemLanguage.url.path}`;
    }
    return altContextItemLanguage.url.path;
  }, [altContextItemLanguage?.url?.path, sitecoreContext?.language]);

  // Memoize the final URL
  const finalUrl = useMemo(() => {
    const langUrlQueryString = decodeURIComponent(router.asPath?.includes("?") ? router.asPath?.substring(router.asPath?.indexOf("?")) : "") || "";
    return `${languageSwitcherUrl}${langUrlQueryString && generateFinalUrl(setLanguageToggle, province, careservices, qs)(langUrlQueryString)}`;
  }, [languageSwitcherUrl, setLanguageToggle, province, careservices, qs, router.asPath]);

  // Memoize language native names
  const languageNativeNames = useMemo(() => {
    return contextItemLanguages?.reduce((acc: Record<string, string>, lang: Language) => {
      acc[lang.language.name] = toTitleCase(lang.language?.nativeName);
      return acc;
    }, {});
  }, [contextItemLanguages]);

  const linkClassName = `ChartwellStrongText text-ChartwellPlum hover:text-ChartwellPlum-100 focus:text-ChartwellPlum-100 active:text-ChartwellPlum ml-6 md:p-3 cursor-pointer flex flex-nowrap min-w-[44px] ${styles}`;

  if (!bilingual) {
    return <></>;
  }

  const LinkComponent = generateHref(sitecoreContext) ? "a" : Link;
  const linkProps = generateHref(sitecoreContext) ? { href: finalUrl, className: linkClassName } : { href: finalUrl, locale: setLanguageToggle, className: linkClassName, passHref: true };

  return (
    <div>
      <span className="sr-only">{setLanguageToggle}</span>
      <LinkComponent {...linkProps}>
        <span className="hidden lg:inline text-[0.95rem]">{setLanguageToggle?.toLocaleUpperCase() ?? ""}</span>
        <span className="lg:hidden ChartwellText text-[0.95rem]">{setLanguageToggle?.toLocaleUpperCase() === "EN" ? languageNativeNames.en : languageNativeNames.fr}</span>
      </LinkComponent>
    </div>
  );
};

export default LanguageSwitcher;
