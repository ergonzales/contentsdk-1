import { ResidenceListModel } from "src/models/Residence";
import { ProvinceResidenceCard } from "../ProvinceFindAResidence/ProvinceResidenceCard";
type FindAResidenceCardProps = Omit<ResidenceListModel, "bookATourLink">;

export const FindAResidenceCard = ({
  residenceImage,
  url,
  residenceName,
  residenceAddress,
  livingOption,
  livingOptions,
  language,
  careServiceAvailable,
  residenceId,
  contactNumber,
  propertySuitPlans,
  provinceName,
  cityId,
  cityName,
  cityLat,
  cityLng,
  Lat,
  Lng,
  bilingual,
  isPriorityProperty,
  careServicesAvailableText,
  bookATourLink,
}: FindAResidenceCardProps & {
  provinceName?: string;
  cityId?: string;
  cityName?: string;
  cityLat?: string;
  cityLng?: string;
  Lat?: string;
  Lng?: string;
  bilingual?: boolean | string;
  isPriorityProperty?: boolean;
  careServicesAvailableText?: string;
  bookATourLink?: string;
}) => {
  // const { t: dictionary } = useI18n();
  // const { sitecoreContext } = useSitecoreContext();
  // const { isPromo, textRegularPrice, textPromoPrice, promoPrices, regularPrices } = (propertySuitPlans && promoDataHandler(propertySuitPlans, sitecoreContext, dictionary)) || {};

  // const openHouseRibbonText = renderPromoOpenHouseBannerOnCards(sitecoreContext, residenceId, language);
  return (
    <>
      <ProvinceResidenceCard
        residenceId={residenceId}
        propertyId={residenceId}
        bilingual={bilingual}
        cityId={cityId}
        cityName={cityName}
        cityNameDisplay={cityName}
        cityLandingPageHref={""}
        provinceId={provinceName}
        provinceName={provinceName}
        residenceAddress={residenceAddress}
        cityLandingPageItem={""}
        Lat={Lat}
        Lng={Lng}
        cityLat={cityLat}
        cityLng={cityLng}
        assignedPromos={""}
        isPriorityProperty={isPriorityProperty}
        subCityName={""}
        subCityId={""}
        subCityNameDisplay={""}
        subCityLandingPageHref={""}
        careServiceAvailableText={careServicesAvailableText || ""}
        imageSrc={residenceImage?.value ? String(residenceImage.value) : ""}
        residence={{
          id: residenceId,
          name: residenceName,
          url,
          language,
          imageUrl: residenceImage?.value || "",
          streetNameAndNumber: residenceAddress || "",
          phone: contactNumber || "",
          province: provinceName || "",
          city: {
            id: cityId || "",
            name: cityName || "",
            latitude: cityLat || "",
            longitude: cityLng || "",
          },
          promotions: {
            promoId: "",
            title: "",
            startDateTime: "",
            endDateTime: "",
          },
          propertyCareServices: "",
          buttonText: "",
          careServiceListTitle: "",
          bookATourLink: bookATourLink || "",
          cardButtonText: { value: "" },
          availableCareServices: [],
          latitude: Lat || "",
          longitude: Lng || "",
          bilingual: bilingual ? String(bilingual) : "",
          isPriorityProperty: isPriorityProperty,
          careServicesAvailable: String(careServiceAvailable),
          careServicesAvailableText: { value: careServicesAvailableText || "" },
          path: "",
          title: residenceName || "",
          postalCode: "",
        }}
        residenceImage={residenceImage}
        url={url}
        residenceName={residenceName}
        livingOption={livingOption}
        livingOptions={livingOptions}
        language={language}
        bookATourLink={bookATourLink || ""}
        contactNumber={contactNumber}
        careServiceAvailable={careServiceAvailable}
        propertySuitPlans={propertySuitPlans}
      />
    </>
  );
};
