import { SitecorePageProps } from "lib/page-props";
import { Plugin } from "..";

class ContentStylesPlugin implements Plugin {
  order = 2;

  async exec(props: SitecorePageProps) {
    // Styles are resolved in SitecoreStyles at render time.
    return props;
  }
}

export const contentStylesPlugin = new ContentStylesPlugin();
