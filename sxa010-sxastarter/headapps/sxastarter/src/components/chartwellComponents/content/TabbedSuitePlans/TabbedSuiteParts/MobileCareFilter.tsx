import type { Dispatch, SetStateAction } from "react";

interface MobileCareFilterProps {
  selected: string;
  suitePlansData: any;
  setSelected: Dispatch<SetStateAction<string>>;
  setCurrentIndex: Dispatch<SetStateAction<number>>;
  setSelectedCareLevel: Dispatch<SetStateAction<number | null>>;
  suiteDictItems: any;
}

export const MobileCareFilter = ({ selected, suitePlansData, setSelected, setCurrentIndex, setSelectedCareLevel, suiteDictItems }: MobileCareFilterProps) => {
  return (
    <>
      <label htmlFor="careLevel" className="block text-sm font-medium leading-6 text-gray-900">
        {suiteDictItems.suiteSelectLivingOption}
      </label>
      <div className="relative mt-2">
        <select
          id="careLevel"
          className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-ChartwellGrey text-sm"
          value={selected}
          onChange={(e) => {
            const care = e.target.value;
            const selectedIndex = suitePlansData?.data?.careLevels.findIndex((item: any) => item === care);
            setSelected(care);
            setCurrentIndex(0);
            setSelectedCareLevel(selectedIndex);
          }}
        >
          {(suitePlansData?.data?.careLevels as Array<string>).map((care: string, index: number) => (
            <option key={index} value={care}>
              {care}
            </option>
          ))}
        </select>
      </div>
    </>
  );
};
