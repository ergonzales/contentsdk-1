"use client";

import { useRef, useEffect, useState } from "react";
import { X, Send, User } from "lucide-react";
import { useChat } from "./use-chat";

import { useI18n } from "next-localization";
import { MessageWrapper } from "./messages/message-wrapper";
import { Maximize, Minus } from "lucide-react";

import { CommonQuestions } from "./common-questions";
import type { ChatBotData } from "./chat-types";
import ChatLogo from "components/chartwellComponents/content/ChatModal/ChatLogo";

import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import { useMediaQuery } from "react-responsive";

import { ChatFormHandler } from "components/chartwellComponents/content/ChatModal/ChatFormHandler";

interface ChatPanelProps {
  data: ChatBotData;
  onClose: () => void;
}

export function ChatPanel({ data, onClose }: ChatPanelProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isDesktop = useMediaQuery({ minWidth: 1024 });
  const {
    input,
    setInput,
    handleSubmit,
    isLoading,
    handleQuestionClick,
    setIsQuestionOpen,
    isQuestionOpen,
    setIsLoading,
    handleSelectForm,
    handelFormSubmit,
    sessionData,
    handelPrivacyOpen,
    isDisclaimerOpen,
    isUsageOpen,
    setIsWordsRichLimit,
    isWordsRichLimit,
    handleRichWordsLimit,
    handelCancelFormSubmission,
    showFollowUpPopup,
    // closeFollowUpPopup,
  } = useChat(data);
  const { t: dictionary } = useI18n();

  const [isFullScreen, setIsFullScreen] = useState(false);
  const [hasNewMessages, setHasNewMessages] = useState(0);

  // Auto-scroll to bottom when new messages arrive
  const messageCount = sessionData.messages.length;
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    if (isDesktop) {
      inputRef.current?.focus();
    }
  }, [messageCount, isLoading, isQuestionOpen, isDesktop]);

  // Hide common questions once there is at least one real message
  useEffect(() => {
    if (sessionData.messages.length > 0) {
      setIsQuestionOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionData.messages]);

  const prevOpenRef = useRef(sessionData.open);
  const prevIsCorporateRef = useRef(data.isCorporate);

  useEffect(() => {
    // Only fire when chat is opened and context is stable (not during navigation)
    if (sessionData.open && (prevOpenRef.current !== sessionData.open || prevIsCorporateRef.current !== data.isCorporate)) {
      updateOpenChatDataLayer();
    }
    prevOpenRef.current = sessionData.open;
    prevIsCorporateRef.current = data.isCorporate;
  }, [sessionData.open, data.isCorporate]);

  // useEffect(() => {
  //   if (prevIsCorporateRef.current == data.isCorporate && sessionData.open) {
  //    updateOpenChatDataLayer(`sessiondata.open ${prevIsCorporateRef.current} ${data.isCorporate}`);
  //   }
  // }, [sessionData.open]);

  useEffect(() => {
    if (sessionData.open && hasNewMessages) {
      updateSubmitChatDataLayer();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasNewMessages]);

  // Data Layer for open/close chat and submit message
  const updateOpenChatDataLayer = (p1: any = "") => {
    const datalayers = (window as any).dataLayer;
    const DL_values: any = {
      event: data.isCorporate ? "corporate_chat" : "property_chat",
      chat_option: `open chat${p1}`,
    };
    if (sessionData.open) {
      datalayers.push(DL_values);
    }
  };

  const updateSubmitChatDataLayer = () => {
    const datalayers = (window as any).dataLayer;
    const DL_values: any = {
      event: data.isCorporate ? "corporate_chat" : "property_chat",
      chat_option: "submit chat",
    };
    if (hasNewMessages > 0) datalayers.push(DL_values);
  };

  const showBookATourButton = !data.isCorporate && sessionData.showBookTourButton && !sessionData.showTourForm && !sessionData.isFormSubmitted;
  // const showBookATourButtonOnTopMenu = !data.isCorporate && !sessionData.showTourForm && !sessionData.isFormSubmitted;
  const selectedForm = data.Forms?.find((f: any) => f.id === sessionData.selectedFormId) ?? undefined;

  return (
    <div className={` inset-0 fixed  flex items-end justify-end z-50 pointer-events-none`}>
      <div
        className={`
          pointer-events-auto
      bg-ChartwellWhite shadow-2xl border border-gray-100
      flex flex-col overflow-hidden
      transition-all duration-300 ease-in-out w-full h-full
     
      ${
        isFullScreen
          ? "rounded-none lg:rounded-none"
          : `
          rounded-none
          lg:w-96 lg:h-[620px]
          lg:max-w-[calc(100vw-2rem)]
          lg:max-h-[calc(100vh-2rem)]
          lg:mb-6 lg:mr-6
          lg:rounded-3xl
        `
      }

      ${sessionData.open ? "scale-100 rotate-0" : "scale-0 rotate-12 translate-x-44 translate-y-64 pointer-events-none"}
    `}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-100 rounded-t-3xl">
          <div className="flex items-center justify-between mb-2 ">
            <div className="flex items-center space-x-3">
              <ChatLogo />

              <div>
                <h3 className=" !text-[1rem] text-ChartwellGrey">{dictionary("ChatBotTitle")}</h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={onClose} className="text-ChartwellWhite  bg-ChartwellGrey hover:bg-ChartwellPlum p-1 hover:bg- rounded-full transition-all duration-200" aria-label="Close chat">
                <X className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsFullScreen(!isFullScreen)}
                className="text-ChartwellWhite bg-ChartwellGrey hover:bg-ChartwellPlum p-1 rounded-full transition-all duration-200 hidden lg:block"
                aria-label="Toggle full screen"
              >
                {isFullScreen ? <Minus className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
              </button>
            </div>
          </div>
          {/* <ChatBotNavTopMenu
            isCorporate={data.isCorporate}
            handleSelectForm={handleSelectForm}
            phoneNumber={data.propertyContactNumber}
            isDesktop={isDesktop}
            showBookATourButtonOnTopMenu={showBookATourButtonOnTopMenu}
          /> */}
        </div>

        {/* Messages */}
        <div className={`flex-1 chat-container border-t `}>
          <MessageWrapper
            showFollowUpPopup={showFollowUpPopup}
            messages={sessionData.messages}
            isDisclaimerOpen={isDisclaimerOpen}
            isUsageOpen={isUsageOpen}
            isWordsRichLimit={isWordsRichLimit}
            handelPrivacyOpen={handelPrivacyOpen}
            isFormSubmitted={sessionData.isFormSubmitted}
            customId={data.customId}
            onClose={onClose}
          />

          {(isQuestionOpen || sessionData.messages.length === 0) && (
            <div>
              <CommonQuestions onQuestionClick={handleQuestionClick} Questions={data.Questions} setIsQuestionOpen={setIsQuestionOpen} />
            </div>
          )}

          {/* Tour Booking Form */}

          {/* Tour Booking Form */}
          {sessionData.showTourForm && selectedForm && (
            <div>
              <ChatFormHandler
                visitor_id={sessionData.visitor_id}
                handelCancelFormSubmission={handelCancelFormSubmission}
                selectedForm={selectedForm}
                isTyping={isLoading}
                setIsTyping={setIsLoading}
                ResidenceID={data.ResidenceID || ""}
                history={sessionData.messages}
                handelFormSubmit={handelFormSubmit}
              />
            </div>
          )}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex items-center space-x-3 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
              </div>
              <span className="text-sm text-slate-600">{dictionary("AIIsThinkingMessage")}</span>
            </div>
          )}
          {showBookATourButton && (
            <div className="  flex items-end justify-end gap-2 p-2">
              <div className="flex  flex-col items-end user-message space-y-4">
                <button
                  onClick={() => handleSelectForm()}
                  className=" bg-ChartwellBlue  text-ChartwellWhite  sm:px-4  uppercase    md:text-[1rem] flex items-center text-center hover:bg-ChartwellPlum no-underline hover:text-white px-6 py-1 !rounded-[8px]  ease-in-out duration-300 hover:-translate-x-[2px] hover:-translate-y-[2px]"
                >
                  <span className="font-bold">{dictionary("BookATourChatBot")}</span>
                </button>
              </div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-md bg-ChartwellBlue   text-white`}>
                <User className="w-4 h-4" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Book Tour Button, Contact us - Only show when AI mentions booking */}

        {/* Input Area */}

        <div className="p-4 bg-white border-t border-slate-100 rounded-b-3xl space-y-2 min-h-[80px]">
          {/* <ChatButtons sessionData={sessionData} isQuestionOpen={isQuestionOpen} setIsQuestionOpen={setIsQuestionOpen} /> */}
          <div className="">
            {!sessionData.showTourForm && !isQuestionOpen && (
              <div className=" flex items-center space-x-2 cursor-pointer " onClick={() => setIsQuestionOpen(true)}>
                <QuestionMarkCircleIcon className="w-6 h-6 text-ChartwellBlue " />
                <span className="text-[0.9rem]">{dictionary("CommonQuestions")}</span>
              </div>
            )}
          </div>
          {!sessionData.showTourForm && (
            <form
              className="chatQuestion flex items-center space-x-2"
              onSubmit={(e) => {
                handleSubmit(e);
                setHasNewMessages(hasNewMessages + 1);
              }}
            >
              <input
                type="text"
                aria-label="Enter your message"
                ref={inputRef}
                value={input}
                onChange={(e) => {
                  const words = e.target.value.trim().split(/\s+/);
                  if (words.length <= 100) {
                    setInput(e.target.value);
                    setIsWordsRichLimit(false);
                  } else {
                    handleRichWordsLimit();
                  }
                }}
                placeholder={data.isCorporate ? dictionary("InputPlaceholderCorporate") : dictionary("InputPlaceholderProperty", { residence: `${data.propertyName}` })}
                className="flex-1 px-4 py-3 border border-ChartwellBlue rounded-2xl focus:outline-none focus:ring-2 focus:ChartwellBlue text-md bg-slate-50 focus:bg-white transition-all duration-200 placeholder-slate-400"
                disabled={isLoading}
              />
              <button
                aria-label="Send message"
                type="submit"
                disabled={isLoading || !input.trim()}
                className="px-4 py-3 bg-ChartwellBlue hover:to-indigo-700 text-white rounded-2xl disabled:opacity-90 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Send aria-hidden="true" focusable="false" className="w-4 h-4" />
              </button>
            </form>
          )}
          {!sessionData.showTourForm && (
            <div className="flex items-center  space-x-2">
              <button onClick={() => handelPrivacyOpen("disclaimer")} className=" text-[0.9rem] underline cursor-pointer hover:text-ChartwellBlue ease-out duration-300" aria-label="Open disclaimer">
                {dictionary("Disclaimer")}
              </button>
              <button
                onClick={() => handelPrivacyOpen("usage")}
                className="text-[0.9rem] underline cursor-pointer hover:text-ChartwellBlue ease-out duration-300"
                aria-label="Open data usage information"
              >
                {dictionary("DataUsage")}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
