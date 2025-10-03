import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { getAdminSession } from "@/lib/adminAuth";
import { getSupabaseServiceRoleClient } from "@/lib/supabaseServer";

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
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
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
    console.error("Failed to update blog:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data ?? null);
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const session = await getAdminSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabaseServiceRoleClient();
  const { error } = await supabase
    .from("blogs")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Failed to delete blog:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
