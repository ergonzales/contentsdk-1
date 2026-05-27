import { Formik, Form, Field } from "formik";
import { Rating } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import ChatLogo from "../ChatModal/ChatLogo";
import qs from "qs";
import { useState } from "react";
import { CheckBadgeIcon } from "@heroicons/react/24/outline";
import { TypingIndicator } from "../ChatModal/TypingIndicator";
import { useI18n } from "next-localization";

export const ChatBotRatingForm = ({ data, responseStatus, setResponseStatus }: { data: any; responseStatus: number; setResponseStatus: (status: number) => void }) => {
  const [isTyping, setIsTyping] = useState(false);
  const [isTypingError, setIsTypingError] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const RatingData = data.questions?.results?.filter((el: any) => el.name === "rating")[0] || {};
  const submitData = data?.children?.results?.filter((el: any) => el.name === "Submit")[0] || {};
  const eloquaFormHTMLName = data.form?.targetItems?.[0]?.field?.value;

  const { t: dictionary } = useI18n();

  const onSubmit = async (value: any) => {
    const eloquaEndpoint = "https://s1816836.t.eloqua.com/e/f2";

    const eloquaFormData = {
      elqFormName: eloquaFormHTMLName,
      elqSiteID: "1816836",
      rating: value.rating,
    };

    try {
      const response = await fetch(eloquaEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(eloquaFormData),
      });

      const responseText = await response.text();
      if (typeof responseText === "string" && responseText.includes("The Information Provided is Incomplete or Invalid")) {
        setErrorMessage("We are sorry, but the information provided is incomplete or invalid. Please try again.");
        setIsTypingError(true);
        setTimeout(() => {
          setIsTypingError(false);
        }, 600);
        return;
      }
      setResponseStatus(response.status);
    } catch (error) {
      console.error("Error submitting form", error);
    } finally {
      setIsTyping(false);
    }
  };

  return responseStatus === 200 ? (
    !isTyping ? (
      <div className="flex items-end gap-2 mt-6">
        <div>
          <ChatLogo />
        </div>
        <div className="assistant-message">
          <p className="text-[0.9rem] !m-0 inline ">{dictionary("SubmitRatingFormMessage")}</p>
          <CheckBadgeIcon className="w-5 h-5  text-green-700 inline ml-2" />
        </div>
      </div>
    ) : (
      <TypingIndicator />
    )
  ) : (
    <>
      <div className="flex items-end gap-2 mt-6">
        <div>
          <ChatLogo />
        </div>
        <div className="assistant-message">
          <p className="text-[0.8rem] !m-0">{RatingData.label?.value}</p>
        </div>
      </div>

      <Formik initialValues={{ rating: 4 }} onSubmit={onSubmit}>
        {({ values, setFieldValue }) => (
          <Form>
            <div className="flex items-center justify-center mt-6">
              <Field name="rating">
                {({ field }: { field: any }) => (
                  <Rating
                    {...field}
                    value={values.rating}
                    onChange={(_event, newValue) => {
                      setFieldValue("rating", newValue);
                    }}
                    defaultValue={4}
                    precision={1}
                    max={5}
                    icon={<StarIcon sx={{ fontSize: 40 }} />}
                    emptyIcon={<StarIcon sx={{ fontSize: 40, opacity: 0.7 }} />}
                  />
                )}
              </Field>
            </div>
            <div className="flex items-center justify-center">
              <button type="submit" className="z-999 mt-6 bg-ChartwellBlue text-white font-bold py-2 px-6 rounded-xl ">
                {submitData.journey}
              </button>
            </div>
          </Form>
        )}
      </Formik>

      {errorMessage && !isTypingError ? (
        <div className="flex items-center justify-center mt-4">
          <p className="text-red-700 text-[0.8rem]">{errorMessage}</p>
        </div>
      ) : (
        isTypingError && <TypingIndicator />
      )}
    </>
  );
};
