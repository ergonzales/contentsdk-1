import { JSX } from "react";
import { Field, withDatasourceCheck, LinkField } from "@sitecore-content-sdk/nextjs";
import { ComponentProps } from "lib/component-props";
import { ChartwellLink } from "components/chartwellComponents/ui/link/ChartwellLink";
import useBackGroundPosition from "../../customHooks/backGroundPosition";

type ImageSizeControlBlockProps = ComponentProps & {
  fields: {
    Desc: Field<string>;
    BackgroundImage?: Field<any>;
    "CTA text": Field<string>;
    "CTA Link": LinkField;
    ["CTA Style"]: Field<string>;
    ["CTA Target"]?: Field<string>;
    ["Background Position"]: Field<string>;
    borderColor: Field<string>;
  };
};

const ImageSizeControlBlock = (props: ImageSizeControlBlockProps): JSX.Element => {
  const backgroundImage = props.fields?.BackgroundImage != undefined ? props.fields.BackgroundImage.value : undefined;
  const bgStyle = backgroundImage ? { backgroundImage: "url(" + backgroundImage.src + ")", minHeight: `${backgroundImage.height + "px"}` } : {};
  const Desc = props?.fields?.Desc.value;
  const CTATarget = props.fields && props.fields["CTA Target"] && props.fields["CTA Target"]?.value;
  const CTAText = props.fields && props?.fields["CTA text"]?.value;
  const CTALink = props.fields && props?.fields["CTA Link"]?.value.href;
  const CTAStyle = (props.fields && props.fields["CTA Style"] != undefined && props.fields["CTA Style"].value != undefined ? props.fields["CTA Style"].value : "plum on clear background").replace(
    /\s/g,
    "-"
  );

  const BgPosition = props.fields && props.fields["Background Position"]?.value;
  const styleBackGroundPosition = useBackGroundPosition(BgPosition);
  const getBorderColor = (value: string) => {
    switch (value) {
      case "plum":
        return "border-4 border-ChartwellPlum";
      case "white":
        return "border-4 border-ChartwellWhite";
      case "blue":
        return "border-4 text-ChartwellBlue";
      case "none":
        return "";
      default:
        return "border-4 border-ChartwellPlum";
    }
  };
  const borderColor = getBorderColor(props?.fields?.borderColor?.value);
  return (
    <div className={`ChartwellContainer SectionPadding  `}>
      <div className={`bg-no-repeat bg-cover ${borderColor} ${styleBackGroundPosition} flex justify-center items-center flex-col`} style={bgStyle}>
        <div className="p-2" dangerouslySetInnerHTML={{ __html: `${Desc}` }}></div>
        {CTALink && CTALink.length !== 0 && (
          <ChartwellLink href={CTALink} label={`${CTAText}`} target={`${CTATarget}`} tailwindStyles={`${CTAStyle} !mx-4 !mb-2  `} linkId={props?.fields["CTA Link"]?.value?.id as string} />
        )}
      </div>
    </div>
  );
};

export default withDatasourceCheck()<ImageSizeControlBlockProps>(ImageSizeControlBlock);
