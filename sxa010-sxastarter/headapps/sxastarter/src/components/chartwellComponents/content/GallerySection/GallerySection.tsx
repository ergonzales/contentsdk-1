import { JSX } from "react";
import { withDatasourceCheck } from "@sitecore-content-sdk/nextjs";
import { ComponentProps } from "lib/component-props";

import { Gallery } from "./Gallery";
type GallerySectionProps = ComponentProps & {
  sitecoreContext: {
    route: {
      placeholders: { [key: string]: any };
      fields: object[];
    };
  };
  fields: {
    data: {
      ds: {
        field: {
          targetItems: Array<any>;
        };
        videoId: { jsonValue: string };
        videos: { targetItems: Array<any> };
      };
    };
  };
};

const GallerySection = (props: GallerySectionProps): JSX.Element => {
  const DAMImages =
    props?.fields?.data?.ds?.field?.targetItems ||
    props?.sitecoreContext?.route?.placeholders?.["headless-main"]?.find((item: any) => item.componentName === "GallerySection")?.fields?.DAMImages ||
    [];
  return <Gallery DAMImages={DAMImages} />;
};

export default withDatasourceCheck()<GallerySectionProps>(GallerySection);
