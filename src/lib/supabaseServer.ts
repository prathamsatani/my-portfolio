import { cookies } from "next/headers";
import {
  createServerClient,
  type CookieOptions,
  type CookieMethodsServer,
} from "@supabase/ssr";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase configuration missing SUPABASE_URL/NEXT_PUBLIC_SUPABASE_URL or anon key");
}

async function createServerCookieAdapter(): Promise<CookieMethodsServer> {
  const cookieStore = await cookies();
  return {
    getAll() {
      return cookieStore.getAll();
    },
    setAll(cookiesToSet: Array<{ name: string; value: string; options: CookieOptions }>) {
      try {
        cookiesToSet.forEach(({ name, value, options }) => {
          cookieStore.set(name, value, options);
        });
      } catch (error) {
        if (process.env.NODE_ENV !== "production") {
          console.warn("Unable to persist Supabase auth cookies in this context.", error);
        }
      }
    },
  };
}

function getSupabaseClientConfig() {
  const url = supabaseUrl;
  const anonKey = supabaseAnonKey;

  if (!url || !anonKey) {
    throw new Error("Supabase configuration missing SUPABASE_URL/NEXT_PUBLIC_SUPABASE_URL or anon key");
  }

  return { url, anonKey };
}

export async function getSupabaseServerComponentClient() {
  const { url, anonKey } = getSupabaseClientConfig();

  return createServerClient(url, anonKey, {
    cookies: await createServerCookieAdapter(),
  });
}

export const getSupabaseRouteHandlerClient = getSupabaseServerComponentClient;

let cachedServiceClient: SupabaseClient | null = null;

export function getSupabaseServiceRoleClient() {
  if (!supabaseServiceRoleKey) {
    throw new Error("Supabase service role credentials missing. Set SUPABASE_SERVICE_ROLE_KEY.");
  }

  if (!supabaseUrl) {
    throw new Error("Supabase configuration missing SUPABASE_URL/NEXT_PUBLIC_SUPABASE_URL for service role client.");
  }

  if (!cachedServiceClient) {
    cachedServiceClient = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }

  return cachedServiceClient;
}