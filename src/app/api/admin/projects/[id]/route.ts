import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { getAdminSession } from "@/lib/adminAuth";
import { getSupabaseServiceRoleClient } from "@/lib/supabaseServer";
import { logError, getSafeDatabaseError, getSafeValidationError } from "@/lib/errors";
import { logAdminAction } from "@/lib/auditLog";

const projectUpdateSchema = z.object({
  title: z.string().min(3).optional(),
  description: z.string().min(10).optional(),
  technologies: z.array(z.string()).optional(),
  github_url: z.string().url().optional().or(z.literal("")),
  demo_url: z.string().url().optional().or(z.literal("")),
  image_url: z.string().url().optional().or(z.literal("")),
  category: z
    .enum(["machine_learning", "deep_learning", "data_science", "web_development", "other"])
    .optional(),
  featured: z.boolean().optional(),
});

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const session = await getAdminSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const json = await request.json();
  const parsed = projectUpdateSchema.safeParse(json);

  if (!parsed.success) {
    logError("Failed to validate project update", parsed.error, {
      userId: session.user.id,
      projectId: id,
      payload: json,
    });
    return NextResponse.json({ error: getSafeValidationError(parsed.error) }, { status: 400 });
  }

  const supabase = getSupabaseServiceRoleClient();
  const { data, error } = await supabase
    .from("portfolio_projects")
    .update({
      ...parsed.data,
      github_url: parsed.data.github_url ?? null,
      demo_url: parsed.data.demo_url ?? null,
      image_url: parsed.data.image_url ?? null,
    })
    .eq("id", id)
    .select()
    .maybeSingle();

  if (error) {
    logError("Failed to update project", error, {
      userId: session.user.id,
      projectId: id,
      payload: parsed.data,
    });
    return NextResponse.json({ error: getSafeDatabaseError(error) }, { status: 500 });
  }

  // Log the action
  if (data) {
    await logAdminAction(
      session.user.id,
      'UPDATE',
      'project',
      id,
      request,
      {
        title: data.title,
        category: data.category,
        updatedFields: Object.keys(parsed.data),
      }
    );
  }

  return NextResponse.json(data ?? null);
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const session = await getAdminSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabaseServiceRoleClient();

  // Get project details before deletion for audit log
  const { data: project } = await supabase
    .from("portfolio_projects")
    .select("title, category")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase
    .from("portfolio_projects")
    .delete()
    .eq("id", id);

  if (error) {
    logError("Failed to delete project", error, {
      userId: session.user.id,
      projectId: id,
    });
    return NextResponse.json({ error: getSafeDatabaseError(error) }, { status: 500 });
  }

  // Log the action
  await logAdminAction(
    session.user.id,
    'DELETE',
    'project',
    id,
    request,
    project ? {
      title: project.title,
      category: project.category,
    } : undefined
  );

  return NextResponse.json({ success: true });
}
