/*
 * Represents the config shape consumed by GraphQL client factory helpers.
 */
export interface JssConfig extends Record<string, string | undefined> {
  sitecoreApiKey?: string;
  sitecoreApiHost?: string;
  sitecoreSiteName?: string;
  graphQLEndpointPath?: string;
  defaultLanguage?: string;
  graphQLEndpoint?: string;
  layoutServiceConfigurationName?: string;
  publicUrl?: string;
  sitecoreEdgeUrl?: string;
  sitecoreEdgeContextId?: string;
}
