import { JSX, useMemo } from "react";
import { useRouter } from "next/router";


import { BreadCrumbs } from "../BreadCrumbs/BreadCrumbs";

import { ProvinceResidenceCard } from "../ProvinceFindAResidence/ProvinceResidenceCard";
import { useSitecoreContext } from "lib/sitecore/useSitecoreContext";

const getLivingOptions = (livingOptions: any[] = []) =>
  livingOptions.map((option: any) => ({
    careServiceName: { value: option.fields?.["Care Service"]?.value },
    careServiceIcon: { jsonValue: { value: option.fields?.["Care Service Icon"]?.value } },
  }));

const sortLivingOptions = (livingOptions: any[] = []) =>
  livingOptions
    .map((option: any) => ({
      ...option,
      sortOrder: option.fields?.sortOrder,
    }))
    .sort((a: any, b: any) => a?.sortOrder - b?.sortOrder);

const getPropertySuitPlans = (plans: any[] = []) =>
  plans.map((el: any) => ({
    id: el.id,
    promoEndDate: {
      jsonValue: { value: el.fields?.["End Date"]?.value },
    },
    promoStartDate: {
      jsonValue: { value: el.fields?.["Start Date"]?.value },
    },
    promoPrice: {
      value: el.fields?.["Promotion Price"]?.value,
    },
    regularPrice: {
      value: el.fields?.["Regular SuitePrice"]?.value,
    },
  }));

const CityLandingPage = (): JSX.Element => {
  const { sitecoreContext } = useSitecoreContext();
  const router = useRouter();

  const residenceList = useMemo(() => {
    const raw = sitecoreContext.route?.fields?.Residence;
    const residences: any[] = Array.isArray(raw) ? raw : raw ? [raw] : [];
    return residences.map((residence: any) => {
      const livingOptionsRaw = residence.fields["Living Option"] || [];
      return {
        ...residence,
        fields: {
          ...residence.fields,
          livingOptions: getLivingOptions(livingOptionsRaw),
          ["Living Option"]: sortLivingOptions(livingOptionsRaw),
        },
      };
    });
  }, [sitecoreContext]);

  const contentItemRoute: any = sitecoreContext.route;

  return (
    <>
      <div className="ChartwellContainer pb-8">
        <BreadCrumbs style="!pl-0 mb-4" />
        <h1 className="text-left">{contentItemRoute.fields["Landing Page Title"]?.value}</h1>
        <div dangerouslySetInnerHTML={{ __html: contentItemRoute.fields["Landing Page Desc Top"]?.value }} />
        <div className="flex w-full">
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 md:mt-4 md:mb-6">
            {residenceList.map((residence: any) => {
              const propertySuitPlans = getPropertySuitPlans(residence.fields?.["Property Suit Plans"] || []);
              return (
                <ProvinceResidenceCard
                  key={residence.propertyId || residence.id}
                  propertyId={residence.propertyId}
                  language={router.locale || ""}
                  bilingual={residence.fields?.["Bilingual"] || false}
                  residenceId={residence.id || ""}
                  residenceName={residence.fields["NavigationTitle"]?.value || residence.fields["Property Name"]?.value || ""}
                  cityId={residence.fields?.City?.[0]?.id || ""}
                  cityName={residence.fields?.City?.[0]?.fields?.["City Name"]?.value || ""}
                  cityNameDisplay={residence.fields?.City?.[0]?.fields?.["City Name"]?.value || residence.fields?.City?.[0]?.fields?.["Alternate City Name"]?.value || ""}
                  provinceId={residence.fields?.Province?.[0]?.id || ""}
                  provinceName={residence.fields?.Province?.[0]?.fields?.["Province Name"]?.value || ""}
                  residence={residence}
                  // residenceAddress={`${residence.fields?.StreetNameAndNumber?.value || ""},
                  //    ${residence.fields?.City?.[0]?.fields?.["City Name"]?.value || ""},
                  //    ${
                  //      sitecoreContext?.route?.itemLanguage === "en"
                  //        ? residence.fields?.Province?.[0]?.fields?.["Province Name"]?.value
                  //        : `(${residence.fields?.Province?.[0]?.fields?.["Province Name"]?.value})`
                  //    },
                  //    ${residence.fields?.["Postal code"]?.value || ""}`}
                  cityLandingPageItem={residence.fields?.["City Landing Page Item"] || undefined}
                  Lat={residence.fields?.Latitude?.value || ""}
                  Lng={residence.fields?.Longitude?.value || ""}
                  cityLat={residence.fields?.City?.[0]?.fields?.["City Latitude"]?.value || ""}
                  cityLng={residence.fields?.City?.[0]?.fields?.["City Longitude"]?.value || ""}
                  url={residence.url || ""}
                  livingOption={residence.fields?.["Living Option"]?.map((opt: any) => opt.fields?.["Care Service"]?.value) || []}
                  livingOptions={residence.fields?.livingOptions || []}
                  careServiceAvailable={!!residence.fields?.["Care Services Available"]?.value}
                  careServiceAvailableText={residence.fields?.["care services available text"]?.value || ""}
                  bookATourLink={residence.fields?.BookATour?.[0]?.fields?.NavigationTitle?.value ? `${router.locale === "fr" ? "/fr" : ""}${residence.fields?.BookATour?.[0]?.url}` : ""}
                  residenceImage={residence.fields?.["Thumbnail Photo"]?.value || ""}
                  imageSrc={residence.fields?.["Thumbnail Photo"]?.value?.src || ""}
                  contactNumber={residence.fields?.["Contact Number"]?.value || ""}
                  propertySuitPlans={propertySuitPlans}
                  subCityName={""}
                  subCityId={""}
                  subCityNameDisplay={""}
                />
              );
            })}
          </ul>
        </div>
        <div dangerouslySetInnerHTML={{ __html: contentItemRoute.fields["Landing Page Desc Bottom"]?.value }} />
      </div>
    </>
  );
};

export default CityLandingPage;
