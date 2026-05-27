import { SlidersHorizontalIcon } from "lucide-react";
import { useI18n } from "next-localization";
import { NextImage } from "@sitecore-content-sdk/nextjs";
import { CareServices } from "src/models/Residence";
export const MobileFilterOptionButton = ({
  isFilterOpen,
  setIsFilterOpen,
  selectedFilterOptions,
}: {
  isFilterOpen: boolean;
  setIsFilterOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedFilterOptions: CareServices[];
}) => {
  const { t: dictionary } = useI18n();
  const toggleFilterOptions = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const isAtLeastOneSelected = selectedFilterOptions.some((option) => option.selected);
  return (
    <div className="flex justify-start items-center m-2">
      <button onClick={toggleFilterOptions} className=" px-4 py-2 border border-ChartwellPlum rounded-md bg-white ">
        <div className="flex items-center gap-6">
          <span className="text-[0.9rem]   text-ChartwellGrey">{dictionary("FilterBy")}:</span>
          {isAtLeastOneSelected ? (
            <ul role="list" className="flex gap-2">
              {selectedFilterOptions.map((option) => {
                console.log(option);

                return (
                  option.selected && (
                    <li key={option.id}>
                      <NextImage field={option.careServiceIcon?.jsonValue?.value} width={24} height={24} className={option.disabled ? "opacity-50" : ""} />
                    </li>
                  )
                );
              })}
            </ul>
          ) : (
            <SlidersHorizontalIcon width={24} height={24} className="text-ChartwellPlum" />
          )}
        </div>
      </button>
    </div>
  );
};
