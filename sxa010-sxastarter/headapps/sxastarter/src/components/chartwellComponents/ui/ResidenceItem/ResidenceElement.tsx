// import { useMemo } from "react";
import careAssistIcon from "../../../../../public/careAssistIcon.svg";
// import { getCareServicesIcon } from "../CareServicesIcon/getCareServicesIcon";
import { useI18n } from "next-localization";
import { useRouter } from "next/router";
import { NextImage } from "@sitecore-content-sdk/nextjs";
import Link from "next/link";

interface IProps {
  language: string;
  bilingual: boolean;
  residenceName: string;
  residenceAddress: string;
  url: string;
  livingOption: string[];
  livingOptions: any[];
  // assignedPromos: string;
  careServiceAvailable: boolean;
}

export const ResidenceElement = ({ url, language, residenceName, residenceAddress, livingOption, livingOptions, careServiceAvailable, bilingual }: IProps) => {
  const { t: dictionary } = useI18n();
  const router = useRouter();

  // Memoize bilingualUrl so it updates on language switch
  // const bilingualUrl = useMemo(() => {
  //   return bilingual ? (router.locale === "fr" ? `/fr${url}` : url) : language === "fr" ? `/fr${url}` : url;
  // }, [bilingual, url, language, router.locale]);

  return (
    <li key={router.locale} className="p-6 bg-ChartwellGrey-10 mt-6 cursor-pointer md:hover:scale-105 duration-300 eas-in-out rounded-md md:hover:shadow-md">
      <Link className="no-underline block  text-ChartwellGrey" href={`${url}`} target="_self" rel="noopener noreferrer" locale={router.locale} passHref>
        <div className="md:flex items-center justify-between">
          <div>
            <h3 className="text-left text-[1.5rem] md:text-[1.6rem]">{residenceName}</h3>
            <p className="my-2 text-[0.9rem] ">{residenceAddress}</p>
            <ul className="flex flex-wrap items-center gap-2 sm:gap-0">
              {livingOption?.map((option, index) => {
                const icon = livingOptions?.find((item: any) => item?.careServiceName?.value === option)?.careServiceIcon?.jsonValue?.value || "";
                const careServiceName = livingOptions?.find((item: any) => item?.careServiceName?.value === option)?.careServiceName?.value || "";
                return (
                  <li className="text-[0.9rem] m-0 sm:border-r pr-2 pl-2 sm:first:pl-0 border-ChartwellGrey last:border-0 last:pr-0 flex gap-2 items-center " key={index}>
                    {/* {getCareServicesIcon(option, 20, 20, "")} */}
                    <NextImage field={icon} width={20} height={20} alt={option} />
                    <span>{careServiceName}</span>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="md:flex flex-col items-end mt-2 md:mt-0">
            {/* {assignedPromos && <p className=" text-[0.9rem] md:text-[1rem]  my-2">{assignedPromos}</p>} */}
            {careServiceAvailable && (
              <div className="flex items-center">
                <svg width="40" height="40" className="">
                  <image href={`${careAssistIcon.src}`} width="40" height="40" className=" " />
                </svg>
                <p className="ml-2  text-[0.9rem] md:text-[1rem]  my-2">{dictionary("careServiceAvailableText", { language: !bilingual ? router.locale : language })}</p>
              </div>
            )}
          </div>
        </div>
      </Link>
    </li>
  );
};
