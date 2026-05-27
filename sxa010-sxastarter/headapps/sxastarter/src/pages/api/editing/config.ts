import { EditingConfigMiddleware } from "@sitecore-content-sdk/nextjs/editing";
import metadata from "temp/metadata.json";
import { ComponentMap } from "@sitecore-content-sdk/react";
import { NextjsContentSdkComponent } from "@sitecore-content-sdk/nextjs";

/**
 * This Next.js API route is used by Sitecore editors (Pages) in XM Cloud
 * to determine feature compatibility and configuration.
 */

const handler = new EditingConfigMiddleware({
  components: new Map() as ComponentMap<NextjsContentSdkComponent>,
  metadata,
}).getHandler();

export default handler;
