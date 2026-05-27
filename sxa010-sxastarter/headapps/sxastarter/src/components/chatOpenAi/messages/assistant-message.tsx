import ChatLogo from "components/chartwellComponents/content/ChatModal/ChatLogo";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import type { Message } from "../chat-types";
import { useI18n } from "next-localization";
import Link from "next/link";
import Phone from "../../../../public/bi_telephone.svg";

interface ChatMessageProps {
  message: Message & { timestamp?: string };
  handelPrivacyOpen?: (privacyType: "disclaimer" | "usage") => void;
  showFollowUpPopup?: () => void;
}

const phoneTestRegex = /(\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;

export const AssistantMessage = ({ showFollowUpPopup, message, handelPrivacyOpen }: ChatMessageProps) => {
  const { t: dictionary } = useI18n();

  if (!message.content?.trim()) return null;

  return (
    <div className="flex justify-start">
      <div className="flex items-end gap-3 max-w-[95%]">
        {/* Avatar */}
        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-md" aria-label="Assistant">
          <ChatLogo className="w-6 h-6" />
        </div>

        {/* Message bubble */}
        <div className="px-4 py-3 rounded-2xl shadow-sm relative assistant-message">
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkBreaks]}
            components={{
              // wrapper-level block spacing
              p: ({ children, ...props }) => (
                <p className="text-sm leading-relaxed whitespace-pre-wrap mb-2 last:mb-0" {...props}>
                  {children}
                </p>
              ),

              a: ({ href = "", children, ...props }) => {
                const isTel = phoneTestRegex.test(String(children));
                const isHttp = href.startsWith("http://") || href.startsWith("https://");
                // const isRelative = href.startsWith("/") || href.startsWith("fr");
                // console.log(isTel, children, href);

                return !isTel ? (
                  <Link
                    href={href}
                    onClick={() => {
                      // Close chat for internal navigation + tel
                      if (showFollowUpPopup) showFollowUpPopup();
                    }}
                    target={"_self"}
                    rel={isHttp ? "noopener noreferrer" : undefined}
                    className="font-semibold underline underline-offset-2 text-ChartwellBlue hover:opacity-80 transition"
                    {...props}
                  >
                    {children}
                  </Link>
                ) : (
                  <a
                    href={"tel:" + String(children).replace(/\D/g, "")}
                    className="underline underline-offset-2 text-ChartwellBlue font-bold hover:opacity-80 transition inline-flex items-center gap-2"
                    {...props}
                  >
                    <svg width="14" height="14" className="">
                      <image href={Phone.src} width="14" height="14" />
                    </svg>
                    {children}
                  </a>
                );
              },

              h1: ({ children, ...props }) => (
                <h1 className="text-[1.25rem] font-semibold mb-2 mt-3 first:mt-0 text-ChartwellBlue" {...props}>
                  {children}
                </h1>
              ),
              h2: ({ children, ...props }) => (
                <h2 className="text-[1.15rem] font-semibold mb-2 mt-3 first:mt-0 text-ChartwellBlue" {...props}>
                  {children}
                </h2>
              ),
              h3: ({ children, ...props }) => (
                <h3 className="text-[1.05rem] font-semibold mb-2 mt-3 first:mt-0 text-ChartwellBlue" {...props}>
                  {children}
                </h3>
              ),

              ul: ({ children, ...props }) => (
                <ul className="list-disc pl-2 mb-4 last:mb-0 space-y-1" {...props}>
                  {children}
                </ul>
              ),
              ol: ({ children, ...props }) => (
                <ol className="list-decimal pl-5 mb-2 last:mb-0 space-y-1" {...props}>
                  {children}
                </ol>
              ),
              li: ({ children, ...props }) => (
                <li className="text-sm leading-relaxed" {...props}>
                  {children}
                </li>
              ),

              strong: ({ children, ...props }) => (
                <strong className="font-semibold" {...props}>
                  {children}
                </strong>
              ),
              em: ({ children, ...props }) => (
                <em className="italic" {...props}>
                  {children}
                </em>
              ),
              // blockquote: ({ children, ...props }) => (
              //   <blockquote className="pl-3 text-xs text-slate-400 italic mt-1" {...props}>
              //     {children}
              //   </blockquote>
              // ),

              // Optional nice code styling (safe default)
              code: ({ children, ...props }) => (
                <code className="px-1 py-[2px] rounded bg-black/5 text-[0.85rem] font-mono" {...props}>
                  {children}
                </code>
              ),

              // Optional: horizontal rule
              hr: (props) => <hr className="my-3 border-black/10" {...props} />,

              // Optional: blockquote
              blockquote: ({ children, ...props }) => (
                <blockquote className="text-xs italic mt-2 pl-2 border-l-2 border-gray-400 text-gray-700" {...props}>
                  {children}
                </blockquote>
              ),
            }}
          >
            {message.content}
          </ReactMarkdown>

          {message.isDisclaimerInjected && (
            <button onClick={() => handelPrivacyOpen?.("disclaimer")} className="mt-2 text-[0.9rem] underline underline-offset-2 cursor-pointer hover:text-ChartwellBlue transition">
              {dictionary("Disclaimer")}
            </button>
          )}

          {message.timestamp && <p className="text-xs mt-2 text-slate-500">{message.timestamp}</p>}
        </div>
      </div>
    </div>
  );
};
