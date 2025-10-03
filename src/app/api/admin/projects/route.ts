import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { getAdminSession } from "@/lib/adminAuth";
import { getSupabaseServiceRoleClient } from "@/lib/supabaseServer";

const projectSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  technologies: z.array(z.string()).default([]),
  github_url: z.string().url().optional().or(z.literal("")),
  demo_url: z.string().url().optional().or(z.literal("")),
  image_url: z.string().url().optional().or(z.literal("")),
  category: z.enum([
    "machine_learning",
    "deep_learning",
    "data_science",
    "web_development",
    "other",
  ]),
  featured: z.boolean().optional().default(false),
});

export async function POST(request: NextRequest) {
  const session = await getAdminSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const json = await request.json();
  const parsed = projectSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const payload = parsed.data;
  const supabase = getSupabaseServiceRoleClient();
  const { data, error } = await supabase
    .from("portfolio_projects")
    .insert({
      title: payload.title,
      description: payload.description,
      technologies: payload.technologies,
      github_url: payload.github_url || null,
      demo_url: payload.demo_url || null,
      image_url: payload.image_url || null,
      category: payload.category,
      featured: payload.featured ?? false,
    })
    .select()
    .maybeSingle();

  if (error) {
    console.error("Failed to create project:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
