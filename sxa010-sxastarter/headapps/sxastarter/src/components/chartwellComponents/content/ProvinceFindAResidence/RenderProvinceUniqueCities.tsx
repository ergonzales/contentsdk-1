import Link from "next/link";
import { ResidenceLink } from "../FindAResidence/ResidenceLink";
import { GoogleMapWrapper } from "./GooleMap/GoogleMapWrappe";
import { useState } from "react";

export const RenderProvinceUniqueCities = ({ residences, selectedOptions }: { residences: any; selectedOptions: any }) => {
  const [isGoogleMapAvailable, setIsGoogleMapAvailable] = useState(true);
  const filterUniqueCitiesBySelectedOptions = (residences: any[], selectedOptions: any): any[] => {
    if (selectedOptions.length === 0) {
      return residences;
    }

    return residences.map((res: any) => {
      return {
        ...res,
        residences: res.residences?.filter((res: any) => selectedOptions.every((option: any) => res.livingOptions?.find((opt: any) => opt.id === option.id && option.selected))),
      };
    });
  };

  const uniqueFilteredResidences = filterUniqueCitiesBySelectedOptions(residences, selectedOptions);
  const resMapList = uniqueFilteredResidences.flatMap((res) => res.residences).filter((res) => res !== undefined && res !== null && Object.keys(res).length > 0);

  return (
    <div className="sm:grid md:grid-cols-6 ">
      <div className="sm:h-fit col-span-4 grid md:grid-cols-2  gap-4 py-8">
        {uniqueFilteredResidences?.map((data: any, index: number) => {
          return (
            data.residences?.length !== 0 && (
              <div key={`city-${data.id}-${index}`}>
                {data?.CityLandingPage?.url ? (
                  <Link className="text-ChartwellPlum no-underline font-bold m-0" href={data?.CityLandingPage?.url?.path} locale={data?.CityLandingPage?.language?.name}>
                    {data.cityDisplayName}
                  </Link>
                ) : (
                  <p className="city whitespace-normal font-bold m-0">{data.cityDisplayName}</p>
                )}

                <ul className="ml-4">
                  {data.residences?.map((res: any, resIndex: number) => (
                    <ResidenceLink key={`residence-${res?.residenceId}-${resIndex}`} styles="text-ChartwellGrey" residenceName={res?.residenceName} url={res?.url || ""} language={res?.language} />
                  ))}
                </ul>
              </div>
            )
          );
        })}
      </div>
      {isGoogleMapAvailable && (
        <div className="col-span-2 hidden md:block">
          <div className="sticky top-0">
            <GoogleMapWrapper setIsGoogleMapAvailable={setIsGoogleMapAvailable} zoom={6} residences={resMapList} />
          </div>
        </div>
      )}
    </div>
  );
};
