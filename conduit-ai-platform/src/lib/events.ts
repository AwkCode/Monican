import { createAnonClient } from "@/lib/supabase/anon";

/**
 * First-party event logging to the Supabase `events` table.
 * Best-effort: failures are logged and swallowed so analytics can
 * never break a user-facing flow (e.g. an affiliate redirect).
 */
export async function logEvent(
  eventType: string,
  payload: Record<string, unknown>,
  request?: Request
) {
  try {
    const supabase = createAnonClient();
    const { error } = await supabase.from("events").insert({
      event_type: eventType,
      payload,
      path: request ? new URL(request.url).pathname : null,
      referer: request?.headers.get("referer")?.slice(0, 500) || null,
    });
    if (error) console.error(`[events] ${eventType} insert failed:`, error.message);
  } catch (e) {
    console.error(`[events] ${eventType} failed:`, e);
  }
}
