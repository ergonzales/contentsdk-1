// // /src/pages/api/v1/chat-history/index.ts
// import type { NextApiRequest, NextApiResponse } from "next";
// import { createClient } from "@supabase/supabase-js";

// type Role = "user" | "assistant";

// type ChatSessionRow = {
//   id: string;
//   visitor_id: string;
//   created_at: string;
//   page_url: string | null;
//   residence_custom_id: string | null;
//   lang: string | null;
// };

// type ChatMessageRow = {
//   id: number;
//   session_id: string;
//   visitor_id: string;
//   role: Role;
//   content: string | null;
//   created_at: string;
// };

// type ResponseBody =
//   | {
//       ok: true;
//       visitorId: string;
//       customId: string | null;
//       startOfDayISO: string;
//       sessionIds: string[];
//       sessions: ChatSessionRow[];
//       messages: ChatMessageRow[];
//     }
//   | { ok: false; error: string };

// function getString(v: string | string[] | undefined): string | null {
//   if (!v) return null;
//   return Array.isArray(v) ? v[0] ?? null : v;
// }

// /**
//  * Start-of-day in a given IANA timezone (returns UTC ISO string for timestamptz).
//  * Uses a robust approach: compute YYYY-MM-DD in TZ, then convert TZ midnight to UTC using offset.
//  */
// function startOfDayISOInTZ(tz: string, now = new Date()): string {
//   const d = new Intl.DateTimeFormat("en-CA", {
//     timeZone: tz,
//     year: "numeric",
//     month: "2-digit",
//     day: "2-digit",
//   }).format(now); // YYYY-MM-DD

//   // Get timezone offset for this date (use noon UTC to avoid DST edge at midnight)
//   const offParts = new Intl.DateTimeFormat("en-US", {
//     timeZone: tz,
//     timeZoneName: "shortOffset",
//     hour: "2-digit",
//   }).formatToParts(new Date(`${d}T12:00:00Z`));
//   const tzName = offParts.find((p) => p.type === "timeZoneName")?.value ?? "GMT+0";

//   const m = tzName.match(/GMT([+-])(\d{1,2})(?::?(\d{2}))?/);
//   const sign = m?.[1] === "-" ? -1 : 1;
//   const hh = m ? parseInt(m[2], 10) : 0;
//   const mm = m?.[3] ? parseInt(m[3], 10) : 0;
//   const offsetMinutes = sign * (hh * 60 + mm);

//   const utcMidnight = new Date(`${d}T00:00:00Z`);
//   const tzMidnightAsUTCInstant = new Date(utcMidnight.getTime() - offsetMinutes * 60_000);
//   return tzMidnightAsUTCInstant.toISOString();
// }

// export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseBody>) {
//   if (req.method !== "GET") {
//     res.setHeader("Allow", "GET");
//     return res.status(405).json({ ok: false, error: "Method Not Allowed" });
//   }

//   try {
//     const visitorId = getString(req.query.visitorId) ?? getString(req.query.visitor_id);
//     const customId = getString(req.query.customId) ?? getString(req.query.custom_id);

//     if (!visitorId) {
//       return res.status(400).json({ ok: false, error: "Missing visitorId" });
//     }

//     const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
//     const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

//     if (!supabaseUrl || !serviceRoleKey) {
//       return res.status(500).json({ ok: false, error: "Missing Supabase env vars (URL or SERVICE ROLE KEY)" });
//     }

//     // Server-only client (bypasses RLS). Keep this endpoint server-side only.
//     const supabase = createClient(supabaseUrl, serviceRoleKey, {
//       auth: { persistSession: false, autoRefreshToken: false },
//     });

//     const tz = "America/Toronto"; // change if needed
//     const startOfDayISO = startOfDayISOInTZ(tz);

//     // 1) Fetch ALL sessions for this visitor today (optionally by residence_custom_id)
//     let sessQuery = supabase
//       .from("chat_sessions")
//       .select("id,visitor_id,created_at,page_url,residence_custom_id,lang")
//       .eq("visitor_id", visitorId)
//       .gte("created_at", startOfDayISO)
//       .order("created_at", { ascending: true })
//       .limit(5000);

//     if (customId) {
//       sessQuery = sessQuery.eq("residence_custom_id", customId);
//     }

//     const { data: sessionsRaw, error: sessErr } = await sessQuery;
//     if (sessErr) throw sessErr;

//     const sessions = (sessionsRaw ?? []) as ChatSessionRow[];
//     const sessionIds = sessions.map((s) => s.id);

//     if (!sessionIds.length) {
//       return res.status(200).json({
//         ok: true,
//         visitorId,
//         customId: customId ?? null,
//         startOfDayISO,
//         sessionIds: [],
//         sessions: [],
//         messages: [],
//       });
//     }

//     // 2) Fetch ALL messages across those sessions (also within today window)
//     // (Filtering by created_at >= startOfDayISO avoids pulling yesterday messages in a long session.)
//     const { data: msgsRaw, error: msgErr } = await supabase
//       .from("chat_messages")
//       .select("id,session_id,visitor_id,role,content,created_at")
//       .in("session_id", sessionIds)
//       .eq("visitor_id", visitorId)
//       .gte("created_at", startOfDayISO)
//       .order("created_at", { ascending: true })
//       .limit(50000);

//     if (msgErr) throw msgErr;

//     const messages = (msgsRaw ?? []) as ChatMessageRow[];

//     return res.status(200).json({
//       ok: true,
//       visitorId,
//       customId: customId ?? null,
//       startOfDayISO,
//       sessionIds,
//       sessions,
//       messages,
//     });
//   } catch (e: any) {
//     console.error("/api/v1/chat-history error:", e);
//     return res.status(500).json({ ok: false, error: e?.message ?? "Internal Server Error" });
//   }
// }
