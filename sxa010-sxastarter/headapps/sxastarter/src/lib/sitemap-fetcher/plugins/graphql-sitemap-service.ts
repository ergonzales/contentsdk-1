import { StaticPath } from "@sitecore-content-sdk/nextjs";
import scConfig from 'sitecore.config';
import { SitemapFetcherPlugin } from "..";
import { GetStaticPathsContext } from "next";
import { siteResolver } from "lib/site-resolver";
import client from "lib/sitecore-client";

class GraphqlSitemapServicePlugin implements SitemapFetcherPlugin {
  async exec(context?: GetStaticPathsContext): Promise<StaticPath[]> {
    if (process.env.JSS_MODE?.toLowerCase() === "disconnected") {
      return [];
    }

    const sites = [...new Set(siteResolver.sites.map((site) => site.name))];
    const languages = process.env.EXPORT_MODE
      ? scConfig.defaultLanguage
        ? [scConfig.defaultLanguage]
        : undefined
      : context?.locales;
    const fetchOptions = typeof globalThis.fetch === "function" ? { fetch: globalThis.fetch.bind(globalThis) } : undefined;

    return client.getPagePaths(sites, languages, fetchOptions);
  }
}

export const graphqlSitemapServicePlugin = new GraphqlSitemapServicePlugin();
