/* eslint-disable @typescript-eslint/no-empty-function */
import { createContext, Dispatch, SetStateAction } from "react";

export type SearchContextType = {
  cityOrPostalCode?: string | null;
  setCityOrPostalCode?: Dispatch<SetStateAction<string | null>> | null;
  maxDistance?: number | null;
  setMaxDistance?: Dispatch<SetStateAction<number | null>> | null;
  careServiceFilters?: string | null;
  setCareServiceFilters?: Dispatch<SetStateAction<string | null>> | null;
};

export const SearchContext = createContext<SearchContextType>({
  cityOrPostalCode: null,
  setCityOrPostalCode: null,
  maxDistance: null,
  setMaxDistance: null,
  careServiceFilters: null,
  setCareServiceFilters: null,
});
