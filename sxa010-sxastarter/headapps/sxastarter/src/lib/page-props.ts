import { DictionaryPhrases, ComponentPropsCollection, LayoutServiceData, SiteInfo, Page } from "@sitecore-content-sdk/nextjs";

/**
 * Sitecore page props
 */
export type SitecorePageProps = {
  page: Page | null;
  site: SiteInfo;
  locale: string;
  dictionary: DictionaryPhrases;
  componentProps: ComponentPropsCollection;
  notFound: boolean;
  layoutData: LayoutServiceData;
};
