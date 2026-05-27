import { JSX, useEffect, useState, useMemo } from "react";
import { withDatasourceCheck } from "@sitecore-content-sdk/nextjs";
import { ComponentProps } from "lib/component-props";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
import { getLinkTarget } from "lib/helpers/utils/targetLink";
import NextLink from "next/link"; // ✅ avoid name clash with our type
import { fetchItemById } from "lib/helpers/helper";
import { HeadingLevel } from "../../ui/HeadingLevel/HeadingLevel";

type ListOfHyperlinksProps = ComponentProps & {
  fields: {
    data: { ci: any; ds: any };
  };
  sitecoreContext?: any;
};

// --- Types for links coming from Sitecore + our edits
type LinkFieldJson = {
  value?: {
    href?: string;
    text?: string;
    target?: string;
    [k: string]: unknown;
  };
  [k: string]: unknown;
};

type LinkItem = {
  dataHolderItemId: string;
  field?: {
    targetItem?: any | null;
    jsonValue?: LinkFieldJson;
    [k: string]: unknown;
  };
};

// --- Helper to fetch CTA Link field for a given id/language
const fetchCtaLinkField = async (id: string, lang: string) => {
  const res = await fetchItemById(id, lang, false);
  return Array.isArray(res) ? res.find((item: any) => item?.name === "CTA Link") : undefined;
};

// --- Helper to fill missing targetItem by fetching fallback language CTA Link
const fillMissingTargets = async (src: LinkItem[], fallbackLanguage: string): Promise<LinkItem[]> => {
  return Promise.all(
    src.map(async (link): Promise<LinkItem> => {
      if (link?.field?.targetItem || !link?.dataHolderItemId) return link;
      try {
        const ctaField = await fetchCtaLinkField(link.dataHolderItemId, fallbackLanguage);
        const correctHref = ctaField?.jsonValue?.value?.href;
        return {
          ...link,
          field: {
            ...(link.field ?? {}),
            targetItem: link.field?.targetItem ?? null,
            jsonValue: {
              ...(link.field?.jsonValue ?? {}),
              value: {
                ...(link.field?.jsonValue?.value ?? {}),
                ...(correctHref && { href: correctHref }),
              },
            },
          },
        };
      } catch (e) {
        console.error(`Failed to fetch target for ${link.dataHolderItemId}`, e);
        return link;
      }
    })
  );
};

const ListOfHyperlinks = (props: ListOfHyperlinksProps): JSX.Element => {
  const { ds = {}, ci } = props.fields?.data || {};
  const language = props?.sitecoreContext?.language as string | undefined;
  const oppositeLanguage = useMemo(() => (language === "en" ? "fr" : "en"), [language]);
  const links = useMemo(() => (ds?.links?.targetItems as LinkItem[]) ?? [], [ds?.links?.targetItems]);
  const [filteredLinks, setFilteredLinks] = useState<LinkItem[]>([]);

  useEffect(() => {
    let isMounted = true;
    if (!links.length) {
      setFilteredLinks([]);
      return;
    }
    fillMissingTargets(links, oppositeLanguage).then((result) => {
      if (isMounted) setFilteredLinks(result);
    });
    return () => {
      isMounted = false;
    };
  }, [links, oppositeLanguage]);

  return (
    <div className="ChartwellContainer SectionPadding">
      <HeadingLevel headingLevel={ci?.headingLevel?.jsonValue} styles="mb-2 mb-8" titleText={ci?.heading?.jsonValue} />
      <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filteredLinks.map((item, index) => {
          const itemLocale = language !== item.field?.targetItem?.language?.name ? oppositeLanguage : item.field?.targetItem?.language?.name;
          const { target, href = "#", text = "" } = item.field?.jsonValue?.value || {};
          return (
            <li key={item.dataHolderItemId ?? index}>
              <NextLink
                locale={itemLocale}
                target={getLinkTarget(target)}
                className="no-underline hover:underline decoration-ChartwellBlue flex items-center group duration-300 text-ChartwellBlue ease-in-out p-2"
                href={href}
              >
                <span>{text}</span>
                <ChevronRightIcon className="w-6 group-hover:translate-x-2 duration-300 text-ChartwellBlue ease-in-out" />
              </NextLink>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default withDatasourceCheck()<ListOfHyperlinksProps>(ListOfHyperlinks);
