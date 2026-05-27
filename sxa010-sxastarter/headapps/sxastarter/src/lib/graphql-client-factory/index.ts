import scConfig from "sitecore.config";
import { createGraphQLClientFactory } from "./create";

// The GraphQLRequestClientFactory serves as the central hub for executing GraphQL requests within the application

const config = {
	sitecoreApiKey: scConfig.api?.local?.apiKey || process.env.SITECORE_API_KEY || "",
	sitecoreApiHost: scConfig.api?.local?.apiHost || process.env.SITECORE_API_HOST || "",
	sitecoreSiteName: scConfig.defaultSite,
	graphQLEndpoint: process.env.GRAPH_QL_ENDPOINT || "/sitecore/api/graph/edge",
	defaultLanguage: scConfig.defaultLanguage,
	sitecoreEdgeUrl: scConfig.api?.edge?.edgeUrl || process.env.SITECORE_EDGE_URL,
	sitecoreEdgeContextId: scConfig.api?.edge?.contextId || process.env.SITECORE_EDGE_CONTEXT_ID || "",
};

// Create a new instance on each import call
export default createGraphQLClientFactory(config);
