import { JSX } from "react";
import { Text as JssText, NextImage } from "@sitecore-content-sdk/nextjs";

const TitleDescription = (props: any): JSX.Element => {
  return (
    <div className="relative isolate overflow-hidden  w-full bg-transparent">
      <div className="relative isolate max-w-1800px mx-auto overflow-hidden px-6 py-12 text-center sm:px-2">
        <NextImage field={props.fields?.data?.ds?.resourceCategory?.targetItem?.icon?.jsonValue} className="block w-20 h-20 mx-auto mb-4" />
        <JssText field={props?.sitecoreContext?.route?.fields?.["Title"] || props.fields?.data?.ds?.resourceTitle} tag="h1" className="mx-auto field-title text-3xl xs:text-6xl " />
      </div>
    </div>
  );
};
export default TitleDescription;
