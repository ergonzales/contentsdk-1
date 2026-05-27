import { NextImage, withDatasourceCheck, Field, ImageField, ComponentRendering } from "@sitecore-content-sdk/nextjs";
import { ChartwellLink } from "components/chartwellComponents/ui/link/ChartwellLink";
import { useMemo, JSX } from "react";
import { HeadingLevel } from "../../ui/HeadingLevel/HeadingLevel";

interface IconCardItem {
  headingLevel?: Field<string>;
  heading: Field<string>;
  customIcon?: {
    jsonValue?: {
      value?: ImageField;
    };
  };
  description?: Field<string>;
  ctaLink?: {
    id?: string;
    url?: string;
    text?: string;
    target?: string;
  };
  ctaText?: Field<string>;
  ctaTarget?: Field<string>;
  ctaStyle?: Field<string>;
}

interface IconCardGridFields {
  iconCardGridHeadingLevel?: Field<string>;
  iconCardGridHeading: Field<string>;
  listOfItems?: {
    targetItems?: IconCardItem[];
  };
}

interface IconCardGridProps {
  rendering: ComponentRendering;
  fields?: {
    data?: {
      item?: IconCardGridFields;
    };
  };
}

const IconCardGrid = (props: IconCardGridProps): JSX.Element => {
  const items = useMemo(() => {
    return props.fields?.data?.item?.listOfItems?.targetItems || [];
  }, [props.fields?.data?.item?.listOfItems?.targetItems]);

  const heading = props.fields?.data?.item?.iconCardGridHeading;
  const headingLevel = props.fields?.data?.item?.iconCardGridHeadingLevel;

  return (
    <div className="ChartwellContainer SectionPadding ">
      {heading && <HeadingLevel headingLevel={headingLevel} titleText={heading} />}
      <div className="md:flex justify-center md:p-6">
        <ul className="grid md:grid-cols-2 gap-10">
          {items.length > 0 &&
            items.map((item: IconCardItem, index: number) => {
              const CTAStyle = (item?.ctaStyle?.value || "plum on clear background").replace(/\s/g, "-");
              const ctaUrl = item?.ctaLink?.url || "#";
              return (
                <li key={index} className="py-6 md:py-8 md:px-2 flex flex-col justify-between">
                  {item.heading && <HeadingLevel headingLevel={item.headingLevel} titleText={item.heading} />}
                  <div className="md:flex gap-6 items-center mt-4">
                    <NextImage field={item?.customIcon?.jsonValue?.value} width={100} height={100} style={{ width: "100px", height: "100px" }} className="mx-auto my-6 md:my-0 md:mx-0" />
                    <div dangerouslySetInnerHTML={{ __html: item?.description?.value || "" }} />
                  </div>
                  <div className="flex items-end justify-center md:justify-start">
                    <ChartwellLink href={ctaUrl} label={item?.ctaText?.value || ""} target={item?.ctaTarget?.value || "_self"} tailwindStyles={`block !md:mt-0 ${CTAStyle} !px-16`} />
                  </div>
                </li>
              );
            })}
        </ul>
      </div>
    </div>
  );
};

export default withDatasourceCheck()(IconCardGrid);
