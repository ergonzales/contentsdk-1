import { User } from "lucide-react";
import { ExclamationCircleIcon } from "@heroicons/react/20/solid";
import { PencilIcon } from "@heroicons/react/24/solid";
import { Formik, Form } from "formik";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import ChatLogo from "./ChatLogo";
import { useRouter } from "next/router";
import { normalize } from "lib/helpers/form/formAndDatalayerHelpers";

import qs from "qs";

import { getValidationSchema } from "./helpers/formValidationSchems";
import { mapFormFieldsToEloquaData } from "./helpers/mapFormFieldsToEloquaData";

// Form fields
import { ChatFormTextField } from "./ChatFormFields/ChatFormTextField";
import { ChatFormSelectField } from "./ChatFormFields/ChatFormSelectField";
import { ChatFormSubmitField } from "./ChatFormFields/ChatFormSubmitField";
import { ChatFormRadioField } from "./ChatFormFields/ChatFormRadioField";
import { ChatFormTextareaField } from "./ChatFormFields/ChatFormTextareaField";
// Edit form fields
import { ChatEditTextFormField } from "./ChatEditFormFields/ChatEditTextFormField";
import { ChatEditSelectFormField } from "./ChatEditFormFields/ChatEditSelectFormField";
import { ChatEditRadioFormField } from "./ChatEditFormFields/ChatEditRadioFormField";
import { useI18n } from "next-localization";
// import { supabase } from "supabase/supabaseClient";
import { useSitecore } from "@sitecore-content-sdk/nextjs";
import { useCookieState, cookieFlags, getCookieJSON } from "lib/hooks/useCookieState";

interface SelectedForm {
  fields: {
    "Form type": { name: string; fields: { EloquaFormName: { value: string } } }[];
    Inputs: {
      id: string;
      fields: {
        fieldName: { value: string };
        fieldType: { value: string };
        label: { value: string };
        options: { targetItems: any[] };
        placeholder: { value: string };
      };
    }[];
  };
}

type FieldType = "text" | "select" | "radio" | "submit";
interface FormField {
  name: string;
  type: FieldType;
}

interface ChatFormHandlerProps {
  selectedForm: SelectedForm;
  isTyping: boolean;
  setIsTyping: (isTyping: boolean) => void;
  ResidenceID: string;
  handelFormSubmit: () => void;
  handelCancelFormSubmission: () => void;
  history: any[];
  visitor_id: string;
}

export const ChatFormHandler = ({ selectedForm, isTyping, setIsTyping, ResidenceID, handelFormSubmit, handelCancelFormSubmission, history, visitor_id }: ChatFormHandlerProps) => {
  const router = useRouter();
  const { page } = useSitecore();
  const scContext: any = { sitecoreContext: page?.layout?.sitecore?.context || {} };

  const formType = selectedForm.fields["Form type"].find((item: any) => item.name.length !== 0)?.fields?.EloquaFormName?.value ?? "";
  const fields = selectedForm.fields.Inputs;

  const FormData = {
    formType,
    fields: fields?.map((el: any) => {
      return {
        id: el?.id,
        name: el?.fields.name?.value,
        type: el?.fields.type?.value,
        label: el?.fields.label?.value,
        options: el?.fields.options,
        placeholder: el?.fields.placeholder?.value,
      };
    }),
  };

  const sessionsInitialData = FormData?.fields?.map((el) => {
    return {
      name: el?.name,
      value: "",
    };
  });
  const [valueSessionsStorage, setSessionsStorage, removeValue] = useCookieState(`${FormData.formType}_chatBot_${ResidenceID ? ResidenceID : "corporate"}_${router.locale}`, sessionsInitialData, {
    hours: 0.5,
  });
  const [stepStorage, setStepStorage, removeStepValue] = useCookieState(`${FormData.formType}_chatBot_step_${ResidenceID ? ResidenceID : "corporate"}_${router.locale}`, 0, { hours: 0.5 });
  const [sessionsStorageQuestionAnswer, setSessionsStorageQuestionAnswer, removeQuestionAnswer] = useCookieState<
    { question: string; answer: any; fieldName: string; fieldType: string; fieldId: string; edit: boolean }[]
  >(`${FormData.formType}_chatBot_questionAnswer_${ResidenceID ? ResidenceID : "corporate"}_${router.locale}`, [], { hours: 0.5 });
  const [userSessionName, setUserSessionName] = useCookieState("userSessionName", "", { hours: 0.5 });
  const [LName, setLName] = useState("");
  const [EmailAddress, setEmailAddress] = useState("");

  const eloquaData: FormField[] = FormData?.fields?.map((el) => {
    return {
      name: el?.name,
      type: el?.type,
      initialValue: "",
    };
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [checked, setChecked] = useState(true);
  const [isTypingError, setIsTypingError] = useState(false);
  const [questionAnswer, setQuestionAnswer] = useState<{ question: string; answer: any; fieldName: string; fieldType: string; fieldId: string; edit: boolean }[]>(sessionsStorageQuestionAnswer);

  const [selectedOption, setSelectedOption] = useState({});

  const [step, setStep] = useState(stepStorage);
  const [errorEditMessage, setErrorEditMessage] = useState("");

  const { t: dictionary } = useI18n();

  const errorDictionaryMessage = {
    required: dictionary("RequiredField"),
    email: dictionary("ValidEmail"),
    phone: dictionary("ValidPhone"),
    name: dictionary("ValidName"),
  };

  const updateSessionData = (nameToUpdate: string, newValue: string) => {
    setSessionsStorage((prev: any) => {
      const updatedSessionsData = prev.map((item: any) => {
        if (item.name === nameToUpdate) {
          return {
            ...item,
            value: newValue,
          };
        }
        return item; // Return unchanged items
      });

      return updatedSessionsData; // Return the new updated state
    });
  };

  const cleanupPropertyName = (propertyName: string) => {
    const regexToReplace = [new RegExp(/ Residence Pour Retraites/gim), new RegExp(/ Retirement Residence/gim), new RegExp(/ Care Residence/gim), new RegExp(/\'/g)];
    regexToReplace.forEach((rx) => {
      propertyName = normalize(propertyName)?.replace(rx, "");
    });
    return propertyName;
  };

  const getPropDetails = () => {
    const context = scContext;
    const isChildPage = context.sitecoreContext?.route?.templateName == "PropertyChildPage" ? true : false;
    const isPropertyPage = context.sitecoreContext?.route?.templateName == "PropertyPage" ? true : false;

    if (isChildPage || isPropertyPage) {
      const resContext = !isChildPage
        ? context.sitecoreContext?.route
        : (
            (context.sitecoreContext?.route?.placeholders["headless-header"]?.filter((comp: any) => comp.componentName === "PropertyHeaderNavigation")[0] as any) ||
            (context.sitecoreContext?.route?.placeholders["headless-main"]?.filter((comp: any) => comp.componentName === "PropertyHeaderNavigation")[0] as any)
          ).fields.data.item.ancestors[0];

      const provinces = [
        { name: "Ontario", value: "ON" },
        { name: "British Columbia", value: "BC" },
        { name: "Colombie-Britannique", value: "BC" },
        { name: "Quebec", value: "QC" },
        { name: "Alberta", value: "AB" },
      ];
      const lang = context.sitecoreContext.language == "en" ? "English" : "French";
      const propertyName = isChildPage ? resContext?.propertyName?.value : resContext.fields?.["Property Name"]?.value;
      const propID = isChildPage ? resContext?.contextParentPropertyId?.value : resContext.fields?.["PropertyID"]?.value;
      const prov = isChildPage
        ? provinces.find((p) => normalize(resContext?.province?.targetItems?.[0]?.provinceName?.value) == p.name)?.value
        : resContext?.fields?.Province?.[0]?.fields?.["Province Abbreviation"]?.value;
      const city = normalize(isChildPage ? resContext?.city?.targetItems?.[0]?.cityName?.value : resContext?.fields?.City?.[0]?.fields?.["City Name"]?.value);
      const isPriorityProperty = (isChildPage ? resContext?.isPriorityProperty?.boolValue : resContext?.fields?.isPriorityProperty?.value) == true ? "Yes" : "No";

      const dlPropDetails = {
        item_name: cleanupPropertyName(propertyName), // see excel
        item_id: propID, // see excel
        price: "1.00", // static value
        item_variant: "", // leave empty
        item_category: prov, // see excel
        item_category2: city, // see excel
        item_category3: lang, // see excel
        item_category4: isPriorityProperty, // see excel
        item_category5: "chatbot",
        quantity: "1", // static
      };
      return dlPropDetails;
    }
    if (typeof window === "undefined") return {};
    const viaCookie = getCookieJSON("dlPropDetails", {} as any);
    if (Object.keys(viaCookie).length) return viaCookie;
    try {
      return JSON.parse(window.sessionStorage.getItem("dlPropDetails") || "{}");
    } catch {
      return {};
    }
  };

  const dlPropDetails = getPropDetails();
  const updateDataLayer = (dlObject: any) => {
    const dataLayer = window.dataLayer || [];
    dataLayer.push(dlObject);
  };

  const nextStep = async (validateForm: any, setFieldTouched: any, values: any) => {
    const currentFieldName = FormData.fields[step].name;
    const currentAnswer = values[currentFieldName];
    const currentQuestion = FormData.fields[step].label;
    const currentFieldId = FormData.fields[step].id;
    const currentFieldType = FormData.fields[step].type;
    if (currentFieldName.toLowerCase() === "firstname") {
      setUserSessionName(currentAnswer);
    }

    updateSessionData(currentFieldName, currentAnswer);

    setFieldTouched(currentFieldName, true);

    const formErrors = await validateForm();
    if (formErrors[currentFieldName]) {
      setIsTypingError(true);
      setErrorMessage(formErrors[currentFieldName]);
      setTimeout(() => {
        setIsTypingError(false);
      }, 600);
      return;
    }

    setIsTyping(true);
    setQuestionAnswer((prev) => [...prev, { question: currentQuestion, answer: currentAnswer, fieldName: currentFieldName, fieldType: currentFieldType, fieldId: currentFieldId, edit: false }]);

    setTimeout(() => {
      setStep((prev) => prev + 1);
      setErrorMessage("");

      setIsTyping(false);
    }, 1000);
    // setSessionsStorageQuestionAnswer(questionAnswer);
    // If no errors, move to the next step
  };

  const HandleEditingPermission = (fieldId: string) => {
    const editQuestionAnswer = questionAnswer.map((el) => {
      if (el.fieldId === fieldId) {
        return { ...el, edit: !el.edit };
      }
      return el;
    });

    setQuestionAnswer(editQuestionAnswer);
  };

  const hiddenUtmOption = {
    utm_medium: router.query.utm_medium,
    utm_source: router.query.utm_source,
    utm_campaign: router.query.utm_campaign,
    utm_content: router.query.utm_content,
    utm_term: router.query.utm_term,
  };

  const getUpdatedEloquaData = (elauqData: any, sessionData: any) => {
    const updatedData = { ...elauqData }; // Make a copy of the original object to avoid mutation

    sessionData.forEach((item: any) => {
      if (item.name in updatedData) {
        updatedData[item.name] = item.value; // Update the value if the name exists in the object
      }
    });

    return updatedData;
  };

  const onSubmit = async (value: any) => {
    setIsTyping(true);
    const eloquaEndpoint = "https://s1816836.t.eloqua.com/e/f2";

    const eloquaFormHTMLName = FormData.formType;

    const eloquaFormData = mapFormFieldsToEloquaData(eloquaData, value, selectedOption, checked, ResidenceID, eloquaFormHTMLName, router.locale);

    const userData = getUpdatedEloquaData(eloquaFormData, valueSessionsStorage);
    const messages = history
      .map((item) => ({ role: item.role, content: item.content }))
      .map((item, index) => {
        const roleLabel = item.role === "assistant" ? "Chartwell" : item.role === "user" ? "Visitor" : item.role || "Unknown";
        const content = String(item.content ?? "")
          .replace(/\s*\n+\s*/g, " ")
          .trim();
        return `${index + 1}. ${roleLabel}: ${content}`;
      })
      .join("\n");
    try {
      const response = await fetch(eloquaEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify({ ...userData, ...hiddenUtmOption, chatbot_history: JSON.stringify(messages) }),
      });
      const responseText = await response.text();

      if (responseText.includes("The Information Provided is Incomplete or Invalid")) {
        setErrorMessage("We are sorry, but the information provided is incomplete or invalid. Please try again.");
        setIsTypingError(true);
        setTimeout(() => {
          setIsTypingError(false);
        }, 600);
        return;
      }

      handelFormSubmit();

      removeValue();
      removeStepValue();
      removeQuestionAnswer();
      const { error } = await fetch("/api/v1/chatbot-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          visitor_id,
          form_type: "chat_bot_book_a_tour",
        }),
      }).then((res) => res.json());

      if (error) {
        console.error("Error submitting form", error);
      }

      // Language detection using dlPropDetails.category3 is not reliable as it can be empty, so using URL to determine language for thank you page redirection
      const path_lang = window.location.href.includes("/fr/") ? "FR" : "EN";

      if (eloquaFormHTMLName.toLowerCase().includes("book")) {
        updateDataLayer({
          pageContent: cleanupPropertyName(dlPropDetails.item_name), // use items_name value
          page_lang: path_lang, //dlPropDetails.category3?.toString().toLowerCase().includes("fr") ? "FR" : "EN", // values: EN for English and FR for French page
          pageCat: "residence", // static
          pageType: "book a tour thank you", // static
          residence_province: dlPropDetails.item_category, // item_category value
          residence_imp: dlPropDetails.item_category4, // item_category4 value
          residence_code: dlPropDetails.item_id, // item_id value
        });

        dlPropDetails.item_variant = window.sessionStorage.getItem("BookATour_forWho") || "";
        updateDataLayer({
          event: "purchase",
          ecommerce: {
            transaction_id: uuidv4(), // random number (must be unique each time)
            value: 1, // static
            currency: "CAD", // static
            items: [dlPropDetails],
          },
        });
      }
      if (eloquaFormHTMLName.toLowerCase().includes("contact")) {
        updateDataLayer({
          event: "contact_us",
          pageContent: "corporate", //static
          pageCat: "corporate", // static
          page_lang: path_lang, // values: EN for English and FR for French page
          pageType: "contact us thank you", //static
          reasons: "chatbot", // user selection of "reasons for contact" in form - for French forms use english translations so value the same as EN
          residence: "", // user selection of "Are you considering a residence.."  - if empty, leave value empty - if French use EN value
        });
      }
    } catch (error) {
      console.error("Error submitting form", error);
    } finally {
      setIsTyping(false);
    }
  };

  const initialValues = eloquaData.reduce((acc: any, field: FormField) => {
    acc[field.name] = "";
    return acc;
  }, {});

  //  [];

  const validationSchema = getValidationSchema(initialValues, errorDictionaryMessage);

  const onEditing = async (fieldId: string, values: any, fieldName: string, step: number): Promise<void> => {
    if (fieldName.toLowerCase() === "firstname") {
      setUserSessionName(values[fieldName]);
    }

    try {
      await validationSchema[step]?.validateAt(fieldName, values);
      setErrorEditMessage("");
    } catch (error: any) {
      setErrorEditMessage(error.message);
      setIsTypingError(true);
      setTimeout(() => {
        setIsTypingError(false);
      }, 600);
      return;
    }

    const editQuestionAnswer = questionAnswer.map((el) => {
      if (el.fieldId === fieldId) {
        return { ...el, answer: values[fieldName], edit: false };
      }
      return el;
    });

    setQuestionAnswer(editQuestionAnswer);
  };

  // updated sessionStorage
  useEffect(() => {
    setSessionsStorageQuestionAnswer(questionAnswer);
  }, [questionAnswer, setSessionsStorageQuestionAnswer]);

  //updated userInfo
  useEffect(() => {
    const LName = valueSessionsStorage.find((el) => el.name == "LastName")?.value || "";
    const EMail = valueSessionsStorage.find((el) => el.name == "EmailAddress")?.value || "";
    setLName(LName);
    setEmailAddress(EMail);
  }, [valueSessionsStorage]);

  useEffect(() => {
    cookieFlags.clear("begunCheckout");
    cookieFlags.clear("addedToCart");
  }, []);

  useEffect(() => {
    if (FormData.formType.includes("bookatour") && LName && !cookieFlags.get("addedToCart")) {
      cookieFlags.set("addedToCart", { hours: 1 });
      dlPropDetails.item_variant = "";
      updateDataLayer({ ecommerce: null });
      const event = "add_to_cart";
      const dl = {
        event: event,
        ecommerce: {
          items: [dlPropDetails],
        },
      };
      updateDataLayer(dl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [LName]);

  useEffect(() => {
    if (FormData.formType.includes("bookatour") && EmailAddress && !cookieFlags.get("begunCheckout")) {
      cookieFlags.set("begunCheckout", { hours: 1 });
      dlPropDetails.item_variant = "";
      updateDataLayer({ ecommerce: null });
      const event = "begin_checkout";
      const dl = {
        event: event,
        ecommerce: {
          items: [dlPropDetails],
        },
      };
      updateDataLayer(dl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [EmailAddress]);

  useEffect(() => {
    setStepStorage(step);
  }, [step, setStepStorage]);

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema[step]} enableReinitialize={true} onSubmit={onSubmit}>
      {({ validateForm, setFieldTouched, values }) => (
        <Form className="">
          {FormData.fields.map((field, index) => {
            return (
              index === step && (
                <div key={field.id}>
                  <div className="flex flex-col justify-between h-full ">
                    {questionAnswer.map((el, index) => (
                      <>
                        <div key={el.fieldId} className="flex items-end gap-2">
                          {/* Render ChatLogo and question */}
                          <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                            <ChatLogo className="w-6 h-6" />
                          </div>

                          <div className="assistant-message">
                            <p className="text-[0.8rem] !m-0">{el.question.replace("{Name}", userSessionName)}</p>
                          </div>
                        </div>
                        {/* Render based on fieldType and edit state */}
                        <div className={`self-end flex items-end justify-end gap-2`} id={el.fieldId}>
                          <div className={` user-message ease-in-out duration-300 cursor-pointer ${el.edit ? "" : " hover:scale-110"}`}>
                            {el.edit ? (
                              (el.fieldType === "text" && (
                                <ChatEditTextFormField
                                  field={el}
                                  onClick={() => {
                                    onEditing(el.fieldId, values, el.fieldName, index);
                                  }}
                                />
                              )) ||
                              (el.fieldType === "select" && (
                                <ChatEditSelectFormField
                                  field={FormData.fields.find((x) => x.name === el.fieldName) || { name: "", type: "", label: "", id: "", options: [] }}
                                  questionAnswer={questionAnswer}
                                  setSelectedOption={setSelectedOption}
                                  setQuestionAnswer={setQuestionAnswer}
                                  selectedOption={selectedOption}
                                />
                              )) ||
                              (el.fieldType === "radio" && (
                                <ChatEditRadioFormField
                                  field={FormData.fields.find((x) => x.name === el.fieldName) || { name: "", type: "", label: "", id: "", options: [] }}
                                  checked={checked}
                                  setChecked={setChecked}
                                  setQuestionAnswer={setQuestionAnswer}
                                  questionAnswer={questionAnswer}
                                />
                              ))
                            ) : (
                              <div onClick={() => HandleEditingPermission(el.fieldId)}>
                                <p className="text-[0.9rem] !m-0 inline ">{el.answer}</p>
                                <PencilIcon className="w-4 h-4 inline ml-2 fill-ChartwellGrey" />
                              </div>
                            )}
                          </div>
                          <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-md bg-ChartwellBlue   text-white ">
                            <User className="w-4 h-4" />
                          </div>
                        </div>
                        {/* Add additional logic for other field types like "select" here if needed */}
                      </>
                    ))}

                    {errorEditMessage && !isTypingError && (
                      <div className=" flex items-end gap-2">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                          <ChatLogo className="w-6 h-6" />
                        </div>

                        <div className="flex-grow assistant-message !bg-red-100">
                          <p className="text-[0.8rem] !m-0 inline "> {errorEditMessage}</p>
                          <ExclamationCircleIcon className="w-6 h-6 fill-red-800  ml-2 inline" />
                        </div>
                      </div>
                    )}

                    {/* Error UI handler */}
                    {!isTyping && errorEditMessage.length === 0 && (
                      <div className="flex items-end gap-2 ">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                          <ChatLogo className="w-6 h-6" />
                        </div>
                        <div className="assistant-message">
                          <label className="text-[0.8rem] !m-0" htmlFor={field.id}>
                            {field.label.replace("{Name}", userSessionName)}
                          </label>
                        </div>
                      </div>
                    )}
                    {errorMessage && !isTypingError && (
                      <div className=" flex items-end gap-2">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                          <ChatLogo className="w-6 h-6" />
                        </div>

                        <div className="flex-grow assistant-message !bg-red-100">
                          <p className="text-[0.8rem] !m-0 inline "> {errorMessage}</p>
                          <ExclamationCircleIcon className="w-6 h-6 fill-red-800  ml-2 inline" />
                        </div>
                      </div>
                    )}

                    {/* typing indicator */}

                    {/* form fields */}
                    <div className="absolute bottom-0 w-full p-2 left-1/2 flex flex-col  py-2 -translate-x-1/2 border-t bg-ChartwellWhite">
                      {!isTyping && errorEditMessage.length === 0 ? (
                        (field.type === "text" && <ChatFormTextField field={field} onClick={() => nextStep(validateForm, setFieldTouched, values)} />) ||
                        (field.type === "select" && (
                          <ChatFormSelectField
                            field={field}
                            setIsTyping={setIsTyping}
                            updateSessionData={updateSessionData}
                            setSelectedOption={setSelectedOption}
                            setStep={setStep}
                            setQuestionAnswer={setQuestionAnswer}
                          />
                        )) ||
                        (field.type === "radio" && (
                          <ChatFormRadioField
                            updateSessionData={updateSessionData}
                            field={field}
                            checked={checked}
                            setChecked={setChecked}
                            setIsTyping={setIsTyping}
                            setQuestionAnswer={setQuestionAnswer}
                            setStep={setStep}
                          />
                        )) ||
                        (field.type === "submit" && <ChatFormSubmitField field={field} />) ||
                        (field.type === "textarea" && <ChatFormTextareaField field={field} onClick={() => nextStep(validateForm, setFieldTouched, values)} />)
                      ) : (
                        <></>
                      )}
                      <button
                        onClick={handelCancelFormSubmission}
                        className="block  rounded-xl  ml-auto px-2 hover:text-ChartwellBlue ease-in-out duration-300 underline"
                        aria-label="Cancel form submission"
                      >
                        {dictionary("CancelChatBotForm")}
                      </button>
                    </div>
                  </div>
                </div>
              )
            );
          })}
        </Form>
      )}
    </Formik>
  );
};
