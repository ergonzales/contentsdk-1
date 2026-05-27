import { addProductJsonLd, generateFinalUrl, toTitleCase, shouldRenderProductJson } from "lib/helpers/helper";
import { fetchSearchHeader, translateProvinceName } from "lib/helpers/search-helpers";
import Head from "next/head";
import { useRouter } from "next/router";
import { useCallback, useState, JSX, useMemo } from "react";

// import { extractTypeFromUrl } from "./extractTypeFromUrl";
import useVideoMetadata from "components/chartwellComponents/customHooks/useVideoMetaData";
import { useSitecoreContext } from "lib/sitecore/useSitecoreContext";

const sanitizeUrl = (url: string = ""): string => {
  return url.replace("/_site_sxastarter", "").replace("https://chartwell.com/_site_sxastarter", "https://chartwell.com");
};

const MetaSeoBlock = (props: any): JSX.Element => {
  const router = useRouter();
  const { videos } = useVideoMetadata();

  const { languages: contextItemLanguages } = props?.fields?.data?.ci || {};
  const { province, cityorpostalcode, careservices, q, qs } = router.query;
  const [metaCityOrPostalCode, setMetaCityOrPostalCode] = useState<string | "">("");
  const { sitecoreContext } = useSitecoreContext();
  const isEN = router.locale === "en";
  const altToggle = isEN ? "fr" : "en";
  const altLocale = isEN ? "fr-CA" : "en-CA";

  const publicUrl = process.env.PUBLIC_URL || "https://chartwell.com";
  const origin = publicUrl;

  // Memoize uniqueVideos
  const uniqueVideos = useMemo(() => (Array.isArray(videos) ? videos.filter((video, idx, arr) => arr.findIndex((v) => v.embedUrl === video.embedUrl) === idx) : videos), [videos]);

  // Memoize contextItemLanguage and altContextItemLanguage
  const contextItemLanguage = useMemo(() => contextItemLanguages?.find((lang: any) => lang.language.name === router.locale), [contextItemLanguages, router.locale]);
  const altContextItemLanguage = useMemo(() => contextItemLanguages?.find((lang: any) => lang.language.name === altToggle), [contextItemLanguages, altToggle]);
  const metaTitle = useMemo(() => {
    const titleField = sitecoreContext?.route?.fields?.["Title"];
    if (titleField && typeof titleField === "object" && "value" in titleField) {
      return titleField.value;
    }
    const contextTitleField = contextItemLanguage?.fields?.find((field: any) => field.name === "Title")?.jsonValue;
    if (contextTitleField && typeof contextTitleField === "object" && "value" in contextTitleField) {
      return contextTitleField.value;
    }
    return "";
  }, [sitecoreContext, contextItemLanguage]);

  const heroSectionPh = sitecoreContext.route?.placeholders["headless-main"]?.find((c: any) => c.componentName === "HeroSectionTextOnly");
  const blogPostPh = sitecoreContext.route?.placeholders["headless-main"]?.find((c: any) => c.componentName === "BlogPostList");
  const resourceListPh = sitecoreContext.route?.placeholders["headless-main"]?.find((c: any) => c.componentName === "ResourceList");

  const ogImage =
    contextItemLanguage?.fields?.find((field: any) => field.name === "BackgroundImage")?.jsonValue?.value?.src ||
    (heroSectionPh as any)?.fields?.data?.ds?.fields?.find((field: any) => field.name === "Background")?.jsonValue?.value?.src ||
    (resourceListPh as any)?.fields?.data?.ds?.children?.results?.[0]?.["backgroundImage"]?.jsonValue?.value?.src ||
    (blogPostPh as any)?.fields?.data?.item?.children?.blogCategories[0]?.children?.blogArticles[0]?.blogBackgroundImage?.jsonValue?.value?.src ||
    "https://dam.chartwell.com/m/27a25bcfee40173a/Desktop_Banner_webp-Chartwell_HOME_Senior_couple_dining.webp";

  const bilingual = contextItemLanguages?.length === 2;

  let xDefaultUrl = "";
  if (bilingual) {
    xDefaultUrl = `${origin}${contextItemLanguages.find((lang: any) => lang.language.name === router.defaultLocale)?.url?.path || ""}`.replace(/\/$/, "");
  } else if (!bilingual && router.locale !== "fr") {
    xDefaultUrl = `${origin}${contextItemLanguage?.url?.path || ""}`.replace(/\/$/, "");
  }

  const langUrlQueryString = decodeURIComponent(router.asPath.includes("?") ? router.asPath.substring(router.asPath.indexOf("?")) : "");

  const getCityName = useCallback(async () => {
    const t = (await fetchSearchHeader(router.locale, cityorpostalcode?.toString() || "")) || cityorpostalcode;
    t && setMetaCityOrPostalCode(Array.isArray(t) ? t[0] : t.toString());
  }, [cityorpostalcode, router.locale]);

  if (router.asPath !== "/" && cityorpostalcode) getCityName();

  const metaSeoTitle =
    router.asPath !== "/" && router.asPath.includes("province") && province
      ? `${metaTitle}${translateProvinceName((province ?? "")?.toString() || "", router.locale || "en")}`
      : router.asPath.includes("cityorpostalcode") && cityorpostalcode
      ? `${metaTitle}${metaCityOrPostalCode.toUpperCase()}`
      : router.asPath.includes("q") && q
      ? `${metaTitle} - ${toTitleCase(q.toString())}`
      : router.asPath.includes("qs") && qs
      ? `${metaTitle} - ${toTitleCase(qs.toString())}`
      : `${metaTitle}`;

  const altUrl = generateFinalUrl(altToggle, province, careservices, qs);

  const noindex = contextItemLanguage?.fields?.find((field: any) => field.name === "No Index")?.jsonValue?.value ? "noindex" : "";
  const nofollow = contextItemLanguage?.fields?.find((field: any) => field.name === "No Follow")?.jsonValue?.value ? "nofollow" : "";
  const robots = `${noindex} ${nofollow}`.trim().replace(" ", ", ");

  const currLocale = isEN ? "en-CA" : "fr-CA";

  const curUrl = `${origin}${router.locale === "fr" ? "/" + router.locale : ""}${router.asPath !== "/" ? router.asPath : ""}`.replace(/\/$/, "") || "";

  const canonicalFromItem = contextItemLanguage?.fields?.find((field: any) => field.name === "Canonical")?.jsonValue?.value || "";
  const canonical = (canonicalFromItem && `${origin}${router.locale === "fr" ? "/" + router.locale : ""}${canonicalFromItem}${langUrlQueryString}`.replace(/\/$/, "")) || curUrl;

  const alternateUrl =
    bilingual &&
    `${origin}${altToggle === "fr" ? "/" + altToggle : ""}${router.asPath !== "/" ? altContextItemLanguage?.url?.path : ""}${langUrlQueryString && altUrl(langUrlQueryString)}`.replace(/\/$/, "");

  // sanitize all key URLs
  const cleanCurUrl = sanitizeUrl(curUrl);
  const cleanCanonical = sanitizeUrl(canonical);
  const cleanXDefaultUrl = sanitizeUrl(xDefaultUrl);
  const cleanAlternateUrl = sanitizeUrl(alternateUrl || "");

  const renderProductJson = useMemo(() => shouldRenderProductJson(sitecoreContext, uniqueVideos), [sitecoreContext, uniqueVideos]);

  const productJson = useMemo(
    () => (renderProductJson && addProductJsonLd(cleanCurUrl, sitecoreContext, router, uniqueVideos)) || "",
    [renderProductJson, cleanCurUrl, sitecoreContext, router, uniqueVideos]
  );
  // const type = useMemo(() => extractTypeFromUrl(cleanCurUrl, router.locale || "en"), [cleanCurUrl, router.locale]);

  return (
    <>
      <Head>
        <meta name="description" content={(sitecoreContext?.route?.fields?.Description as any)?.value || contextItemLanguage?.fields.find((f: any) => f.name === "Description")?.jsonValue?.value} />
        <meta name="robots" content={robots} />

        {/* <meta property="og:type" content={type} /> */}
        <meta property="og:title" id="MetaTitle" content={metaSeoTitle} />
        <meta property="og:url" content={cleanCurUrl} />
        <meta property="og:image" content={ogImage} />
        <meta
          property="og:description"
          content={(sitecoreContext?.route?.fields?.Description as any)?.value || contextItemLanguage?.fields.find((f: any) => f.name === "Description")?.jsonValue?.value}
        />
        <title>{metaSeoTitle}</title>
        {xDefaultUrl && <link rel="alternate" hrefLang="x-default" href={cleanXDefaultUrl} key="xdefault" />}
        <link rel="canonical" href={cleanCanonical} key="canonical" />
        <link rel="alternate" href={cleanCurUrl} hrefLang={currLocale} id="current" />
        {bilingual && <link rel="alternate" href={cleanAlternateUrl} hrefLang={altLocale} id="alt1" />}
        {productJson && <script id="product-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: productJson }} key="product-jsonld" />}
      </Head>
    </>
  );
};

MetaSeoBlock.displayName = "MetaSeoBlock";
export default MetaSeoBlock;
