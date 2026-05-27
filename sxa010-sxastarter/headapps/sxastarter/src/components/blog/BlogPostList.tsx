import { JSX } from "react";
import { withDatasourceCheck } from "@sitecore-content-sdk/nextjs";
import { useI18n } from "next-localization";
import { useEffect, useState } from "react";
import { getTypeOfCard } from "./blogCardType/getTypeOfCard";
import { BlogCard } from "./BlogCard";
import { useSitecore } from "@sitecore-content-sdk/nextjs";
import LoadMore from "components/chartwellComponents/content/ResourceList/LoadMore";

const ITEMS_PER_PAGE = 9;

function getCategoryIdFromBlogArticleId(result: any[], articleId: string) {
  return result.find((x: any) => x.blogArticleId === articleId)?.blogCategoryId;
}

const BlogPostList = (props: any): JSX.Element => {
  const { t: dict } = useI18n();
  const { page } = useSitecore();
  const sitecoreContext = page?.layout?.sitecore?.context;
  const route = page?.layout?.sitecore?.route;
  const [blogList, setBlogList] = useState<any[]>([]);

  const [currentPage, setCurrentPage] = useState(1);

  const handleLoadMore = (page: number) => {
    setCurrentPage(page);
  };
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const blogCategories = props?.fields?.data?.item?.children?.blogCategories ?? [];
    if (!Array.isArray(blogCategories)) {
      setBlogList([]);
      setTotalPages(0);
      return;
    }

    const result = blogCategories.flatMap((category: any) =>
      Array.isArray(category?.children?.blogArticles)
        ? category.children.blogArticles.map((article: any) => ({
            blogCategoryId: category?.blogCategoryId,
            blogCategoryName: props?.sitecoreContext?.route?.fields?.["Category Name"]?.value || category?.categoryName?.value,
            blogArticleId: article?.blogArticleId,
            authorName: article?.author?.targetItems?.[0]?.authorName || "",
            authorCTA: article?.author?.targetItems?.[0]?.authorCTA?.value || "",
            blogArticleUrl: article?.blogArticleUrl?.path,
            blogCreationDate: article?.blogCreationDate?.jsonValue?.value,
            blogUpdatedDate: article?.blogUpdatedDate?.jsonValue?.value,
            blogArticleName: article.blogTitle?.value,
            blogBackgroundImage: article?.blogBackgroundImage?.jsonValue,
            blogArticleDescription: article.blogDescription?.value,
            blogArticleTitle: article.blogArticleName?.value,
            blogTags: article?.blogTags?.targetIds,
            isBlogPinned: article?.isBlogPinned?.jsonValue?.value || false,
            blogLabel: article?.blogLabel?.jsonValue?.value || "",
          }))
        : []
    );

    let filteredResult = result;
    if (route && typeof route === "object" && "templateName" in route) {
      if (route.templateName === "BlogCategory") {
        filteredResult = result.filter((el: any) => el.blogCategoryId === (route.itemId ?? "").replaceAll("-", "").toUpperCase());
      } else if (route.templateName === "BlogArticle") {
        const articleIdStr = (route.itemId ?? "").replaceAll("-", "").toUpperCase();
        const categoryIdFromBlogArticleId = getCategoryIdFromBlogArticleId(result, articleIdStr);
        filteredResult = result
          .filter((el: any) => (el.blogCategoryId === props?.params?.["categoryId"]?.replaceAll("-", "") || el.blogCategoryId === categoryIdFromBlogArticleId) && el.blogArticleId !== articleIdStr)
          .slice(0, 3);
      } else if (route.templateName === "BlogAuthor") {
        filteredResult = result.filter((el: any) => el.authorName === route.name);
      } else if (route.templateName === "BlogTags") {
        filteredResult = result.filter((el: any) => el.blogTags?.includes(route.itemId));
      }
    }

    setBlogList(
      filteredResult
        .sort((a: any, b: any) => {
          const dateA = new Date(a.blogUpdatedDate);
          const dateB = new Date(b.blogUpdatedDate);
          return dateB.getTime() - dateA.getTime();
        })
        .sort((a: any, b: any) => {
          return (b.isBlogPinned === true ? 1 : 0) - (a.isBlogPinned === true ? 1 : 0);
        })
    );
    setTotalPages(Math.ceil(filteredResult.length / ITEMS_PER_PAGE));
  }, [sitecoreContext, props?.params, props?.fields?.data?.item?.children?.blogCategories, props?.sitecoreContext?.route?.fields]);

  const blogPosts = blogList.slice(0, currentPage * ITEMS_PER_PAGE);

  if (!blogPosts.length) return <></>;

  return (
    <div className="ChartwellContainer bg-ChartwellGrey-10 blogPostList mt-4 mb-4 pt-8 pb-8">
      {route && typeof route === "object" && "templateName" in route && route.templateName === "BlogArticle" && <h2 className="uppercase font-normal mt-4 mb-3 text-2xl">{dict("RelatedArticles")}</h2>}
      {route && typeof route === "object" && "templateName" in route && route.templateName === "BlogAuthor" && <h2 className="uppercase font-normal mt-4 mb-3 text-2xl">{blogPosts[0]?.authorCTA}</h2>}
      <div>
        <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((card, index) => (
            <BlogCard
              key={card?.blogArticleId || index}
              cardId={card?.blogArticleId}
              label={card?.blogLabel}
              cardType={getTypeOfCard(index)}
              cardURL={card?.blogArticleUrl}
              imageField={card?.blogBackgroundImage}
              cardImageSrc={card?.blogBackgroundImage}
              cardDescription={card?.blogArticleDescription}
              cardCategory={card?.blogCategoryName}
              cardTitle={card?.blogArticleTitle}
            />
          ))}
        </ul>
      </div>
      <LoadMore totalPages={totalPages} currentPage={currentPage} handleLoadMore={handleLoadMore} />
    </div>
  );
};

export default withDatasourceCheck()(BlogPostList);
