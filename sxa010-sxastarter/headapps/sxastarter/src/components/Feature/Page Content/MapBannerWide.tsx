import { JSX, useEffect, useRef, useCallback, useState, useMemo } from "react";
import { addEventListeners } from "lib/helpers/helper";
import { useRouter } from "next/router";

type ProvinceName = "britishColumbia" | "alberta" | "ontario" | "quebec";

interface LinkField {
  value?: {
    text?: string;
    src?: string;
    alt?: string;
    href?: string;
  };
}

interface MapBannerWideProps {
  fields: {
    map?: LinkField;
    mobileMap?: LinkField;
    britishColumbiaLink?: LinkField;
    albertaLink?: LinkField;
    ontarioLink?: LinkField;
    quebecLink?: LinkField;
  };
}

const provinceList: ProvinceName[] = ["britishColumbia", "alberta", "ontario", "quebec"];

const MapBannerWide = ({ fields }: MapBannerWideProps): JSX.Element => {
  const mapRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);

  // Map province names to their link fields (memoized)
  const provinceListToLinkField = useMemo(
    () => ({
      britishColumbia: fields.britishColumbiaLink,
      alberta: fields.albertaLink,
      ontario: fields.ontarioLink,
      quebec: fields.quebecLink,
    }),
    [fields.britishColumbiaLink, fields.albertaLink, fields.ontarioLink, fields.quebecLink]
  );

  const setupInteractiveSvg = useCallback(() => {
    if (!mapRef.current) return;
    const svgDoc = mapRef.current.getElementsByTagName("svg")[0];
    if (!svgDoc) return;

    provinceList.forEach((provinceName) => {
      const provinceElement = svgDoc.getElementById(provinceName);
      if (!provinceElement) return;
      const hoverColor = "map-banner-wide-st12";
      const originalColor = provinceElement.classList[0] || "map-banner-wide-st0";
      const textElement = provinceElement.querySelector("text");
      if (textElement) {
        textElement.textContent = provinceListToLinkField[provinceName]?.value?.text || provinceName;
      }
      addEventListeners(provinceElement as HTMLElement, hoverColor, originalColor, provinceName, provinceListToLinkField, router);
    });
  }, [provinceListToLinkField, router]);

  // Track mobile/desktop view
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const fetchSvg = async () => {
      const url = isMobile ? fields.mobileMap?.value?.src : fields.map?.value?.src;
      if (!url) return;
      try {
        const response = await fetch(url);
        const svgText = await response.text();
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgText, "image/svg+xml");
        const svgElement = svgDoc.documentElement;
        if (mapRef.current) {
          mapRef.current.innerHTML = "";
          mapRef.current.appendChild(svgElement);
        }
        setupInteractiveSvg();
      } catch (error) {
        console.error("Error fetching SVG:", error);
      }
    };
    fetchSvg();
  }, [fields.map, fields.mobileMap, setupInteractiveSvg, router.locale, isMobile]);

  return (
    <div className="map-banner-wide relative w-full max-w-[1920px] mx-auto">
      <div className="desktop-view sm:flex">
        <div ref={mapRef} className="w-full max-h-[940px] overflow-hidden flex items-end" />
      </div>
    </div>
  );
};

export default MapBannerWide;
