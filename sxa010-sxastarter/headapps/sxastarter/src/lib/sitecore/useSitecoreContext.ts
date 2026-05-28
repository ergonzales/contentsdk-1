import { useMemo } from "react";
import { useSitecore } from "@sitecore-content-sdk/nextjs";
import type { SitecoreContextValue, UseSitecoreContextResult } from "./types";

/**
 * Compatibility hook for legacy components during JSS -> Content SDK migration.
 * It preserves the old shape expected by components: { sitecoreContext }.
 */
export const useSitecoreContext = (): UseSitecoreContextResult => {
  const { page } = useSitecore();

  const layoutSitecore = page?.layout?.sitecore;
  const context = layoutSitecore?.context;
  const route = layoutSitecore?.route;

  const sitecoreContext = useMemo((): SitecoreContextValue => {
    const ctx = (context || {}) as SitecoreContextValue;
    const resolvedRoute = (route || ctx.route || {}) as Record<string, any>;
    return {
      ...ctx,
      route: resolvedRoute,
    };
  }, [context, route]);
  console.log(sitecoreContext);
  return { sitecoreContext };
};
