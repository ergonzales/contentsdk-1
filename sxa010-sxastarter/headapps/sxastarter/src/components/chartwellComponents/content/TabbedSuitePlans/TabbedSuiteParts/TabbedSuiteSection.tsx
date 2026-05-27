import { ChartwellLink } from "components/chartwellComponents/ui/link/ChartwellLink";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { NextImage } from "@sitecore-content-sdk/nextjs";
import { useI18n } from "next-localization";
import { useState } from "react";
import { HeadingLevel } from "../../../ui/HeadingLevel/HeadingLevel";
import { MobileCareFilter } from "./MobileCareFilter";
import { ListOfFeature } from "./ListOfFeature";
import { SuitePlansPriceAndTitle } from "./SuitePlansPriceAndTitle";
import { getGroupedSuitePlans } from "lib/helpers/residence-helpers";
import { useSitecoreContext } from "lib/sitecore/useSitecoreContext";

export const TabbedSuiteSection = ({ props, chatBotExcludeCareLevels }: { props?: any; chatBotExcludeCareLevels?: any }) => {
  const { t: dictionary } = useI18n();

  const excludeCareLevels = (props?.fields?.SuitePlans?.length > 0 ? props?.fields?.SuitePlans : chatBotExcludeCareLevels) || [];
  const { sitecoreContext } = useSitecoreContext();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCareLevel, setSelectedCareLevel] = useState(0);
  const suitePlansData = getGroupedSuitePlans({ sitecoreContext, selectedCareLevel, currentIndex, dictionary, excludeCareLevels }) || {};
  const [selected, setSelected] = useState(suitePlansData?.data?.careLevels[0]);

  if (!suitePlansData?.data?.suitePlans) return <></>;

  const BgImage = props?.fields && props.fields["background image"] && props.fields["background image"].value?.src;
  const customSuiteTitle = suitePlansData?.data?.selectedSuitePlan?.fields?.find((item: any) => item?.name === "Hospitality Services")?.jsonValue?.length !== 0;
  const { suiteDictItems } = suitePlansData?.data;

  return suitePlansData?.data?.suitePlans && suitePlansData?.data?.suitePlans?.length ? (
    <>
      <div className="w-full pt-8">
        {props && <HeadingLevel headingLevel={props.fields["Heading Level"]} titleText={props.fields.Title} styles="text-center mb-4" />}
        <div className="w-full bg-no-repeat bg-cover" style={{ backgroundImage: `url(${BgImage})` }}>
          <div className="ChartwellContainer SectionPadding ">
            <>
              <div className={`bg-ChartwellWhite p-4 lg:p-8 `}>
                <div className="">
                  {/* desktop care filter */}
                  <ul className="hidden lg:flex items-center justify-center  w-fit mx-auto  outline outline-1 rounded-2xl outline-ChartwellPlum overflow-hidden">
                    {suitePlansData?.data?.careLevels &&
                      suitePlansData?.data?.careLevels?.map((care: any, index: any) => {
                        const careLevelIcon = suitePlansData?.data?.careLevelObj?.find((item: any) => item.name === care)?.icon;
                        return (
                          <li
                            key={`care-level-${index}`}
                            onClick={() => {
                              setCurrentIndex(0);
                              setSelectedCareLevel(index);
                            }}
                            className={` ${
                              suitePlansData?.data?.careLevels.length > 1 && "cursor-pointer duration-300 ease-in-out  "
                            }  rounded-xl     text-ChartwellPlum  font-medium flex items-center p-2 md:px-3 py-2 outline outline-1 outline-transparent  ${
                              selectedCareLevel === index ? "bg-ChartwellPlum text-white outline-ChartwellPlum " : ` md:hover:bg-ChartwellPlum/20  "} `
                            }`}
                          >
                            <span className={` flex gap-2 font-semibold text-[0.85rem] md:text-[0.9rem]`}>
                              <NextImage field={careLevelIcon} width={20} height={20} className="object-contain" />
                              <span>{care}</span>
                            </span>
                          </li>
                        );
                      })}
                  </ul>
                  {/* desktop suite filter */}
                  <ul className="hidden lg:flex items-center justify-center mt-4 mb-8 ">
                    {suitePlansData?.data?.suitePlans &&
                      suitePlansData?.data?.suitePlans.map((data: any, index: any) => {
                        const suiteNameWithFractions = data?.fields?.find((item: any) => item?.name === "SuiteName")?.jsonValue?.fields?.suiteType?.value; //suiteName?.targetItem?.field?.value.replace("1/2", "<sup>1</sup>&frasl;<sub>2</sub>");
                        return (
                          <li
                            key={`suite-plan-${data.id || index}`} // Use index as fallback if data.id is undefined
                            onClick={() => setCurrentIndex(index)}
                            className={`ChartwellTitleH3 relative px-6 ${
                              index === currentIndex ? "bg-ChartwellWhite text-ChartwellPlum" : ""
                            } hover:bg-ChartwellWhite focus:bg-ChartwellWhite group cursor-pointer ease-in-out duration-300 ml-1 group flex items-center gap-2`}
                          >
                            <span className={` text-[1.25rem] group-hover:text-ChartwellPlum group-focus:text-ChartwellPlum  uppercase  relative p-0 m-0`}>
                              <span dangerouslySetInnerHTML={{ __html: suiteNameWithFractions }} />
                              <span
                                className={`absolute w-full h-[2px] bg-ChartwellPlum bottom-[-20%] left-0  scale-0 group-hover:scale-100 duration-300 opacity-0  group-hover:opacity-100  group-focus:scale-100  group-focus:opacity-100 ${
                                  index === currentIndex ? "opacity-100 scale-100" : ""
                                }`}
                              ></span>
                            </span>
                          </li>
                        );
                      })}
                  </ul>
                </div>

                <div className="lg:hidden">
                  <MobileCareFilter
                    selected={selected}
                    suitePlansData={suitePlansData}
                    setSelected={setSelected}
                    setCurrentIndex={setCurrentIndex}
                    setSelectedCareLevel={setSelectedCareLevel}
                    suiteDictItems={suiteDictItems}
                  />
                </div>

                <div className="lg:grid lg:grid-cols-6 lg:mt-6">
                  <SuitePlansPriceAndTitle wrapperStyle={"flex flex-col items-center lg:hidden mt-6"} suitePlansData={suitePlansData} />
                  <div className="mt-4 md:mt-0 md:col-span-2 px-4 relative">
                    <div className="relative w-fit mx-auto">
                      <NextImage width={300} height={300} className=" " field={suitePlansData?.data?.selectedSuitePlan?.fields?.find((item: any) => item?.name === "SuiteImage")?.jsonValue?.value} />
                      {/* custom promo: Popular etc. */}
                      {suitePlansData?.data?.selectedSuitePlan?.fields?.find((item: any) => item?.name === "SuiteCustomPromo")?.jsonValue?.value &&
                        suitePlansData?.data?.selectedSuitePlan?.suiteCustomPromo.length !== 0 && (
                          <span
                            className={` duration-300  ease-in-out -top-4  uppercase -right-2 absolute text-black  bg-ChartwellYellow   rounded-l-md shadow-sm shadow-ChartwellYellow rounded-md  py-[4px] px-3 md:px-3 md:py-1  text-[0.7rem] lg:text-[0.85rem] `}
                          >
                            {suitePlansData?.data?.selectedSuitePlan?.fields?.find((item: any) => item?.name === "SuiteCustomPromo")?.jsonValue?.value}
                            <span className={`block right-0 absolute w-0 h-0 border-t-[14px] md:border-t-[10px] border-t-ChartwellYellow    border-r-[8px] border-r-transparent `}></span>
                          </span>
                        )}
                    </div>

                    <button
                      onClick={() => setCurrentIndex(currentIndex === suitePlansData?.data?.suitePlans.length - 1 ? 0 : currentIndex + 1)}
                      type="button"
                      className="lg:hidden z-10 absolute top-[50%] right-[-6%] sm:right-[2%] translate-y-[-50%]"
                    >
                      <ChevronRightIcon className=" w-[45px] h-[45px]  fill-ChartwellGrey-100 hover:fill-ChartwellGrey" />
                    </button>
                    <button
                      onClick={() => setCurrentIndex(currentIndex === 0 ? suitePlansData?.data?.suitePlans.length - 1 : currentIndex - 1)}
                      type="button"
                      className=" lg:hidden z-10 absolute top-[50%] left-[-6%] sm:left-[2%] translate-y-[-50%]"
                    >
                      <ChevronLeftIcon className=" w-[45px] h-[45px]  fill-ChartwellGrey-100  hover:fill-ChartwellGrey" />
                    </button>
                  </div>
                  <div className=" lg:col-span-4 lg:p-6">
                    <div className="lg:flex justify-between items-center">
                      <SuitePlansPriceAndTitle wrapperStyle={"hidden lg:flex lg:flex-col lg:items-start"} suitePlansData={suitePlansData} />
                      {suitePlansData?.data?.selectedSuitePlan &&
                        suitePlansData?.data?.selectedSuitePlan?.fields?.find((item: any) => item?.name === "CTA Link")?.jsonValue?.value &&
                        suitePlansData?.data?.selectedSuitePlan?.fields?.find((item: any) => item?.name === "CTA Link")?.jsonValue?.value?.href?.length !== 0 && (
                          <ChartwellLink
                            href={suitePlansData?.data?.selectedSuitePlan?.fields?.find((item: any) => item?.name === "CTA Link")?.jsonValue?.value?.href}
                            label={suitePlansData?.data?.selectedSuitePlan?.fields?.find((item: any) => item?.name === "CTA Text")?.jsonValue?.value}
                            target={suitePlansData?.data?.selectedSuitePlan?.fields?.find((item: any) => item?.name === "CTA Target")?.jsonValue?.value}
                            tailwindStyles="p-2  w-fit    lg:mb-6 !bg-ChartwellBlue !border-ChartwellBlue !block !my-6 lg:!my-0 mx-auto lg:mx-0"
                            textStyles="!text-ChartwellWhite "
                            // linkId={suitePlansData?.data?.selectedSuitePlan?.ctaLink?.id}
                          />
                        )}
                    </div>
                    {suitePlansData?.data?.selectedSuitePlan?.fields?.find((item: any) => item?.name === "Key Features")?.jsonValue?.length !== 0 && (
                      <div className="pb-4 hidden md:block">
                        <ListOfFeature
                          featureList={suitePlansData?.data?.selectedSuitePlan?.fields?.find((item: any) => item?.name === "Key Features")?.jsonValue}
                          title={customSuiteTitle ? suitePlansData?.data?.suiteDictItems.suiteHospitalityRentInclusion : suitePlansData?.data?.suiteDictItems.keyFeaturesText}
                        />
                      </div>
                    )}
                    {suitePlansData?.data?.selectedSuitePlan?.fields?.find((item: any) => item?.name === "Hospitality Services")?.jsonValue?.length !== 0 && (
                      <div className="pb-4 hidden md:block">
                        <ListOfFeature
                          featureList={suitePlansData?.data?.selectedSuitePlan?.fields?.find((item: any) => item?.name === "Hospitality Services")?.jsonValue}
                          title={suitePlansData?.data?.suiteDictItems.hospitalityServicesText}
                        />
                      </div>
                    )}

                    {suitePlansData?.data?.selectedSuitePlan?.fields?.find((item: any) => item?.name === "Optional features")?.jsonValue?.length !== 0 && (
                      <div className="pt-6 border-t-2 border-ChartwellPlum hidden md:block">
                        <ListOfFeature
                          featureList={suitePlansData?.data?.selectedSuitePlan?.fields?.find((item: any) => item?.name === "Optional features")?.jsonValue}
                          title={customSuiteTitle ? suitePlansData?.data?.suiteDictItems.suiteHospitalityAdditionalServices : suitePlansData?.data?.suiteDictItems.optionalServicesText}
                        />
                      </div>
                    )}

                    <ul className="md:hidden  ">
                      {suitePlansData?.data?.selectedSuitePlan?.fields?.find((item: any) => item?.name === "Key Features")?.jsonValue.length !== 0 && (
                        <li className="">
                          <ListOfFeature
                            featureList={suitePlansData?.data?.selectedSuitePlan?.fields?.find((item: any) => item?.name === "Key Features")?.jsonValue}
                            title={customSuiteTitle ? suitePlansData?.data?.suiteDictItems.suiteHospitalityRentInclusion : suitePlansData?.data?.suiteDictItems.keyFeaturesText}
                            itemStyles="list-disc  ml-[10px] mt-1 first:mt-0"
                            listStyle=" border-t-[2px] mt-2 border-ChartwellPlum py-2 md:p-2  marker:text-ChartwellGrey marker:text-[0.75rem]"
                          />
                        </li>
                      )}
                      {suitePlansData?.data?.selectedSuitePlan?.fields?.find((item: any) => item?.name === "Hospitality Services")?.jsonValue.length !== 0 && (
                        <li className="">
                          <ListOfFeature
                            featureList={suitePlansData?.data?.selectedSuitePlan?.fields?.find((item: any) => item?.name === "Hospitality Services")?.jsonValue}
                            title={customSuiteTitle ? suitePlansData?.data?.suiteDictItems.suiteHospitalityRentInclusion : suitePlansData?.data?.suiteDictItems.hospitalityServicesText}
                            itemStyles="list-disc  ml-[10px] mt-1 first:mt-0"
                            listStyle=" border-t-[2px] mt-2 border-ChartwellPlum py-2 md:p-2  marker:text-ChartwellGrey marker:text-[0.75rem]"
                          />
                        </li>
                      )}

                      {suitePlansData?.data?.selectedSuitePlan?.fields?.find((item: any) => item?.name === "Optional features")?.jsonValue.length !== 0 && (
                        <li className="  mt-6 ">
                          <ListOfFeature
                            featureList={suitePlansData?.data?.selectedSuitePlan?.fields?.find((item: any) => item?.name === "Optional features")?.jsonValue}
                            title={customSuiteTitle ? suitePlansData?.data?.suiteDictItems.suiteHospitalityAdditionalServices : suitePlansData?.data?.suiteDictItems.optionalServicesText}
                            itemStyles="list-disc  ml-[10px] mt-1 first:mt-0"
                            listStyle=" border-t-[2px] mt-2 border-ChartwellPlum py-2 md:p-2  marker:text-ChartwellGrey marker:text-[0.75rem]"
                          />
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
                <div className="border-t-[2px] mt-4 border-ChartwellPlum">
                  {suitePlansData?.data?.suiteDictItems?.DisclaimerText && (
                    <div className="mt-2 ChartwellText text-[0.75rem]" dangerouslySetInnerHTML={{ __html: `${suitePlansData?.data?.suiteDictItems?.DisclaimerText}` }}></div>
                  )}
                </div>
              </div>
            </>
          </div>
        </div>
      </div>
    </>
  ) : (
    <></>
  );
};
