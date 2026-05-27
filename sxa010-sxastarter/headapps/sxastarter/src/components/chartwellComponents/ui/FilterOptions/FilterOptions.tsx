import { useI18n } from "next-localization";
import { CareServices } from "src/models/Residence";
import { NextImage } from "@sitecore-content-sdk/nextjs";
import { MobileViewResultsButton } from "./MobileViewResultsButton";

export const FilterOptions = ({
  filterOptions,
  onChange,
  ref,
  isMobile,
  setIsFilterOpen,
}: {
  filterOptions: CareServices[];
  onChange: (e: React.ChangeEvent<HTMLInputElement>, index: number) => void;
  ref?: React.RefObject<HTMLDivElement | null>;
  isMobile: boolean;
  isFilterOpen: boolean;
  setIsFilterOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { t: dictionary } = useI18n();

  return filterOptions?.length > 1 ? (
    <div className="mt-2 md:mt-0 mr-auto md:mx-auto sm:flex flex-wrap justify-center items-center md:px-4  z-99 md:bg-ChartwellGrey/5 w-full  md:overflow-hidden mb-0">
      <span className="text-[0.95rem] text-ChartwellGrey">{dictionary("FilterBy")}:</span>

      {filterOptions
        .sort((a: CareServices, b: CareServices) => Number(a.disabled) - Number(b.disabled))
        .map((filter, index) => (
          <div className="cursor-pointer flex items-center  ml-2 " key={index}>
            <label
              className={`cursor-pointer rounded-xl my-2 border   text-ChartwellPlum duration-300 ease-in-out font-medium flex items-center p-2 md:px-3 py-2 ${
                !filter.disabled && filter.selected
                  ? "bg-ChartwellPlum text-white  hover:scale-105"
                  : ` ${filter.disabled ? " border-ChartwellGrey/10 " : "md:hover:bg-ChartwellPlum/20 hover:scale-105 border-ChartwellPlum "} `
              }`}
              tabIndex={filter.disabled ? -1 : 0}
            >
              <input
                className="hidden"
                onChange={(e) => {
                  onChange(e, index);
                }}
                value={filter.id}
                type="checkbox"
                disabled={filter.disabled}
                checked={filter.selected}
                aria-disabled={filter.disabled}
                tabIndex={filter.disabled ? -1 : 0}
              />
              <div className="flex items-center gap-2 relative" tabIndex={filter.disabled ? -1 : 0}>
                <NextImage field={filter.careServiceIcon?.jsonValue?.value} width={24} height={24} className={filter.disabled ? "opacity-50" : ""} />
                <span className={`flex gap-2 items-center ${filter.disabled && "text-ChartwellGrey/90"} font-semibold text-[0.85rem] md:text-[0.9rem]`} tabIndex={filter.disabled ? -1 : 0}>
                  {filter?.careServiceName?.value || filter.field.value}
                </span>
              </div>
            </label>
          </div>
        ))}

      {isMobile && <MobileViewResultsButton ref={ref} setIsFilterOpen={setIsFilterOpen} />}
    </div>
  ) : (
    <></>
  );
};
