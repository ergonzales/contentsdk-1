import { JSX } from "react";
import { useSitecore } from "@sitecore-content-sdk/nextjs";
import { useRouter } from "next/router";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useId } from "react";
import Link from "next/link";
export const BreadCrumbs = ({ style }: any): JSX.Element => {
  const { page } = useSitecore();
  const sitecoreContext = page?.layout?.sitecore?.context || {};
  const route = (sitecoreContext?.route || page?.layout?.sitecore?.route) as any;
  const router = useRouter();
  const contextPlaceHolders: any = route?.placeholders || {};
  const id = useId();

  const metaSeoBlock = contextPlaceHolders["headless-main"]?.find((component: any) => component.componentName == "MetaSeoBlock");
  const { languages: contextItem = [] } = metaSeoBlock ? (metaSeoBlock.fields?.data?.ci as any) : {};

  const breadcrumbs =
    contextItem &&
    createBreadcrumb(
      contextItem?.find((lang: any) => lang?.language?.name === router.locale),
      route?.itemId,
      route
    )?.results;

  const showOnlyIndexes = [0, breadcrumbs?.length - 3, breadcrumbs?.length - 2, breadcrumbs?.length - 1];

  const ArrowForwardIosIcoStyles = { fontSize: "0.875rem", color: "darkgray" };
  return (
    <>
      <div className={`ChartwellContainer bg-white hidden md:block   pt-6  lg:px-0  bg-no-repeat bg-cover cwbreadcrumbs ${style}`}>
        {breadcrumbs &&
          breadcrumbs?.map((link: any, index: number) => {
            const isDisabled = index === breadcrumbs?.length - 1;
            const displayArrowForwardIosIcon = route?.templateName !== "BlogCategory" || !isDisabled;

            let abbrevString = "";
            const linkTitle = link.propertyNavTitle.split(" ").splice(0, 12);
            if (link.propertyNavTitle.split(" ").length > 12) {
              linkTitle.forEach((x: string) => {
                abbrevString += x + " ";
              });
              abbrevString += " ...";
            } else abbrevString = link.propertyNavTitle;

            return (
              <span key={id + index}>
                {isDisabled ? (
                  route?.templateName !== "BlogArticle" && (
                    <span className=" mx-3 text-ChartwellGrey" title={link.propertyNavTitle}>
                      <span aria-hidden="true">{abbrevString}</span>
                      <span className="sr-only">{link.propertyNavTitle}</span>
                    </span>
                  )
                ) : (
                  <>
                    <Link
                      href={`${link?.url.replace("/en/", "")}`}
                      locale={router.locale}
                      className="decoration-ChartwellPlum hover:decoration-ChartwellBlue !p-0 mx-2 hover:text-ChartwellBlue text-ChartwellPlum duration-300 ease-in-out"
                      target={"_self"}
                      title={link.propertyNavTitle}
                    >
                      {showOnlyIndexes.includes(index) ? (
                        link.propertyNavTitle
                      ) : (
                        <>
                          <span aria-hidden="true">...</span>
                          <span className="sr-only">{link.propertyNavTitle}</span>
                        </>
                      )}
                    </Link>
                    {displayArrowForwardIosIcon && <ArrowForwardIosIcon style={ArrowForwardIosIcoStyles} />}
                  </>
                )}
              </span>
            );
          })}
      </div>
    </>
  );
};
export default BreadCrumbs;

const createBreadcrumb = (data: any, itemId: any, sitecoreContext: any) => {
  // const navTitle = sitecoreContext?.route?.templateName?.startsWith("Blog")
  // ? sitecoreContext?.route?.fields?.["NavigationTitle"]?.value
  // : sitecoreContext?.route?.templateName?.startsWith("Resource")
  // ? sitecoreContext?.route?.fields?.["NavigationTitle"]?.value
  // : data?.field?.jsonValue?.value;

  const results: any =
    data &&
    data?.ancestors
      ?.map((ancestor: any) => {
        return {
          itemId: ancestor?.itemId,
          propertyNavTitle: ancestor?.field?.jsonValue?.value,
          url: ancestor?.url?.path,
        };
      })
      .reverse();

  results &&
    results?.push({
      itemId: itemId?.replaceAll("-", "").toUpperCase(),
      propertyNavTitle: sitecoreContext?.fields?.["NavigationTitle"]?.value || data?.field?.jsonValue?.value,
      url: data?.url?.path,
    }); // append the context item to the end of the array

  return { results };
};
