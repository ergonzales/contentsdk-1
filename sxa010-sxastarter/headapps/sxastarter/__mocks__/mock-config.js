const config = {};
config.sitecoreApiKey = process.env.SITECORE_API_KEY || "no-api-key-set",
config.sitecoreApiHost = process.env.SITECORE_API_HOST || "",
config.jssAppName = process.env.JSS_APP_NAME || "sxastarter",
config.graphQLEndpointPath = process.env.GRAPH_QL_ENDPOINT_PATH || "/sitecore/api/graph/edge",
config.graphQLEndpoint = process.env.GRAPH_QL_ENDPOINT || `${config.sitecoreApiHost}${config.graphQLEndpointPath}`;
module.exports = config;