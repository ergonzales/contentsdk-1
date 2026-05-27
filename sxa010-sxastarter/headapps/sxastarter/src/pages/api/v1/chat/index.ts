import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "supabase/supabaseClient";
import OpenAI from "openai";
import { prompt } from "lib/helpers/prompts/prompts";
import { executeFindResidencesTool, FIND_RESIDENCES_TOOL_NAME, findResidencesToolDefinition } from "lib/helpers/chat-tools/find-residences-tool";
import shouldSendErrorEmail from "lib/helpers/chat-tools/shouldSendErrorEmail";
import notifyChatbotError from "lib/helpers/chat-tools/notifyChatbotError";
// const OPENAI_API_KEY = config.nextOpenAIApiKey;

function getErrorStatus(err: any): number {
  // 1. If error already has a valid HTTP status → use it
  const status = Number(err?.status);
  if (!Number.isNaN(status) && status >= 400 && status < 600) {
    return status;
  }

  // 2. OpenAI-specific errors
  if (err?.code === "invalid_api_key") return 401;
  if (err?.code === "insufficient_quota") return 429;
  if (err?.code === "rate_limit_exceeded") return 429;

  // 3. Network / timeout errors
  if (err?.code === "ECONNREFUSED") return 503;
  if (err?.code === "ETIMEDOUT") return 504;

  // 4. Supabase / DB fallback (usually internal)
  if (err?.message?.toLowerCase?.().includes("supabase")) {
    return 500;
  }

  // 5. Default fallback
  return 500;
}
const openai = new OpenAI({
  apiKey: process.env.NEXT_OPEN_AI_API_KEY!,
  // apiKey: "bla",
});
const CHAT_MODEL = "gpt-4.1";
const MAX_TOOL_ITERATIONS = 2;

type Tracking = {
  visitor_id?: string | null;
  session_id?: string | null;
  page_url?: string | null;
};

// type SourceRowInsert = {
//   session_id: string;
//   user_message_id: number;
//   assistant_message_id: number;
//   document_section_id: number | null;
//   source_type: "vector" | "keyword" | "hybrid";
//   rank: number;
//   score: number | null;
//   snippet_used: string | null;
// };

function safeString(v: any, max = 10000) {
  if (v == null) return null;
  const s = String(v);
  return s.length > max ? s.slice(0, max) : s;
}

type SanitizedMessage = {
  role: "user" | "assistant";
  content: string;
};

type ChatToolCall = {
  callId: string;
  name: string;
  arguments: string;
};

type FunctionCallOutputInput = {
  type: "function_call_output";
  call_id: string;
  output: string;
};

type TextDeltaHandler = (delta: string) => void;

function extractResponseText(response: any): string {
  if (typeof response?.output_text === "string" && response.output_text.trim()) {
    return response.output_text;
  }

  const parts: string[] = [];
  const output = Array.isArray(response?.output) ? response.output : [];

  for (const item of output) {
    if (item?.type !== "message" || !Array.isArray(item?.content)) {
      continue;
    }

    for (const contentPart of item.content) {
      if (contentPart?.type === "output_text" && typeof contentPart?.text === "string") {
        parts.push(contentPart.text);
        continue;
      }

      if (contentPart?.type === "text") {
        if (typeof contentPart?.text === "string") {
          parts.push(contentPart.text);
        } else if (typeof contentPart?.text?.value === "string") {
          parts.push(contentPart.text.value);
        }
      }
    }
  }

  return parts.join("").trim();
}

function extractToolCalls(response: any): ChatToolCall[] {
  const output = Array.isArray(response?.output) ? response.output : [];

  return output
    .filter((item: any) => item?.type === "function_call" && typeof item?.call_id === "string")
    .map((item: any) => ({
      callId: item.call_id as string,
      name: String(item?.name ?? ""),
      arguments: typeof item?.arguments === "string" ? item.arguments : "{}",
    }));
}

function extractToolCallFromOutputItem(item: any): ChatToolCall | null {
  if (item?.type !== "function_call" || typeof item?.call_id !== "string") {
    return null;
  }

  return {
    callId: item.call_id as string,
    name: String(item?.name ?? ""),
    arguments: typeof item?.arguments === "string" ? item.arguments : JSON.stringify(item?.arguments ?? {}),
  };
}

function extractResponseIdFromEvent(event: any): string | undefined {
  if (typeof event?.response?.id === "string") {
    return event.response.id;
  }

  if (typeof event?.response_id === "string") {
    return event.response_id;
  }

  if (typeof event?.item?.response_id === "string") {
    return event.item.response_id;
  }

  return undefined;
}

async function createResponseWithTools(params: {
  systemPrompt: string;
  history: SanitizedMessage[];
  userMessage: string;
  language: "en" | "fr";
  enableResidenceTool: boolean;
  onTextDelta?: TextDeltaHandler;
}): Promise<string> {
  const { systemPrompt, history, userMessage, language, enableResidenceTool, onTextDelta } = params;
  const toolList = enableResidenceTool ? [findResidencesToolDefinition] : undefined;

  let previousResponseId: string | undefined;
  let nextInput: any = [{ role: "developer", content: systemPrompt }, ...history, { role: "user", content: userMessage }];
  const turnTexts: string[] = [];

  for (let i = 0; i < MAX_TOOL_ITERATIONS; i++) {
    const stream: any = await openai.responses.create({
      model: CHAT_MODEL,
      temperature: 0,
      stream: true,
      ...(toolList ? { tools: toolList } : {}),
      ...(previousResponseId
        ? {
            previous_response_id: previousResponseId,
            input: nextInput,
          }
        : {
            input: nextInput,
          }),
    });

    let streamedTurnText = "";
    const toolCallsFromEvents = new Map<string, ChatToolCall>();
    let responseIdFromEvents: string | undefined;
    let responseFromEvents: any = null;

    for await (const event of stream) {
      const eventResponseId = extractResponseIdFromEvent(event);
      if (eventResponseId) {
        responseIdFromEvents = eventResponseId;
      }

      if (event?.type === "response.output_text.delta") {
        const delta = typeof event?.delta === "string" ? event.delta : "";
        if (delta) {
          streamedTurnText += delta;
          onTextDelta?.(delta);
        }
        continue;
      }

      if (event?.type === "response.completed" && event?.response) {
        responseFromEvents = event.response;
        continue;
      }

      if (event?.type === "response.error") {
        const error: any = new Error(String(event?.error?.message ?? "OpenAI stream error."));

        error.status = event?.error?.status ?? 500;
        error.code = event?.error?.code ?? null;
        error.type = event?.error?.type ?? null;

        throw error;
      }

      if (event?.type === "response.output_item.done") {
        const parsedToolCall = extractToolCallFromOutputItem(event?.item);
        if (parsedToolCall) {
          toolCallsFromEvents.set(parsedToolCall.callId, parsedToolCall);
        }
      }
    }

    let response: any = null;
    if (typeof stream?.finalResponse === "function") {
      try {
        response = await stream.finalResponse();
      } catch {
        response = null;
      }
    }

    response = response ?? responseFromEvents;
    const responseId = typeof response?.id === "string" ? response.id : responseIdFromEvents;

    if (!responseId) {
      throw new Error("Missing response id from streamed OpenAI response.");
    }

    const responseText = response ? extractResponseText(response) : "";
    if (responseText && streamedTurnText && responseText.startsWith(streamedTurnText)) {
      const missingDelta = responseText.slice(streamedTurnText.length);
      if (missingDelta) {
        onTextDelta?.(missingDelta);
      }
    } else if (responseText && !streamedTurnText) {
      onTextDelta?.(responseText);
    }

    const finalTurnText = responseText || streamedTurnText;
    if (finalTurnText) {
      turnTexts.push(finalTurnText);
    }

    const toolCalls = response ? extractToolCalls(response) : Array.from(toolCallsFromEvents.values());

    if (!toolCalls.length) {
      const fullText = turnTexts.join("").trim();
      return fullText || "I'm sorry, I couldn't generate a response right now.";
    }

    const toolOutputs: FunctionCallOutputInput[] = await Promise.all(
      toolCalls.map(async (toolCall) => {
        if (toolCall.name !== FIND_RESIDENCES_TOOL_NAME) {
          return {
            type: "function_call_output" as const,
            call_id: toolCall.callId,
            output: JSON.stringify({ error: `Unsupported tool: ${toolCall.name}` }),
          };
        }

        const toolResponse = await executeFindResidencesTool(toolCall.arguments, language);
        return {
          type: "function_call_output" as const,
          call_id: toolCall.callId,
          output: JSON.stringify(toolResponse),
        };
      })
    );

    previousResponseId = responseId;
    nextInput = toolOutputs;
  }

  const fullText = turnTexts.join("").trim();
  return fullText || "I'm sorry, I couldn't generate a response right now.";
}

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }
  try {
    const {
      message,
      data,
      history,
      lang = "en",
      tracking,
    } = req.body as {
      message: string;
      data: any;
      history: any[];
      lang?: "en" | "fr";
      tracking?: Tracking;
    };

    if (!message?.trim()) {
      res.status(400).json({ error: "Message is required" });
      return;
    }

    const visitorId = tracking?.visitor_id ?? null;
    const sessionId = tracking?.session_id ?? null;
    const pageUrl = tracking?.page_url ?? null;
    const resolvedLanguage: "en" | "fr" = lang === "fr" ? "fr" : "en";
    const isCorporateChat = Boolean(data?.isCorporate);

    if (!visitorId || !sessionId) {
      // keep it strict so you don’t get junk rows
      res.status(400).json({ error: "Missing tracking.visitor_id or tracking.session_id" });
      return;
    }

    // ----------------------------
    // 0) Ensure visitor + session exist
    // ----------------------------
    // Visitors table: keep minimal for now
    // visitors(id uuid pk, created_at timestamptz default now())
    const { error: visitorErr } = await supabase.from("visitors").upsert({ id: visitorId }, { onConflict: "id" });

    if (visitorErr) throw visitorErr;

    // chat_sessions(id uuid pk, visitor_id uuid fk, started_at timestamptz default now(), page_url text, lang text)
    // Upsert session so same session_id can be reused
    const { error: sessionErr } = await supabase.from("chat_sessions").upsert(
      {
        id: sessionId,
        visitor_id: visitorId,
        page_url: pageUrl,
        lang: resolvedLanguage,
        residence_custom_id: data.customId,
      },
      { onConflict: "id" }
    );
    if (sessionErr) throw sessionErr;

    // ----------------------------
    // 1) Insert USER message (so we can link sources/assistant answer later)
    // ----------------------------
    // chat_messages(id bigserial pk, session_id uuid, visitor_id uuid, role text, content text, created_at timestamptz default now())
    const { data: userMsgRow, error: userMsgErr } = await supabase
      .from("chat_messages")
      .insert({
        session_id: sessionId,
        visitor_id: visitorId,
        role: "user",
        content: safeString(message, 20000),
      })
      .select("id")
      .single();

    if (userMsgErr) throw userMsgErr;
    const userMessageId = userMsgRow.id as number;

    // ----------------------------
    // 2) PARALLEL SEARCH
    // ----------------------------
    const vecByIdPromise = supabase.functions.invoke("search-vector", {
      body: { message, customId: data.customId, limit: 7 },
    });

    const vecCorpPromise = data.corporateId
      ? supabase.functions.invoke("search-vector", {
          body: { message, customId: data.corporateId, limit: 7 },
        })
      : Promise.resolve({ data: { documents: [] } });

    const kwByIdPromise = supabase.rpc("search_sections_ml", {
      q: message,
      p_residence_custom_id: data.customId,
      p_lang: lang ?? "auto",
      p_limit: 7,
      p_offset: 0,
    });

    const kwCorpPromise = data.corporateId
      ? supabase.rpc("search_sections_ml", {
          q: message,
          p_residence_custom_id: data.corporateId ?? null,
          p_lang: lang ?? "auto",
          p_limit: 7,
          p_offset: 0,
        })
      : Promise.resolve({ data: [] });

    const [vecById, vecCorp, kwById, kwCorp] = await Promise.all([vecByIdPromise, vecCorpPromise, kwByIdPromise, kwCorpPromise]);

    const vectorDocs = (vecById.data?.documents || []).map((d: any, i: number) => ({
      content: d.content,
      document_section_id: d.id,
      source_type: "vector" as const,
      rank: i + 1,
      score: typeof d.score === "number" ? d.score : null,
    })) as any[];

    const vectorCorpDocs = (vecCorp.data?.documents || []).map((d: any, i: number) => ({
      content: d.content,
      document_section_id: d.id,
      source_type: "vector" as const,
      rank: i + 1,
      score: typeof d.score === "number" ? d.score : null,
    })) as any[];

    const keywordByIdDocs = (kwById.data || []).map((d: any, i: number) => ({
      content: d.content,
      document_section_id: d.section_id,
      source_type: "keyword" as const,
      rank: i + 1,
      score: typeof d.rank === "number" ? d.rank : null, // depends on your RPC
    })) as any[];

    const keywordCorpDocs = (kwCorp.data || []).map((d: any, i: number) => ({
      content: d.content,
      document_section_id: d.section_id,
      source_type: "keyword" as const,
      rank: i + 1,
      score: typeof d.rank === "number" ? d.rank : null,
    })) as any[];

    const allDocs = [...vectorDocs, ...vectorCorpDocs, ...keywordByIdDocs, ...keywordCorpDocs].filter((d) => !!d?.content);
    // console.log(vectorDocs);

    // Deduplicate by content, keep first occurrence metadata
    const uniqueContentMap = new Map<string, any>();
    for (const doc of allDocs) {
      if (!uniqueContentMap.has(doc.content)) {
        uniqueContentMap.set(doc.content, doc);
      }
    }

    const chosenSources = Array.from(uniqueContentMap.values()).slice(0, 10);
    const uniqueContents = Array.from(uniqueContentMap.keys()).join("\n---\n");

    // ----------------------------
    // 3) OpenAI streaming
    // ----------------------------
    const system = prompt(data, uniqueContents).replace(/\s+/g, " ");

    const sanitizedHistory = (history || []).map((m: any) => ({
      role: m.role === "user" || m.role === "assistant" ? m.role : "user",
      content: m.content,
    })) as SanitizedMessage[];

    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    });

    let hasWrittenAnswer = false;
    const fullAnswer = await createResponseWithTools({
      systemPrompt: system,
      history: sanitizedHistory,
      userMessage: message,
      language: resolvedLanguage,
      enableResidenceTool: isCorporateChat,
      onTextDelta: (delta) => {
        if (!delta) {
          return;
        }

        hasWrittenAnswer = true;
        res.write(delta);
      },
    });

    if (!hasWrittenAnswer && fullAnswer) {
      res.write(fullAnswer);
    }

    // ----------------------------
    // 4) Persist ASSISTANT message + sources
    // ----------------------------
    // Insert assistant message
    const { data: assistantMsgRow, error: assistantMsgErr } = await supabase
      .from("chat_messages")
      .insert({
        session_id: sessionId,
        visitor_id: visitorId,
        role: "assistant",
        content: safeString(fullAnswer, 20000),
      })
      .select("id")
      .single();

    if (assistantMsgErr) {
      console.error("Failed to insert assistant message:", assistantMsgErr);
    } else {
      const assistantMessageId = assistantMsgRow.id as number;

      // Insert source rows
      const sourcesToInsert = chosenSources
        .filter((s: any) => s.document_section_id != null)
        .map((s: any, idx: number) => ({
          session_id: sessionId,
          user_message_id: userMessageId,
          assistant_message_id: assistantMessageId,
          document_section_id: s.document_section_id,
          source_type: s.source_type,
          rank: idx + 1,
          score: typeof s.score === "number" ? s.score : null,
          snippet_used: safeString(s.content, 1200),
        }));

      if (sourcesToInsert.length) {
        const { error: srcErr } = await supabase.from("chat_message_sources").insert(sourcesToInsert);

        if (srcErr) {
          console.error("Failed to insert sources:", srcErr);
        }
      }
    }

    res.end();
  } catch (err: any) {
    console.error("Handler Error:", err);

    const errorKey = err?.message || "Unknown chatbot error";

    try {
      const canSendEmail = await shouldSendErrorEmail(errorKey);

      if (canSendEmail) {
        await notifyChatbotError(err, req.body);
      }
    } catch (emailErr) {
      console.error("Failed to send chatbot error email:", emailErr);
    }

    // const fallbackMessage = "I'm sorry, I’m having trouble responding right now. Please try again in a few moments.";

    const status = getErrorStatus(err);

    const errorPayload = {
      __chatbot_error: true,
      ok: false,
      status,
      error: err?.message || "Something went wrong",
      code: err?.code ?? null,
      type: err?.type ?? null,
    };

    if (!res.headersSent) {
      res.status(status).json(errorPayload);
      return;
    }

    res.write(`\n__CHATBOT_ERROR__${JSON.stringify(errorPayload)}__END_CHATBOT_ERROR__\n`);

    res.end();
    // res.write(fallbackMessage);
  }
}
