import { HeadingLevel } from "../../ui/HeadingLevel/HeadingLevel";
import { getIsBookATour } from "lib/helpers/form/formAndDatalayerHelpers";
import React, { useState } from "react";
import { getCustomLocalizedAddress } from "lib/helpers/helper";
import PropertyAddress from "components/chartwellComponents/content/PropertyAddress/PropertyAddress";
import { useRouter } from "next/router";

// Accept props from parent component (ImageTextData) to get the property data from context
// This is rendered from ImageTextData component only when it is a BookATour form,
// so the BookATourPersonalization (headless-main) rendering need to be removed from the thank-you page presentation details across all properties.
type BookATourPersonalizationProps = {
  propertyData?: any;
  scContext: any;
  fields?: any;
};

const BookATourPersonalization: React.FC<BookATourPersonalizationProps> = ({ scContext, fields, propertyData }) => {
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  const [personalization, setPersonalization] = useState<{ heading: string; headingLevel: string; resName: string; resCustomAddress: string }>({
    heading: "",
    headingLevel: "",
    resName: "",
    resCustomAddress: "",
  });

  React.useEffect(() => {
    setIsClient(true);
    const isBookATour = getIsBookATour(scContext);
    if (!isBookATour || typeof window === "undefined") return;

    const customAddress = getCustomLocalizedAddress(propertyData, router.asPath);
    const localStorageDataHeading = window.localStorage.getItem("chartwellSubmitter") || "";
    const personalizationHeading = localStorageDataHeading ? JSON.parse(localStorageDataHeading) : {};

    const headingValue = fields?.heading?.value?.replace(/!/g, "") || "";
    const nameValue = personalizationHeading.name || "";
    const heading = headingValue && nameValue ? `${headingValue} ${nameValue}!` : headingValue || nameValue ? `${headingValue}${nameValue ? " " + nameValue + "!" : ""}` : "";

    setPersonalization({
      heading,
      headingLevel: fields?.["Heading Level"] ? fields["Heading Level"] : { value: "h2" },
      resName: propertyData?.propertyNavigationTitle?.value || "",
      resCustomAddress: customAddress || "",
    });
  }, [scContext, fields, propertyData, router.asPath]);

  if (!isClient || !personalization.heading) return null;

  return (
    <>
      <div id="personalizationName" className="data-h1 mb-2 md:md-4">
        <HeadingLevel
          headingLevel={typeof personalization.headingLevel === "string" ? { value: personalization.headingLevel } : personalization.headingLevel}
          styles="mb-2 md:md-4"
          titleText={{ value: personalization.heading }}
        />
        <div className="resdetail" id="personalizationResidence">
          <div style={{ color: "var(--chartwell-dark-gray)" }}>
            <strong>{personalization.resName}</strong>
            {personalization.resCustomAddress ? (
              <>
                <br />
                {personalization.resCustomAddress}
              </>
            ) : (
              <PropertyAddress propertyData={propertyData} mapLink={false} />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default BookATourPersonalization;
