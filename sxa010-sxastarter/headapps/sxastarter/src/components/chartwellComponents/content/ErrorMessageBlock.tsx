import { JSX } from "react";
import { Field, withDatasourceCheck, RichText as JssRichText, LinkField } from "@sitecore-content-sdk/nextjs";
import { ComponentProps } from "lib/component-props";
import { HeadingLevel } from "../ui/HeadingLevel/HeadingLevel";
import { ChartwellLink } from "../ui/link/ChartwellLink";
import { HeaderSearchInput } from "../layout/header/search/HeaderSearchInput";

type ErrorMessageBlockProps = ComponentProps & {
  fields: {
    Heading: Field<string>;
    "Heading Level": Field<string>;
    Text: Field<string>;
    "CTA Link"?: LinkField;
    "CTA Text Link"?: Field<string>;
    "CTA Text Button"?: Field<string>;
    "Background image"?: Field<any>;
  };
};

const ErrorMessageBlock = (props: ErrorMessageBlockProps): JSX.Element => {
  const CTALink = props.fields["CTA Link"] !== undefined && props.fields["CTA Link"].value?.href;
  const CTATextLink = props.fields["CTA Text Link"] !== undefined && props.fields["CTA Text Link"].value;

  const backgroundImage = props.fields["Background image"] != undefined ? props.fields["Background image"].value : undefined;
  const bgStyle = backgroundImage ? { backgroundImage: "url(" + backgroundImage.src + ")" } : {};

  return (
    <div className="w-full bg-no-repeat bg-cover" style={bgStyle}>
      <div className="ChartwellContainer SectionPadding ">
        <HeadingLevel headingLevel={props.fields["Heading Level"]} titleText={props.fields.Heading} />
        {props.fields.Text && props.fields.Text.value && <JssRichText field={props.fields.Text} tag="div" />}
        <div className="w-full">
          <HeaderSearchInput stylesInput="mr-auto" stylesTitle="!hidden" stylesForm="md:flex items-center" stylesBTN="md:mt-0 md:ml-10" stylesWrapperForm="!items-start" />
        </div>
        {CTALink && CTALink.length !== 0 && (
          <ChartwellLink
            href={CTALink}
            textStyles={`!text-ChartwellBlue !hover:text-ChartwellBlue-100 !focus:text-ChartwellBlue-100 `}
            tailwindStyles={`mt-8 p-2 block !border-0 focus:bg-transparent hover:bg-transparent !p-0  !mt-6`}
            label={`${CTATextLink}`}
            linkId={props.fields["CTA Link"]?.value?.id as string}
          />
        )}
      </div>
    </div>
  );
};

export default withDatasourceCheck()<ErrorMessageBlockProps>(ErrorMessageBlock);
