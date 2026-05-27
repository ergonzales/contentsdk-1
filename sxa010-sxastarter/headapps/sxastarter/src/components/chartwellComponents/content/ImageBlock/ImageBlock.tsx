import { JSX } from "react";
import { Field, withDatasourceCheck, ImageField } from "@sitecore-content-sdk/nextjs";
import { ComponentProps } from "lib/component-props";

import { checkIsItPromo } from "lib/helpers/utils/checkIsItPromo";
import { NextImage } from "@sitecore-content-sdk/nextjs";
import { getBgColor } from "lib/helpers/layoutOption";
import { useSitecoreContext } from "lib/sitecore/useSitecoreContext";

type ImageBlockProps = ComponentProps & {
  fields: {
    "Desktop Image": ImageField;
    "Mobile Image": ImageField;
    "background color": Field<string>;
  };
};

const ImageBlock = (props: ImageBlockProps): JSX.Element => {
  const BgColorValue = props.fields && props.fields["background color"] && props.fields["background color"].value;
  const ImageDesktop = props?.fields?.["Desktop Image"]?.value;
  const ImageMobile = props?.fields?.["Mobile Image"]?.value;

  const { sitecoreContext } = useSitecoreContext();
  const AssignedPromotions = sitecoreContext && (sitecoreContext.route?.fields as any);

  const StartDate = AssignedPromotions["Assigned Promotions"] && AssignedPromotions["Assigned Promotions"].length && AssignedPromotions["Assigned Promotions"][0]?.fields?.StartDate?.value;
  const EndDate = AssignedPromotions["Assigned Promotions"] && AssignedPromotions["Assigned Promotions"].length && AssignedPromotions["Assigned Promotions"][0]?.fields?.EndDate?.value;

  const isPromo = checkIsItPromo(StartDate, EndDate);

  const COLORIZER = {
    blue: "lg:bg-ChartwellBlue-100",
    plum: "lg:bg-ChartwellPlu-100",
    white: "lg:bg-ChartwellWhite",
  };

  const BgColor = getBgColor(BgColorValue, COLORIZER);
  return isPromo ? (
    <div className={`w-full  my-8 ${BgColor}`}>
      <div className="ChartwellContainer  SectionPadding  py-0  ">
        <div className="w-full  h-[200px] relative hidden lg:block">
          <NextImage field={ImageDesktop} fill sizes="100vw" className="w-full h-full object-cover" />
        </div>
        <div className="w-full h-[200px] sm:h-[400px] md:h-[500px] relative block mx-auto lg:hidden">
          <NextImage field={ImageMobile} fill sizes="100vw" className="w-full h-full object-cover" />
        </div>
      </div>
    </div>
  ) : (
    <div></div>
  );
};

export default withDatasourceCheck()<ImageBlockProps>(ImageBlock);
