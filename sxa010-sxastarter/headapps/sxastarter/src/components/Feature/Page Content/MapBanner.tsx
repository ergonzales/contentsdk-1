import { JSX } from "react";
import { useEffect, useRef } from "react";
import { ChartwellLink } from "components/chartwellComponents/ui/link/ChartwellLink";
import Link from "next/link";
import { HeadingLevel } from "../../../components/chartwellComponents/ui/HeadingLevel/HeadingLevel";
import { addEventListeners } from "lib/helpers/helper";
import { useRouter } from "next/router";
import { RichText } from "@sitecore-content-sdk/nextjs";

const MapBanner = (props: any): JSX.Element => {
  const mapRef: any = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const provinceList = ["britishColumbia", "alberta", "ontario", "quebec"];
  const provinceListToLinkField: { [key: string]: any } = {
    britishColumbia: props.fields.britishColumbiaLink,
    alberta: props.fields.albertaLink,
    ontario: props.fields.ontarioLink,
    quebec: props.fields.quebecLink,
  };

  const CTAText = props.fields?.["CTA Text"] && props.fields?.["CTA Text"]?.value;
  const CTAStyle = (props.fields && props.fields?.["CTA Style"]?.value ? props.fields && props.fields?.["CTA Style"]?.value : "plum on clear background").replace(/\s/g, "-");

  const setupInteractiveSvg = () => {
    if (!mapRef) {
      return;
    }
    const svgDoc = mapRef.current.getElementsByTagName("svg")?.[0];
    if (!svgDoc) {
      return;
    }

    // on hover on province pieces
    provinceList.forEach((provinceName: string) => {
      const provinceElement = svgDoc.getElementById(provinceName);
      if (!provinceElement) {
        return;
      }
      const provincePinElement = svgDoc.getElementById(provinceName + "Pin");
      if (!provincePinElement || provincePinElement?.length === 0) {
        return;
      }

      const hoverColor = "map-banner-st12";
      const originalColor = provinceElement?.classList[0] || "map-banner-st0"; // this is a class name, not color name

      addEventListeners(provinceElement, hoverColor, originalColor, provinceName, provinceListToLinkField, router);
      addEventListeners(provincePinElement, hoverColor, originalColor, provinceName, provinceListToLinkField, router);
    });
  };

  useEffect(() => {
    const fetchSvg = async () => {
      try {
        const response = await fetch(props.fields.map?.value?.src as string);
        const svgText = await response.text();
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgText, "image/svg+xml");
        const svgElement = svgDoc.documentElement;
        if (mapRef.current?.children?.length === 0) {
          mapRef.current.appendChild(svgElement);
        }
        setupInteractiveSvg();
      } catch (error) {
        console.error("Error fetching SVG:", error);
      }
    };

    fetchSvg();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.fields.map?.value?.src]);

  const transformHeader = () => {
    const headingFieldClone = JSON.parse(JSON.stringify(props.fields.heading));
    headingFieldClone.value = headingFieldClone.value.slice(0, 41);
    return headingFieldClone;
  };

  return (
    <div className="ChartwellContainer SectionPaddingSm">
      <div className="map-banner w-full max-w-[1300px] pb-12 mx-auto">
        <div className="relative mb-6">
          <div className="desktop-view hidden sm:flex">
            <div className="restrict-image grow-[0] shrink-[1000] basis-[150px] hidden "></div>
            <div ref={mapRef} className="block h-auto grow-[1000] shrink-[0] basis-[768px] max-h-[500px] max-w-full lg:mb-28"></div>
          </div>
          <HeadingLevel headingLevel={props.fields && props.fields["Heading Level"]} titleText={transformHeader()} styles="md:absolute md:bottom-0 md:left-0 md:max-w-[65%] " />
        </div>

        <div>
          <RichText className="text-2xl mb-6 md:max-w-[70%]" field={props.fields.body}></RichText>
          {/* {Mobile view} */}
          <div className="mobile-view flex sm:hidden flex-col mb-4">
            {provinceList
              .sort((a, b) => (a > b ? 1 : -1))
              .map((province: string, index) => (
                <Link key={index} href={`${provinceListToLinkField[province]?.value?.href}`} locale={router.locale} passHref className="bg-ChartwellPlum text-white px-4 py-2 m-[2px]">
                  {provinceListToLinkField[province]?.value?.text}
                </Link>
              ))}
          </div>

          {props.fields.ctaLink && <ChartwellLink href={props.fields.ctaLink.value.href} label={`${CTAText}`} tailwindStyles={`mb-3${CTAStyle}`} />}
        </div>
      </div>
    </div>
  );
};

export default MapBanner;
