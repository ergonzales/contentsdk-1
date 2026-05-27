import { JSX } from "react";
import { useEffect, useState } from "react";

export type DropdownOption = {
  name: string;
  label?: string;
  value: boolean;
};

export type DropdownFilter = {
  title?: string;
  placeholderText?: string;
  initialDropdownOptions: DropdownOption[];
  onValueChange: (newValue: DropdownOption[]) => any;
  disabled?: boolean;
};

const DropdownFilter = (props: DropdownFilter): JSX.Element => {
  const [dropdownOptions, setDropdownOptions] = useState<DropdownOption[]>();
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  useEffect(() => {
    setDropdownOptions([...props.initialDropdownOptions]);
  }, [props.initialDropdownOptions]);

  return (
    <>
      <div className={`dropdown-filter ${props.disabled ? "opacity-50" : ""}`}>
        <div className="text-white text-lg font-bold mb-1">{props.title}</div>
        <div
          className="dropdown-toggle border-solid border-white border-[2px] bg-ChartwellPlum text-white cursor-pointer px-4 py-2"
          onClick={() => {
            if (props.disabled) {
              return;
            }
            setIsDropdownOpen(!isDropdownOpen);
          }}
        >
          {props.placeholderText}
        </div>
        <div className="dropdown-content bg-white">
          {isDropdownOpen ? (
            dropdownOptions?.map((dropdownOption, index: number) => {
              return (
                <div
                  key={index}
                  className="bg-white flex items-center px-4 py-2 cursor-pointer hover:bg-ChartwellPlum hover:bg-opacity-25"
                  onClick={() => {
                    if (props.disabled) {
                      return;
                    }
                    dropdownOption.value = !dropdownOption.value;
                    setDropdownOptions([...dropdownOptions]);
                    props.onValueChange({ ...dropdownOptions });
                  }}
                >
                  <input readOnly checked={dropdownOption.value} type="checkbox" className="h-4 w-4 outline-1 outline-black outline accent-transparent mr-2" />
                  <span>{dropdownOption.label || dropdownOption.name}</span>
                </div>
              );
            })
          ) : (
            <></>
          )}
        </div>
      </div>
    </>
  );
};

export default DropdownFilter;
