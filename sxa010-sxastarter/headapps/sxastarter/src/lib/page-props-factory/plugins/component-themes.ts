import { SitecorePageProps } from "lib/page-props";
import { Plugin } from "..";

class ComponentThemesPlugin implements Plugin {
  // Make sure to run this plugin after the personalization plugin, since it relies on the layout data
  order = 10;

  async exec(props: SitecorePageProps) {
    // Styles are resolved in SitecoreStyles at render time.
    return props;
  }
}

export const componentThemesPlugin = new ComponentThemesPlugin();
