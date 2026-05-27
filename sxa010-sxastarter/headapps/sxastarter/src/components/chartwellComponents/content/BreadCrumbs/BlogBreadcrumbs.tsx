import { JSX } from "react";
import { useSitecore } from "@sitecore-content-sdk/nextjs";
import { useRouter } from "next/router";
import Link from "next/link";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const BlogBreadcrumbs = (props: any): JSX.Element => {
  const { page } = useSitecore();
  const sitecoreContext = page?.layout?.sitecore?.context || {};
  const route = sitecoreContext?.route as { templateName?: string } | undefined;
  const router = useRouter();
  const breadCrumbsPh = props?.fields?.data?.contextItem;
  const breadcrumbs = breadCrumbsPh && createBreadcrumb(breadCrumbsPh?.ancestors).results;

  if (!breadcrumbs) return <></>;

  const ArrowForwardIosIcoStyles = { fontSize: "14px", color: "darkgray" };

  return (
    <>
      <div className={`ChartwellContainer bg-white  pt-6  lg:px-0  bg-no-repeat bg-cover cwbreadcrumbs ${props.style}`}>
        {breadcrumbs &&
          breadcrumbs.map((link: any, index: number) => {
            const style = index === 0 ? "mr-3" : "mx-3";
            const isDisabled = index === breadcrumbs?.length - 1;
            const displayArrowForwardIosIcon = route?.templateName !== "BlogCategory" && !isDisabled;
            return (
              <span key={link.id}>
                {isDisabled ? (
                  route?.templateName !== "BlogArticle" && <span className="mx-3 text-ChartwellGrey">{link.propertyNavTitle}</span>
                ) : (
                  <>
                    <Link href={`${link.url}`} locale={router.locale} className={`${style}  text-ChartwellPlum`}>
                      {link.propertyNavTitle}
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
export default BlogBreadcrumbs;

const createBreadcrumb = (data: any) => {
  const results: any =
    data &&
    data
      ?.map((ancestor: any) => {
        return {
          displayName: ancestor?.displayName,
          propertyNavTitle: ancestor?.propertyNavTitle?.value,
          url: ancestor?.url?.path,
        };
      })
      .reverse();

  results &&
    results?.push({
      displayName: data?.displayName,
      propertyNavTitle: data?.propertyNavTitle?.value,
      url: data?.url?.path,
    }); // append the context item to the end of the array

  return { results };
};
