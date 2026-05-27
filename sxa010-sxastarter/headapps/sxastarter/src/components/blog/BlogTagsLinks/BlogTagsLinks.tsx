import Link from "next/link";
import { useRouter } from "next/router";

type Tag = {
  url?: string | { path: string };
  fields?: { TagTitle?: { value: string } };
  TagTitle?: { value: string };
  id?: string | number;
};

type BlogTagsLinksProps = {
  Tags: Tag[];
};

export const BlogTagsLinks = ({ Tags }: BlogTagsLinksProps) => {
  const { locale } = useRouter();

  const getTagUrl = (tag: Tag): string => {
    if (typeof tag.url === "string") return tag.url;
    if (tag.url && typeof tag.url === "object" && "path" in tag.url) return tag.url.path;
    return "#";
  };

  const getTagTitle = (tag: Tag): string => {
    return tag.TagTitle?.value || tag.fields?.TagTitle?.value || "";
  };

  return (
    <ul className="flex flex-wrap pb-[2rem] md:px-[2rem]">
      {Tags.map((tag, index) => (
        <li key={tag.id ?? index} className="mr-2">
          <Link href={getTagUrl(tag)} locale={locale} passHref className="text-ChartwellPlum hover:text-ChartwellBlue focus:text-ChartwellBlue duration-300 ease-in-out no-underline">
            {getTagTitle(tag)}
          </Link>
          {index < Tags.length - 1 && <span className="text-ChartwellPlum">,</span>}
        </li>
      ))}
    </ul>
  );
};
