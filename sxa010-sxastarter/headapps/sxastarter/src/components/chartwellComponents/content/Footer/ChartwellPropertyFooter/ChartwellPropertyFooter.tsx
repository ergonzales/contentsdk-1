import { JSX } from "react";
import { withDatasourceCheck } from "@sitecore-content-sdk/nextjs";
import { useRouter } from "next/router";
import Link from "next/link";

import Phone from "../../../../../../public/bi_telephone_white.svg";
import ButterflyBg from "../../../../../../public/Butterfly-Opacity.svg";

import { MiceTypeLink } from "../uiFooter/MiceTypeLink";
import { ChartwellSocialLink } from "components/chartwellComponents/ui/socialLink/ChartwellSocialLink";
import { CityFields, ProvinceFields } from "../../PropertyAddress/PropertyFields";
import PropertyAddress from "../../PropertyAddress/PropertyAddress";
import { useSitecoreContext } from "lib/sitecore/useSitecoreContext";

const extractFields = (fields: any[] = []): { [key: string]: any } => {
  return fields?.reduce((acc: { [key: string]: any }, item: any) => {
    if (item?.name) {
      acc[item.name] = fields?.find((field: any) => field.name === item.name)?.jsonValue || [];
    }
    return acc;
  }, {});
};

const ChartwellPropertyFooter = (props: any): JSX.Element => {
  const { ds, ci } = props?.fields.data || {};

  const { sitecoreContext } = useSitecoreContext();
  const router = useRouter();

  let userNote = "Note: This is hardcoded content. On a residence page, the values are populated from residence data";
  if (sitecoreContext.pageEditing != true) {
    userNote = "";
  }

  const footerFields = extractFields(Array.isArray(ds?.fields) ? ds?.fields : []);

  const getPropertyFields = (ci: any, isPropertyPage: boolean) => {
    if (isPropertyPage) {
      return ci?.fields;
    }
    return !ci?.parent?.parent?.fields?.length ? ci?.parent?.fields : ci?.parent?.parent?.fields;
  };

  const propertyDetailsFooter = extractFields(getPropertyFields(ci, sitecoreContext.route?.templateName === "PropertyPage"));
  const residenceFacebookLink = ci?.socialLink?.value ? ci?.socialLink?.value : !ci?.parent?.parent?.fields?.length ? ci?.parent?.socialLink?.value : ci?.parent?.parent?.socialLink?.value;

  // Create updatedSocialsCards for rendering
  const updatedSocialsCards = footerFields?.SocialsCards?.map((card: any) => {
    if (card.name === "Facebook" && card.fields?.SocialLink && residenceFacebookLink) {
      return {
        ...card,
        fields: {
          ...card.fields,
          SocialLink: {
            ...card.fields.SocialLink,
            value: residenceFacebookLink,
          },
        },
      };
    }
    return card;
  });

  const isCustomAddress: boolean = sitecoreContext.route?.fields?.CustomAddress && (sitecoreContext.route?.fields?.CustomAddress as any)?.value ? true : false;

  footerFields.BookATourContactUsSubscribePages =
    [
      Array.isArray(propertyDetailsFooter?.BookATour) ? propertyDetailsFooter?.BookATour?.find((item: any) => item?.name === "book-a-tour" || item?.name === "planifier-une-visite") : undefined,
      ...(Array.isArray(footerFields?.BookATourContactUsSubscribePages)
        ? footerFields?.BookATourContactUsSubscribePages?.filter((item: any) => item?.name !== "book-a-tour" && item?.name !== "planifier-une-visite")
        : []),
    ].filter(Boolean) || [];

  const cityFields = propertyDetailsFooter?.City?.[0]?.fields as unknown as CityFields;
  const provinceFields = propertyDetailsFooter?.Province?.[0]?.fields as unknown as ProvinceFields;

  const cityName = cityFields?.["City Name"]?.value || "";
  const provinceName = provinceFields?.["Province Name"]?.value || "";
  const formattedProvince = sitecoreContext?.route?.itemLanguage === "en" ? provinceName : `(${provinceName})`;

  const address = [propertyDetailsFooter?.StreetNameAndNumber?.value, cityName, formattedProvince, propertyDetailsFooter?.["Postal code"]?.value].filter(Boolean).join(", ");

  const propertyPageFields = {
    propertyName: propertyDetailsFooter?.NavigationTitle?.value,
    address: (sitecoreContext.route?.fields?.CustomAddress as any)?.value ? (sitecoreContext.route?.fields?.CustomAddress as any)?.value : address,
    contactNumber: (sitecoreContext.route?.fields?.CustomPhoneNumber as any)?.value
      ? (sitecoreContext.route?.fields?.CustomPhoneNumber as any)?.value
      : propertyDetailsFooter?.["Contact Number"]?.value,
  };

  const residenceName = (sitecoreContext.route?.fields?.CustomPropertyName as any)?.value ? (sitecoreContext.route?.fields?.CustomPropertyName as any)?.value : propertyPageFields.propertyName;
  return (
    footerFields && (
      <>
        <footer className={`bg-ChartwellGrey w-full relative bg-no-repeat bg-cover md:bg-35% sm:bg-right`} style={{ backgroundImage: `url(${ButterflyBg.src})` }}>
          <p id="footer-heading" className="sr-only">
            Footer
          </p>
          <div className="ChartwellContainer SectionPadding ChartwellFooterText ">
            <div className="  ">
              {userNote}
              <div className="md:w-full lg:w-9/12 md:flex content-start justify-between  ">
                <div className="sm:w-full lg:w-3/5">
                  <span className="my-3 inline-block ChartwellFooterText font-bold text-center md:text-left text-[1.375rem] md:text-[1.25rem] uppercase">{residenceName}</span>
                  <address className="flex md:flex-row flex-col  items-center flex-wrap">
                    <PropertyAddress propertyData={isCustomAddress ? sitecoreContext.route?.fields : propertyDetailsFooter} mapLink={true} mobile={false} footer={true} />
                    <a
                      href={`tel:${propertyPageFields.contactNumber}`}
                      className="hover:text-ChartwellWhite-100 ChartwellFooterText no-underline justify-center text-[0.875rem] focus:text-ChartwellWhite-100 duration-300 flex items-center not-italic"
                    >
                      <svg width="20" height="20" className="block mx-2">
                        <image href={`${Phone.src}`} width="20" height="20" className="" />
                      </svg>
                      <span className="">{propertyPageFields.contactNumber}</span>
                    </a>
                  </address>
                  <ul className={`grid md:grid-cols-3 gap-4 mt-4`}>
                    {footerFields?.BookATourContactUsSubscribePages &&
                      footerFields?.BookATourContactUsSubscribePages?.map((item: any) => {
                        return (
                          <li
                            key={item?.id}
                            className="text-[0.875rem] border md:p-4 w-full md:w-auto hover:border-ChartwellWhite-100  focus:border-ChartwellWhite-100  hover:text-ChartwellWhite-100  focus:text-ChartwellWhite-100 duration-300 cursor-pointer flex justify-center items-center"
                          >
                            <Link href={`${item?.url}`} locale={router.locale} rel="noreferrer noopener" className="text-center  p-4 md:p-0 block w-full md:w-auto ">
                              {item?.fields?.NavigationTitle?.value?.toUpperCase()}
                            </Link>
                          </li>
                        );
                      })}
                  </ul>
                </div>
                <span className="w-0 border-l hidden md:block mx-6"></span>
                <div className="sm:w-full lg:w-2/5">
                  <div className="md:flex justify-between gap-6 md:p-5 pt-5 md:pt-0 md:pb-2 content-start">
                    <ul className="basis-1/2 md:pt-5">
                      {footerFields?.leftLinksBlock &&
                        footerFields?.leftLinksBlock?.map((leftLink: any) => {
                          return (
                            <li key={leftLink.id} className="text-[0.875rem] md:text-[0.8125rem] mt-2 first:mt-0 text-center border-b-1 md:border-b-0 pb-1  md:text-left md:p-0 md:border-0 nowrap">
                              <Link href={`${leftLink?.url?.toLowerCase()}`} locale={router.locale} passHref className="">
                                {leftLink?.fields?.NavigationTitle?.value.toUpperCase()}
                              </Link>
                            </li>
                          );
                        })}
                    </ul>
                    <span className="w-0 hidden md:block border-l"></span>
                    <ul className="sm:mt-2 md:mt-0 md:pt-5 basis-1/2">
                      {footerFields?.rightLinksBlock &&
                        footerFields?.rightLinksBlock?.map((rightLink: any) => {
                          return (
                            <li key={rightLink.id} className="text-[0.875rem] md:text-[0.8125rem] mt-2 first:mt-0 text-center border-b-1 md:border-b-0 pb-1 md:text-left md:p-0 md:border-0 nowrap">
                              <Link href={`${rightLink?.url?.toLowerCase()}`} locale={router.locale} passHref className="">
                                {rightLink?.fields?.NavigationTitle?.value.toUpperCase()}
                              </Link>
                            </li>
                          );
                        })}
                    </ul>
                  </div>
                  <span className=" my-2 border border-b-0 hidden md:block"></span>
                  <ul className="mt-2 md:mt-0 sm:border-b-1 md:border-b-0 md:px-[20px] flex flex-col sm:justify-center md:justify-start items-center md:grid gap-1 ">
                    {footerFields?.DropItems &&
                      footerFields?.DropItems?.map((dropItem: any) => {
                        return (
                          <li key={dropItem.id} className="text-[0.875rem] md:text-[0.8125rem] mt-2 first:mt-0 text-center border-b-1 md:border-b-0 pb-1 md:text-left md:p-0 md:border-0 nowrap">
                            <Link target={"_blank"} href={`${dropItem?.fields?.ExternalDropItem?.value?.url}`} locale={router.locale} passHref className="">
                              {dropItem?.fields?.ExternalDropItem?.value?.title.toUpperCase()}
                            </Link>
                          </li>
                        );
                      })}
                  </ul>
                </div>
              </div>
            </div>
            <div className="md:flex mt-10  sm:relative">
              <div className="flex mt-8  justify-center items-center md:mt-0 gap-4 md:absolute top-[-50%] right-0 md:translate-y-[30%] ">
                <span className="w-full md:hidden h-[1px] bg-white"></span>
                {updatedSocialsCards &&
                  updatedSocialsCards.map((linkCard: any, index: any) => {
                    return (
                      <ChartwellSocialLink
                        key={linkCard.id}
                        href={linkCard.fields.SocialLink.value}
                        target={linkCard.fields["Link Target"].value}
                        name={linkCard.displayName}
                        ImageValue={linkCard.fields.SocialLinkSVG.value}
                        index={index}
                      />
                    );
                  })}
                <span className="w-full md:hidden h-[1px] bg-white"></span>
              </div>
              <ul className="md:hidden mt-6 gap-2 flex flex-col items-center justify-center">
                {/* Mobile */}
                {footerFields?.MiceTypeLinksUp?.map((link: any) => {
                  return <MiceTypeLink LinkStyle="m-0 ChartwellFooterText " key={link.id} link={link} />;
                })}
              </ul>
              <div className=" flex flex-row justify-center sm:block mt-2  sm:w-8/12 md:w-9/12   md:border-t border-white pt-2 lg:mr-4   ">
                <div>
                  <p className="mx-0 my-1 p-0 ChartwellFooterText text-center md:text-left">{`${footerFields?.CopyrightInfo?.value.replace("2025", new Date().getFullYear().toString())}` || ""}</p>
                  <ul className="hidden md:flex">
                    {/* Desktop */}
                    {footerFields?.MiceTypeLinksUp &&
                      footerFields?.MiceTypeLinksUp?.map((link: any) => {
                        return <MiceTypeLink listStyle="first:pl-0 px-2 border-r last:border-0" LinkStyle="m-0   md:order-1 lg:whitespace-nowrap" key={link.id} link={link} />;
                      })}
                  </ul>
                </div>
              </div>
              <div className="hidden md:flex mt-8  justify-center items-center md:mt-0 gap-4 md:absolute top-[-50%] right-0 md:translate-y-[30%] ">
                <span className="w-full md:hidden h-[1px] bg-white"></span>
                {updatedSocialsCards &&
                  updatedSocialsCards.map((linkCard: any, index: any) => {
                    return (
                      <ChartwellSocialLink
                        key={linkCard.id}
                        href={linkCard.fields.SocialLink.value}
                        target={linkCard.fields["Link Target"].value}
                        name={linkCard.displayName}
                        ImageValue={linkCard.fields.SocialLinkSVG.value}
                        index={index}
                      />
                    );
                  })}
                <span className="w-full md:hidden h-[1px] bg-white"></span>
              </div>
            </div>
          </div>
        </footer>
      </>
    )
  );
};
export default withDatasourceCheck()(ChartwellPropertyFooter);
