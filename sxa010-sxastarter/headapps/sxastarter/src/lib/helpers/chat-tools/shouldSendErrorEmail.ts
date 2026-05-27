import { supabase } from "supabase/supabaseClient";

async function shouldSendErrorEmail(errorKey: string) {
  const throttleMinutes = 90; // Throttle duration in minutes

  const { data, error: selectError } = await supabase.from("chatbot_error_alerts").select("*").eq("error_key", errorKey).maybeSingle();

  if (selectError) {
    console.error("SELECT ERROR:", selectError);
    return true;
  }

  // First time error → insert
  if (!data) {
    const { error: insertError } = await supabase.from("chatbot_error_alerts").insert({
      error_key: errorKey,
      last_sent_at: new Date().toISOString(),
      count: 1,
    });

    if (insertError) {
      console.error("INSERT ERROR:", insertError);
    }

    return true;
  }

  const lastSent = new Date(data.last_sent_at).getTime();
  const diffMinutes = (Date.now() - lastSent) / 1000 / 60;

  // Send again after throttle
  if (diffMinutes >= throttleMinutes) {
    const { error } = await supabase
      .from("chatbot_error_alerts")
      .update({
        last_sent_at: new Date().toISOString(),
        count: data.count + 1,
      })
      .eq("error_key", errorKey);

    if (error) {
      console.error("UPDATE ERROR:", error);
    }

    return true;
  }

  // Only increment counter
  const { error } = await supabase
    .from("chatbot_error_alerts")
    .update({
      count: data.count + 1,
    })
    .eq("error_key", errorKey);

  if (error) {
    console.error("COUNT UPDATE ERROR:", error);
  }

  return false;
}

export default shouldSendErrorEmail;
