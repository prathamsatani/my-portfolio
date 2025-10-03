import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { getAdminSession } from "@/lib/adminAuth";
import { getSupabaseServiceRoleClient } from "@/lib/supabaseServer";

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
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
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
    console.error("Failed to create blog:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
