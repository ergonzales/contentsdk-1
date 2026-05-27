import { Listbox, ListboxButton, Transition, ListboxOptions, ListboxOption } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { Fragment, Key, type ReactElement, type ReactNode } from "react";

export type SelectorBaseOption = {
  name: string;
  id?: Key;
};

export type SelectorProps<TOption extends SelectorBaseOption> = {
  label: string;
  value: TOption | null;
  options: TOption[];
  onChange: (value: TOption | null) => void;
  disabled?: boolean;
  boxStyles?: string;
  ListboxButtonStyle?: string;
};

type TypedListboxOptionProps<TOption extends SelectorBaseOption> = {
  value: TOption;
  children: ReactNode | ((props: { active: boolean; focus: boolean; selected: boolean; disabled: boolean }) => ReactNode);
  disabled?: boolean;
  className?: string | ((props: { active: boolean; focus: boolean; selected: boolean; disabled: boolean }) => string);
};

const TypedListboxOption = ListboxOption as unknown as <TOption extends SelectorBaseOption>(props: TypedListboxOptionProps<TOption>) => ReactElement | null;

export const Selector = <TOption extends SelectorBaseOption>({ label, value, options, onChange, disabled = false, boxStyles, ListboxButtonStyle }: SelectorProps<TOption>) => {
  return (
    <Listbox<"div", TOption> value={value ?? undefined} onChange={(v) => onChange(v ?? null)} disabled={disabled} by={(a, b) => (a?.id ?? a?.name) === (b?.id ?? b?.name)}>
      {({ open }: { open: boolean }) => (
        <div className={`relative mt-2 min-w-[240px] ${boxStyles || ""}`}>
          <ListboxButton
            className={`${
              ListboxButtonStyle || ""
            } relative w-full rounded-md py-1.5 pl-3 pr-10 text-left shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-ChartwellBlue sm:text-sm sm:leading-6 ${
              disabled ? "bg-ChartwellGrey/20" : "bg-white cursor-pointer"
            }`}
          >
            <span className="flex items-center">
              <span className="ml-3 block truncate">{value?.name || label}</span>
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
              <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </span>
          </ListboxButton>

          <Transition show={open} as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
            <ListboxOptions
              modal={false}
              className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
            >
              {options.map((option, index) => (
                <TypedListboxOption<TOption>
                  key={option?.id ?? index}
                  value={option}
                  className={({ focus, selected }) =>
                    `relative select-none py-2 pl-3 pr-9 cursor-pointer transition duration-300 ease-in-out ${
                      selected ? "bg-ChartwellBlue text-white" : focus ? "bg-ChartwellBlue-100 text-ChartwellWhite" : "text-gray-900"
                    }`
                  }
                >
                  {({ selected }) => (
                    <div className="flex items-center capitalize justify-between">
                      <span className={`${selected ? "font-semibold" : "font-normal"} ml-3 block truncate`}>{option?.name}</span>
                      {selected && <CheckIcon className="h-5 w-5 text-ChartwellWhite" aria-hidden="true" />}
                    </div>
                  )}
                </TypedListboxOption>
              ))}
            </ListboxOptions>
          </Transition>
        </div>
      )}
    </Listbox>
  );
};
