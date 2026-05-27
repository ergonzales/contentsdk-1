"use client";

import type React from "react";
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import type { Message, ChatBotData } from "./chat-types";
import { useI18n } from "next-localization";
import { useSessionStorage } from "usehooks-ts";
import { useMediaQuery } from "usehooks-ts";
import { useRouter } from "next/router";
import { keywords } from "./constants";
import { hasAny, normalize } from "./helpers/helpers";

type SessionBranch = {
  open: boolean;
  messages: Message[];
  selectedFormId: string | undefined;
  showTourForm: boolean;
  showBookTourButton: boolean;
  isPopupActive: boolean;
  isFollowUpPopupActive: boolean;
  openAtLeastOnce: boolean;
  isFirstTime: boolean;
  isFormSubmitted: boolean;
  showFindAResidenceButton: boolean;
  greetedIds: string[];
  hasSeenAgreement: boolean;
  visitor_id: string;
};

// function isSameCustomId(m: any, customId: string) {
//   return m?.customId === customId;
// }

// function hasAnyMessageForCustomId(messages: any[], customId: string) {
//   return (messages || []).some((m) => isSameCustomId(m, customId));
// }

const now = () => new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

function getCookie(name: string) {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return m ? decodeURIComponent(m[1]) : null;
}
const VISITOR_COOKIE = "cw_vid";

export function useChat(data: ChatBotData) {
  const visitorIdRef = useRef<string | null>(null);
  const chatSessionIdRef = useRef<string | null>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const router = useRouter();
  const lang = (router.locale === "fr" ? "fr" : "en") as "en" | "fr";
  const { t: dictionary } = useI18n();

  const makeWelcome = useCallback(
    (): Message => ({
      role: "assistant",
      content: !data.isCorporate ? dictionary("ResidenceGreeting", { residence: `${data.propertyName}` }) : dictionary("CorporateGreeting"),
      timestamp: now(),
      customId: data.customId,
    }),
    [data.customId, data.isCorporate, data.propertyName, dictionary]
  );

  const makeAgainWelcome = useCallback(
    (): Message => ({
      role: "assistant",
      content: !data.isCorporate ? dictionary("ResidenceAgainGreeting", { residence: `${data.propertyName}` }) : dictionary("CorporateAgainGreeting"),
      timestamp: now(),
      customId: data.customId,
    }),
    [data.customId, data.isCorporate, data.propertyName, dictionary]
  );

  const ContinueWithAgreementMessage = useCallback(
    (): Message => ({
      role: "assistant",
      content: dictionary("ContinuewithAgreement"),
      timestamp: now(),
      customId: data.customId,
    }),
    [data.customId, dictionary]
  );

  const initialSessionsStorage: SessionBranch = {
    open: false,
    isFollowUpPopupActive: false,
    messages: [],
    selectedFormId: undefined,
    showTourForm: false,
    showBookTourButton: false,
    isPopupActive: false,
    openAtLeastOnce: false,
    isFirstTime: true,
    isFormSubmitted: false,
    showFindAResidenceButton: false,
    greetedIds: [],
    hasSeenAgreement: false,
    visitor_id: "",
  };

  const storageKey = useMemo(() => `chatBot_${router.locale}`, [router.locale]);

  const [valueSessionsStorage, setSessionsStorage] = useSessionStorage<SessionBranch>(storageKey, initialSessionsStorage);

  const sessionData = valueSessionsStorage;

  // Immutable update helper — mutator receives ONLY the active branch (SessionBranch)
  const updateSession = useCallback(
    (mutator: (draft: SessionBranch) => void) => {
      setSessionsStorage((prev) => {
        const next = structuredClone(prev) as SessionBranch;
        mutator(next);
        return next;
      });
    },
    [setSessionsStorage]
  );

  useEffect(() => {
    visitorIdRef.current = getCookie(VISITOR_COOKIE);

    updateSession((d) => {
      d.visitor_id = visitorIdRef.current ?? "";
    });

    // create once per page load (simple)
    if (!chatSessionIdRef.current) {
      chatSessionIdRef.current = crypto.randomUUID();
    }
  }, [updateSession]);

  // --- Initial Greeting and Agreement Logic ---
  useEffect(() => {
    if (!sessionData.open) return;

    updateSession((d) => {
      let addedGreeting = false;

      // User is returning to this residence after visiting another one
      if (d.greetedIds[d.greetedIds.length - 1] !== data.customId && d.greetedIds.includes(data.customId)) {
        d.messages = [...d.messages, makeAgainWelcome()];
        d.greetedIds = [...d.greetedIds, data.customId];
      }

      // First time ever for this residence
      if (!d.greetedIds.includes(data.customId)) {
        d.messages = [...d.messages, makeWelcome()];
        d.greetedIds = [...d.greetedIds, data.customId];
        addedGreeting = true;
      }

      // After the greeting → add the "continue with agreement" once
      if (addedGreeting && !d.hasSeenAgreement) {
        d.messages = [...d.messages, ContinueWithAgreementMessage()];
        d.hasSeenAgreement = true;
      }
    });
  }, [data.customId, makeWelcome, makeAgainWelcome, ContinueWithAgreementMessage, sessionData.open, updateSession]);

  // ===== Popup logic =====
  const popupTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (sessionData.openAtLeastOnce || sessionData.open) return;

    if (!sessionData.isPopupActive) {
      popupTimerRef.current = window.setTimeout(() => {
        updateSession((d) => {
          d.isPopupActive = true;
          d.openAtLeastOnce = true;
        });
      }, 7000);
    }

    return () => {
      if (popupTimerRef.current) {
        clearTimeout(popupTimerRef.current);
        popupTimerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionData.openAtLeastOnce, sessionData.open, sessionData.isPopupActive, updateSession]);

  // Popup/chat controls
  const openChat = useCallback(() => {
    updateSession((d) => {
      d.open = true;
      d.isPopupActive = false;
      d.openAtLeastOnce = true;
    });
  }, [updateSession]);

  const showFollowUpPopup = useCallback(() => {
    if (!isMobile) return;
    updateSession((d) => {
      d.open = false;
      d.isFollowUpPopupActive = true;
      // d.isPopupActive = false;
      // d.openAtLeastOnce = true;
    });
  }, [isMobile, updateSession]);

  const closeFollowUpPopup = useCallback(() => {
    if (!isMobile) return;
    updateSession((d) => {
      d.isFollowUpPopupActive = false;
    });
  }, [updateSession, isMobile]);

  const closeChat = useCallback(() => {
    updateSession((d) => {
      d.open = false;
    });
  }, [updateSession]);

  const toggleChat = useCallback(() => {
    updateSession((d) => {
      d.open = !d.open;
      if (d.open) d.isPopupActive = false;
      d.openAtLeastOnce = true;
    });
  }, [updateSession]);

  const dismissPopup = useCallback(() => {
    updateSession((d) => {
      d.isPopupActive = false;
      d.openAtLeastOnce = true;
    });
  }, [updateSession]);

  const acceptPopupAndOpenChat = useCallback(() => {
    updateSession((d) => {
      d.open = true;
      d.isPopupActive = false;
      d.openAtLeastOnce = true;
    });
  }, [updateSession]);

  // ===== Chat state =====
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isQuestionOpen, setIsQuestionOpen] = useState(true);
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState(false);
  const [isUsageOpen, setIsUsageOpen] = useState(false);
  const [isWordsRichLimit, setIsWordsRichLimit] = useState(false);

  const messageCount = sessionData.messages.length;
  useEffect(() => {
    setIsDisclaimerOpen(false);
    setIsUsageOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messageCount]);

  // Out-of-order guard (Still useful for preventing old responses from showing up)
  const pending = useRef<Set<string>>(new Set());

  // ===== Single source of truth for sending a message (Simplified) =====
  const sendMessage = useCallback(
    async (content: string) => {
      const trimmed = content.trim();
      if (!trimmed) return;

      openChat();

      if (sessionData.isFirstTime) {
        updateSession((d) => {
          d.isFirstTime = false;
        });
      }

      const nowStr = now();
      const userMessage: Message = { role: "user", content: trimmed, timestamp: nowStr, customId: data.customId };

      // 1) Push the user message
      updateSession((d) => {
        d.messages = [...d.messages, userMessage];
      });
      setInput("");
      setIsLoading(true);

      // 2) Placeholder assistant we will mutate as chunks arrive
      const assistantId = crypto.randomUUID();
      updateSession((d) => {
        d.messages = [...d.messages, { role: "assistant", content: "", timestamp: nowStr, _id: assistantId, customId: data.customId } as any];
      });

      const reqId = crypto.randomUUID();
      pending.current.add(reqId);

      try {
        // --- Single Unified API Call ---
        const res = await fetch("/api/v1/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: trimmed,
            data, // Passes customId, corporateId, etc.
            history: sessionData.messages,
            lang,
            tracking: {
              visitor_id: visitorIdRef.current,
              session_id: chatSessionIdRef.current,
              page_url: router.asPath,
            },
          }),
        });

        if (!pending.current.has(reqId)) return; // superseded by newer request
        pending.current.delete(reqId);

        if (!res.ok || !res.body) {
          const errorBody = await res.json().catch(() => ({ error: "Unknown server error" }));
          throw new Error(errorBody.error || "Failed to get response stream");
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        console.log(res);

        let acc = "";

        // --- Stream Processing ---
        const ERROR_START = "__CHATBOT_ERROR__";
        const ERROR_END = "__END_CHATBOT_ERROR__";

        for (;;) {
          const { value, done } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const nextAcc = acc + chunk;

          const errorStart = nextAcc.indexOf(ERROR_START);
          const errorEnd = nextAcc.indexOf(ERROR_END);

          if (errorStart !== -1 && errorEnd !== -1) {
            const errorJson = nextAcc.slice(errorStart + ERROR_START.length, errorEnd);

            const parsedError = JSON.parse(errorJson);
            throw new Error(parsedError.error || "Chatbot error");
          }

          acc = nextAcc;

          updateSession((d) => {
            const idx = (d.messages as any[]).findIndex((m: any) => m._id === assistantId);

            if (idx !== -1) {
              const m = { ...(d.messages[idx] as any) };
              m.content += chunk;

              d.messages = [...d.messages.slice(0, idx), m, ...d.messages.slice(idx + 1)];
            }
          });
        }

        // --- Post-Processing ---
        const fullNormalized = normalize(acc);
        const disclaimerInjected = hasAny(fullNormalized, keywords.price);
        const showBooking = hasAny(fullNormalized, keywords.booking);
        const showFindResidence = hasAny(fullNormalized, keywords.findResidence);

        updateSession((d) => {
          const idx = (d.messages as any[]).findIndex((m: any) => m._id === assistantId);
          if (idx !== -1) {
            const m = { ...(d.messages[idx] as any) };
            m.isDisclaimerInjected = disclaimerInjected;
            d.messages = [...d.messages.slice(0, idx), m, ...d.messages.slice(idx + 1)];
            d.showBookTourButton = showBooking;
            d.showFindAResidenceButton = showFindResidence;
          }
        });
      } catch (err) {
        console.error(err);

        updateSession((d) => {
          const idx = (d.messages as any[]).findIndex((m: any) => m._id === assistantId);

          if (idx !== -1) {
            const m = { ...(d.messages[idx] as any) };
            m.content = dictionary("AIErrorMessage");
            m.isError = true;

            d.messages = [...d.messages.slice(0, idx), m, ...d.messages.slice(idx + 1)];

            return;
          }

          d.messages = [
            ...d.messages,
            {
              role: "assistant",
              content: dictionary("AIErrorMessage"),
              timestamp: now(),
            },
          ];
        });
      } finally {
        setIsLoading(false);
      }
    },
    [openChat, sessionData.isFirstTime, sessionData.messages, data, updateSession, lang, router.asPath, dictionary]
  );

  // Form submit → use input
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      void sendMessage(input);
    },
    [input, sendMessage]
  );

  // Common question click → send immediately
  const handleQuestionClick = useCallback(
    (question: string) => {
      setIsQuestionOpen(false);
      void sendMessage(question);
    },
    [sendMessage]
  );

  const handleSelectForm = useCallback(() => {
    const form = data.Forms?.find((item) => item.name === "Book A Tour");
    if (!form) {
      console.warn("Book A Tour form not found in data.Forms");
      return;
    }

    updateSession((d) => {
      d.showTourForm = true;
      d.selectedFormId = form.id; // 👈 only store ID
    });
  }, [data.Forms, updateSession]);

  const handelFormSubmit = useCallback(async () => {
    const newMessage: Message = {
      role: "assistant",
      content: dictionary("FormSubmittedMessage"),
      customId: data.customId,
      timestamp: now(),
    };

    updateSession((d) => {
      d.showTourForm = false;
      d.selectedFormId = undefined;
      d.showBookTourButton = false;
      d.showFindAResidenceButton = false;
      d.messages = [...d.messages, newMessage]; // append atomically here
    });
  }, [dictionary, data.customId, updateSession]);

  const handelPrivacyOpen = (type: "disclaimer" | "usage") => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (type === "disclaimer") {
        setIsDisclaimerOpen(true);
      } else if (type === "usage") {
        setIsUsageOpen(true);
      }
    }, 500);
  };

  const handleRichWordsLimit = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsWordsRichLimit(true);
    }, 500);
  };

  const handelCancelFormSubmission = () => {
    updateSession((d) => {
      d.showTourForm = false;
      d.selectedFormId = undefined;
    });
  };

  return {
    input,
    setInput,
    handleSubmit,
    isLoading,
    handleQuestionClick,

    sessionData,

    openChat,
    closeChat,
    toggleChat,
    dismissPopup,
    acceptPopupAndOpenChat,
    showFollowUpPopup,
    closeFollowUpPopup,
    setIsQuestionOpen,
    isQuestionOpen,

    setIsLoading,
    handleSelectForm,
    handelFormSubmit,
    handelPrivacyOpen,
    isDisclaimerOpen,
    isUsageOpen,
    setIsWordsRichLimit,
    isWordsRichLimit,
    handleRichWordsLimit,
    handelCancelFormSubmission,
  };
}
