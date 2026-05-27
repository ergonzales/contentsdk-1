import { Field, LinkField, ImageField } from "@sitecore-content-sdk/nextjs";

export type Category = {
  name: Field<string>;
  image: ImageField;
  hoverImage: ImageField;
  url: LinkField;
};
