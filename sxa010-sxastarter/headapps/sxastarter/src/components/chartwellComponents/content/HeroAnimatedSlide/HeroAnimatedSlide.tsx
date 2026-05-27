import { withDatasourceCheck } from "@sitecore-content-sdk/nextjs";
import { JSX } from "react";
import JoyIsAgelessHeroAnimatedSlide from "./JoyIsAgelessFadeInHeroAnimatedSlide";
import OpenHouseHeroAnimatedSlide from "./OpenHouseHeroAnimatedSlide";
import { useSitecoreContext } from "lib/sitecore/useSitecoreContext";

// rendered from HeroSectionTextOnly when the joy is ageless animation (renderPropertyOverviewJoyIsAgeless) is enabled
const HeroAnimatedSlide = (props: any): JSX.Element => {
  const animation = (props.rendering?.fields?.Animation as any)?.value || (Array.isArray(props?.fields) ? props.fields.find((field: any) => field?.name === "Animation")?.jsonValue?.value : "") || "";
  // For French, do not split by space if the string contains a <span>
  const blockTextRaw =
    (props.rendering?.fields?.BlockText as any)?.value || (Array.isArray(props?.fields) ? props.fields.find((field: any) => field?.name === "BlockText")?.jsonValue?.value : "") || "";
  const slideAnimatedText = /<span[^>]*>.*?<\/span>/i.test(blockTextRaw) ? [blockTextRaw] : blockTextRaw.split(" ");
  const slideStaticText =
    (props.rendering?.fields?.SecondaryBlockText as any)?.value ||
    (Array.isArray(props?.fields) ? props.fields.find((field: any) => field?.name === "SecondaryBlockText")?.jsonValue?.value : "") ||
    "";
  const ctaLink = (props.rendering?.fields?.["CTA Link"] as any)?.value || (Array.isArray(props?.fields) ? props.fields.find((field: any) => field?.name === "CTA Link")?.jsonValue?.value : "") || "";
  const headingLevel =
    (props.rendering?.fields?.["Heading Level"] as any)?.value || (Array.isArray(props?.fields) ? props.fields.find((field: any) => field?.name === "Heading Level")?.jsonValue?.value : "") || "";
  const Tag = (headingLevel as keyof JSX.IntrinsicElements) || "h1";

  const { sitecoreContext } = useSitecoreContext();

  const isQuebec = sitecoreContext?.itemPath?.toLowerCase().includes("quebec");

  const linkTargetHref = ctaLink?.href ? `${sitecoreContext?.language?.includes("fr") ? "/fr" : ""}${ctaLink.href}` : "";

  const bkgImage =
    (props.rendering?.fields?.["Background Image"] as any)?.value?.asset?.files?.find((img: any) => img?.name === "Large_Generic_Hero_webp") ||
    (Array.isArray(props?.fields)
      ? props.fields.find((field: any) => field?.name === "Background Image")?.jsonValue?.value?.asset?.files?.find((img: any) => img?.name === "Large_Generic_Hero_webp")
      : undefined);

  return (
    <div style={{ maxWidth: "100vw", overflowX: "hidden" }}>
      {animation === "Joy is ageless fade in" && (
        <JoyIsAgelessHeroAnimatedSlide
          animation={animation}
          slideAnimatedText={slideAnimatedText}
          slideStaticText={slideStaticText}
          ctaLink={ctaLink}
          Tag={Tag}
          isQuebec={isQuebec}
          linkTargetHref={linkTargetHref}
          bkgImage={bkgImage}
        />
      )}
      {animation === "Open House" && (
        <OpenHouseHeroAnimatedSlide
          animation={animation}
          slideAnimatedText={slideAnimatedText}
          slideStaticText={slideStaticText}
          ctaLink={ctaLink}
          Tag={Tag}
          isQuebec={isQuebec}
          linkTargetHref={linkTargetHref}
          bkgImage={bkgImage}
        />
      )}
    </div>
  );
};

export default withDatasourceCheck()<any>(HeroAnimatedSlide);
