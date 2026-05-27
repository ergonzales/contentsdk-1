import { SiteInfo } from "@sitecore-content-sdk/nextjs/site";
import scConfig from 'sitecore.config';
import { SiteResolverPlugin } from "..";

type MultisiteConfig = typeof scConfig & {
  sites?: string;
};

class MultisitePlugin implements SiteResolverPlugin {
  exec(sites: SiteInfo[]): SiteInfo[] {
    // Add preloaded sites when provided by config generation.
    const configuredSites = (scConfig as MultisiteConfig).sites;

    if (configuredSites) {
      sites.push(...(JSON.parse(configuredSites) as SiteInfo[]));
    }

    return sites;
  }
}

export const multisitePlugin = new MultisitePlugin();
