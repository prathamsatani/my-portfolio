import { NextResponse } from "next/server";
import { getProjects } from "@/lib/data";
import type { Project } from "@/lib/data";
import { getSupabaseServiceRoleClient } from "@/lib/supabaseServer";

const hasSupabaseConfig = Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);

export async function GET() {
  if (!hasSupabaseConfig) {
    return NextResponse.json(getProjects());
  }

  try {
    const supabase = getSupabaseServiceRoleClient();
    const { data, error } = await supabase
      .from("portfolio_projects")
      .select(
        "id, title, description, technologies, github_url, demo_url, image_url, category, featured, created_date"
      )
      .order("created_date", { ascending: false });

    if (error) {
      console.error("Supabase projects fetch error:", error.message);
      return NextResponse.json(getProjects());
    }

    return NextResponse.json((data as Project[] | null) ?? getProjects());
  } catch (error) {
    console.error("Supabase projects fetch exception:", error);
    return NextResponse.json(getProjects());
  }
}
