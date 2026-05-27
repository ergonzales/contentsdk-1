"use client";

import type { Message } from "../chat-types";

import { AssistantMessage } from "./assistant-message";
import { UserMessage } from "./user-message";

interface ChatMessageProps {
  message: Message & { timestamp?: string }; // ensure timestamp is optional
  handelPrivacyOpen: (privacyType: "disclaimer" | "usage") => void;

  showFollowUpPopup: () => void;
}

export function ChatMessage({ showFollowUpPopup, message, handelPrivacyOpen }: ChatMessageProps) {
  // Example state, not used in this component
  const isUser = message.role === "user";

  return (
    <div className="mb-4">
      {/* Main message row */}
      {isUser ? <UserMessage message={message} /> : <AssistantMessage showFollowUpPopup={showFollowUpPopup} message={message} handelPrivacyOpen={handelPrivacyOpen} />}
    </div>
  );
}
