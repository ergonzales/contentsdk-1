import { JSX } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { NextImage } from "@sitecore-content-sdk/nextjs";

const ResourceCard2 = (props: any): JSX.Element => {
  const { featured, linkToResource, mediaForResource, backgroundImage, title, body, category, subTitle } = props;
  const router = useRouter();
  const doesImageExist = backgroundImage?.value?.src != null;
  const href = linkToResource?.value?.href && linkToResource?.value?.href !== "" ? linkToResource.value.href : mediaForResource?.src ? mediaForResource.src : "#";
  const locale = router.locale;
  const categoryName = category?.[0]?.fields?.name?.value;
  const subTitleValue = subTitle?.value;
  const textSizeClass = `text-sm ${locale === "en" ? "xs:text-lg" : "xs:text-md"}`;

  // Card content for non-featured
  const renderNonFeatured = () => (
    <Link href={href} locale={locale} title={title} className="no-underline flex flex-col justify-between gap-4 h-full">
      <div>
        <div className="relative xs:mb-16 mb-5">
          {doesImageExist ? <NextImage field={backgroundImage} className="mx-auto w-full h-[280px] lg:max-w-full object-cover object-center" /> : <div className="h-16"></div>}
          <div className="absolute bg-ChartwellPlum/95 -bottom-5 xs:-bottom-16 xs:inset-x-5 inset-x-2 mx-auto xs:max-h-[125px] xs:h-[125px] h-12 max-w-[400px] bg-opacity-50 text-white py-2 px-2 xs:px-6 flex justify-center items-center">
            <h3 className="xs:py-2 xs:text-2xl text-xs font-semibold text-center text-white align-top">{title?.substring(0, 60)}</h3>
          </div>
        </div>
        <div className="mt-4 flex flex-col justify-center">
          <div
            className="mx-auto text-sm xs:text-lg text-ChartwellGrey mt-6 max-w-7xl field-body text-ellipsis overflow-hidden max-h-36"
            dangerouslySetInnerHTML={{ __html: body?.substring(0, 160) }}
          ></div>
        </div>
      </div>
      <div className="border-t !border-ChartwellPlum w-full mt-auto"></div>
      <div>
        <div className="flex items-center justify-between">
          <div className={`${textSizeClass} text-left uppercase font-small text-ChartwellPlum`}>{categoryName}</div>
          {subTitleValue && <span className={`${textSizeClass} font-semibold text-ChartwellGrey uppercase m-0 px-2 bg-ChartwellGrey/5 leading-normal`}>{subTitleValue}</span>}
        </div>
      </div>
    </Link>
  );

  // Card content for featured
  const renderFeatured = () => (
    <>
      <Link href={href} locale={locale} className="no-underline flex flex-col justify-between gap-4 h-full">
        <div className="no-underline flex w-full justify-center relative isolate overflow-hidden lg:h-full h-[320px] md:h-[600px]">
          <NextImage field={backgroundImage} className="absolute inset-0 -z-10 h-full w-full object-cover object-center" />
          <h2 className="text-ChartwellWhite bg-ChartwellPlum/90 font-semibold normal-case text-xl xs:text-3xl xs:px-10 p-4 absolute bottom-10">{title}</h2>
        </div>
        <div className="flex items-center justify-between pt-6">
          <div className={`${textSizeClass} text-left uppercase font-small text-ChartwellPlum`}>{categoryName}</div>
          {subTitleValue && <span className={`${textSizeClass} font-semibold uppercase m-0 text-ChartwellGrey px-2 bg-ChartwellGrey/5 leading-normal`}>{subTitleValue}</span>}
        </div>
      </Link>
    </>
  );

  return featured ? renderFeatured() : renderNonFeatured();
};

export default ResourceCard2;
