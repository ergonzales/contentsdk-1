import { EditingService } from "@sitecore-content-sdk/nextjs/editing";
import clientFactory from "lib/graphql-client-factory";

/**
 * GraphQL Editing Service instance. Used to fetch editing data in Pages preview (editing) Metadata Edit Mode.
 */
export const graphQLEditingService = new EditingService({
  clientFactory,
});
