import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Cookie-less anon-key client for public, insert-only API routes
 * (demo requests, email signups, event logging). RLS on those tables
 * permits inserts and nothing else, so this client can't read anything.
 */
export function createAnonClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
  );
}
