export type BlogQueryList = {
  blogList: BlogArticleItem[];
  endCursor: string;
  hasNext: boolean;
};

export type BlogCard = {
  Heading: string;
  CardText: string;
};
export type blogCategory = {
  categoryName: string;
  categoryUrl: string;
};
export type BlogArticleItem = {
  BlogTitle: string;
  BlogNavigationTitle: string;
  BlogContent: string;
  BlogBackgroundImage: string;
  BlogSecondContentBlock: string;
  BlogAuthorInfo: string;
  BlogDisplayAuthorInfo: string;
  BlogCardsList: BlogCard[];
  BlogCategory: blogCategory;

  BlogPostUrl: string;
  CategoryUrl: string;
};
