import { JSX } from "react";
import { Field, withDatasourceCheck, useSitecore } from "@sitecore-content-sdk/nextjs";
import { ComponentProps } from "lib/component-props";
import { useEffect, useState, useRef } from "react";
import { EllipsisHorizontalCircleIcon } from "@heroicons/react/24/solid";
import { checkIsItPromo } from "lib/helpers/utils/checkIsItPromo";
type AnchorLinksProps = ComponentProps & {
  fields: {
    "CTA Texts": Field<string>;
    Title: Field<string>;
    "Divider top": Field<boolean>;
  };
};

const AnchorLinks = (props: AnchorLinksProps): JSX.Element => {
  const { page } = useSitecore();
  const sitecoreContext = page?.layout?.sitecore?.context || {};
  const route = sitecoreContext?.route as { placeholders?: Record<string, any[]>; itemLanguage?: string } | undefined;
  const Links = (props?.fields && props?.fields?.["CTA Texts"]?.value?.split(",")) || [];
  const Title = props?.fields?.Title?.value || "";
  const borderPosition = props?.fields && props?.fields?.["Divider top"]?.value ? "border-t " : "border-b";
  const [heights, setHeights] = useState(0);
  const [marginForAnchorLinks, setMarginForAnchorLinks] = useState(0);
  const [anchorLinksPosition, setAnchorLinksPosition] = useState(0);
  const [isHidden, setIsHidden] = useState(false);
  const [isClick, setIsClick] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const contextPlaceHolders = route?.placeholders || {};
  const alterNateNode = contextPlaceHolders["headless-sticky-banner"]?.find((rendering: any) => rendering?.componentName === "StickyPromoBanner");

  const { dsEN, dsFR } = alterNateNode?.fields?.data || {};
  // Pick dsEN or dsFR based on locale
  const dsLocale = route?.itemLanguage === "fr" ? dsFR : dsEN;

  const StartDate = dsLocale?.stickyPromoBannerStartDate.jsonValue.value || alterNateNode?.fields?.StarDate?.value;
  const EndDate = dsLocale?.stickyPromoBannerEndDate.jsonValue.value || alterNateNode?.fields?.EndDate?.value;

  const IsItValidDate = checkIsItPromo(StartDate, EndDate);

  useEffect(() => {
    const headerEl = document.getElementById("ChartwellHeader");

    const StickyPromoBannerEl = IsItValidDate && document.getElementById("StickyPromoBanner");

    const AnchorLinksEl = document.getElementById("AnchorLinks");

    const headerHeight = (headerEl as HTMLElement)?.offsetHeight || 0;
    const StickyPromoBannerHeight = (StickyPromoBannerEl as HTMLElement)?.offsetHeight || 0;
    const AnchorLinksElHeight = (AnchorLinksEl as HTMLElement)?.offsetHeight || 0;

    const heights = headerHeight + StickyPromoBannerHeight + AnchorLinksElHeight;
    const marginForAnchorLinks = headerHeight + StickyPromoBannerHeight;

    setHeights(heights);

    setMarginForAnchorLinks(marginForAnchorLinks);
  }, [IsItValidDate, marginForAnchorLinks]);

  useEffect(() => {
    const rect = ref?.current?.getBoundingClientRect().top || 0;
    setAnchorLinksPosition(rect - rect * 0.5);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const rect = ref?.current?.getBoundingClientRect().top || 0;
      const isDesktop = window.innerWidth >= 1024;

      if (!isDesktop) {
        if (rect === marginForAnchorLinks && !isClick) {
          setIsHidden(true);
        }

        if (rect >= anchorLinksPosition) {
          setIsHidden(false);
        }
      }

      if (isClick) {
        setIsClick(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [anchorLinksPosition, isClick, marginForAnchorLinks]);

  const scrollTo = (id: string, offSet: number) => {
    const element = document.getElementById(id);
    const parentElement = element?.parentElement || null;
    if (element && parentElement) {
      const elementRect = element.getBoundingClientRect();
      const scrollTopPosition = elementRect.top + window.scrollY - offSet - parentElement.offsetHeight;

      window.scrollTo({
        top: scrollTopPosition,
        behavior: "smooth",
      });
    }
  };
  const handleButtonClick = () => {
    setIsHidden(false);
    setIsClick(true);
  };
  return (
    <div ref={ref} id="AnchorLinks" style={{ top: marginForAnchorLinks }} className={`w-full  ${marginForAnchorLinks} bg-ChartwellWhite-200 sticky  z-20 left-0  `}>
      <div className={`ChartwellContainer  overflow-hidden  `}>
        <div className={`relative w-full`}>
          <div className={` lg:flex w-full items-center ${borderPosition} border-ChartwellPlum  ${Title.length !== 0 ? "py-4" : "py-6"} `}>
            {Title && <p className={`text-ChartwellPlum ChartwellText text-[1.125rem] ${isHidden ? "pr-12" : ""}`}>{Title}:</p>}

            <ul className={`flex flex-col lg:flex-row flex-wrap items-start ${isHidden ? "-translate-x-[400%] h-0" : "translate-x-0 "} duration-300 ease-in-out`}>
              {Links &&
                Links.map((link, index) => (
                  <li className="lg:ml-4 cursor-pointer" key={index}>
                    <a onClick={() => scrollTo(link, heights)}>{link}</a>
                  </li>
                ))}
            </ul>
            <button
              onClick={handleButtonClick}
              className={`absolute top-1/2 -translate-y-1/2 right-0 flex items-center justify-center bg-ChartwellPlum  text-white rounded-full ${
                isHidden ? "translate-x-0" : "translate-x-[4000%]"
              } duration-300 ease-in-out`}
            >
              <span className="sr-only">Open menu</span>
              <EllipsisHorizontalCircleIcon className="w-8 h-8 text-ChartwellWhite " />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withDatasourceCheck()<AnchorLinksProps>(AnchorLinks);
