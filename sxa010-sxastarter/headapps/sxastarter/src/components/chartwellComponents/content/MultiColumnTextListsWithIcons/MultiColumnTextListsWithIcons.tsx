import { JSX } from "react";
import { Field, NextImage, withDatasourceCheck } from "@sitecore-content-sdk/nextjs";
import { ComponentProps } from "lib/component-props";
import { HeadingLevel } from "../../ui/HeadingLevel/HeadingLevel";

type MultiColumnTextListsWithIconsProps = ComponentProps & {
  fields: {
    "Heading Level"?: Field<string>;
    Heading: Field<string>;
    ListOfItems?: Array<any>;
  };
};

const MultiColumnTextListsWithIcons = (props: MultiColumnTextListsWithIconsProps): JSX.Element => {
  return (
    <div className="ChartwellContainer SectionPadding ">
      <HeadingLevel headingLevel={props.fields?.["Heading Level"]} titleText={props.fields?.Heading} />
      <div className="">
        <ul className=" flex flex-wrap items-center justify-between md:grid  md:grid-cols-4 xl:grid-cols-5 gap-2 ">
          {props.fields?.ListOfItems &&
            props.fields.ListOfItems.length !== 0 &&
            props.fields.ListOfItems.map(({ fields }, index) => {
              return (
                <li key={index} className="flex   items-center   gap-4">
                  <NextImage field={fields?.CustomIcon} style={{ width: "20px", height: "20px" }} className="" />
                  <HeadingLevel headingLevel={fields?.["Heading Level"]} titleText={fields?.Heading} />
                </li>
              );
            })}
        </ul>
      </div>
    </div>
  );
};

export default withDatasourceCheck()<MultiColumnTextListsWithIconsProps>(MultiColumnTextListsWithIcons);
