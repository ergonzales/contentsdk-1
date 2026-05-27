import { Field, RichText } from "@sitecore-content-sdk/nextjs";
import { useState, JSX } from "react";
import { Filter } from "src/models/Filter";

export type CheckboxFiltersType = {
  title: Field<string>;
  filters: Filter[];
  onFilterClick: (e: any) => void;
};

const CheckboxFilters = (props: CheckboxFiltersType): JSX.Element => {
  const [hasTouch, setHasTouch] = useState(false);

  function handleTouch(e: any, filter: Filter) {
    e.preventDefault();
    props.onFilterClick(filter.name);
    setHasTouch(true);
  }

  function handleClick(e: any, filter: Filter) {
    if (!hasTouch) {
      e.preventDefault();
      props.onFilterClick(filter.name);
    }

    setHasTouch(false);
  }
  return (
    <div className={`checkbox-filter flex max-w-[1900px] px-8 mx-auto`}>
      <RichText className="flex whitespace-nowrap text-ChartwellPlum font-bold mr-6" field={props.title}></RichText>
      <div className="flex flex-wrap">
        {props.filters.map((filter, index: number) => {
          return (
            <div
              className="cursor-pointer flex items-center mr-8 mb-2"
              key={index}
              onClick={(e) => {
                handleClick(e, filter);
              }}
              onTouchStart={(e) => {
                handleTouch(e, filter);
              }}
            >
              <label className="cursor-pointer text-ChartwellPlum font-medium flex items-center">
                <input
                  className={`h-4 min-h-[16px] w-4 min-w-[16px] ${
                    filter.value === false ? "appearance-none" : ""
                  } focus:outline-ChartwellBlue group cursor-pointer outline outline-2 outline-ChartwellPlum rounded-[1px] mr-3`}
                  readOnly
                  checked={filter.value}
                  type="checkbox"
                />
                {filter.label || filter.name}
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CheckboxFilters;
