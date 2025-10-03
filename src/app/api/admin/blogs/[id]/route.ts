import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { getAdminSession } from "@/lib/adminAuth";
import { getSupabaseServiceRoleClient } from "@/lib/supabaseServer";
import { logError, getSafeDatabaseError, getSafeValidationError } from "@/lib/errors";
import { logAdminAction } from "@/lib/auditLog";

const blogUpdateSchema = z.object({
  title: z.string().min(5).optional(),
  slug: z
    .string()
    .regex(/^[a-z0-9-]+$/)
    .optional(),
  content: z.string().optional().or(z.literal("")),
  excerpt: z.string().max(400).optional().or(z.literal("")),
  cover_image_url: z.string().url().optional().or(z.literal("")),
  tags: z.array(z.string()).optional(),
  status: z.enum(["draft", "published"]).optional(),
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
  const parsed = blogUpdateSchema.safeParse(json);

  if (!parsed.success) {
    logError("Failed to validate blog update", parsed.error, {
      userId: session.user.id,
      blogId: id,
      payload: json,
    });
    return NextResponse.json({ error: getSafeValidationError(parsed.error) }, { status: 400 });
  }

  const payload = parsed.data;
  const supabase = getSupabaseServiceRoleClient();
  const { data, error } = await supabase
    .from("blogs")
    .update({
      ...payload,
      content: payload.content ?? null,
      excerpt: payload.excerpt ?? null,
      cover_image_url: payload.cover_image_url || null,
    })
    .eq("id", id)
    .select()
    .maybeSingle();

  if (error) {
    logError("Failed to update blog", error, {
      userId: session.user.id,
      blogId: id,
      payload: payload,
    });
    return NextResponse.json({ error: getSafeDatabaseError(error) }, { status: 500 });
  }

  // Log the action
  if (data) {
    await logAdminAction(
      session.user.id,
      'UPDATE',
      'blog',
      id,
      request,
      {
        title: data.title,
        slug: data.slug,
        status: data.status,
        updatedFields: Object.keys(payload),
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

  // Get blog details before deletion for audit log
  const { data: blog } = await supabase
    .from("blogs")
    .select("title, slug, status")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase
    .from("blogs")
    .delete()
    .eq("id", id);

  if (error) {
    logError("Failed to delete blog", error, {
      userId: session.user.id,
      blogId: id,
    });
    return NextResponse.json({ error: getSafeDatabaseError(error) }, { status: 500 });
  }

  // Log the action
  await logAdminAction(
    session.user.id,
    'DELETE',
    'blog',
    id,
    request,
    blog ? {
      title: blog.title,
      slug: blog.slug,
      status: blog.status,
    } : undefined
  );

  return NextResponse.json({ success: true });
}
