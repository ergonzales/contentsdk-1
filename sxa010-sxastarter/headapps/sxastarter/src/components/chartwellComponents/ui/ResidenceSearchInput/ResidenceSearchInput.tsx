import { ChangeEvent, Dispatch, SetStateAction, useEffect, useRef } from "react";
import { isThisPostalCode } from "lib/helpers/utils/postalcode-matcher";
import { useI18n } from "next-localization";
import { useRouter } from "next/router";
interface IProps {
  setIsSearching: Dispatch<SetStateAction<boolean>>;
  setSearchTerm: Dispatch<SetStateAction<string>>;
  searchTerm: string;
  styles?: string;
  isSearchingDefault?: boolean;
  setDefaultValue?: Dispatch<SetStateAction<string>>;
  maxDistance?: number;
  // defaultValue?: string;
  setIsNearMe?: Dispatch<SetStateAction<boolean>>;
  setMaxDistance: Dispatch<SetStateAction<number>>;
}

export const ResidenceSearchInput = ({ setIsSearching, setSearchTerm, searchTerm, styles, maxDistance = 25, setMaxDistance }: IProps) => {
  const { t: dictionary } = useI18n();
  const router = useRouter();

  const inputRef = useRef<any>(null);

  const handlerSearch = async (e: ChangeEvent<HTMLInputElement>): Promise<void> => {
    try {
      const inputValue = e.target.value;
      const trimmedValue = inputValue.trim();

      setMaxDistance(25);
      // if (setIsNearMe !== undefined && setIsNearMe) {
      //   setIsNearMe(false);
      // }
      if (trimmedValue.length < 3) {
        setIsSearching(false);
        setSearchTerm("");
        // if (setIsNearMe) {
        //   setIsNearMe(false);
        // }
        return;
      }
      if (isThisPostalCode(trimmedValue)) {
        setIsSearching(true);
        setMaxDistance(maxDistance);
        // if (setIsNearMe) {
        //   setIsNearMe(false);
        // }

        setSearchTerm(trimmedValue as string);
      } else {
        if (trimmedValue.length < 4) {
          setIsSearching(false);
          setSearchTerm("");
          return;
        }
        setIsSearching(true);
        setSearchTerm(trimmedValue as string);
        // if (setIsNearMe) {
        //   setIsNearMe(false);
        // }
      }
    } catch (error) {
      console.error("Error during search handling:", error);
    }
  };

  useEffect(() => {
    if (!inputRef.current) return;
    inputRef.current.value = searchTerm || "";
    if (searchTerm?.length) inputRef.current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, router.locale]);

  return (
    <div className={`${styles} w-full xs:w-[285px] sm:[370px] md:w-[370px]`}>
      <label htmlFor="search" className="sr-only">
        {dictionary("InputPlaceholder")}
      </label>
      <div className="relative flex items-center ">
        <input
          ref={inputRef}
          placeholder={dictionary("InputPlaceholder")}
          onChange={(e) => handlerSearch(e)}
          type="search"
          name="search"
          id="search"
          className="bg-ChartwellWhite block w-full py-1.5 pl-4  pr-4 text-ChartwellGrey border placeholder:text-[0.8rem] md:placeholder:text-[1rem]  placeholder:text-ChartwellGrey  md:text-[1rem]"
        />
      </div>
    </div>
  );
};
