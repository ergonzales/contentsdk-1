import { ChartwellModal } from "components/chartwellComponents/ui/modal/ChartwellModal";
import { FilterOptions } from "components/chartwellComponents/ui/FilterOptions/FilterOptions";
import { CareServices } from "src/models/Residence";
interface IProps {
  isFilterOpen: boolean;
  setIsFilterOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setMaxDistance: React.Dispatch<React.SetStateAction<number>>;
  isMobile: boolean;
  selectedFilterOptions: CareServices[];
  setSelectedFilterOptions: React.Dispatch<React.SetStateAction<CareServices[]>>;
  ResidencesList: any[];
  resultsRef: React.RefObject<HTMLDivElement | null>;
  handlerFilterOption: (e: React.ChangeEvent<HTMLInputElement>, index: number) => void;
}
export const MobileModalFilterOptions = ({
  isMobile,
  isFilterOpen,
  setIsFilterOpen,
  setMaxDistance,
  selectedFilterOptions,

  ResidencesList,
  resultsRef,
  handlerFilterOption,
}: IProps) => {
  return (
    <ChartwellModal open={isFilterOpen} setOpen={setIsFilterOpen} setMaxDistance={setMaxDistance} styles="flex flex-col justify-center items-center relative z-999">
      <div className="bg-ChartwellWhite px-4 w-full h-full  overflow-y-auto">
        <div className="py-4">
          {ResidencesList.length > 0 && (
            <FilterOptions isMobile={isMobile} isFilterOpen={isFilterOpen} setIsFilterOpen={setIsFilterOpen} ref={resultsRef} filterOptions={selectedFilterOptions} onChange={handlerFilterOption} />
          )}
        </div>
      </div>
    </ChartwellModal>
  );
};
