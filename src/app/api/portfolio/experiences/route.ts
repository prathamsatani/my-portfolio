import { NextResponse } from "next/server";
import { getExperiences } from "@/lib/data";
import type { Experience } from "@/lib/data";
import { getSupabaseServiceRoleClient } from "@/lib/supabaseServer";

const hasSupabaseConfig = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && 
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET() {
  if (!hasSupabaseConfig) {
    return NextResponse.json(getExperiences());
  }

  try {
    const supabase = getSupabaseServiceRoleClient();
    const { data, error } = await supabase
      .from("portfolio_experiences")
      .select(
        "id, title, organization, start_date, end_date, description, type, current"
      )
      .order("start_date", { ascending: false });

    if (error) {
      console.error("Supabase experiences fetch error:", error.message);
      return NextResponse.json(getExperiences());
    }

    return NextResponse.json((data as Experience[] | null) ?? getExperiences());
  } catch (error) {
    console.error("Supabase experiences fetch exception:", error);
    return NextResponse.json(getExperiences());
  }
}