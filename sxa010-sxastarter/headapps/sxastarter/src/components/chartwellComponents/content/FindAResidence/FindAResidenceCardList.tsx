import { ResidenceListModel, CareServices } from "src/models/Residence";
import { FindAResidenceCard } from "./FindAResidenceCard";
import { useI18n } from "next-localization";
export const FindAResidenceCardList = ({
  residences,
  selectedOptions,
  type,
  nearMePostalCode,
  maxDistance,
  city,
}: // isNearMe,
{
  residences: any[];
  selectedOptions: CareServices[];
  type: string;
  nearMePostalCode?: string;
  maxDistance?: number;
  city?: string;
  // isNearMe?: boolean;
}) => {
  const { t: dictionary } = useI18n();
  const filterResidencesBySelectedOptions = (residences: ResidenceListModel[], selectedOptions: CareServices[]): ResidenceListModel[] => {
    if (selectedOptions?.length === 0) {
      return residences;
    }

    return residences.filter((res) => {
      const livingOptionIds = new Set(res.livingOptions.map((livingOption: CareServices) => livingOption.id));
      return selectedOptions?.every((option) => livingOptionIds.has(option.id));
    });
  };

  const FilterResidences = filterResidencesBySelectedOptions(residences, selectedOptions);
  let Element;
  switch (type) {
    case "ByPostalCode":
      Element = <h3 className="text-ChartwellGrey">{dictionary("ByPostalCode").replace("{results}", String(FilterResidences?.length))}</h3>;
      break;
    case "ByCity":
      Element = (
        <h3>
          <span className="text-ChartwellGrey">{dictionary("ByCity")}:</span> <span>{city}</span>
        </h3>
      );
      break;
    case "ByResidenceName":
      Element = <h3 className="mt-8 text-ChartwellGrey">{dictionary("ByResidenceName")}:</h3>;
      break;
    case "DynamicDisplayingNearMe":
      Element = (
        <h3 className="text-ChartwellGrey">
          {dictionary("DynamicDisplayingNearMe", { nearMePostalCode: nearMePostalCode?.toUpperCase() || "", distance: maxDistance, count: String(FilterResidences?.length) })}
        </h3>
      );
      break;
    default:
      Element = <></>;
      break;
  }
  return FilterResidences?.length > 0 ? (
    <div className="p-2 pb-14 sm:pb-0 md:p-6">
      {Element}
      <ul className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 mt-6 pb-14 h-full">
        {FilterResidences.map((residence) => (
          <FindAResidenceCard key={residence.propertyId} {...residence} />
        ))}
      </ul>
    </div>
  ) : (
    <> </>
  );
};
