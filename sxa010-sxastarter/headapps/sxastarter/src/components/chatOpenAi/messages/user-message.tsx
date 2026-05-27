import { User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import type { Message } from "../chat-types";

export const UserMessage = ({ message }: { message: Message }) => {
  return (
    <div className={"flex justify-end"}>
      <div className={"flex items-end space-x-3 max-w-[95%] flex-row-reverse space-x-reverse"}>
        {/* Avatar */}
        <div className={"w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-md bg-ChartwellBlue text-white"} aria-label={"You"}>
          <User className="w-4 h-4" />
        </div>

        {/* Message bubble */}
        <div className={"px-4 py-3 rounded-2xl shadow-sm relative user-message"}>
          <ReactMarkdown
            components={{
              p: (props) => <p className="text-sm leading-relaxed whitespace-pre-wrap" {...props} />,
              a: (props) => <a className="underline" target="_blank" rel="noopener noreferrer" {...props} />,
            }}
          >
            {message.content}
          </ReactMarkdown>

          {message.timestamp && <p className={"text-xs mt-2"}>{message.timestamp}</p>}
        </div>
      </div>
    </div>
  );
};
