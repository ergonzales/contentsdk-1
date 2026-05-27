import { JSX, useMemo } from "react";
import { withDatasourceCheck } from "@sitecore-content-sdk/nextjs";
import { BreadCrumbs } from "components/chartwellComponents/content/BreadCrumbs/BreadCrumbs";
import { ShareButtons } from "./shareButtons/shareButtons";
import useBackGroundPosition from "components/chartwellComponents/customHooks/backGroundPosition";

type Field = {
  name: string;
  jsonValue?: any;
};

const extractFields = (fields: Field[] = []): Record<string, any> => {
  const result: Record<string, any> = {};
  for (const field of fields) {
    if (field?.name) {
      result[field.name] = field.jsonValue || [];
    }
  }
  return result;
};

const BlogPostListByAuthor = (props: any): JSX.Element => {
  const authorFields = useMemo(() => {
    const fieldsArr = props?.fields?.data?.ci?.author?.info?.[0]?.fields ?? props.fields?.data?.ci?.author?.authorInfo?.[0]?.fields ?? [];
    return extractFields(Array.isArray(fieldsArr) ? fieldsArr : []);
  }, [props.fields]);

  const BgPosition = authorFields["Author Image background position"]?.value ?? props.fields?.data?.ci?.authorBkgImgPos?.value;
  const styleBackGroundPosition = useBackGroundPosition(BgPosition);
  const bkgImage = authorFields["BackgroundImage"]?.value?.src ?? props.fields?.data?.ci?.author?.authorInfo?.[0]?.fields?.BackgroundImage?.value?.src;
  const authorInfo = authorFields["Content"]?.value ?? props.fields?.data?.ci?.author?.authorInfo?.[0]?.fields?.["Content"]?.value;
  const authorPageHeading = authorFields["Page Heading"]?.value ?? props.fields?.data?.ci?.author?.authorInfo?.[0]?.fields?.["Page Heading"]?.value;

  const styles = useMemo(
    () => ({
      heroSection: {
        backgroundImage: bkgImage ? `url(${bkgImage})` : undefined,
      },
    }),
    [bkgImage]
  );

  return (
    <div className="w-full">
      <div className="relative w-full">
        <div className="max-w-7xl mx-auto px-4 pb-0">
          <div className="border-b border-ChartwellPlum">
            <div className={`heroSection max-h-300px md:max-h-400px lg:max-h-600px bg-no-repeat ${styleBackGroundPosition}`} style={styles.heroSection}></div>
            <div className="md:flex items-end w-100 grow py-6">
              <div className="grow">
                <BreadCrumbs style="!p-2 md:p-0" />
              </div>
              <ShareButtons />
            </div>
            <div className="my-8 md:my-[4rem] p-0">
              <h1 className="py-[0rem] md:px-[6rem]">{authorPageHeading}</h1>
              <div className="py-[2rem] md:px-[6rem]" dangerouslySetInnerHTML={{ __html: authorInfo }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withDatasourceCheck()(BlogPostListByAuthor);
