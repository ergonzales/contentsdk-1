import { JSX, useMemo } from "react";

import { PropertyFields, CityFields, ProvinceFields } from "./PropertyFields";
import { useI18n } from "next-localization";
import ChartwellMarker from "public/stories/Map Banner/chartwell_pin.svg";
import ChartwellMarkerFooter from "public/white_chartwell_marker.svg";
import Phone from "public/bi_telephone.svg";
import { useSitecoreContext } from "lib/sitecore/useSitecoreContext";

interface PropertyAddressProps {
  propertyData?: any;
  mapLink?: boolean;
  mobile?: boolean;
  footer?: boolean;
}

/**
 * PropertyAddress Component
 *
 * Renders a formatted property address, optionally as a Google Maps link.
 *
 * Features:
 * - If `footer` is true, displays the address in a footer style with a white Chartwell marker icon.
 * - If `mobile` is true, displays a map icon and localized "View Map" text as the link label.
 * - If `mapLink` is true (or on PropertyPage), displays the address as a clickable link to Google Maps.
 * - Otherwise, displays the address as plain text.
 *
 * Address formatting:
 * - English: 240 Old Harwood Avenue, Ajax, Ontario L1T 0N2
 * - French (desktop): 240 Old Harwood Avenue, Ajax, (Ontario) L1T 0N2
 * - French (mobile): 240 Old Harwood Avenue, Ajax, Ontario L1T 0N2
 * - Footer: Address is rendered with a white Chartwell marker icon and styled for the footer.
 * @param {PropertyAddressProps} props
 * @returns {JSX.Element | null} The formatted address or null if no data
 */

const PropertyAddress = ({ propertyData, mapLink = false, mobile = false, footer = false }: PropertyAddressProps): JSX.Element | null => {
  const { sitecoreContext } = useSitecoreContext() || { sitecoreContext: {} };
  const { t } = useI18n();
  const fields = propertyData || (sitecoreContext?.route?.fields as PropertyFields | undefined);

  const cityFields = (fields?.City?.[0]?.fields as CityFields) || (fields?.fields?.City?.[0]?.fields as CityFields) || undefined;
  const provinceFields =
    (fields?.Province?.[0]?.fields as ProvinceFields) || (fields?.fields?.Province?.[0]?.fields as ProvinceFields) || (fields?.provAbbr?.targetItems?.[0] as ProvinceFields) || undefined;

  const phoneNumber = propertyData?.phone || (fields.fields?.["Contact Number"] as any)?.value || (fields?.contactNumber as any)?.value || "";

  // Memoize address parts
  const address = useMemo(() => {
    if (!fields) return "";
    if (fields && "CustomAddress" in fields) return fields.CustomAddress?.value || "";
    const cityName = cityFields?.["City Name"]?.value || propertyData?.city?.targetItems?.[0]?.cityName?.value || propertyData?.city?.targetItems?.[0]?.name || "";
    const provinceName = provinceFields?.["Province Name"]?.value || propertyData?.province?.targetItems?.[0]?.provinceName?.value || provinceFields?.fullName?.value || "";
    let formattedProvince = provinceName;
    if (sitecoreContext?.route?.itemLanguage !== "en" && provinceName) {
      formattedProvince = mobile ? provinceName : `(${provinceName})`;
    }

    const street =
      propertyData?.streetNameAndNumber || fields?.StreetNameAndNumber?.value || propertyData?.address?.value || fields?.StreetNameAndNumber?.value || fields?.fields?.StreetNameAndNumber?.value || "";
    const city = cityName;
    const province = formattedProvince;
    const postal = fields["Postal code"]?.value || propertyData?.postalCode?.value || fields?.fields?.["Postal code"]?.value || "";

    const parts = [typeof street === "string" ? street : street.value, city, province].filter(Boolean);

    let addr = parts.join(", ");
    if (postal) {
      // Ensure postal code is on a new line
      addr += (addr ? " " : "") + postal;
    }
    return addr;
  }, [fields, cityFields, provinceFields, propertyData, sitecoreContext?.route?.itemLanguage, mobile]);

  // Always enable mapLink on PropertyPage
  const isMapLink = mapLink || sitecoreContext?.route?.templateName === "PropertyPage" || mobile;
  if (!fields || !address) return null;

  // Footer rendering
  if (footer && isMapLink) {
    return (
      <a
        className="hover:text-ChartwellWhite-100 ChartwellFooterText no-underline focus:text-ChartwellWhite-100 duration-300 justify-center not-italic text-[0.875rem] flex items-center"
        href={`https://www.google.com/maps/place/${address}`}
        target="_blank"
        rel="noreferrer noopener"
      >
        <svg width="30" height="40" className="hidden sm:block">
          <image href={ChartwellMarkerFooter.src} width="30" height="30" className="" />
        </svg>
        {address}
      </a>
    );
  }

  // Property Page / Mobile Header rendering  (map link or mobile)
  if (isMapLink) {
    return (
      <div className={mobile ? "flex items-center justify-between py-2" : "ChartwellContainer SectionPaddingSm !pb-0 bg-white lg:px-0"}>
        <div className={mobile ? "" : "sm:flex-row justify-center justify-items-center propertyAddress"}>
          <address className={mobile ? "" : "flex justify-center"}>
            <a
              className={
                mobile ? "no-underline justify-center not-italic text-[14px] flex items-center gap-2 -ml-2" : "no-underline justify-center not-italic text-[1rem] flex items-center text-center"
              }
              href={`https://www.google.com/maps/place/${address}`}
              target="_blank"
              rel="noreferrer noopener"
            >
              {mobile ? (
                <>
                  <svg width="34" height="40" className="block">
                    <image href={ChartwellMarker.src} width="40" height="40" className="" />
                  </svg>
                  {t("ViewMap")}
                </>
              ) : (
                address
              )}
            </a>
          </address>
        </div>
      </div>
    );
  }

  // Simple text rendering (BAT Personalization on Thank you page)
  // Insert <br> before postal code for display
  // Province and postal code together on a new line
  let addressWithBreak = address;
  const postalPattern = /([A-Za-z]\d[A-Za-z] \d[A-Za-z]\d)$/;
  const postalMatch = address.match(postalPattern);
  if (postalMatch) {
    // Find province: substring after last comma before postal code
    const lastCommaIdx = address.lastIndexOf(",");
    const province = address.substring(lastCommaIdx + 1, address.length - postalMatch[0].length).trim();
    // Remove province from main address
    const mainAddress = address.substring(0, lastCommaIdx);
    // Compose new line: province + postal code
    addressWithBreak = `${mainAddress}<br>${province} ${postalMatch[0]}`;
  }
  return (
    <>
      <address>
        <p className="not-italic mt-2 text-[0.95rem] !leading-[1.5] mb-0" dangerouslySetInnerHTML={{ __html: addressWithBreak }} />
      </address>
      {phoneNumber && (
        <a href={`tel:${phoneNumber}`} className="flex mt-3 flex-row mt-1 text-ChartwellBlue underline hover:no-underline font-bold text-[0.95rem] items-center">
          <svg width="15" height="15" className="block mx-2">
            <image href={`${Phone.src}`} width="15" height="15" className="" />
          </svg>
          {phoneNumber}
        </a>
      )}
    </>
  );
};

export default PropertyAddress;
