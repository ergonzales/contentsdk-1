import { CareServices, ResidenceListModel } from "src/models/Residence";
import { ProvinceResidenceCard } from "./ProvinceResidenceCard";
import { useI18n } from "next-localization";
import { GoogleMapWrapper } from "./GooleMap/GoogleMapWrappe";
import { useState } from "react";
const RenderResidenceItem = ({ res }: { res: ResidenceListModel }) => <ProvinceResidenceCard {...res} />;

export const RenderResidencesByTypes = ({
  residences,
  selectedOptions,
  type = "",
  cityName = "",
  nearMePostalCode,
  maxDistance,
}: {
  residences: any[];
  selectedOptions: CareServices[];
  type: string;
  cityName?: string;
  nearMePostalCode?: string;
  maxDistance?: number;
}) => {
  const { t: dictionary } = useI18n();
  const [isGoogleMapAvailable, setIsGoogleMapAvailable] = useState(true);

  const filterResidencesBySelectedOptions = (residences: any[], selectedOptions: CareServices[]): any[] => {
    if (selectedOptions.length === 0) {
      return residences;
    }

    return residences.filter((res) => {
      const livingOptionIds = new Set(res.livingOptions.map((livingOption: CareServices) => livingOption.id));
      return selectedOptions.every((option) => livingOptionIds.has(option.id));
    });
  };

  const FilterResidences = filterResidencesBySelectedOptions(residences, selectedOptions);

  let Element;
  switch (type) {
    case "DynamicDisplayingNearMe":
      Element = (
        <h3 className="text-ChartwellGrey">
          {dictionary("DynamicDisplayingNearMe", { nearMePostalCode: nearMePostalCode?.toUpperCase() || "", distance: maxDistance, count: String(FilterResidences?.length) })}
        </h3>
      );
      break;
    case "ByCity":
      const citySearchType: boolean = FilterResidences?.some((res) => res.searchType === "city" || res.searchType === "subCity");
      if (!citySearchType) {
        return <></>;
      }
      Element = (
        <h3>
          <span className="text-ChartwellGrey">{dictionary("ByCity")}:</span> <span>{cityName}</span>
        </h3>
      );
      break;
    case "ByResidenceName":
      const residenceSearchType: boolean = FilterResidences?.some((res) => res.searchType === "residence");
      if (!residenceSearchType) {
        return <></>;
      }
      Element = <h3 className="mt-8 text-ChartwellGrey">{dictionary("ByResidenceName")}:</h3>;
      break;
    default:
      Element = <></>;
      break;
  }
  return (
    <div className="">
      {Element}
      <div className="sm:grid md:grid-cols-6 mt-6 bg-ChartwellGrey/5">
        <ul
          className={`${
            type !== "ByResidenceName" && isGoogleMapAvailable ? "col-span-4  sm:grid-cols-2 xl:grid-cols-3" : "col-span-6  md:grid-cols-3 xl:grid-cols-4"
          }  residence-list px-2 md:px-8 grid grid-cols-1 h-fit gap-1 md:gap-6 py-2 md:py-6`}
        >
          {FilterResidences?.map((res) => (
            <RenderResidenceItem key={res.residenceId} res={res} />
          ))}
        </ul>
        {type !== "ByResidenceName" && isGoogleMapAvailable && (
          <div className="col-span-2 hidden md:block ">
            <div className="sticky top-0">
              <GoogleMapWrapper setIsGoogleMapAvailable={setIsGoogleMapAvailable} residences={FilterResidences} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
