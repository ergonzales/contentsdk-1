import Celebration from "../../../../../../public/celebration.svg";

export const SuitePlansPriceAndTitle = ({ suitePlansData, wrapperStyle }: { suitePlansData: any; wrapperStyle: string }) => {
  // const suiteName = suitePlansData?.data?.selectedSuitePlan?.suiteName?.targetItem?.field?.value.replace("1/2", "<sup>1</sup>&frasl;<sub>2</sub>");
  const suiteName = suitePlansData?.data?.selectedSuitePlan?.fields?.find((x: any) => x.name === "SuiteName")?.jsonValue?.fields?.suiteType?.value?.replace("1/2", "<sup>1</sup>&frasl;<sub>2</sub>");

  const isPromo = suitePlansData?.data?.selectedSuitePlan?.isPromo;
  const regularPrice = suitePlansData?.data?.selectedSuitePlan?.textRegularPrice;
  const promoPrice = suitePlansData?.data?.selectedSuitePlan?.textPromoPrice;
  const suiteHospitalityServicesRegularPrice = suitePlansData?.data?.selectedSuitePlan?.textHospitalityServicesRegularPrice;
  const suiteHospitalityServicesPromoPrice = suitePlansData?.data?.selectedSuitePlan?.textHospitalityServicesPromoPrice;

  const hasPrice = suitePlansData?.data?.selectedSuitePlan?.formattedRegularPrice?.length !== 0;
  const customSuiteTitle = suitePlansData?.data?.selectedSuitePlan?.fields?.find((item: any) => item?.name === "Hospitality Services")?.jsonValue?.length !== 0;

  return (
    <div className={wrapperStyle}>
      {/* Suite Name */}
      <h3 className="text-center lg:text-left text-[1.5rem] sm:text-[1.875rem]" dangerouslySetInnerHTML={{ __html: suiteName }} />

      {/* Pricing Section */}
      {hasPrice && (
        <div className="mb-4">
          {isPromo ? (
            <div className="flex flex-col items-center lg:items-start">
              {/* Regular Price */}
              <p className="m-0 p-0 mt-2 ChartwellText text-[0.9rem] sm:text-[1.0625rem] inline relative">
                {customSuiteTitle ? suiteHospitalityServicesRegularPrice : regularPrice}
                <span className="absolute w-full h-[1px] bg-black top-[50%] translate-y-[-50%] left-0"></span>
              </p>

              {/* Promo Price */}
              <p className="m-0 p-0 mt-2 ChartwellText text-ChartwellBlue font-semibold text-[0.875rem] sm:text-[1.125rem] text-center lg:text-left relative">
                <svg width="20" height="20" className="absolute top-0 left-[-8%] hidden sm:block">
                  <image href={`${Celebration.src}`} width="30" height="30" />
                </svg>
                {customSuiteTitle ? suiteHospitalityServicesPromoPrice : promoPrice}
              </p>
            </div>
          ) : (
            <p className="m-0 p-0 mt-2 text-center lg:text-left text-[1rem] sm:text-[1.0625rem] ChartwellText font-bold">{customSuiteTitle ? suiteHospitalityServicesRegularPrice : regularPrice}</p>
          )}
        </div>
      )}
    </div>
  );
};
