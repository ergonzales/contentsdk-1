import { useSitecore } from "@sitecore-content-sdk/nextjs";

/**
 * Compatibility hook for legacy components during JSS -> Content SDK migration.
 * It preserves the old shape expected by components: { sitecoreContext }.
 */
export const useSitecoreContext = () => {
  const { page } = useSitecore();

  const context = (page?.layout?.sitecore?.context || {}) as Record<string, any>;
  const route = context?.route || (page?.layout?.sitecore?.route as Record<string, any>) || {};

  return {
    sitecoreContext: {
      ...context,
      route,
    } as any,
  };
};
