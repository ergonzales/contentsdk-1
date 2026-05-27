interface ChatFormSubmitFieldProps {
  field: {
    name: string;
    type: "submit";
    id: string;
  };
}

export const ChatFormSubmitField = ({ field }: ChatFormSubmitFieldProps) => {
  return (
    <button type={field.type} className=" z-999  bg-ChartwellBlue text-white w-full py-2 px-8 rounded-md uppercase hover:bg-ChartwellPlum  duration-300 ease-in-out " aria-label="Submit form">
      {field.name}
    </button>
  );
};
