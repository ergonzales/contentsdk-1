import * as Yup from "yup";
interface errorDictionaryMessageProps {
  name: string;
  phone: string;
  email: string;
  required: string;
}
// const dateValidation = Yup.date().required("Date is required").nullable();
export const getValidationSchema = (fields: object, errorDictionaryMessage: errorDictionaryMessageProps) => {
  const nameValidation = Yup.string()
    .trim()
    .min(2, errorDictionaryMessage.name)
    .max(50, errorDictionaryMessage.name)
    .matches(/^[A-Za-z\s]+$/, errorDictionaryMessage.name)
    .required(errorDictionaryMessage.required);
  const phoneValidation = Yup.string()
    .trim()
    .matches(/^(\d{10}|\d{3}[- ]\d{3}[- ]\d{4}|\d{3} \d{3} \d{4}|\(\d{3}\) \d{3}-\d{4})$/, errorDictionaryMessage.phone)
    .required(errorDictionaryMessage.required);
  const textareaValidation = Yup.string().trim().required(errorDictionaryMessage.required);

  const emailValidation = Yup.string()
    .trim()
    .email(errorDictionaryMessage.email)
    .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, errorDictionaryMessage.email)
    .required(errorDictionaryMessage.required);

  const validationSchemas: (
    | Yup.ObjectSchema<{ FirstName: string }, Yup.AnyObject, { FirstName: undefined }, "">
    | Yup.ObjectSchema<{ LastName: string }, Yup.AnyObject, { LastName: undefined }, "">
    | Yup.ObjectSchema<{ homeNumber: string }, Yup.AnyObject, { homeNumber: undefined }, "">
    | Yup.ObjectSchema<{ EmailAddress: string }, Yup.AnyObject, { EmailAddress: undefined }, "">
    | Yup.ObjectSchema<{ question2: string }, Yup.AnyObject, { question2: undefined }, "">
  )[] = [];

  Object.keys(fields).forEach((field) => {
    switch (field) {
      case "FirstName":
        validationSchemas.push(
          Yup.object({
            FirstName: nameValidation,
          })
        );
        break;
      case "LastName":
        validationSchemas.push(
          Yup.object({
            LastName: nameValidation,
          })
        );
        break;
      case "homeNumber":
        validationSchemas.push(
          Yup.object({
            homeNumber: phoneValidation,
          })
        );
        break;
      case "EmailAddress":
        validationSchemas.push(
          Yup.object({
            EmailAddress: emailValidation,
          })
        );
        break;

      case "questions2":
        validationSchemas.push(
          Yup.object({
            question2: textareaValidation,
          })
        );
        break;
      default:
        break; // No action for unrecognized fields
    }
  });

  return validationSchemas;
};
