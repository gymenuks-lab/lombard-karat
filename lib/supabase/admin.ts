import { createClient } from "@supabase/supabase-js"

/**
 * Service-role Supabase client for trusted server-side operations
 * (Telegram import, admin mutations, storage uploads). Bypasses RLS.
 * NEVER import this in client components.
 */
export function createAdminClient() {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL!
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

  return createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
