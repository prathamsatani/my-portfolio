import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { getAdminSession } from "@/lib/adminAuth";
import { getSupabaseServiceRoleClient } from "@/lib/supabaseServer";
import { getSafeDatabaseError, getSafeValidationError, logError } from "@/lib/errors";
import { logAdminAction } from "@/lib/auditLog";

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
    logError("Project validation failed", parsed.error, {
      userId: session.user.id,
    });
    return NextResponse.json({ error: getSafeValidationError(parsed.error) }, { status: 400 });
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
    logError("Failed to create project", error, {
      userId: session.user.id,
      projectTitle: payload.title,
    });
    return NextResponse.json({ error: getSafeDatabaseError(error) }, { status: 500 });
  }

  // Log the action
  await logAdminAction(
    session.user.id,
    'CREATE',
    'project',
    data.id,
    request,
    {
      title: payload.title,
      category: payload.category,
    }
  );

  return NextResponse.json(data, { status: 201 });
}
