"use client";

import { ChatBubble } from "./chat-bubble";
import { ChatPanel } from "./chat-panel";
import type { ChatBotData } from "./chat-types";
import { useChat } from "./use-chat";
import ChatLogo from "components/chartwellComponents/content/ChatModal/ChatLogo";
import { X } from "lucide-react";
import { useI18n } from "next-localization";
import { useEffect, useRef, useState } from "react";

function ChatSuggestionPopup({ motionCue, message, buttonLabel, onDismiss, onAccept }: { motionCue: boolean; message: string; buttonLabel: string; onDismiss: () => void; onAccept: () => void }) {
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setIsTyping(false), 1600);
    return () => clearTimeout(t);
  }, []);

  return (
    <div id="ChatSuggestion" className={`relative z-30 bg-white border border-ChartwellGrey-200 ${motionCue ? " chat-bubble-motion-cue" : ""}`}>
      <button onClick={onDismiss} aria-label="Dismiss chat suggestion" className="absolute top-2 right-2 cursor-pointer rounded focus-visible:ring-2 ">
        <X className="h-5 w-5 text-ChartwellGrey" aria-hidden="true" />
      </button>
      <div className="flex items-end gap-2 mt-3">
        <div className="mt-2 flex gap-2 items-end">
          <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 shadow-md" aria-label="Assistant">
            <ChatLogo className="w-4 h-4" />
          </div>
          <div className=" assistant-message relative">
            {/* {!isTyping ? ( */}
            <div className={`flex items-center space-x-1 text-sm leading-relaxed absolute top-1/2 -translate-y-1/2  left-2 ${!isTyping ? "hidden" : ""}`}>
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
            </div>
            {/* ) : ( */}
            <p className={`!m-0 text-sm leading-relaxed whitespace-pre-wrap  delay-200 ${isTyping ? "opacity-0" : "opacity-100"}`}>{message}</p>
            {/* )} */}
          </div>
        </div>
      </div>

      <button
        aria-label={buttonLabel}
        onClick={onAccept}
        className={`hover:bg-ChartwellPlum text-white font-bold py-2 px-4 rounded-xl button block mx-auto mt-2 ${isTyping ? "opacity-0 cursor-not-allowed" : "opacity-100"} delay-200 `}
        disabled={isTyping}
      >
        {buttonLabel}
      </button>
    </div>
  );
}

export function ChatbotWidget({ data }: { data: ChatBotData }) {
  const motionCueFired = useRef(false);
  const [motionCue, setMotionCue] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (motionCueFired.current) return;
      const scrolled = window.scrollY + window.innerHeight;
      const total = document.documentElement.scrollHeight;
      if (scrolled / total >= 0.6) {
        motionCueFired.current = true;
        setMotionCue(true);
        window.removeEventListener("scroll", handleScroll);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const {
    sessionData, // { open, isPopupActive, ... }
    toggleChat,
    closeChat,
    acceptPopupAndOpenChat,
    dismissPopup,
    // openHalfChat,
    // closeHalfChat,
    closeFollowUpPopup,
    // showFollowUpPopup,
  } = useChat(data);
  const { t: dictionary } = useI18n();

  return (
    <>
      {/* Popup (shows once ~7s after first visit) */}
      {!sessionData.open && sessionData.isPopupActive && (
        <ChatSuggestionPopup motionCue={motionCue} message={data.popupMessage} buttonLabel={dictionary("PopupButton")} onDismiss={dismissPopup} onAccept={acceptPopupAndOpenChat} />
      )}

      {sessionData.isFollowUpPopupActive && (
        <ChatSuggestionPopup
          motionCue={motionCue}
          message={dictionary("FollowUpMessage")}
          buttonLabel={dictionary("FollowUpButton")}
          onDismiss={closeFollowUpPopup}
          onAccept={acceptPopupAndOpenChat}
        />
      )}

      {/* Floating chat bubble (hidden when panel is open) */}
      <ChatBubble open={sessionData.open} onClick={toggleChat} motionCue={motionCue} />

      {/* Chat panel */}
      <ChatPanel data={data} onClose={closeChat} />
    </>
  );
}
