import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(url && anonKey);

if (!isSupabaseConfigured) {
  // eslint-disable-next-line no-console
  console.error(
    "Supabase isn't configured — set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (in .env.local locally, or your host's environment variables in production)."
  );
}

// Falls back to placeholder values instead of throwing so a missing config
// shows the friendly ConfigError screen (see App.tsx) rather than crashing
// the whole module graph into a blank page before React can even render.
export const supabase = createClient(
  url || "https://placeholder.supabase.co",
  anonKey || "placeholder-anon-key"
);
