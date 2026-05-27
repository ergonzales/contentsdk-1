import { generateComponentBuilder } from '@sitecore-jss/sitecore-jss-dev-tools/nextjs';
import fs from 'fs';
import path from 'path';
import {
  ComponentBuilderPluginConfig,
  ComponentBuilderPlugin as ComponentBuilderPluginType,
} from '..';

const LEGACY_IMPORT_REGEX = /import\s*\{\s*ComponentBuilder\s*\}\s*from\s*['"]@sitecore-jss\/sitecore-jss-nextjs['"];?\r?\n\r?\n?/g;
const LEGACY_EXPORTS_REGEX = /export const componentBuilder = new ComponentBuilder\(\{ components \}\);\r?\n\r?\nexport const moduleFactory = componentBuilder\.getModuleFactory\(\);/g;
const SDK_V2_EXPORT = 'export const moduleFactory = components;';

/**
 * Generates the component builder file.
 */
class ComponentBuilderPlugin implements ComponentBuilderPluginType {
  order = 9999;

  exec(config: ComponentBuilderPluginConfig) {
    generateComponentBuilder(config);

    const componentBuilderPath = path.resolve(process.cwd(), 'src/temp/componentBuilder.ts');
    if (fs.existsSync(componentBuilderPath)) {
      const source = fs.readFileSync(componentBuilderPath, 'utf8');
      const updated = source.replace(LEGACY_IMPORT_REGEX, '').replace(LEGACY_EXPORTS_REGEX, SDK_V2_EXPORT);

      if (updated !== source) {
        fs.writeFileSync(componentBuilderPath, updated, 'utf8');
      }
    }

    return config;
  }
}

export const componentBuilderPlugin = new ComponentBuilderPlugin();
