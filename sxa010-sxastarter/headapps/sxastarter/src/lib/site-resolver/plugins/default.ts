import { SiteInfo } from "@sitecore-content-sdk/nextjs/site";
import scConfig from "sitecore.config";
import { SiteResolverPlugin } from "..";

class DefaultPlugin implements SiteResolverPlugin {
  exec(sites: SiteInfo[]): SiteInfo[] {
    // Add default/configured site
    sites.unshift({
      name: scConfig.defaultSite || "default",
      language: scConfig.defaultLanguage,
      hostName: "*",
    });

    return sites;
  }
}

export const defaultPlugin = new DefaultPlugin();
