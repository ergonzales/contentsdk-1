import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ImageField, NextImage } from "@sitecore-content-sdk/nextjs";

type BlogAuthorShortFormProps = {
  Thumbnail: ImageField;
  border?: string;
  Content: string;
  Url: string;
  CTALinkText: string;
};

const linkClassName =
  "no-underline inline-flex border-2 cursor-pointer hover:bg-ChartwellPlum-100 hover:border-ChartwellPlum-100 focus:bg-ChartwellPlum-100 focus:border-ChartwellPlum-100 border-ChartwellPlum ease-in-out group py-3 hover:text-white focus:text-white active:text-white text-center text-[0.9rem] text-ChartwellPlum uppercase !max-w-fit p-3 px-8 md:text-[1.06rem] mt-4 duration-300 chartwellCTAs mb-6 plum-on-clear-background";

const BlogAuthorShortForm: React.FC<BlogAuthorShortFormProps> = ({ Thumbnail, border = "", Content, Url, CTALinkText }) => {
  const { locale } = useRouter();
  return (
    <section className="relative w-full authorContainer">
      <div className={`bg-white max-w-7xl ${border}`}>
        <div className="ChartwellContainer lg:flex lg:items-center justify-between">
          <div className="w-full md:px-8 flex flex-col md:flex-row items-center pb-2 md:pb-0">
            <div className="flex basis-full md:basis-1/4 p-2 pt-8 items-start authorPhoto">
              <NextImage field={Thumbnail} width="300" height="350" />
            </div>
            <div className="basis-full md:basis-3/4 p-8 pb-0 authorDetails">
              <div dangerouslySetInnerHTML={{ __html: Content }} />
              {CTALinkText && Url && (
                <Link href={Url} locale={locale} className={linkClassName}>
                  {CTALinkText}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogAuthorShortForm;
