import { GetServerSidePropsContext, GetStaticPropsContext } from "next";
import { SiteInfo, LayoutServicePageState } from "@sitecore-content-sdk/nextjs";
import { EditingService, isDesignLibraryPreviewData } from "@sitecore-content-sdk/nextjs/editing";
import { SitecorePageProps } from "lib/page-props";
import { Plugin } from "..";
import { ComponentLayoutService } from "@sitecore-content-sdk/nextjs";
import { DesignLibraryMode } from "@sitecore-content-sdk/content/editing";
import { DictionaryService } from "@sitecore-content-sdk/content/i18n";
import clientFactory from "lib/graphql-client-factory";

const dictionaryService = new DictionaryService({
  clientFactory,
});
const editingService = new EditingService({ clientFactory });

function hasEditingOptions(obj: any): obj is { itemId: string; language: string; mode: string; version?: string; site?: string } {
  return obj && typeof obj === 'object' && !Array.isArray(obj) &&
    typeof obj.itemId === 'string' &&
    typeof obj.language === 'string' &&
    typeof obj.mode === 'string';
}

function toLayoutServicePageState(mode: string): LayoutServicePageState {
  switch (mode) {
    case "preview":
      return LayoutServicePageState.Preview;
    case "edit":
      return LayoutServicePageState.Edit;
    default:
      throw new Error(`Invalid mode for LayoutServicePageState: ${mode}`);
  }
}

class PreviewModePlugin implements Plugin {
  order = 1;

  async exec(props: SitecorePageProps, context: GetServerSidePropsContext | GetStaticPropsContext) {
    if (!context.preview) return props;

    if (isDesignLibraryPreviewData(context.previewData)) {
      const { itemId, componentUid, site, language, renderingId, dataSourceId, version } = context.previewData;

      const componentService = new ComponentLayoutService({
        contextId: site,
        edgeUrl: "https://edge-platform.sitecorecloud.io",
      });

      const componentData = await componentService.fetchComponentData({
        siteName: site,
        itemId,
        language,
        componentUid,
        renderingId,
        dataSourceId,
        version,
        mode: DesignLibraryMode.Normal,
      });

      if (!componentData) {
        throw new Error(`Unable to fetch editing data for preview ${JSON.stringify(context.previewData)}`);
      }

      const dictionaryData = await dictionaryService.fetchDictionaryData(language, site);

      props.locale = context.previewData.language;
      props.layoutData = componentData;
      props.dictionary = dictionaryData;

      return props;
    }

    // If we're in preview (editing) Chromes Edit Mode, use data already sent along with the editing request
    const pd = context.previewData;
    if (!hasEditingOptions(pd)) {
      throw new Error(`Invalid previewData for editing: ${JSON.stringify(context.previewData)}`);
    }
    const { itemId, language, version, site, mode } = pd;
    const layoutServiceMode = toLayoutServicePageState(mode);
    const { layoutData } = await editingService.fetchEditingData({ itemId, language, version, site, mode: layoutServiceMode });
    if (!layoutData) {
      throw new Error(`Unable to get editing data for preview ${JSON.stringify(context.previewData)}`);
    }
    const resolvedSite = layoutData.sitecore.context.site?.name || "default";
    const resolvedLanguage = layoutData.sitecore.context.language || "en";
    const dictionary = await dictionaryService.fetchDictionaryData(resolvedLanguage, resolvedSite);
    props.site = layoutData.sitecore.context.site as SiteInfo;
    props.locale = resolvedLanguage;
    props.layoutData = layoutData;
    props.dictionary = dictionary;

    return props;
  }
}

export const previewModePlugin = new PreviewModePlugin();
