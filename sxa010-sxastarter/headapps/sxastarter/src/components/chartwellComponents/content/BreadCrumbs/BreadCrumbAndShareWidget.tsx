import { JSX } from "react";
import { BreadCrumbs } from "./BreadCrumbs";
import { ShareButtons } from "../../../blog/shareButtons/shareButtons";
import { useSitecore } from "@sitecore-content-sdk/nextjs";

const BreadCrumbAndShareWidget = (): JSX.Element => {
  const { page } = useSitecore();
  const route = (page?.layout?.sitecore?.route || page?.layout?.sitecore?.context?.route) as any;
  const title: any = route?.fields?.Title;
  return (
    <div className="container mx-auto">
      <div className="md:flex items-center w-100 grow py-6">
        <div className=" grow">
          <BreadCrumbs style=" !p-2 md:p-0"></BreadCrumbs>
        </div>
        <ShareButtons subject={`${title.value}`} />
      </div>
    </div>
  );
};
export default BreadCrumbAndShareWidget;
