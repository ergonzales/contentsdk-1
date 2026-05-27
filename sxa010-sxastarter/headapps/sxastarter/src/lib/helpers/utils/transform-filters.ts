import { CareService } from "src/models/CareService";
import { Filter } from "src/models/Filter";

export const getFilterStringArray = (inputFilterString: string): string[] => {
  // Ex. 'long_term_care|memory_living' -> ['long_term_care', 'memory_living']
  return inputFilterString.split("|").filter((element) => element !== "");
};

export const filterStringContains = (filterString: string, targetFilterElement: string) => {
  return filterString.split("|").includes(targetFilterElement);
};

export const convertFilterStringToFilters = (filterString: string, availableFilters: CareService[]): Filter[] => {
  return availableFilters.map((availableFilterElement) => {
    return {
      name: availableFilterElement.value,
      value: filterStringContains(filterString, availableFilterElement.value),
      label: availableFilterElement.label,
    };
  });
};

export const onlyIncludeValidFilters = (
  inputFilterString: string, // Ex. long_term_care|memory_living
  availableFilters: string[] // Ex. ['long_term_care', 'memory_living']
): string => {
  const filterStringArray = getFilterStringArray(inputFilterString);
  return filterStringArray.filter((filterString) => availableFilters.includes(filterString)).join("|");
};

export const addNewValue = (existingFilterString: string, newFilterString: string): any => {
  return existingFilterString.split("|").concat(newFilterString).join("|");
};

export const removeValue = (existingFilterString: string, filterStringToBeReemoved: string): any => {
  return existingFilterString
    .split("|")
    .filter((filterString) => filterString !== filterStringToBeReemoved)
    .join("|");
};
