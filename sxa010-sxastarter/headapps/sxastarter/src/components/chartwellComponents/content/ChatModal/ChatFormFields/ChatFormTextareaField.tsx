import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { Field } from "formik";

interface ChatFormTextFieldProps {
  field: {
    placeholder: string;
    name: string;
    id: string;
    type: string;
  };
  onClick: () => void;
}

export const ChatFormTextareaField = ({ field, onClick }: ChatFormTextFieldProps) => {
  return (
    <div className="flex items-center mt-2 relative">
      <Field
        type={field.type}
        as={field.type}
        id={field.id}
        rows="5"
        cols="80"
        name={field.name}
        placeholder={field?.placeholder}
        onKeyPress={(e: { key: string }) => {
          if (e.key === "Enter") {
            onClick();
          }
        }}
        className="mt-1 block w-full pl-2 pr-8 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-md bg-ChartwellWhite resize-none"
      />
      <button
        aria-label="Send message"
        type="button"
        onClick={onClick}
        className="  rounded-full bg-ChartwellGrey px-2 flex items-center justify-center group hover:bg-ChartwellWhite border  hover:border-ChartwellGrey ease-in-out duration-300 absolute bottom-1 right-1"
      >
        <PaperAirplaneIcon className="w-5 h-5 text-ChartwellWhite  group-hover:text-ChartwellBlue ease-in-out duration-300" />
      </button>
    </div>
  );
};
