type FieldType = "text" | "select" | "radio" | "submit" | "textarea";

interface FormField {
  name: string;
  type: FieldType;
}

interface Value {
  [key: string]: string;
}

interface SelectedOption {
  [key: string]: string;
}

export const mapFormFieldsToEloquaData = (
  formFields: FormField[],
  value: Value,
  selectedOption: SelectedOption | undefined,
  checked: boolean,
  ResidenceID: number | string,
  eloquaFormHTMLName: string,
  language: string | undefined
): { [key: string]: string | number | undefined } => {
  const eloquaFormData: { [key: string]: string | number | undefined } = {};
  formFields.forEach((field) => {
    const fieldName = field.name;

    switch (field.type) {
      case "text":
        eloquaFormData[fieldName] = value[fieldName];
        break;

      case "textarea":
        eloquaFormData[fieldName] = value[fieldName];
        break;

      case "select":
        eloquaFormData[fieldName] = selectedOption?.[fieldName];
        break;

      case "radio":
        eloquaFormData[fieldName] = checked ? "Yes" : "No";
        break;

      case "submit":
        break;

      default:
        break;
    }
  });

  // Add additional fields manually if they are not part of formFields
  eloquaFormData["ResidenceID"] = ResidenceID !== undefined ? ResidenceID : "";
  eloquaFormData["elqFormName"] = eloquaFormHTMLName;
  eloquaFormData["elqSiteID"] = "1816836";
  eloquaFormData["subject"] = "information on our residences";
  eloquaFormData["language"] = `${language}`;

  return eloquaFormData;
};
