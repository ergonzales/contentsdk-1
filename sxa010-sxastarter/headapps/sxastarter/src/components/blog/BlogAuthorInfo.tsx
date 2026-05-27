import { JSX } from "react";
import { withDatasourceCheck } from "@sitecore-content-sdk/nextjs";
import BlogAuthorShortForm from "./BlogAuthorShortform";
import { BreadCrumbs } from "components/chartwellComponents/content/BreadCrumbs/BreadCrumbs";

const BlogAuthorInfo = (props: any): JSX.Element => {
  const { ci: authorContext } = props?.fields?.data || {}; // destructure context item
  const { author: authorList } = props?.fields?.data?.ds?.authorList || {}; // destructure datasource

  return (
    <>
      <div className="w-full">
        {props && (
          <div className="ChartwellContainer">
            <div>
              <BreadCrumbs style="!p-2 md:p-0 !mb-6"></BreadCrumbs>
              <h1 className="py-[0rem] md:px-[6rem] text-center">{authorContext?.authorPageHeading?.value}</h1>
              <div className="py-[2rem] md:px-[6rem]" dangerouslySetInnerHTML={{ __html: authorContext?.authorContent?.value }}></div>
            </div>
            <div className="authorList">
              {authorList &&
                authorList?.map((author: any, index: any) => {
                  return (
                    <>
                      <BlogAuthorShortForm
                        border={"border-b border-b-ChartwellPlum-70"}
                        key={index}
                        Thumbnail={author?.authorThumbnail?.jsonValue}
                        Content={author?.authorSecondContentBlock?.value}
                        CTALinkText={`${author?.authorCTA?.value}` || ""}
                        Url={`${author?.authorLink?.jsonValue?.value?.href}` || ""}
                      />
                    </>
                  );
                })}
            </div>
          </div>
        )}
      </div>
    </>
  );
};
export default withDatasourceCheck()(BlogAuthorInfo);
