interface FieldOption {
  id: string;
  value: string;
  displayName: string;
}

interface ChatEditSelectFormFieldProps {
  field: {
    name: string;
    type: string;
    label: string;
    id: string;
    options: FieldOption[];
  };

  setSelectedOption: (value: Record<string, any>) => void;
  setQuestionAnswer: (value: any) => void;
  selectedOption: Record<string, any>;
  questionAnswer: any;
}

export const ChatEditSelectFormField = ({ field, setSelectedOption, questionAnswer, setQuestionAnswer, selectedOption }: ChatEditSelectFormFieldProps) => {
  const handlerSelectedOption = (option: any) => {
    const editedSelectedOption = { ...selectedOption, [field.name]: option };
    setSelectedOption(editedSelectedOption);

    const editQuestionAnswer: any[] = questionAnswer.map((el: any) => {
      if (el.fieldId === field.id) {
        return { ...el, answer: option, edit: false };
      }
      return el;
    });

    setQuestionAnswer(editQuestionAnswer);
  };

  return (
    <>
      <ul className="flex flex-wrap gap-2 justify-center">
        {field.options.map((option) => {
          return (
            <li key={option.id}>
              <button
                aria-label={option.displayName}
                onClick={() => {
                  handlerSelectedOption(option.displayName);
                }}
                value={option.displayName}
                id={(option as any).fields.LookingForOptions.value.replace(/ /gm, "").toLowerCase() + "-EditField"}
                className={` ${selectedOption[field.name] === option.displayName ? "bg-ChartwellBlue" : "bg-ChartwellGrey/80"}  hover:bg-ChartwellPlum text-white font-bold py-2 px-3 rounded-xl`}
              >
                {option.displayName}
              </button>
            </li>
          );
        })}
      </ul>
    </>
  );
};
