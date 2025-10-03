import { NextResponse } from "next/server";
import { getUserData } from "@/lib/data";
import type { UserData } from "@/lib/data";
import { getSupabaseServiceRoleClient } from "@/lib/supabaseServer";

type UserRow = UserData;

const hasSupabaseConfig = Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);

export async function GET() {
  if (!hasSupabaseConfig) {
    return NextResponse.json(getUserData());
  }

  try {
    const supabase = getSupabaseServiceRoleClient();
    const { data, error } = await supabase
      .from("portfolio_profile")
      .select(
        "full_name, email, bio, title, location, profile_image_url, github_url, linkedin_url, resume_url"
      )
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("Supabase user fetch error:", error.message);
      return NextResponse.json(getUserData());
    }

    return NextResponse.json((data as UserRow | null) ?? getUserData());
  } catch (error) {
    console.error("Supabase user fetch exception:", error);
    return NextResponse.json(getUserData());
  }
}
