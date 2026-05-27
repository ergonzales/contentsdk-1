import { JSX } from "react";
import { Field, withDatasourceCheck, RichText as JssRichText } from "@sitecore-content-sdk/nextjs";
import Button from "components/Common/Button";
import { useState } from "react";
import { ComponentProps } from "lib/component-props";
import { HeadingLevel } from "../../ui/HeadingLevel/HeadingLevel";
import { useI18n } from "next-localization";

type StaticGoogleMapProps = ComponentProps & {
  fields: {
    Heading: Field<string>;
    "Heading Level": Field<string>;
    BlockText: Field<string>;
    src: Field<string>;
  };
};

const StaticGoogleMap = (props: StaticGoogleMapProps): JSX.Element => {
  const { src } = props?.fields || {};
  const { t: dictionary } = useI18n();
  const [isActive, setIsActive] = useState(false);

  return (
    <>
      <div className="ChartwellContainer SectionPadding  z-0">
        <div className="flex flex-col md:grid grid-cols-7 gap-6 items-center">
          <div className={`w-full h-[450px]  xl:h-[620px] overflow-hidden relative${isActive ? " col-span-7" : " col-span-4 "}`}>
            {isActive && (
              <Button onClick={() => setIsActive(false)} type="button" additionalClass="absolute z-10 py-3 px-4 absolute  top-10 right-1/2 translate-x-1/2">
                <span className="uppercase">{dictionary("MapCloseCTA")}</span>
              </Button>
            )}
            {!isActive && (
              <div className="  absolute inset-0 z-10 bg-ChartwellGrey/40 flex items-center justify-center p-4 ">
                <Button onClick={() => setIsActive(true)} type="button" additionalClass="py-3 px-4 ">
                  <span className="uppercase">{dictionary("MapOpenCTA")}</span>
                </Button>
              </div>
            )}
            <iframe loading="lazy" title="Google Map" src={src?.value} className={`w-full h-full ${isActive ? "hidden" : "block"} ease-in-out  absolute`}></iframe>
            <iframe loading="lazy" title="Google Map" src={src?.value} className={`w-full h-full ${isActive ? " translate-x-0" : " -translate-x-full"} z-0 ease-in-out duration-300`}></iframe>
          </div>

          <div className={`col-span-3 ${isActive ? "md:hidden" : "md:block"} duration-400 ease-in-out`}>
            <HeadingLevel headingLevel={props.fields && props.fields["Heading Level"]} titleText={props.fields?.Heading} styles={" text-center mb-4 "} />
            <div className=" ">{props?.fields?.BlockText?.value && <JssRichText field={props.fields?.BlockText} tag="div" className="mt-4   ChartwellText " />}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default withDatasourceCheck()<StaticGoogleMapProps>(StaticGoogleMap);
