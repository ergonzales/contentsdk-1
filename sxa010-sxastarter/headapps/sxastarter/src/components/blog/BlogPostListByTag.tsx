import React, { useMemo } from "react";
import { withDatasourceCheck } from "@sitecore-content-sdk/nextjs";
import { BreadCrumbs } from "components/chartwellComponents/content/BreadCrumbs/BreadCrumbs";
import Link from "next/link";
import { useRouter } from "next/router";

type BlogTag = {
  tagTitle: { value: string };
  url: { path: string };
  id?: string | number;
};

type BlogPostListByTagProps = {
  rendering: any;
  fields: {
    data?: {
      ci?: {
        blogTags?: { results: BlogTag[] };
        pageHeading?: { value: string };
      };
    };
    TagDescription?: { value: string };
    TagTitle?: { value: string };
  };
};

const BlogPostListByTag: React.FC<BlogPostListByTagProps> = (props) => {
  const blogTags = useMemo(() => props.fields?.data?.ci?.blogTags?.results ?? [], [props.fields?.data?.ci?.blogTags?.results]);
  const { locale } = useRouter();

  const blogTagPageTitle = props.fields?.data?.ci?.pageHeading?.value || props.fields?.TagDescription?.value || props.fields?.TagTitle?.value || "";

  const sortedTags = useMemo(() => blogTags.slice().sort((a: BlogTag, b: BlogTag) => a.tagTitle.value.localeCompare(b.tagTitle.value)), [blogTags]);

  return (
    <div className="ChartwellContainer">
      <BreadCrumbs style="!py-[4px] md:!px-[6rem]" />
      <h1 className="py-[2rem] md:px-[6rem] text-center">{blogTagPageTitle}</h1>
      {sortedTags.length > 0 && (
        <>
          <ul className="sm:flex items-center justify-start gap-4 flex-wrap">
            {sortedTags.map((tag: BlogTag) => (
              <li key={tag.id ?? tag.tagTitle.value} className="bg-ChartwellPlum rounded-md mt-4 sm:mt-0">
                <Link className="text-[1.25rem] block p-2 no-underline text-ChartwellWhite" href={tag.url.path} locale={locale}>
                  {tag.tagTitle.value}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mb-8" />
        </>
      )}
    </div>
  );
};

export default withDatasourceCheck()(BlogPostListByTag);
