import { JSX } from "react";
import { withDatasourceCheck, RichText as JssRichText, NextImage } from "@sitecore-content-sdk/nextjs";
import { useRouter } from "next/router";
import Link from "next/link";
import { BreadCrumbs } from "components/chartwellComponents/content/BreadCrumbs/BreadCrumbs";
const BlogCategoryFilters = (props: any): JSX.Element => {
  const router = useRouter();

  const blogCatList =
    props?.fields?.data?.ds?.children &&
    props?.fields?.data?.ds?.children?.blogCategories?.map((category: any) => {
      return {
        blogCategoryId: category?.blogCategoryId,
        categoryIcon: category.categoryIcon.jsonValue?.value,
        categoryName: props?.sitecoreContext?.route?.name === category?.blogCategoryItemName ? props.sitecoreContext?.route?.fields?.["Category Name"]?.value : category.categoryName?.value,
        categoryUrl: category.blogCategoryUrl?.path,
      };
    });

  if (!props) {
    return <></>;
  }

  return (
    <>
      <div className="ChartwellContainer">
        <BreadCrumbs style="p-0 pb-8" />
        <JssRichText field={props?.sitecoreContext?.route?.fields?.Content || props?.fields?.data?.ci?.field} className={`text-center`} />
        <ul className={`grid grid-cols-3 xs:grid-cols-3 lg:grid-cols-${blogCatList?.length} pb-8 border-b-2 border-ChartwellPlum lg:px-16"`}>
          {blogCatList &&
            blogCatList.map((category: any, index: any) => {
              return (
                <li className="lg:ml-4 cursor-pointer mt-4 md:mt-0 group" key={category.blogCategoryId || index}>
                  <div className="">
                    <Link className="font-semibold field-title text-lg normal-case no-underline flex flex-col items-center" href={`${category.categoryUrl}`} locale={router.locale}>
                      <div className="relative xs:w-20 xs:h-20 w-10 h-10 mx-auto">{category.categoryIcon?.src && <NextImage field={category.categoryIcon} fill className="" />}</div>
                      <h2
                        className={`mx-auto py-3 px-3 lg:px-2 font-semibold field-title text-lg text-center normal-case no-underline ${
                          router.asPath.trim() === category.categoryUrl ? "!text-ChartwellBlue" : "text-ChartwellPlum"
                        }  group-focus:text-ChartwellBlue group-hover:text-ChartwellBlue duration-300 ease-in`}
                        style={{ lineHeight: "1.15" }}
                      >
                        {category?.categoryName}
                      </h2>
                    </Link>
                  </div>
                </li>
              );
            })}
        </ul>
      </div>
    </>
  );
};
export default withDatasourceCheck()(BlogCategoryFilters);
