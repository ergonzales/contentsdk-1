import { JSX, useCallback, useMemo, useState, useEffect } from "react";
import { Field, withDatasourceCheck, LinkField, NextImage, RichText as JssRichText } from "@sitecore-content-sdk/nextjs";
import { ComponentProps } from "lib/component-props";
import { HeadingLevel } from "../../ui/HeadingLevel/HeadingLevel";
import { ChevronUpIcon } from "@heroicons/react/20/solid";

import { ChartwellLink } from "components/chartwellComponents/ui/link/ChartwellLink";

type AccordionGroupContainerProps = ComponentProps & {
  sitecoreContext: {
    route: {
      placeholders: { [key: string]: any };
      fields: object[];
    };
  };
  fields: {
    data: {
      ds: {
        faqHeaderLevel: { jsonValue: Field<string> };
        faqHeader: { jsonValue: Field<string> };
        imagesAreInclude: { boolValue: Field<boolean> };
        ctaLink: { jsonValue: LinkField };
        field: { targetItems: Array<any> };
        blockText: { jsonValue: Field<string> };
      };
    };
  };
};

const AccordionGroupContainer = (props: AccordionGroupContainerProps): JSX.Element => {
  const accordianGroupContainerPh = (props?.sitecoreContext?.route?.placeholders?.["headless-main"]?.find((item: any) => item.componentName === "AccordionGroupContainer") as any)?.fields; // Fallback to placeholder data if props data is missing
  const fallbackFAQs = accordianGroupContainerPh?.FAQS;

  const { targetItems: FAQs = fallbackFAQs } = props?.fields?.data?.ds?.field || {};
  const { target, href = "#", text = "", style = "", id = "" } = (props?.fields?.data?.ds?.ctaLink?.jsonValue?.value ?? accordianGroupContainerPh?.["CTA Link"]?.value) || {};
  const imagesIncluded = props?.fields?.data?.ds?.imagesAreInclude?.boolValue ?? (accordianGroupContainerPh?.ImagesAreInclude?.value as boolean) ?? false;
  // Memoize faqs and field value getter
  const faqs = useMemo(() => FAQs ?? [], [FAQs]);
  const getFieldValue = useCallback((fields: Record<string, any> | any[] | undefined, fieldName: string) => {
    if (!fields) return undefined;
    if (Array.isArray(fields)) {
      // Array of { name, ... }
      const found = fields.find((f) => f.name === fieldName);
      return found;
    }
    if (typeof fields === "object") {
      // Object with keys
      return fields[fieldName];
    }
    return undefined;
  }, []);

  // Only the first is open if imagesIncluded, otherwise all closed
  const [isOpenArray, setIsOpenArray] = useState<boolean[]>(() => faqs.map((_: any, idx: number) => (imagesIncluded ? idx === 0 : false)));

  // When faqs/imagesIncluded change, reset open state (useEffect avoids infinite re-render)
  useEffect(() => {
    setIsOpenArray(faqs.map((_: any, idx: number) => (imagesIncluded ? idx === 0 : false)));
  }, [faqs, imagesIncluded]);

  const handleCardClick = useCallback((e: React.MouseEvent<HTMLDivElement>, index: number) => {
    e.stopPropagation();
    setIsOpenArray((prev: boolean[]) => prev.map((open: boolean, i: number) => (i === index ? !open : false)));
  }, []);

  return (
    <div className="ChartwellContainer SectionPadding">
      <HeadingLevel
        headingLevel={props?.fields?.data?.ds?.faqHeaderLevel?.jsonValue ?? accordianGroupContainerPh?.["Heading Level"]}
        titleText={props?.fields?.data?.ds?.faqHeader?.jsonValue ?? accordianGroupContainerPh?.Header}
      />
      {(props?.fields?.data?.ds?.blockText?.jsonValue?.value || accordianGroupContainerPh?.BlockText?.value) && (
        <JssRichText field={props?.fields?.data?.ds?.blockText?.jsonValue || accordianGroupContainerPh?.BlockText} tag="div" className="mt-4 ChartwellText" />
      )}
      <div className={imagesIncluded ? "grid md:grid-cols-2 md:gap-16 items-center mt-8" : "mt-8"}>
        <div>
          <ul>
            {faqs?.map((faqItem: any, index: number) => {
              const faqFields = faqItem.fields;
              const isOpen = isOpenArray[index];
              const faqQuestion = getFieldValue(faqFields, "Question");
              const faqAnswer = getFieldValue(faqFields, "Answer");
              const faqImage = getFieldValue(faqFields, "Image");
              return (
                <li className={`mt-4 first:mt-0  overflow-hidden relative`} key={index}>
                  <div
                    onClick={(e) => handleCardClick(e, index)}
                    className={`hover:bg-ChartwellPlum focus:bg-ChartwellPlum rounded-b-md ease-in-out duration-300 group border-t cursor-pointer border-ChartwellPlum px-2 flex justify-between items-center ${
                      isOpen ? "bg-ChartwellPlum" : ""
                    }`}
                  >
                    <h3 className={`group-hover:text-ChartwellWhite group-focus:text-ChartwellWhite duration-1000 ease-in-out !text-[1.1rem] md:!text-[1.4rem] ${isOpen ? "text-ChartwellWhite" : ""}`}>
                      {faqQuestion?.jsonValue?.value ?? faqQuestion?.value}
                    </h3>
                    <button className="p-4" type="button" aria-label="Expand">
                      <ChevronUpIcon
                        className={`lg:w-[40px] lg:h-[50px] md:w-[30px] md:h-[50px] sm:w-[30px] sm:h-[40px] w-[20px] h-[30px] group-hover:fill-ChartwellWhite-200 group-focus:fill-ChartwellWhite-200 duration-800 ease-in-out fill-ChartwellGrey-100 ${
                          isOpen ? "fill-ChartwellWhite-200 rotate-0" : "rotate-180"
                        }`}
                      />
                    </button>
                  </div>
                  <div className={`ease-in-out duration-600 px-2 ${isOpen ? "opacity-100 translate-y-[0]" : "-z-10 absolute pointer-events-none opacity-0 translate-y-[-100%]"}`}>
                    <div dangerouslySetInnerHTML={{ __html: faqAnswer?.jsonValue?.value ?? faqAnswer?.value }} />
                    {imagesIncluded && (
                      <NextImage
                        key={index}
                        field={faqImage?.jsonValue ?? faqImage?.value}
                        height="300"
                        width="500"
                        className={` ${isOpenArray[index] ? "opacity-100" : "opacity-0"}  ease-in-out delay-300 duration-300  md:hidden my-4 mx-auto w-[300px]`}
                      />
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
          {href && href !== "#" && <ChartwellLink href={href} label={text} target={target} tailwindStyles={`!mt-2 block ${style}`} linkId={id as string} />}
        </div>
        {faqs && imagesIncluded && (
          <ul className="hidden md:block">
            <li>
              <div className="relative overflow-hidden">
                {faqs?.map((faqItem: any, index: number) => {
                  const faqFields = faqItem.fields;
                  const faqImage = getFieldValue(faqFields, "Image");
                  return faqImage ? (
                    <NextImage
                      key={index}
                      field={faqImage?.jsonValue ?? faqImage?.value}
                      height="300"
                      width="500"
                      className={`${isOpenArray[index] ? "opacity-100" : "absolute top-0 opacity-0"} duration-800 ease-in-out`}
                    />
                  ) : null;
                })}
              </div>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
};

export default withDatasourceCheck()<AccordionGroupContainerProps>(AccordionGroupContainer);
