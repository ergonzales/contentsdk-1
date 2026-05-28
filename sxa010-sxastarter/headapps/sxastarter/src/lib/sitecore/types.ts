import type { LayoutServicePageState } from "@sitecore-content-sdk/nextjs";

/**
 * JSS-era layout context shape used across Chartwell components.
 * Explicit fields so migration code type-checks (SDK LayoutServiceContext uses [key: string]: unknown).
 */
export interface SitecoreContextValue {
  route?: Record<string, any>;
  language?: string;
  itemPath?: string;
  itemId?: string;
  pageEditing?: boolean;
  pageState?: LayoutServicePageState;
  [key: string]: any;
}

export type UseSitecoreContextResult = {
  sitecoreContext: SitecoreContextValue;
};
