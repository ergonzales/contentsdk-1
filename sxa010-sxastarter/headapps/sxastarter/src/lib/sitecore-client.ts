import { SitecoreClient } from '@sitecore-content-sdk/nextjs/client';
import scConfig from 'sitecore.config';
import { layoutServiceFactory } from 'lib/layout-service-factory';
import { dictionaryServiceFactory } from 'lib/dictionary-service-factory';
import { graphQLEditingService } from 'lib/graphql-editing-service';

const client = new SitecoreClient({
  ...scConfig,
  custom: {
    layoutService: layoutServiceFactory.create(scConfig.defaultSite),
    dictionaryService: dictionaryServiceFactory.create(scConfig.defaultSite),
    editingService: graphQLEditingService,
  },
});

export default client;
