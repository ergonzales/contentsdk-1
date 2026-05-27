interface FieldOption {
  value: string;
  displayName: string;
}

interface ChatFormSelectFieldProps {
  field: {
    name: string;
    type: string;
    label: string;
    id: string;
    options: FieldOption[];
  };
  updateSessionData: (key: string, value: any) => void;
  setIsTyping: (value: boolean) => void;
  setStep: (value: any) => void;
  setSelectedOption: (value: Record<string, any>) => void;
  setQuestionAnswer: (value: any) => void;
}

export const ChatFormSelectField = ({ field, setIsTyping, setSelectedOption, setStep, setQuestionAnswer, updateSessionData }: ChatFormSelectFieldProps) => {
  const handlerSelectedOption = (option: any) => {
    setIsTyping(true);
    setSelectedOption((prev: any) => ({ ...prev, [field.name]: option }));
    setQuestionAnswer((prev: any) => [...prev, { question: field.label, answer: option, fieldName: field.name, fieldType: field.type, fieldId: field.id, edit: false }]);
    updateSessionData(field.name, option);
    setTimeout(() => {
      setStep((prev: number) => prev + 1);
      setIsTyping(false);
    }, 1000);
  };

  const updateSessionForWho = (e: any) => {
    const val = e.target.id.includes("for-a-loved-one-") ? "for a loved one" : "for myself";
    window.sessionStorage.setItem("BookATour_forWho", val);
  };

  return (
    <>
      <ul className="flex flex-wrap gap-2 justify-center">
        {field.options.map((option, index) => {
          return (
            <li key={`option-${index}`}>
              <button
                aria-label={option.displayName}
                onClick={(e: any) => {
                  handlerSelectedOption(option.displayName);
                  updateSessionForWho(e);
                }}
                id={(option as any).name.replace(/ /gm, "").toLowerCase() + "-Field"}
                value={option.displayName}
                className={` bg-ChartwellGrey/80 hover:bg-ChartwellPlum text-white font-bold py-2 px-3 rounded-xl`}
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
