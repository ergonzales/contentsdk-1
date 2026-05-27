import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "supabase/supabaseClient";
// import { createClient } from "@supabase/supabase-js";

// const supabase = createClient(process.env.NEXT_SUPABASE_URL!, process.env.NEXT_SUPABASE_ANON_KEY!);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { visitor_id, form_type } = req.body;

  const { error } = await supabase.from("visitor_forms").insert({
    visitor_id,
    form_type,
    submitted_with_button: "dynamic",
    is_submitted: true,
    submitted_at: new Date().toISOString(),
  });

  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json({ success: true });
}
