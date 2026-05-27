import { JSX } from "react";
import { BreadCrumbs } from "../chartwellComponents/content/BreadCrumbs/BreadCrumbs";
import HelpfulResources from "./HelpfulResources";
import { ShareButtons } from "./shareButtons/shareButtons";
import BlogAuthorShortForm from "./BlogAuthorShortform";
import useBackGroundPosition from "components/chartwellComponents/customHooks/backGroundPosition";
import { BlogTagsLinks } from "./BlogTagsLinks/BlogTagsLinks";
import { withDatasourceCheck } from "@sitecore-content-sdk/nextjs";

const getFieldValue = (primary: any, fallback: any, subfield: string = "value") => primary?.[subfield] || fallback?.[subfield] || "";
const getArrayField = (primary: any, fallback: any) => (Array.isArray(primary) && primary.length > 0 ? primary : Array.isArray(fallback) && fallback.length > 0 ? fallback : null);

const BlogArticle = (props: any): JSX.Element => {
  const fields = props?.fields || {};
  const blogFields = fields?.data?.ci || {};
  const { backgroundImage, heroImageBackgroundPosition, pageHeading, content, blogCardsList, secondContentBlock, author, tags, authorLink, displayAuthorInfo } = blogFields;

  const bgPosition = heroImageBackgroundPosition?.value || fields["Hero Image background position"]?.value;
  const styleBackGroundPosition = useBackGroundPosition(bgPosition);
  const heroImageSrc = fields["BackgroundImage"]?.value?.src || backgroundImage?.jsonValue?.value?.src || "";
  const styles = {
    heroSection: {
      backgroundImage: `url(${heroImageSrc})`,
    },
  };
  const containerPadding = "py-[0rem] px-[1rem] md:px-[5rem]";
  const pageHeadingValue = getFieldValue(fields["Page Heading"], pageHeading);
  const contentValue = getFieldValue(fields["Content"], content);
  const secondContentBlockValue = getFieldValue(fields["Second Content Block"], secondContentBlock);
  const blogCards = getArrayField(fields["Blog Cards List"], blogCardsList);
  const showAuthorInfo = fields["Display Author Info"]?.value || displayAuthorInfo?.boolValue;
  const authorFields = fields?.Author?.[0]?.fields || author?.targetItems?.[0]?.fields;
  const authorSecondContent =
    fields?.Author?.[0]?.fields?.["Second Content Block"]?.value || author?.targetItems?.[0]?.fields?.find((field: any) => field.name === "Second Content Block")?.jsonValue?.value || "";
  const authorUrl = fields["AuthorLink"]?.value?.href || authorLink?.url || "";
  const authorThumbnail = fields?.Author?.[0]?.fields?.["Thumbnail"] || author?.targetItems?.[0]?.fields?.find((field: any) => field.name === "Thumbnail")?.jsonValue?.value || {};
  const authorCTALinkText = fields?.Author?.[0]?.fields?.["CTA Link Text"]?.value || author?.targetItems?.[0]?.fields?.find((field: any) => field.name === "CTA Link Text")?.jsonValue?.value || "";
  const tagsValue = tags?.targetItems || fields?.Tags;

  return (
    <div className="relative w-full bg-no-repeat bg-cover blog">
      <div className="max-w-7xl bg-no-repeat bg-cover mx-auto px-4 pb-0">
        <article>
          <div className={`heroSection max-h-300px md:max-h-400px lg:max-h-600px ${styleBackGroundPosition}`} style={styles.heroSection} />
          <div className="md:flex items-end w-100 grow py-6">
            <div className="grow">
              <BreadCrumbs style="!p-2 md:p-0" />
            </div>
            <ShareButtons subject={pageHeadingValue} />
          </div>
          <div className="lg:my-[2rem] p-0">
            {pageHeadingValue && <h1 className={containerPadding}>{pageHeadingValue}</h1>}
            {contentValue && <div className={`${containerPadding} pt-[2rem] pb-0`} dangerouslySetInnerHTML={{ __html: contentValue }} />}
            {blogCards && <HelpfulResources isBlogSingleFormSection="false" props={blogCards} />}
            {secondContentBlockValue && <div className={`${containerPadding} py-[brem] pt-0`} dangerouslySetInnerHTML={{ __html: secondContentBlockValue }} />}
          </div>
        </article>
        {showAuthorInfo && authorFields && (
          <div className="authorList">
            <BlogAuthorShortForm
              border={secondContentBlockValue ? "border-t border-ChartwellPlum" : "md:-mt-8 "}
              Content={authorSecondContent}
              Url={authorUrl}
              Thumbnail={authorThumbnail}
              CTALinkText={authorCTALinkText}
            />
          </div>
        )}
        {tagsValue && <BlogTagsLinks Tags={tagsValue} />}
      </div>
    </div>
  );
};

export default withDatasourceCheck()(BlogArticle);
