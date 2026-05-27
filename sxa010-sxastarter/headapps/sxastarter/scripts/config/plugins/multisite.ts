import chalk from "chalk";
import { SiteInfoService, SiteInfo } from "@sitecore-content-sdk/nextjs";
import { createGraphQLClientFactory } from "lib/graphql-client-factory/create";
import { JssConfig } from "lib/config";
import { ConfigPlugin } from "..";

/**
 * This plugin will set the "sites" config prop.
 * By default this will attempt to fetch site information directly from Sitecore (using the GraphQLSiteInfoService).
 * You could easily modify this to fetch from another source such as a static JSON file instead.
 */
class MultisitePlugin implements ConfigPlugin {
  order = 11;

  async exec(config: JssConfig) {
    let sites: SiteInfo[] = [];
    console.log("Fetching site information");
    try {
      const siteInfoService = new SiteInfoService({
        clientFactory: createGraphQLClientFactory(config),
      });
      sites = await siteInfoService.fetchSiteInfo();
    } catch (error) {
      console.error(chalk.red("Error fetching site information"));
      console.error(error);
    }

    // Filter the sites array to a specific site
    const filteredSites = sites.filter((site) => site.name === config.sitecoreSiteName);

    return Object.assign({}, config, {
      sites: JSON.stringify(filteredSites),
    });
  }
}

export const multisitePlugin = new MultisitePlugin();
