"use client";

import { X } from "lucide-react";
import { ChatBotData } from "./chat-types";

interface CommonQuestionsProps {
  onQuestionClick: (question: string) => void;
  Questions: ChatBotData["Questions"];
  setIsQuestionOpen: (isQuestionOpen: boolean) => void;
}

export function CommonQuestions({ onQuestionClick, setIsQuestionOpen, Questions }: CommonQuestionsProps) {
  return (
    <div className="bg-gradient-to-r from-slate-50 to-white rounded-2xl p-4 border border-slate-200 shadow-sm">
      <div className="flex  justify-between ">
        <h4 className="text-sm font-semibold text-slate-700 mb-3">Common Questions</h4>
        <X className="w-4 h-4 cursor-pointer" onClick={() => setIsQuestionOpen(false)} />
      </div>

      <div className="grid grid-cols-1 gap-2">
        {Questions?.map((question, index) => (
          <button
            key={index}
            onClick={() => onQuestionClick(question.fields.Question.value)}
            className="text-left text-sm p-3 bg-white hover:bg-gradient-to-r hover:from-purple-50 hover:to-indigo-50 text-slate-700 hover:text-slate-900 rounded-xl border border-slate-200 hover:border-purple-200 transition-all duration-200 hover:shadow-md transform hover:scale-[1.02]"
          >
            {question.fields.Question.value}
          </button>
        ))}
      </div>
    </div>
  );
}
