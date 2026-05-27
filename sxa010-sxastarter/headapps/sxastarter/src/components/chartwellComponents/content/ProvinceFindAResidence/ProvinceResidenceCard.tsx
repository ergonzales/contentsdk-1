import { NextImage } from "@sitecore-content-sdk/nextjs";
// import Image from "next/image";
import Link from "next/link";
import careAssistIcon from "../../../../../public/careAssistIcon.svg";
import { RichText as JssRichText } from "@sitecore-content-sdk/nextjs";
import { ChartwellLink } from "components/chartwellComponents/ui/link/ChartwellLink";
import { ResidenceListModel } from "src/models/Residence";
import { useI18n } from "next-localization";
import { promoDataHandler } from "lib/helpers/residence-helpers";
import PropertyAddress from "../PropertyAddress/PropertyAddress";
import { renderPromoOpenHouseBannerOnCards } from "lib/helpers/residence-helpers";
import { useSitecoreContext } from "lib/sitecore/useSitecoreContext";
// import { resolveHref } from "lib/helpers/utils/resolve-href";

export const ProvinceResidenceCard = ({
  // imageSrc
  residenceId,
  residence,
  residenceImage,
  url,
  residenceName,
  // residenceAddress,
  livingOption,
  livingOptions,
  language,
  bookATourLink,
  // contactNumber,
  careServiceAvailable,
  propertySuitPlans,
}: ResidenceListModel) => {
  const { t: dictionary } = useI18n();
  const { sitecoreContext } = useSitecoreContext();
  const promoInfo = propertySuitPlans ? promoDataHandler(propertySuitPlans, sitecoreContext, dictionary) : undefined;
  const isPromo = promoInfo?.isPromo ?? false;
  const textRegularPrice = promoInfo?.textRegularPrice ?? "";
  const textPromoPrice = promoInfo?.textPromoPrice ?? "";
  const promoPrices = promoInfo?.promoPrices ?? [];
  const regularPrices = promoInfo?.regularPrices ?? [];
  // const openHouseRibbonText = "";
  const openHouseRibbonText = renderPromoOpenHouseBannerOnCards(sitecoreContext, residenceId, language);
  // const residenceUrl = resolveHref(url);
  // const bookTourUrl = resolveHref(bookATourLink);
  // console.log(residenceId);

  return (
    <>
      <li className=" group  border-[1px] border-ChartwellGrey-200 bg-white flex flex-col standardResidenceCard">
        <div>
          <div className="relative overflow-hidden">
            {url && (
              <Link aria-label={residenceName} title={residenceName} href={url} locale={language}>
                <NextImage width={500} height={220} field={residenceImage} className="w-full h-[220px] object-cover" />
              </Link>
            )}
            {!url && <NextImage width={500} height={220} field={residenceImage} className="w-full h-[220px] object-cover" />}
          </div>
          {openHouseRibbonText && (
            <div className="w-full">
              {/* Visible diagonal ribbon */}
              <div className="bg-ChartwellWhite px-12 py-1 bg-gradient-to-r from-[#A6CEE6] via-[#E3E7F3]/[0.96] to-white/0 ">
                <JssRichText field={openHouseRibbonText} tag="div" className=" text-center openhouse-ribbon" />
              </div>
            </div>
          )}
          {promoPrices?.length || regularPrices?.length ? (
            <div className=" w-full">
              <p className={`m-0 p-2 ChartwellText text-[0.88rem] w-full py-3 text-center text-ChartwellWhite ${isPromo ? "bg-ChartwellBlue" : "bg-ChartwellPlum"}`}>
                {isPromo ? textPromoPrice : textRegularPrice}
              </p>
            </div>
          ) : null}
        </div>

        <div className="px-3 md:px-6 py-2 flex flex-col">
          {url ? (
            <Link href={url} className="flex my-3 text-ChartwellPlum no-underline font-bold text-[1.2rem]" locale={language}>
              {residenceName}
            </Link>
          ) : (
            <span className="text-ChartwellPlum font-bold text-[1.2rem]">{residenceName}</span>
          )}
          {/* Need to confirm with Shirin */}
          {/* {JSON.stringify(residence)} */}
          <PropertyAddress propertyData={residence} mapLink={false} />
          <p className="mt-4 mb-0 text-ChartwellPlum font-semibold text-[1.05rem]">{dictionary("ResidenceCardLivingOptionTitle")}</p>
          <ul className="flex flex-col gap-0">
            {livingOption?.map((option, index) => {
              const careServiceIcon = livingOptions?.find((item: any) => item?.careServiceName?.value === option)?.careServiceIcon?.jsonValue?.value || "";
              return (
                <li key={index} className="text-[0.95rem] flex gap-1 items-center m-0 p-0">
                  <NextImage field={careServiceIcon} width={20} height={20} className="object-contain ml-1 mr-3" />
                  {option}
                </li>
              );
            })}
          </ul>
        </div>

        <div className="px-3 md:px-6 mt-auto">
          {careServiceAvailable && (
            <div className="flex items-center pb-0 border-b border-ChartwellGrey-200">
              <svg width="32" height="32">
                <image href={careAssistIcon.src} width="32" height="32" />
              </svg>
              <p className="ml-2 text-[0.95rem] text-ChartwellPurple">{dictionary("careServiceAvailableText")}</p>
            </div>
          )}
          <div className="flex py-3 justify-between">
            <ChartwellLink
              locale={language}
              ariaLabel={`${dictionary("ResidenceCardLearnMore")} ${residenceName}`}
              href={url}
              label={dictionary("ResidenceCardLearnMore")}
              tailwindStyles="block !py-2 !px-3 !mt-0 !mt-auto mr-6 rounded-[8px] min-h-[50px] flex items-center"
              textStyles="md:text-[1rem] sm:text-md"
            />
            {/* <Link href={`tel:${contactNumber}`} passHref className="block xs:hidden border-2 w-fit border-ChartwellPlum py-2 px-2 mb-4 no-underline">
              <div className="flex justify-center items-center text-ChartwellPlum rounded-[8px]">
                <svg width="22" height="22" className="block mr-2">
                  <image href={Phone.src} width="22" height="22" />
                </svg>
                {contactNumber}
              </div>
            </Link> */}
            {bookATourLink && (
              <ChartwellLink
                href={bookATourLink}
                locale={language}
                ariaLabel={`${dictionary("bookatour")} ${residenceName}`}
                label={dictionary("bookatour")}
                tailwindStyles="white-on-blue-background !py-2 !px-3 !mt-auto chartwellPropCardBATBtn rounded-[8px] min-h-[50px] flex items-center"
                textStyles="font-semibold md:text-[1rem] sm:text-md"
              />
            )}
          </div>
        </div>
      </li>
    </>
  );
};
