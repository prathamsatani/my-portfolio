import type { Session } from "@supabase/supabase-js";
import { getSupabaseRouteHandlerClient } from "@/lib/supabaseServer";

export const getAdminSession = async (): Promise<Session | null> => {
  const supabase = await getSupabaseRouteHandlerClient();
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    console.error("Failed to fetch Supabase session:", error.message);
    return null;
  }

  if (session?.user?.app_metadata?.role !== "admin") {
    return null;
  }

  return session;
};
