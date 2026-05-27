import { ChangeEvent } from "react";
import { isThisPostalCode } from "lib/helpers/utils/postalcode-matcher";
import { useI18n } from "next-localization";
interface iProps {
  styles?: string;
  setSearchTerm: (value: string) => void;
  setIsSearching: (isSearching: boolean) => void;
  // setIsNearMe: (isNearMe: boolean) => void;
}
export const FakeSearchInput = ({ setSearchTerm, styles, setIsSearching }: iProps) => {
  const { t: dictionary } = useI18n();

  const fakeSearchInputHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const trimmedValue = value.trim();
    const ArrayValues = trimmedValue.split(" ");

    if (ArrayValues.length > 1 && ArrayValues[1].length >= 4) {
      setSearchTerm(ArrayValues[1]);
      setIsSearching(true);
      return;
    }

    if (ArrayValues[0].startsWith("char")) {
      // setIsNearMe(false);
      return;
    }

    if (trimmedValue.length < 3) {
      // setIsNearMe(false);
      setIsSearching(false);
      setSearchTerm("");
      return;
    }
    // setIsNearMe(false);
    setSearchTerm("");

    if (isThisPostalCode(trimmedValue)) {
      setSearchTerm(trimmedValue);
    } else if (trimmedValue.length >= 4) {
      setSearchTerm(trimmedValue);
    } else {
      setIsSearching(false);
      setSearchTerm("");
      return;
    }

    setIsSearching(true);
    e.target.value = "";
  };

  return (
    <div className={`${styles} w-[300px] sm:[370px] md:w-[340px]`}>
      <label htmlFor="search" className="sr-only">
        {dictionary("InputPlaceholder")}
      </label>
      <div className="relative  flex items-center ">
        <input
          placeholder={dictionary("InputPlaceholder")}
          onChange={(e) => fakeSearchInputHandler(e)}
          type="search"
          name="search"
          id="search"
          className="bg-ChartwellWhite block w-full py-1.5 pl-4  pr-4 text-ChartwellGrey border placeholder:text-[0.8rem] md:placeholder:text-[0.9rem]  placeholder:text-ChartwellGrey  md:text-[0.9rem]"
        />
      </div>
    </div>
  );
};
