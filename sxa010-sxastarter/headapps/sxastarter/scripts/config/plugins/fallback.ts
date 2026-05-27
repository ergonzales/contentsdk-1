import { JssConfig } from 'lib/config';
import { ConfigPlugin } from '..';

const resolvePublicUrl = () => process.env.PUBLIC_URL || process.env.NEXT_PUBLIC_PUBLIC_URL || '';

/**
 * This config will set fallback values for properties that were left empty
 * If neither env, nor other places had a proper value, this will ensure a fallback is set
 */
class FallbackPlugin implements ConfigPlugin {
  // should always come last
  order = 100;

  async exec(config: JssConfig) {
    return Object.assign({}, config, {
      defaultLanguage: config.defaultLanguage || 'en',
      layoutServiceConfigurationName: config.layoutServiceConfigurationName || 'default',
      publicUrl: config.publicUrl || resolvePublicUrl(),
    });
  }
}

export const fallbackPlugin = new FallbackPlugin();
