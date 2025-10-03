import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { getAdminSession } from "@/lib/adminAuth";
import { getSupabaseServiceRoleClient } from "@/lib/supabaseServer";
import { getSafeDatabaseError, getSafeValidationError, logError } from "@/lib/errors";
import { logAdminAction } from "@/lib/auditLog";

const blogSchema = z.object({
  title: z.string().min(5),
  slug: z
    .string()
    .regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens."),
  content: z.string().optional().or(z.literal("")),
  excerpt: z.string().max(400).optional().or(z.literal("")),
  cover_image_url: z.string().url().optional().or(z.literal("")),
  tags: z.array(z.string()).optional().default([]),
  status: z.enum(["draft", "published"]).default("draft"),
  featured: z.boolean().optional().default(false),
});

export async function POST(request: NextRequest) {
  const session = await getAdminSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const json = await request.json();
  const parsed = blogSchema.safeParse(json);

  if (!parsed.success) {
    logError("Blog validation failed", parsed.error, {
      userId: session.user.id,
    });
    return NextResponse.json({ error: getSafeValidationError(parsed.error) }, { status: 400 });
  }

  const payload = parsed.data;
  const supabase = getSupabaseServiceRoleClient();
  const { data, error } = await supabase
    .from("blogs")
    .insert({
      title: payload.title,
      slug: payload.slug,
      content: payload.content ?? null,
      excerpt: payload.excerpt ?? null,
      cover_image_url: payload.cover_image_url || null,
      tags: payload.tags ?? [],
      status: payload.status,
      featured: payload.featured ?? false,
    })
    .select()
    .maybeSingle();

  if (error) {
    logError("Failed to create blog", error, {
      userId: session.user.id,
      blogTitle: payload.title,
    });
    return NextResponse.json({ error: getSafeDatabaseError(error) }, { status: 500 });
  }

  // Log the action
  await logAdminAction(
    session.user.id,
    'CREATE',
    'blog',
    data.id,
    request,
    {
      title: payload.title,
      slug: payload.slug,
      status: payload.status,
    }
  );

  return NextResponse.json(data, { status: 201 });
}
