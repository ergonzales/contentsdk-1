import React, { JSX, useEffect, useState } from "react";
import { NextImage, withDatasourceCheck } from "@sitecore-content-sdk/nextjs";
import { ComponentProps } from "lib/component-props";
import { HeadingLevel } from "../../ui/HeadingLevel/HeadingLevel";
import { ChartwellLink } from "components/chartwellComponents/ui/link/ChartwellLink";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { Listbox, ListboxButton, Transition } from "@headlessui/react";
import type { ImageField, ImageFieldValue } from "@sitecore-content-sdk/nextjs";
import { updateAnchorOffset } from "lib/helpers/helper";

type CareLevelSectionItem = {
  id: string;
  headingLevel: string;
  heading: string;
  description: string;
  anchorId: string;
  image: any;
  ctaStyle: string;
  ctaText: string;
  ctaTitle: string;
  ctaTarget: string;
  ctaLinkId: string;
  href: string;
};

type CareLevelSection = {
  careId: string;
  careLevel: {
    name: string;
    displayName: string;
    careService?: string;
    icon?: ImageField | ImageFieldValue;
  };
  items: CareLevelSectionItem[];
};

type CareItem = {
  id: string;
  fields: Array<any>;
};

export type TabbedTextImageProps = ComponentProps & {
  fields: {
    data: {
      ds: {
        listOfItems: {
          targetItems: CareItem[];
        };
      };
    };
  };
};

function extractFieldValue(fields: any, fieldName: string, fallback: any = ""): string {
  const field = fields?.find((x: any) => x.name === fieldName)?.jsonValue;
  const retValue = typeof field?.value === "string" && field?.value?.trim()?.length > 0 ? field.value : fallback;
  return retValue;
}

const getFieldOrFallback = (value: any, fallback: any): string => {
  return typeof value === "string" && value.trim().length > 0 ? value : fallback;
};

const formatCtaStyle = (style: string) => style.replace(/\s/g, "-");

const TabbedTextImage = (props: TabbedTextImageProps): JSX.Element => {
  // Move items initialization inside useMemo to avoid changing dependencies on every render
  const items = React.useMemo(() => props?.fields?.data?.ds?.listOfItems?.targetItems ?? [], [props?.fields?.data?.ds?.listOfItems?.targetItems]);

  useEffect(() => {
    updateAnchorOffset();
    const handleResize = () => updateAnchorOffset();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { careLevelSections, careLevel } = React.useMemo(() => {
    const careLevelSectionsMap = items.reduce((map, item) => {
      const filterNameField = item.fields?.find((field: any) => field.name === "FilterName")?.jsonValue;
      if (!filterNameField) return map;
      const careId = filterNameField.id;
      if (!map.has(careId)) {
        map.set(careId, {
          careId,
          careLevel: {
            name: filterNameField.name,
            displayName: filterNameField.displayName,
            careService: filterNameField.fields?.["Care Service"]?.value,
            icon: filterNameField.fields?.["Care Service Icon"]?.value,
          },
          items: [],
        });
      }
      const ctaLinkField = item.fields?.find((field: any) => field.name === "CTA Link")?.jsonValue?.value ?? {};
      const hasAnchor: boolean = !!(ctaLinkField?.anchor || item.fields?.find((field: any) => field.name === "AnchorID")?.jsonValue?.value);
      const anchorValue = ctaLinkField?.anchor || item.fields?.find((field: any) => field.name === "AnchorID")?.jsonValue?.value || "";
      const anchorLink = hasAnchor ? `${ctaLinkField?.href}#${anchorValue}` : `${ctaLinkField?.href}`;
      const computedItem: CareLevelSectionItem = {
        id: item.id,
        headingLevel: extractFieldValue(item.fields, "Heading Level"),
        heading: extractFieldValue(item.fields, "Heading"),
        description: extractFieldValue(item.fields, "Description"),
        anchorId: extractFieldValue(item.fields, "AnchorID"),
        image: item.fields?.find((x: any) => x.name === "Image")?.jsonValue,
        href: anchorLink,
        ctaStyle: formatCtaStyle(getFieldOrFallback(ctaLinkField.class ?? "plum on clear background", extractFieldValue(item.fields, "CTA Style"))),
        ctaText: getFieldOrFallback(extractFieldValue(item.fields, "CTA Text"), ctaLinkField.text ?? "Learn More"),
        ctaTitle: getFieldOrFallback(extractFieldValue(item.fields, "CTA Title"), ctaLinkField.title ?? "Learn More"),
        ctaTarget: getFieldOrFallback(ctaLinkField.target ?? "_self", extractFieldValue(item.fields, "CTA Target")),
        ctaLinkId: ctaLinkField.id ?? "",
      };
      map.get(careId)!.items.push(computedItem);
      return map;
    }, new Map<string, CareLevelSection>());
    const careLevelSections = Array.from(careLevelSectionsMap.values());
    const careLevel = careLevelSections.map((section) => ({
      id: section.careId,
      label: section.careLevel.careService || section.careLevel.displayName || section.careLevel.name || "",
      icon: section.careLevel.icon,
    }));
    return { careLevelSections, careLevel };
  }, [items]);

  const [currentCareLevelId, setCurrentCareLevelId] = useState<string>(careLevel[0]?.id ?? "");
  const currentCareLevel = careLevel.find((cl) => cl.id === currentCareLevelId) ?? careLevel[0];
  const currentCareLevelSection = careLevelSections.find((section) => section.careId === currentCareLevelId);

  // Extracted filter components for clarity
  const DesktopFilter = () => (
    <ul className="hidden lg:flex items-center justify-center mx-auto gap-2">
      {careLevel.map((careLevel) => (
        <li
          key={careLevel.id}
          onClick={() => setCurrentCareLevelId(careLevel.id)}
          className={`border border-ChartwellPlum cursor-pointer duration-300 ease-in-out rounded-xl text-ChartwellPlum font-medium flex items-center p-2 md:px-3 py-2  ${
            currentCareLevelId === careLevel.id ? "bg-ChartwellPlum text-white outline-ChartwellPlum" : "md:hover:bg-ChartwellPlum/20 md:hover:scale-105 bg-ChartwellWhite"
          }`}
        >
          <div className="flex items-center gap-2 relative">
            <NextImage field={careLevel.icon} width={24} height={24} className="object-contain" />
            <span className="flex gap-2 items-center font-semibold text-[0.85rem] md:text-[0.9rem]">{careLevel?.label}</span>
          </div>
        </li>
      ))}
    </ul>
  );

  const MobileFilter = () => (
    <div className="lg:hidden">
      <Listbox
        value={currentCareLevel?.label}
        onChange={(label: string) => {
          const selected = careLevel.find((cl) => cl.label === label);
          if (selected) setCurrentCareLevelId(selected.id);
        }}
      >
        {({ open }: { open: boolean }) => (
          <div className="relative mt-2">
            <ListboxButton className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-ChartwellGrey text-sm">
              <div className="flex items-center gap-2 relative">
                <NextImage field={currentCareLevel?.icon} width={24} height={24} className="object-contain" />
                <span className="block">{currentCareLevel?.label}</span>
              </div>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon aria-hidden="true" className="w-5 text-gray-400" />
              </span>
            </ListboxButton>
            <Transition show={open} as={React.Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
              <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm" role="listbox">
                {careLevel.map((careLevel) => {
                  const isSelected = careLevel?.label === currentCareLevel?.label;
                  return (
                    <li
                      key={careLevel.id}
                      role="option"
                      aria-selected={isSelected}
                      tabIndex={0}
                      onClick={() => setCurrentCareLevelId(careLevel.id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          setCurrentCareLevelId(careLevel.id);
                        }
                      }}
                      className={`group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 ${isSelected ? "bg-ChartwellBlue text-white" : ""} focus:bg-indigo-600 focus:text-white`}
                    >
                      <div className="flex items-center gap-2 relative">
                        <NextImage field={careLevel.icon} width={24} height={24} className="object-contain" />
                        <span className="block truncate font-normal">{careLevel?.label}</span>
                      </div>
                      {isSelected && (
                        <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600 group-data-[focus]:text-white">
                          <CheckIcon aria-hidden="true" className="size-5" />
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </Transition>
          </div>
        )}
      </Listbox>
    </div>
  );

  return (
    <div className="w-full bg-ChartwellGrey-10 relative">
      <div className="ChartwellContainer SectionPadding">
        <DesktopFilter />
        <MobileFilter />
        <div>
          {currentCareLevelSection?.items?.map((currentItem, index) => {
            const { ctaLinkId, ctaStyle, ctaText, ctaTitle, ctaTarget, href, id, headingLevel, heading, description, image } = currentItem;
            return (
              <div key={id} className="first:mt-6 first:md:mt-8 mt-12 md:mt-16 flex flex-col md:grid grid-cols-2 items-center gap-6 md:gap-8">
                <div className="md:basis-1/2 p-2 flex flex-col justify-between">
                  <HeadingLevel headingLevel={{ value: headingLevel }} titleText={{ value: heading }} />
                  <div dangerouslySetInnerHTML={{ __html: description }} />
                  {typeof href === "string" && href.length > 0 && (
                    <ChartwellLink href={href} label={ctaText} target={ctaTarget} ariaLabel={ctaTitle} tailwindStyles={`block !md:mt-0 ${ctaStyle} !px-16  mx-auto lg:mx-0`} linkId={ctaLinkId ?? ""} />
                  )}
                </div>
                <div className={`p-2 flex-1 md:basis-1/2 ${index % 2 === 0 ? "lg:order-last" : "lg:order-first"}`}>
                  <NextImage width={300} height={300} className="w-full h-full object-cover" field={image} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default withDatasourceCheck()<TabbedTextImageProps>(TabbedTextImage);
