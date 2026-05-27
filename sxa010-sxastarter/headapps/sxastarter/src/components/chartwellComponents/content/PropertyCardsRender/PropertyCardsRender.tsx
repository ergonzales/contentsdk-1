import { JSX } from "react";
import { useRouter } from "next/router";
import { Field, withDatasourceCheck, RichText as JssRichText } from "@sitecore-content-sdk/nextjs";
import { HeadingLevel } from "../../ui/HeadingLevel/HeadingLevel";
import { ProvinceResidenceCard } from "../ProvinceFindAResidence/ProvinceResidenceCard";
import { ComponentProps } from "lib/component-props";
import { getCareServices } from "lib/helpers/residence-helpers";
import { useSitecoreContext } from "lib/sitecore/useSitecoreContext";

type PropertyCardsRenderProps = ComponentProps & {
  fields: {
    Residence?: Array<any>;
    Heading: Field<string>;
    "Heading Level": Field<string>;
    Desc: Field<string>;
  };
};

const PropertyCardsRender = (props: PropertyCardsRenderProps): JSX.Element => {
  const { sitecoreContext } = useSitecoreContext();
  const router = useRouter();

  const residenceList: any = props?.fields?.Residence || [];

  const commonCareOptions = getCareServices(router, sitecoreContext) || [];
  residenceList.map((residence: any) => {
    residence.fields["Living Option"] = residence.fields["Living Option"]
      ?.map((option: any) => {
        const careService = commonCareOptions.find((careOption: any) => careOption?.id === option?.id?.toString().replaceAll("-", "").toUpperCase());
        return {
          ...option,
          sortOrder: careService?.sortOrder,
        };
      })
      ?.sort((a: any, b: any) => a?.sortOrder - b?.sortOrder);
    return residence;
  });
  return (
    <div className="ChartwellContainer SectionPadding ">
      <HeadingLevel headingLevel={props?.fields?.["Heading Level"] || ""} titleText={props?.fields?.Heading} styles={" text-center mb-4 md:mb-6"} />
      {props.fields?.Desc?.value && <JssRichText field={props.fields?.Desc} tag="div" className=" ChartwellText" />}
      <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 md:mt-6 ">
        {residenceList.map((residence: any) => {
          const propertySuitPlans =
            residence.fields?.["Property Suit Plans"].map((el: any) => ({
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
            })) || [];
          return (
            <ProvinceResidenceCard
              key={residence.id}
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
              // ${residence.fields?.City?.[0]?.fields?.["City Name"]?.value || ""},
              // ${
              //   sitecoreContext?.route?.itemLanguage === "en"
              //     ? residence.fields?.Province?.[0]?.fields?.["Province Name"]?.value
              //     : `(${residence.fields?.Province?.[0]?.fields?.["Province Name"]?.value})`
              // },
              // ${residence.fields?.["Postal code"]?.value || ""}`}
              cityLandingPageItem={residence.fields?.["City Landing Page Item"] || undefined}
              Lat={residence.fields?.Latitude?.value || ""}
              Lng={residence.fields?.Longitude?.value || ""}
              cityLat={residence.fields?.City?.[0]?.fields?.["City Latitude"]?.value || ""}
              cityLng={residence.fields?.City?.[0]?.fields?.["City Longitude"]?.value || ""}
              url={residence.url || ""}
              livingOption={residence.fields?.["Living Option"]?.map((opt: any) => opt.fields?.["Care Service"]?.value) || []}
              livingOptions={residence.fields?.["Living Option"]}
              careServiceAvailable={!!residence.fields?.["Care Services Available"]?.value}
              careServiceAvailableText={residence.fields?.["care services available text"]?.value || ""}
              bookATourLink={residence.fields?.BookATour?.[0]?.fields?.NavigationTitle?.value ? `${router.locale === "fr" ? "/fr" : ""}${residence.fields?.BookATour?.[0]?.url}` : ""}
              imageSrc={residence.fields?.["Thumbnail Photo"]?.value?.src || ""}
              residenceImage={residence.fields?.["Thumbnail Photo"]?.value || ""}
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
  );
};

export default withDatasourceCheck()<PropertyCardsRenderProps>(PropertyCardsRender);
