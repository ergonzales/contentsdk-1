import { Field } from "formik";

interface FieldOption {
  name: string;
  displayName: string;
}

interface ChatFormRadioFieldProps {
  field: {
    name: string;
    type: string;
    label: string;
    id: string;
    options: FieldOption[];
  };

  checked: boolean; // true = yes, false = no
  setChecked: (value: boolean) => void;
  setIsTyping: (value: boolean) => void;
  setQuestionAnswer: (value: any) => void;
  setStep: (value: any) => void;

  updateSessionData: (key: string, value: any) => void;
}

export const ChatFormRadioField = ({ field, checked, setChecked, setIsTyping, setQuestionAnswer, setStep, updateSessionData }: ChatFormRadioFieldProps) => {
  const positiveOption = field?.options.find((option) => option.name === "option-yes");
  const negativeOption = field?.options.find((option) => option.name === "option-no");

  const applyAnswer = (isYes: boolean) => {
    setChecked(isYes);

    const answerDisplay = isYes ? positiveOption?.displayName : negativeOption?.displayName;

    setIsTyping(true);

    setQuestionAnswer((prev: any) => [
      ...prev,
      {
        question: field.label,
        answer: answerDisplay,
        fieldName: field.name,
        fieldType: field.type,
        fieldId: field.id,
        edit: false,
      },
    ]);

    updateSessionData(field.name, answerDisplay);

    setTimeout(() => {
      setStep((prev: number) => prev + 1);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <>
      {/* keep hidden field for Formik */}
      <Field type="hidden" id={field.id} name={field.name} />

      <ul className="flex flex-wrap gap-2 justify-center">
        {/* NO button */}
        <li>
          <button
            aria-label="Select no"
            type="button"
            onClick={() => applyAnswer(false)}
            className={`${!checked ? "bg-ChartwellBlue" : "bg-ChartwellGrey/80"} hover:bg-ChartwellPlum text-white font-bold py-2 px-3 rounded-xl`}
          >
            {negativeOption?.displayName}
          </button>
        </li>

        {/* YES button */}
        <li>
          <button
            aria-label="Select yes"
            type="button"
            onClick={() => applyAnswer(true)}
            className={`${checked ? "bg-ChartwellBlue" : "bg-ChartwellGrey/80"} hover:bg-ChartwellPlum text-white font-bold py-2 px-3 rounded-xl`}
          >
            {positiveOption?.displayName}
          </button>
        </li>
      </ul>
    </>
  );
};
