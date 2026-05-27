import { Send } from "lucide-react";
import { Field } from "formik";
import { useEffect, useRef } from "react";
interface ChatFormTextFieldProps {
  field: {
    placeholder: string;
    name: string;
    id: string;
    type: string;
  };
  onClick: () => void;
}

export const ChatFormTextField = ({ field, onClick }: ChatFormTextFieldProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    inputRef.current?.focus();
  }, [inputRef]);
  return (
    <div className=" bg-white   flex gap-4  ">
      <Field
        onInput={(e: { target: { value: any } }) => {
          if (field.name === "homeNumber") {
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
        innerRef={inputRef}
        onKeyPress={(e: { key: string }) => {
          if (e.key === "Enter") {
            onClick();
          }
        }}
        type={field.type}
        id={field.id}
        name={field.name}
        placeholder={field?.placeholder}
        className="flex-1 px-4 py-3 border border-ChartwellBlue rounded-2xl focus:outline-none focus:ring-2 focus:ChartwellBlue text-md bg-slate-50 focus:bg-white transition-all duration-200 placeholder-slate-400"
      />
      {/* <button
        type="button"
        onClick={onClick}
        className="  rounded-full bg-ChartwellGrey px-2 flex items-center justify-center group hover:bg-ChartwellWhite border  hover:border-ChartwellGrey ease-in-out duration-300"
      >
        <PaperAirplaneIcon className="w-5 h-5 text-ChartwellWhite  group-hover:text-ChartwellBlue ease-in-out duration-300" />
      </button> */}
      <button
        type="button"
        aria-label="Send message"
        onClick={onClick}
        // disabled={isLoading || !input.trim()}
        className="px-4 py-3 bg-ChartwellBlue hover:to-indigo-700 text-white rounded-2xl disabled:opacity-90 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
      >
        <Send className="w-4 h-4" />
      </button>
    </div>
  );
};
