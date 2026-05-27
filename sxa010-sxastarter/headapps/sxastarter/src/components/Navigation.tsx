import { JSX } from "react";
import { useEffect, useState, useCallback } from "react";
import ChartwellHeader from "./chartwellComponents/layout/header/ChartwellHeader";

import { fetchItemById } from "lib/helpers/helper";
import { useSitecoreContext } from "lib/sitecore/useSitecoreContext";

const dedupeNavChildren = (children: any[] = []) => {
  const seen = new Set<string>();
  return children.filter((child) => {
    const key = (child?.Id && `id:${child.Id}`) || (child?.Href && `href:${child.Href}`) || "";
    if (!key || seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
};

export const Default = (props: any): JSX.Element => {
  const { sitecoreContext } = useSitecoreContext();

  const parentNavItems = Object.values(props?.fields)?.filter((item: any) => item.NavigationFilter?.length === 0) ?? [];
  interface CorpNavData {
    corpDropItem?: { jsonValue: any };
  }

  const [corpNavData, setCorpNavData] = useState<CorpNavData | null>(null);

  //
  /**
   * Fetches corporate navigation drop items by making an asynchronous call to retrieve data
   * based on a specific item ID and the current language from the Sitecore context.
   *
   * If data is successfully fetched, it updates the corporate navigation state.
   *
   * Dependencies:
   * - `sitecoreContext?.language`: The current language context used for fetching the data.
   *
   * @async
   * @function fetchCorpNavItems
   * @returns {Promise<void>} A promise that resolves when the data is fetched and state is updated.
   *
   * {58E933CB-3A4F-48FE-868A-52D1EFB73898} -> /sitecore/content/sxastarter/sxastarter/Data/Shared Content/Property Shared Data/PropertyUtilityData
   */
  const fetchCorpNavItems = useCallback(async () => {
    const data = await fetchItemById("{58E933CB-3A4F-48FE-868A-52D1EFB73898}", sitecoreContext?.language as string, true);
    if (data) {
      setCorpNavData(data);
    }
  }, [sitecoreContext?.language]);

  useEffect(() => {
    fetchCorpNavItems();
  }, [fetchCorpNavItems]);

  const CorpNavDropItem = Array.isArray(corpNavData) ? corpNavData.find((item: any) => item?.name === "CorpDropItem")?.jsonValue ?? [] : [];

  if (CorpNavDropItem) {
    CorpNavDropItem.forEach((itm: any) => {
      const dropItem = Object.values(props?.fields ?? {}).find((item: any) => item.Id === itm?.fields?.DropItem?.id) || itm?.fields?.ExternalDropItem?.value;
      const parentItemDrop: any = parentNavItems?.find((item: any) => item.Id === itm?.fields?.ParentItemName?.id);

      if (parentItemDrop) {
        const navItemPos = itm?.fields["NavItemPos"]?.value ?? 0;
        const isDropItemPresent = dropItem.Id !== undefined;
        const isExternalDropItemPresent = !dropItem.Id;
        if (isDropItemPresent && !parentItemDrop.Children?.some((item: any) => item.Id === itm?.fields?.DropItem?.id)) {
          parentItemDrop.Children.splice(navItemPos, 0, dropItem);
        } else if (isExternalDropItemPresent && !parentItemDrop.Children?.some((item: any) => item.Href === itm?.fields?.ExternalDropItem?.value?.href)) {
          const navItem = {
            Id: "",
            Styles: "",
            Href: itm?.fields?.ExternalDropItem?.value?.href,
            Querystring: "",
            NavigationTitle: { value: itm?.fields?.ExternalDropItem?.value?.text },
            NavigationFilter: [],
            ItemLanguage: itm?.fields?.ItemLanguage?.value,
          };
          parentItemDrop.Children.splice(navItemPos, 0, navItem);
        }
      }
    });
  }

  /**
   * Filter out navigation items that have a NavigationFilter with a name of "Main Navigation"
   *
   * @param props - The props containing the fields.
   * @returns The filtered navigation items.
   */
  const filteredNavItems = parentNavItems
    .map((field: any) => {
      const { Children, ...rest } = field;
      const navigationFilters = Children?.filter(
        (child: any) =>
          !child?.NavigationFilter?.length || CorpNavDropItem?.some((item: any) => (item?.id ? item.fields?.DropItem?.id === child.Id : item.fields?.ExternalDropItem?.value?.href === child.Href))
      );
      return { ...rest, Children: navigationFilters };
    })
    .map((item: any) => {
      const filteredChildren = item.Children?.filter((child: any) => child.ItemLanguage === sitecoreContext.language || child.Id);
      return { ...item, Children: dedupeNavChildren(filteredChildren) };
    });
  const propsCopy: any = { ...props, fields: { ...filteredNavItems } };

  return (
    <>
      <ChartwellHeader navData={propsCopy} />
    </>
  );
};
