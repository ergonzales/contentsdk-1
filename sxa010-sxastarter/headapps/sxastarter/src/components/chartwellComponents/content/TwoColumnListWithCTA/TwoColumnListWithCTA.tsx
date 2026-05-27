import { JSX } from "react";
import { Field, withDatasourceCheck } from "@sitecore-content-sdk/nextjs";
import { ComponentProps } from "lib/component-props";
import { ChartwellLink } from "components/chartwellComponents/ui/link/ChartwellLink";
import { HeadingLevel } from "../../ui/HeadingLevel/HeadingLevel";

type TwoColumnListWithCTAProps = ComponentProps & {
  fields: {
    "Heading Level"?: Field<string>;
    Heading: Field<string>;
    MultiContainer?: Array<any>;
  };
};

const TwoColumnListWithCTA = (props: TwoColumnListWithCTAProps): JSX.Element => {
  return (
    <div className="ChartwellContainer SectionPadding ">
      <HeadingLevel headingLevel={props.fields?.["Heading Level"]} titleText={props.fields?.Heading} />
      <ul className="md:mt-6">
        {props.fields?.MultiContainer &&
          props.fields.MultiContainer.length !== 0 &&
          props.fields.MultiContainer.map(({ fields }, index) => {
            const CTAStyle = (fields?.["CTA Style"]?.value !== undefined ? fields?.["CTA Style"]?.value : "plum on clear background").replace().replace(/\s/g, "-");

            return (
              <li key={index} className="md:flex items-center   py-12 border-b border-ChartwellPlum md:px-8">
                <div className="md:w-[60%]">
                  <HeadingLevel headingLevel={fields?.["Heading Level"]} titleText={fields?.title} />
                  <div className="text-ChartwellGrey " dangerouslySetInnerHTML={{ __html: fields?.["image description"]?.value }} />
                </div>
                <div className=" flex justify-center md:block md:ml-auto">
                  <ChartwellLink
                    href={fields?.["CTA Link"]?.value?.href}
                    label={`${fields?.["CTA Text"]?.value}`}
                    target={`${fields?.["CTA Target"]?.value || "_self"}`}
                    tailwindStyles={`block !md:mt-0 ${CTAStyle} !px-16`}
                    linkId={fields?.["CTA Link"]?.value?.id || ""}
                  />
                </div>
              </li>
            );
          })}
      </ul>
    </div>
  );
};

export default withDatasourceCheck()<TwoColumnListWithCTAProps>(TwoColumnListWithCTA);
