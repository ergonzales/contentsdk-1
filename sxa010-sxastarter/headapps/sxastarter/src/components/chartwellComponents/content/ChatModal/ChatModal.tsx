import { JSX } from "react";
import { useState, useEffect, useRef } from "react";


import { XMarkIcon } from "@heroicons/react/24/outline";
import { UserIcon } from "@heroicons/react/20/solid";
import { TypingIndicator } from "./TypingIndicator";

import ChatLogo from "./ChatLogo";
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";

import { ChatBotEndJourneyOptions } from "../ChatBotComponents/ChatBotEndJourneyOptions";
// import { ChatFormHandler } from "./ChatFormHandler";

import { GalleryChatBotModal } from "../ChatBotComponents/GalleryChatBotModal";
import { TabbedSuitePlansChatBotModal } from "../ChatBotComponents/TabbedSuitePlansChatBotModal";
import { TestimonialsChatBotModal } from "../ChatBotComponents/TestimonialsChatBotModal";

import { normalize } from "lib/helpers/form/formAndDatalayerHelpers";

import Phone from "../../../../../public/bi_telephone.svg";
import ChartwellMarkerPlum from "../../../../../public/stories/Map Banner/chartwell_pin.svg";

import Link from "next/link";

import { useMediaQuery } from "react-responsive";
import { useI18n } from "next-localization";
import { useSessionStorage } from "usehooks-ts";
import { useRouter } from "next/router";
import { useSitecoreContext } from "lib/sitecore/useSitecoreContext";

const ChatModal = ({ data }: { data: any }): JSX.Element => {
  const router = useRouter();
  const sessionsStorageData = {
    residences: {
      open: false,
      userAnswers: [] as any[],
      journey: { parentQuestion: "", flow: [] as any[] },
      selectedForm: null,
    },
    corporate: {
      open: false,
      userAnswers: [] as any[],
      journey: { parentQuestion: "", flow: [] as any[] },
      selectedForm: null,
    },
  };

  const pipUpStorageData = {
    common: {
      isPopupActive: false,
      openAtLeastOnce: false,
    },
  };

  const [valueSessionsStorage, setSessionsStorage] = useSessionStorage(`chatBot_${router.locale}_${data.ResidenceID ? data.ResidenceID : "corporate"}`, sessionsStorageData);
  const [popUpValueStorage, setPopUpValueStorage] = useSessionStorage(`chatBot_popUpValue}`, pipUpStorageData);
  const [submittedFormTypeSessionsStorage, setSubmittedFormTypeSessionsStorage] = useSessionStorage(`chatBot_Form_${router.locale}_${data.ResidenceID ? data.ResidenceID : "corporate"}`, {
    isSubmitted: false,
    formType: "",
  });
  const [open, setOpen] = useState<boolean>(data.ResidenceID ? valueSessionsStorage?.residences?.open : valueSessionsStorage.corporate.open);
  const [journey, setJourney] = useState<{ parentQuestion: string; flow: any[] }>(data.ResidenceID ? valueSessionsStorage?.residences?.journey : valueSessionsStorage.corporate.journey);
  const [selectedForm, setSelectedForm] = useState<any>(data.ResidenceID ? valueSessionsStorage?.residences?.selectedForm : valueSessionsStorage.corporate.selectedForm);

  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isTabbedSuitePlansOpen, setIsTabbedSuitePlansOpen] = useState(false);
  const [isContactInfo, setIsContactInfo] = useState(false);
  const [isTestimonialOpen, setIsTestimonialOpen] = useState(false);
  const [isOtherInquiry, setIsOtherInquiry] = useState(false);
  const [isPolicyOpen, setIsPolicyOpen] = useState(false);

  const [userAnswers, setUserAnswers] = useState<any[]>(data.ResidenceID ? valueSessionsStorage?.residences?.userAnswers : valueSessionsStorage.corporate.userAnswers);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [isFormTyping, setIsFormTyping] = useState<boolean>(false);

  const [isPopupActive, setIsPopupActive] = useState(popUpValueStorage?.common?.isPopupActive);
  const [openAtLeastOnce, setOpenAtLeastOnce] = useState(popUpValueStorage?.common?.openAtLeastOnce);

  const [submittedFormType, setSubmittedFormType] = useState(submittedFormTypeSessionsStorage);

  const getSavedDL = () => {
    try {
      return JSON.parse(window.sessionStorage.getItem("cwCbDl") || "");
    } catch (e) {
      return {};
    }
  };

  const setSavedDL = (obj: any) => {
    window.sessionStorage.setItem("cwCbDl", JSON.stringify(obj));
  };

  const isMobile = useMediaQuery({
    query: "(max-width: 768px)",
  });

  useEffect(() => {
    if (window.sessionStorage.getItem("currForm")) {
      const formDetails = JSON.parse(window.sessionStorage.getItem("currForm") as string);
      setSubmittedFormType(formDetails);
    }

    setPopUpValueStorage((prev) => ({ ...prev, common: { isPopupActive: isPopupActive, openAtLeastOnce: openAtLeastOnce } }));
    setSubmittedFormTypeSessionsStorage((prev) => ({ ...prev, isSubmitted: submittedFormType.isSubmitted, formType: submittedFormType.formType }));
    if (data.ResidenceID) {
      setSessionsStorage((prev) => ({
        ...prev,
        residences: {
          open: open,
          openAtLeastOnce: openAtLeastOnce,
          userAnswers: userAnswers,
          journey: journey,
          selectedForm: selectedForm,
        },
      }));
    } else {
      setSessionsStorage((prev) => ({
        ...prev,
        corporate: {
          open: open,
          openAtLeastOnce: openAtLeastOnce,
          userAnswers: userAnswers,
          journey: journey,
          selectedForm: selectedForm,
        },
      }));
    }
  }, [
    data.ResidenceID,
    isPopupActive,
    journey,
    open,
    openAtLeastOnce,
    selectedForm,
    setPopUpValueStorage,
    setSessionsStorage,
    setSubmittedFormTypeSessionsStorage,
    submittedFormType.formType,
    submittedFormType.isSubmitted,
    userAnswers,
  ]);

  const { t: dictionary } = useI18n();

  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scContext = useSitecoreContext();
  const [cbDataLayer, setCBDatalayer] = useState({ event: "", chat_option_main: "", chat_option_secondary: "" });

  useEffect(() => {
    if (openAtLeastOnce) return;
    const timer = setTimeout(() => {
      setOpenAtLeastOnce(true);
      setIsPopupActive(true);
    }, 7000); // Adjust timing if necessary

    return () => clearTimeout(timer);
  }, [openAtLeastOnce]);

  // handler for which modal to open
  const handleButtonClickModalOpen = (id: string) => {
    const idToActionMap: Record<string, () => void> = {
      GalleryBtnCB: () => {
        setIsGalleryOpen(true);
        setIsTabbedSuitePlansOpen(false);
        setIsTestimonialOpen(false);
        setIsOtherInquiry(false);
      },
      FloorPlansPricingBtnCB: () => {
        setIsTabbedSuitePlansOpen(true);
        setIsGalleryOpen(false);
        setIsTestimonialOpen(false);
        setIsOtherInquiry(false);
      },
      TestimonialsBtnCB: () => {
        setIsTestimonialOpen(true);
        setIsGalleryOpen(false);
        setIsTabbedSuitePlansOpen(false);
        setIsOtherInquiry(false);
      },
      ContactInfoBtnCB: () => {
        setIsContactInfo(true);
        setIsGalleryOpen(false);
        setIsTabbedSuitePlansOpen(false);
        setIsTestimonialOpen(false);
        setIsOtherInquiry(false);
      },
      OtherInquiryBtnCB: () => {
        setIsOtherInquiry(true);
        setIsGalleryOpen(false);
        setIsTabbedSuitePlansOpen(false);
        setIsTestimonialOpen(false);
      },
    };

    // Execute the corresponding action if id exists in the map
    if (idToActionMap[id]) {
      idToActionMap[id]();
    } else {
      // Default fallback action
      setIsGalleryOpen(false);
      setIsTabbedSuitePlansOpen(false);
      setIsContactInfo(false);
      setIsTestimonialOpen(false);
      setIsOtherInquiry(false);
    }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [isTyping, journey, isFormTyping, userAnswers]);

  useEffect(() => {
    {
      const bodyElement = document.querySelector("body");
      if (open && bodyElement && isMobile) {
        bodyElement.style.overflow = "hidden";
      } else if (bodyElement) {
        bodyElement.style.overflow = "auto";
      }
    }
  }, [open, isMobile]);

  const handlerJourneys = (flow: any, e: any) => {
    if (flow.form && flow.isItparentForJourneys?.value !== "1") {
      setIsFormTyping(true);
      setJourney({ parentQuestion: "", flow: [] });
      setTimeout(() => {
        setIsFormTyping(false);
      }, 1000);
      setSelectedForm(flow);
      setUserAnswers([]);
      setSubmittedFormType({ isSubmitted: false, formType: "" });
    } else if (flow.isItparentForJourneys?.value === "1") {
      setIsTyping(true);
      setJourney({ parentQuestion: flow.parentQuestion.value, flow: flow?.children?.results });
      setSelectedForm(null);
      setTimeout(() => {
        setIsTyping(false);
      }, 1000);

      setUserAnswers([]);
      setSubmittedFormType({ isSubmitted: false, formType: "" });
    }
    setChatBotEventDatalayers(flow, e);
  };

  const cleanupPropertyName = (propertyName: string) => {
    const regexToReplace = [new RegExp(/ Residence Pour Retraites/gim), new RegExp(/ Retirement Residence/gim), new RegExp(/ Care Residence/gim)];

    regexToReplace.forEach((rx) => {
      propertyName = normalize(propertyName)?.replace(rx, "");
    });

    return propertyName.trim();
  };

  const createBtnIDs = (flow: any) => {
    let eleId = flow.dataLayersId?.value || flow.id;
    if (flow.journey.toLowerCase().includes("book") || flow.journey.toLowerCase().includes("planifier")) {
      eleId = "batBtnCB";
    }
    if (flow.journey.toLowerCase().includes("learn about residence") || flow.journey.toLowerCase().includes("en savoir plus sur la résidence")) {
      eleId = "learnBtnCB";
    }
    if (flow.journey.toLowerCase().includes("explorer les modes de vie") || flow.journey.toLowerCase().includes("explore living options")) {
      eleId = "expLvnOptsBtnCB";
    }
    if (flow.journey.toLowerCase().includes("request information") || flow.journey.toLowerCase().includes("demander des informations")) {
      eleId = "reqInfoBtnCB";
    }
    if (flow.journey.toLowerCase().includes("living at chartwell") || flow.journey.toLowerCase().includes("la vie chez chartwell")) {
      eleId = "livingatchartwellBtnCB";
    }
    if (flow.journey.toLowerCase().includes("request information") || flow.journey.toLowerCase().includes("autres questions")) {
      eleId = "OtherInquiryBtnCB";
    }
    if (flow.journey.toLowerCase().includes("learn about care assist") || flow.journey.toLowerCase().includes("en savoir plus sur notre programme de soins de santé")) {
      eleId = "learnaboutcareassistBtnCB";
    }
    if (flow.journey.toLowerCase().includes("explore retirement living") || flow.journey.toLowerCase().includes("explorer la vie en résidence")) {
      eleId = "exploreretirementlivingBtnCB";
    }
    if (flow.journey.toLowerCase().includes("senior living options") || flow.journey.toLowerCase().includes("options de vie en résidence")) {
      eleId = "seniorlivingoptionsBtnCB";
    }
    if (flow.journey.toLowerCase().includes("chartwell experiences") || flow.journey.toLowerCase().includes("expériences chartwell")) {
      eleId = "chartwellexperiencesBtnCB";
    }
    if (flow.journey.toLowerCase().includes("helpful resources ") || flow.journey.toLowerCase().includes("ressources utiles")) {
      eleId = "helpfulresourcesBtnCB";
    }
    if (flow.journey.toLowerCase().includes("helpful resources ") || flow.journey.toLowerCase().includes("ressources utiles")) {
      eleId = "helpfulresourcesBtnCB";
    }
    if (!eleId) {
      eleId = normalize(flow.journey.toLowerCase().replace(/ /gm, "")) + "BtnCB";
    }
    return eleId;
  };

  const btnIds = [
    { id: "FindAResidenceBtnCB", evt: "find_a_residence" },
    { id: "exploreretirementlivingBtnCB", evt: "explore_retirement_living" },

    { id: "batBtnCB", evt: "book_a_personalized_tour" },
    { id: "learnBtnCB", evt: "learn_about_residence" },
    { id: "JobsBtnCB", evt: "career_opportunities" },

    { id: "FloorPlansPricingBtnCB", evt: "view_suites_pricing" },
    { id: "GalleryBtnCB", evt: "view_residence_photos" },
    { id: "TestimonialsBtnCB", evt: "read_testimonials" },
    { id: "ContactInfoBtnCB", evt: "see_contact_info" },
    { id: "expLvnOptsBtnCB", evt: "explore_living_options" },
    { id: "BrochureBtnCB", evt: "download_our_brochure" },
    { id: "reqInfoBtnCB", evt: "request_information" },

    { id: "livingatchartwellBtnCB", evt: "living_at_chartwell" },
    { id: "OtherInquiryBtnCB", evt: "other_inquiries" },

    { id: "IndependentLivingBtnCB", evt: "independent_living" },
    { id: "AssistedLivingBtnCB", evt: "assisted_living" },
    { id: "MemoryCareBtnCB", evt: "memory_care" },
    { id: "SeniorApartmentsBtnCB", evt: "senior_apartments" },
    { id: "LongTermCareBtnCB", evt: "long_term_care" },
    { id: "learnaboutcareassistBtnCB", evt: "learn_about_care_assist" },

    { id: "seniorlivingoptionsBtnCB", evt: "senior_living_options" },
    { id: "chartwellexperiencesBtnCB", evt: "chartwell_experiences" },
    { id: "helpfulresourcesBtnCB", evt: "helpful_resources" },

    { id: "ontarioCB", evt: "ON" },
    { id: "QuebecCB", evt: "QC" },
    { id: "AlbertaCB", evt: "AB" },
    { id: "BritishColumbiaCB", evt: "BC" },

    { id: "lifeEnrichmentCB", evt: "life_enrichment" },
    { id: "DiningExpCB", evt: "dining_experience" },

    { id: "helpGuidCB", evt: "comprehensive_guides" },
    { id: "infArtCB", evt: "informative_articles" },
    { id: "intQuizCB", evt: "readiness_quiz" },
  ];

  const setChatBotEventDatalayers = (flow: any, e: any) => {
    const isPropertyPage = scContext.sitecoreContext.route?.templateName?.toLowerCase().includes("property");
    const target = e.target as HTMLElement;
    const secondaryChoices = document.querySelectorAll(".nth-selections")[0];
    const isInitialChoice = target.classList.contains("initial");
    const isSecondaryChoice = target.parentNode == secondaryChoices;
    if (isInitialChoice || isSecondaryChoice) {
      if (isInitialChoice) {
        let chatOptMain = btnIds.find((x) => x.id == e.target.id)?.evt || normalize(flow.journey.replace(/ /gm, "_").toLowerCase());
        if (e.target.id.includes("batBtnCB")) chatOptMain = "book_a_personalized_tour";
        if (e.target.id.includes("learnBtnCB")) chatOptMain = "learn_about_residence";
        if (e.target.id.includes("JobsBtnCB")) chatOptMain = "career_opportunities";
        setCBDatalayer({ event: `${isPropertyPage ? "property" : "corporate"}_chat`, chat_option_main: `${chatOptMain}`, chat_option_secondary: "" });
      }

      if (isSecondaryChoice) {
        const chatOptSec = btnIds.find((x) => x.id == e.target.id)?.evt || normalize(flow.journey.replace(/ /gm, "_").toLowerCase());
        cbDataLayer.chat_option_secondary = `${chatOptSec}`;
        setCBDatalayer(cbDataLayer);
      }
    }
    if (e.target.id.includes("for-a-loved-one-") || e.target.id.includes("for-myself-")) {
      const val = e.target.id.includes("for-a-loved-one-") ? "for a loved one" : "for myself";
      window.sessionStorage.setItem("BookATour_forWho", val);
    }
  };

  const updateDataLayer = (obj: any) => {
    const dataLayer = window.dataLayer || [];
    dataLayer.push(obj);
  };

  const chatFormDataLayers = async (context: any, type: any) => {
    const lang = context.sitecoreContext.language == "en" ? "English" : "French";
    const shortlang = context.sitecoreContext.language.toString().toUpperCase();

    if (type == "bookatour") {
      const isChildPage = context.sitecoreContext.route.templateName == "PropertyChildPage" ? true : false;
      const isPropertyPage = context.sitecoreContext.route.templateName == "PropertyPage" ? true : false;

      if (isChildPage || isPropertyPage) {
        const resContext = !isChildPage
          ? context.sitecoreContext.route
          : context.sitecoreContext.route?.placeholders["headless-main"]
              ?.filter((comp: any) => comp.componentName === "PropertyHeaderNavigation")[0]
              .fields.data.item.ancestors?.find((el: any) => el.hasOwnProperty("propertyName"));

        const provinces = [
          { name: "Ontario", value: "ON" },
          { name: "British Columbia", value: "BC" },
          { name: "Colombie-Britannique", value: "BC" },
          { name: "Quebec", value: "QC" },
          { name: "Alberta", value: "AB" },
        ];

        const propertyName = isChildPage ? resContext.propertyName.value : resContext.fields["Property Name"].value;
        const propID = isChildPage ? resContext.contextParentPropertyId.value : resContext.fields["PropertyID"].value;
        const prov = isChildPage
          ? provinces.find((p) => normalize(resContext?.province?.targetItems?.[0]?.provinceName.value) == p.name)?.value
          : resContext.fields.Province[0].fields["Province Abbreviation"].value;
        const city = normalize(isChildPage ? resContext?.city?.targetItems?.[0]?.cityName.value : resContext.fields.City[0].fields["City Name"].value);
        const isPriorityProperty = (isChildPage ? resContext.isPriorityProperty.boolValue : resContext.fields.isPriorityProperty.value) == true ? "Yes" : "No";

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
        //view item event
        const evDl = {
          event: "view_item",
          ecommerce: {
            items: [dlPropDetails],
          },
        };
        window.sessionStorage.setItem("dlPropDetails", JSON.stringify(dlPropDetails));
        updateDataLayer(evDl);
      }
    }

    if (type == "contact") {
      const evDl = {
        pageContent: "corporate", //static
        page_lang: shortlang, // values: EN for English and FR for French page
        pageCat: "corporate", // static
        pageType: "contact us", //static
        //item_category5: "chatbot",
      };
      updateDataLayer(evDl);
    }
  };

  useEffect(() => {
    if (cbDataLayer.chat_option_main?.length == 0) {
      const lastDL = getSavedDL();
      const isProperty = scContext.sitecoreContext.route?.templateName?.toLowerCase().includes("property");

      //Keep the saved stuff if it aligns with current.
      if ((isProperty && lastDL.event == "property_chat") || (!isProperty && lastDL.event == "corporate_chat")) {
        setCBDatalayer(lastDL);
      } else {
        sessionStorage.removeItem("cwCbDl");
      }
    }
    cbDataLayer.chat_option_main?.length > 0 && setSavedDL(cbDataLayer);
    cbDataLayer.chat_option_main?.length > 0 && updateDataLayer(cbDataLayer);
    if (cbDataLayer.chat_option_main == "book_a_personalized_tour") chatFormDataLayers(scContext, "bookatour");
    if (cbDataLayer.chat_option_secondary == "request_information") chatFormDataLayers(scContext, "contact");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cbDataLayer.chat_option_main, cbDataLayer.chat_option_secondary, cbDataLayer.event]);

  const questionAnswerHandler = (question: string, answer: string, isItForm: string, id: string) => {
    if (isItForm) return;
    setUserAnswers((prev) => [...prev, { question, answer, id }]);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
    }, 1000);
  };
  return (
    <>
      {isTabbedSuitePlansOpen && <TabbedSuitePlansChatBotModal setOpen={setIsTabbedSuitePlansOpen} isTabbedSuitePlansOpen={isTabbedSuitePlansOpen} />}
      {isGalleryOpen && <GalleryChatBotModal VideoId={data?.VideoId} DAMImages={data?.GalleryData} setOpen={setIsGalleryOpen} isGalleryOpen={isGalleryOpen} />}
      {isTestimonialOpen && <TestimonialsChatBotModal data={data?.TestimonialData} setOpen={setIsTestimonialOpen} isTestimonialOpen={isTestimonialOpen} />}
      <div className="z-50  relative">
        {/* Start PopUp */}
        {!open && isPopupActive && (
          <div id="ChatSuggestion" className={` bg-ChartwellWhite relative  `}>
            <XMarkIcon className="h-6 w-6 cursor-pointer absolute top-2 right-2" onClick={() => setIsPopupActive(false)} aria-hidden="true" />
            <div className="flex items-end gap-2 mt-3">
              <div className="mt-2 flex gap-2 items-center">
                <ChatLogo id="chatLogo" alt="Chat with Chartwell Retirement Residences" />
                <p className="!m-0">{dictionary("popupMessage")}</p>
              </div>
            </div>
            <button
              onClick={() => {
                setOpen(!open);
                setIsPopupActive(false);
              }}
              className=" hover:bg-ChartwellPlum text-white font-bold py-2 px-4 rounded-xl button block mx-auto mt-2 "
            >
              {dictionary("PopupButton")}
            </button>
          </div>
        )}

        {open && (
          <div className="absolute  inset-0 z-999 overflow-y-hidden chartwellModal justify-center">
            <div id="chatBot">
              <div className="header flex justify-between">
                <div className="flex items-center ml-[4px]">
                  <ChatLogo id="chatLogo" alt="Chat with Chartwell Retirement Residences" />
                  <span className="font-semibold ml-[4px]">{dictionary("ChatBotTitle")}</span>
                </div>
                <XMarkIcon className="h-6 w-6 cursor-pointer" onClick={() => setOpen(false)} aria-hidden="true" />
              </div>

              <div ref={chatContainerRef} className="chat-container">
                <div className="flex items-end gap-2 mb-4">
                  <div className="">
                    <ChatLogo />
                  </div>
                  <div className="assistant-message">
                    <p className="text-[0.8rem] !m-0" dangerouslySetInnerHTML={{ __html: data.GreetingMessage }}></p>
                  </div>
                </div>

                <div className="flex gap-2  flex-col justify-center items-center mb-6">
                  {data.allFlows &&
                    data.allFlows.map((flow: any, index: number) => {
                      const eleId = createBtnIDs(flow);
                      return !flow.customLink && !flow.navigationItem ? (
                        <button
                          onClick={(e) => {
                            handlerJourneys(flow, e);
                            handleButtonClickModalOpen(flow.dataLayersId?.value);
                          }}
                          id={eleId}
                          key={index} // Added unique key prop
                          type="button"
                          className="no-underline hover:bg-ChartwellPlum text-white font-bold py-2 px-4 rounded-xl button block initial"
                        >
                          {flow.journey.replace("{ResidenceName}", data.ResidenceName)}
                        </button>
                      ) : (
                        <Link
                          id={eleId}
                          key={index} // Added unique key prop
                          target={flow.customLink.value.length !== 0 ? "_blank" : "_self"}
                          className="no-underline  hover:bg-ChartwellPlum text-white font-bold py-2 px-4 rounded-xl button block initial"
                          onClick={(e) => {
                            setChatBotEventDatalayers(flow, e);
                            setOpen(false);
                          }}
                          href={flow.customLink.value.length !== 0 ? flow.customLink.value : flow.navigationItem.navigationLink}
                        >
                          {flow.journey}
                        </Link>
                      );
                    })}
                </div>

                {/* New deep journeys are starting here */}

                {/* Select form  user flow */}

                {/* Show question-answer pairs */}

                {userAnswers.map((pair, index) => (
                  <div key={index}>
                    <div className="flex items-end gap-2">
                      <div>
                        <ChatLogo />
                      </div>
                      <div className="assistant-message">
                        <p className="text-[0.8rem] !m-0">{pair.question}</p>
                      </div>
                    </div>
                    <div className="self-end flex items-end justify-end">
                      <div className="user-message ">
                        <p className="text-[0.8rem] !m-0">{pair.answer}</p>
                      </div>
                      <UserIcon className="w-6 h-6 fill-ChartwellGrey" />
                    </div>
                  </div>
                ))}

                <div className="">
                  {!isTyping && journey.flow.length !== 0 && (
                    <div className="flex items-end gap-2 mb-4">
                      <div>
                        <ChatLogo />
                      </div>
                      <div className="assistant-message">
                        <p className="text-[0.8rem] mb-4 !m-0">{journey?.parentQuestion}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 flex-col justify-center items-center mb-6 nth-selections">
                    {!isTyping &&
                      journey?.flow.map((flow: any) => {
                        const eleId = createBtnIDs(flow);
                        return !flow.customLink && !flow.navigationItem ? (
                          flow.name !== "Brochure" ? (
                            <button
                              onClick={(e) => {
                                handlerJourneys(flow, e);
                                questionAnswerHandler(journey?.parentQuestion, flow.journey, flow.form, flow.dataLayersId?.value);
                                handleButtonClickModalOpen(flow.dataLayersId?.value);
                              }}
                              id={eleId}
                              key={flow.dataLayersId?.value || flow.id}
                              type="button"
                              className="no-underline hover:bg-ChartwellPlum text-white font-bold py-2 px-4 rounded-xl bg-ChartwellGrey block nth"
                            >
                              {flow.journey}
                            </button>
                          ) : data.BrochureLink?.value?.href ? (
                            <Link
                              id={eleId}
                              key={flow.dataLayersId?.value || flow.id}
                              target="_blank"
                              className="no-underline hover:!bg-ChartwellPlum text-white font-bold py-2 px-4 rounded-xl button !bg-ChartwellGrey block nth "
                              onClick={(e) => {
                                setChatBotEventDatalayers(flow, e);
                                setOpen(false);
                              }}
                              href={data.BrochureLink?.value?.href}
                            >
                              {flow.journey}
                            </Link>
                          ) : null
                        ) : (
                          <Link
                            onClick={(e) => {
                              setChatBotEventDatalayers(flow, e);
                              setOpen(false);
                            }}
                            id={eleId}
                            key={flow.dataLayersId?.value || flow.id}
                            target={flow.customLink?.value ? "_blank" : "_self"}
                            className="no-underline hover:!bg-ChartwellPlum text-white font-bold py-2 px-4 rounded-xl button !bg-ChartwellGrey block"
                            href={flow.customLink?.value ? flow.customLink?.value : flow.navigationItem.navigationLink}
                          >
                            {flow.journey}
                          </Link>
                        );
                      })}
                  </div>
                </div>

                {/* Display current question and choices */}

                {/* BrochureLink */}
                {!isTyping && isContactInfo && (
                  <div className="flex items-end gap-2">
                    <div>
                      <ChatLogo />
                    </div>
                    <div className="assistant-message">
                      <p className="text-[0.8rem] !m-0">{dictionary("contactInfo")}</p>
                      <address className="flex md:flex-row flex-col  items-center flex-wrap mt-2">
                        <a href={`tel:${data.ContactNumber}`} className=" mb-2  no-underline justify-center text-[0.8rem]  duration-300 flex items-center not-italic">
                          <svg width="15" height="15" className="block mx-2">
                            <image href={`${Phone.src}`} width="15" height="15" className="" />
                          </svg>
                          <span>{data.ContactNumber}</span>
                        </a>
                        <a
                          className="  no-underline  duration-300 justify-center  not-italic  text-[0.8rem] flex items-center "
                          href={`https://www.google.com/maps/place/${data.address}`}
                          rel="noreferrer noopener"
                          target="_blank"
                        >
                          <svg width="42" height="42" className="mr-2">
                            <image href={`${ChartwellMarkerPlum.src}`} width="30" height="30" className=" " />
                          </svg>

                          {data.address}
                        </a>
                      </address>
                    </div>
                  </div>
                )}

                {!isTyping && isOtherInquiry && (
                  <div className="flex items-end gap-2">
                    <div>
                      <ChatLogo />
                    </div>
                    <div className="assistant-message">
                      <p className="text-[0.8rem] !mb-2">{dictionary("OtherInquiry")} </p>
                      <a href={`tel:${data.ContactNumber}`} className="no-underline  text-[0.8rem]  duration-300 inline-flex items-center not-italic">
                        <svg width="15" height="15" className="mr-2">
                          <image href={`${Phone.src}`} width="15" height="15" className="" />
                        </svg>
                        <span>{data.ContactNumber}</span>
                      </a>
                    </div>
                  </div>
                )}

                {/* {!submittedFormType.isSubmitted && selectedForm && (
                  <ChatFormHandler setSubmittedFormType={setSubmittedFormType} selectedForm={selectedForm} ResidenceID={data.ResidenceID} isTyping={isFormTyping} setIsTyping={setIsFormTyping} />
                )} */}

                {submittedFormType.isSubmitted && (
                  <ChatBotEndJourneyOptions
                    setSubmittedFormType={setSubmittedFormType}
                    submittedFormType={submittedFormType}
                    data={data.endJourney}
                    setIsTyping={setIsTyping}
                    isTyping={isTyping}
                    setOpen={setOpen}
                    setJourney={setJourney}
                    setSelectedForm={setSelectedForm}
                    setUserAnswers={setUserAnswers}
                  />
                )}
                {isTyping && <TypingIndicator />}

                {!isTyping && isPolicyOpen && (
                  <div className="flex items-end gap-2">
                    <div>
                      <ChatLogo />
                    </div>
                    <div className="assistant-message ">
                      <p className="text-[0.7rem] !mb-2 inline">{dictionary("NoticeText")}</p>
                      <Link target="_blank" className="text-[0.7rem]  ml-1" href={router.locale === "en" ? "/website-privacy-statement" : "/fr/politique-de-confidentialite"}>
                        {dictionary("policyLink")}
                      </Link>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => {
                    setIsTyping(true);
                    setTimeout(() => {
                      setIsTyping(false);

                      setIsPolicyOpen(!isPolicyOpen);
                    }, 1000);
                  }}
                  className="ml-auto mt-auto pr-2   underline"
                >
                  <span className="text-[0.7rem]"> {isPolicyOpen ? dictionary("CloseNoticeBTN") : dictionary("OpenNoticeBTN")} </span>
                </button>
                <div className="w-full mt-10"></div>
              </div>
            </div>
          </div>
        )}

        <div className={`chartwellChatButton  flex justify-center cursor-pointer  ease-in-out duration-300`}>
          <button
            id="chartwellChatButton"
            title="click to contact support (needs translation)"
            onClick={() => {
              setOpen(!open);
              setIsPopupActive(false);
            }}
            className="text-white bg-ChartwellBlue shadow-custom p-3 rounded-full hover:scale-125 duration-300 ease-in-out"
          >
            <ChatBubbleLeftRightIcon className="w-10 h-10" />
          </button>
        </div>
      </div>
    </>
  );
};

export default ChatModal;
