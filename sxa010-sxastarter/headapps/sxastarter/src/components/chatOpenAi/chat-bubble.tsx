"use client";

import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";

interface ChatBubbleProps {
  onClick: () => void;
  open: boolean;
  motionCue?: boolean;
}

export function ChatBubble({ onClick, open, motionCue }: ChatBubbleProps) {
  return (
    <button
      onClick={onClick}
      className={`fixed bottom-6 right-6 w-16 h-16 bg-ChartwellBlue text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-30 group ${
        !open ? "scale-100 rotate-0" : "scale-0 rotate-12 "
      } ease-in-out duration-300 delay-75${motionCue ? " chat-bubble-motion-cue" : ""}`}
      aria-label="Open chat"
    >
      <ChatBubbleLeftRightIcon className="w-10 h-10 group-hover:scale-110 transition-transform duration-200" />

      {/* Notification dot */}

      {/* Ripple effect */}
      {/* Add logic: if user has unread messages */}
      {/* <div className="absolute inset-0 rounded-full bg-ChartwellBlue animate-ping opacity-20"></div> */}
    </button>
  );
}
