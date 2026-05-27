import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { Field } from "formik";

interface ChatFormEditTextFieldProps {
  field: {
    question?: string;
    answer: any;
    fieldName: string;
    fieldType: string;
    fieldId: string;
    edit?: boolean;
  };
  onClick: () => void;
}

export const ChatEditTextFormField = ({ field, onClick }: ChatFormEditTextFieldProps) => {
  return (
    <div className="flex items-center relative">
      <Field
        onInput={(e: { target: { value: any } }) => {
          if (field.fieldName === "homeNumber") {
            let input = e.target.value.replace(/\D/g, "");

            if (input.length <= 3) {
              input = input.replace(/^(\d{0,3})/, "($1");
            } else if (input.length <= 6) {
              input = input.replace(/^(\d{3})(\d{0,3})/, "($1) $2");
            } else if (input.length <= 10) {
              input = input.replace(/^(\d{3})(\d{3})(\d{0,4})/, "($1) $2-$3");
            } else {
              input = input.slice(0, 10);
              input = input.replace(/^(\d{3})(\d{3})(\d{0,4})/, "($1) $2-$3");
            }

            e.target.value = input;
          }
        }}
        type={field.fieldType}
        id={field.fieldId}
        name={field.fieldName}
        defaultValue={field.answer}
        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-ChartwellWhite"
      />
      <button
        aria-label="Save edited answer"
        type="button"
        onClick={onClick}
        className="rounded-full bg-ChartwellGrey px-2 flex items-center justify-center group hover:bg-ChartwellWhite border  hover:border-ChartwellGrey ease-in-out duration-300"
      >
        <PaperAirplaneIcon className="w-5 h-5 text-ChartwellWhite  group-hover:text-ChartwellBlue ease-in-out duration-300" />
      </button>
    </div>
  );
};
