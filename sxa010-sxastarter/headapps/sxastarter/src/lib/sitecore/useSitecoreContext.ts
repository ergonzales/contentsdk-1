import { useMemo } from "react";
import { useSitecore } from "@sitecore-content-sdk/nextjs";

/**
 * Compatibility hook for legacy components during JSS -> Content SDK migration.
 * It preserves the old shape expected by components: { sitecoreContext }.
 */
export const useSitecoreContext = () => {
  const { page } = useSitecore();

  const layoutSitecore = page?.layout?.sitecore;
  const context = layoutSitecore?.context;
  const route = layoutSitecore?.route;

  const sitecoreContext = useMemo(() => {
    const ctx = (context || {}) as Record<string, any>;
    const resolvedRoute = (route || ctx?.route || {}) as Record<string, any>;

    return {
      ...ctx,
      route: resolvedRoute,
    };
  }, [context, route]);

  return { sitecoreContext };
};
