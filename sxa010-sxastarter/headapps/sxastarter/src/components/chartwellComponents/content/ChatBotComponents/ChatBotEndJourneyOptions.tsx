import { useState } from "react";
import { ChatBotRatingForm } from "./ChatBotRatingForm";

import { StarIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import ChatLogo from "../ChatModal/ChatLogo";
import { useI18n } from "next-localization";
export const ChatBotEndJourneyOptions = ({
  data,
  setOpen,
  setJourney,
  setSelectedForm,
  setUserAnswers,
  setIsTyping,
  isTyping,
  setSubmittedFormType,
  submittedFormType,
}: {
  data: any;
  setOpen: (value: boolean) => void;
  setJourney: (value: any) => void;
  setSelectedForm: (value: any) => void;
  setUserAnswers: (value: any) => void;
  setIsTyping: (value: boolean) => void;
  submittedFormType: { isSubmitted: boolean; formType: string };
  setSubmittedFormType: (isFormSubmitted: { isSubmitted: boolean; formType: string }) => void;
  isTyping: boolean;
}) => {
  const [isRatingForm, setIsRatingForm] = useState(false);
  const [formData, setFormData] = useState({});
  const [responseStatus, setResponseStatus] = useState(0);

  const { t: dictionary } = useI18n();

  const handlerJourneys = (option: { name: string }) => {
    if (option.name === "Close Chat") {
      setOpen(false);
      setJourney({ parentQuestion: "", flow: [] });
      setSelectedForm(null);
      setUserAnswers([]);
      setSubmittedFormType({ isSubmitted: false, formType: "" });
      setIsRatingForm(false);

      const ftype = JSON.parse(window.sessionStorage.getItem("currForm") || "") ? JSON.parse(window.sessionStorage.getItem("currForm") || "").formType : "";
      window.sessionStorage.setItem("currForm", JSON.stringify({ isSubmitted: false, formType: ftype }));
      window.sessionStorage.removeItem(`${ftype}_chatBot_questionAnswer`);
      window.sessionStorage.removeItem(`${ftype}_chatBot_step`);
      window.sessionStorage.removeItem(`${ftype}_chatBot`);
    } else if (option.name === "Go Back to Start") {
      setJourney({ parentQuestion: "", flow: [] });
      setSelectedForm(null);
      setUserAnswers([]);
      setSubmittedFormType({ isSubmitted: false, formType: "" });
      setIsRatingForm(false);

      const ftype = JSON.parse(window.sessionStorage.getItem("currForm") || "") ? JSON.parse(window.sessionStorage.getItem("currForm") || "").formType : "";
      window.sessionStorage.setItem("currForm", JSON.stringify({ isSubmitted: false, formType: ftype }));
      window.sessionStorage.removeItem(`${ftype}_chatBot_questionAnswer`);
      window.sessionStorage.removeItem(`${ftype}_chatBot_step`);
      window.sessionStorage.removeItem(`${ftype}_chatBot`);
    } else {
      setFormData(option);
      setIsTyping(true);
      setTimeout(() => setIsTyping(false), 1000);
      setIsRatingForm(true);
    }
  };

  const BookATourEnd = data[0]?.children?.results.filter((el: any) => el.name === "BookATourDownloadPDF")[0] || {};
  const ContactUsEnd = data[0]?.children?.results.filter((el: any) => el.name === "FAQsContactUS")[0] || {};

  return (
    <div>
      <div>
        <div className="flex items-end gap-2">
          <ChatLogo />
          <div className="assistant-message">
            {submittedFormType.formType === "bookatour_chatbot_en" || submittedFormType.formType === "bookatour_chatbot_fr" ? (
              <p className="text-[0.9rem] !m-0">{dictionary("BookATourPDF")}</p>
            ) : (
              <p className="text-[0.9rem] !m-0">{dictionary("ContactUsFAQ")}</p>
            )}
          </div>
        </div>
      </div>
      <ul className="flex gap-2 flex-wrap justify-center items-center mt-6">
        {data[0]?.children?.results?.map((el: any) => {
          if (el?.form?.targetItems?.[0].field?.value === "rate_your_experience") {
            return responseStatus !== 200 ? (
              <li key={el.journey}>
                <button onClick={() => handlerJourneys(el)} type="button" className="no-underline border font-bold py-2 px-4 rounded-xl bg-ChartwellWhite flex items-center gap-2 border-yellow-400">
                  {el.journey}
                  <StarIcon className="w-5 h-5 text-yellow-400" />
                </button>
              </li>
            ) : null;
          } else if (el.name === "BookATourDownloadPDF" || el.name === "FAQsContactUS") {
            // Render either BookATourDownloadPDF or FAQsContactUS based on the form type
            if (submittedFormType.formType === "bookatour_chatbot_en" || submittedFormType.formType === "bookatour_chatbot_fr") {
              if (el.name === "BookATourDownloadPDF") {
                return (
                  <Link
                    key={el.journey}
                    target={"_blank"}
                    className="no-underline hover:!bg-ChartwellPlum text-white font-bold py-2 px-4 rounded-xl text-center button !bg-ChartwellGrey block"
                    href={BookATourEnd.customLink.value}
                  >
                    {BookATourEnd.journey}
                  </Link>
                );
              }
            } else if (el.name === "FAQsContactUS") {
              return (
                <Link
                  key={el.journey}
                  target={"_blank"}
                  className="no-underline hover:!bg-ChartwellPlum text-white font-bold py-2 px-4 rounded-xl text-center button !bg-ChartwellGrey block"
                  href={ContactUsEnd.navigationItem.navigationLink}
                >
                  {ContactUsEnd.journey}
                </Link>
              );
            }
          } else {
            return (
              <li key={el.journey}>
                <button onClick={() => handlerJourneys(el)} type="button" className="no-underline hover:bg-ChartwellPlum text-white font-bold py-2 px-4 rounded-xl bg-ChartwellGrey block">
                  {el.journey}
                </button>
              </li>
            );
          }
          return null; // Fallback for unhandled cases
        })}
      </ul>
      {isRatingForm && !isTyping && <ChatBotRatingForm setResponseStatus={setResponseStatus} responseStatus={responseStatus} data={formData} />}
    </div>
  );
};
