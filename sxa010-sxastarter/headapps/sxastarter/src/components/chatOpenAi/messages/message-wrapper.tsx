import type { Message } from "../chat-types";
import { ChatMessage } from "./chat-message";
import { AssistantMessage } from "./assistant-message";
import { useI18n } from "next-localization";

interface ChatMessageProps {
  messages: Message[];
  isDisclaimerOpen: boolean;
  isUsageOpen: boolean;
  isWordsRichLimit: boolean;
  isFormSubmitted: boolean;
  customId: string;
  onClose: () => void;
  showFollowUpPopup: () => void;

  handelPrivacyOpen: (privacyType: "disclaimer" | "usage") => void;
}

export const MessageWrapper = ({ showFollowUpPopup, messages, isDisclaimerOpen, isUsageOpen, isWordsRichLimit, handelPrivacyOpen, customId }: ChatMessageProps) => {
  const { t: dictionary } = useI18n();

  const disclaimerMassage: Message = {
    role: "assistant",
    content: dictionary("DisclaimerMessage"),
  };

  const dataUsageMassage: Message = {
    role: "assistant",
    content: dictionary("DataUsageMessage"),
  };

  const wordsRichLimitMassage: Message = {
    role: "assistant",
    content: dictionary("WordsRichLimitMessage"),
  };

  return (
    <>
      {messages.map((message, index) => (
        <div className={` ${message.customId === customId ? "" : "opacity-50"} `} key={index}>
          <ChatMessage key={index} message={message} handelPrivacyOpen={handelPrivacyOpen} showFollowUpPopup={showFollowUpPopup} />
        </div>
      ))}
      {isDisclaimerOpen && <AssistantMessage message={disclaimerMassage} handelPrivacyOpen={handelPrivacyOpen} />}
      {isUsageOpen && <AssistantMessage message={dataUsageMassage} handelPrivacyOpen={handelPrivacyOpen} />}
      {isWordsRichLimit && <AssistantMessage message={wordsRichLimitMassage} />}
    </>
  );
};
