import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { getAdminSession } from "@/lib/adminAuth";
import { getSupabaseServiceRoleClient } from "@/lib/supabaseServer";

const nullableDate = z.union([z.string().min(1), z.literal(""), z.null()]);

const experienceSchema = z.object({
  title: z.string().min(3),
  organization: z.string().min(2),
  start_date: z.string().min(1),
  end_date: nullableDate.optional(),
  description: z.string().min(10).optional(),
  type: z.enum(["education", "work", "research"]),
  current: z.boolean().optional().default(false),
});

export async function POST(request: NextRequest) {
  const session = await getAdminSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const json = await request.json();
  const parsed = experienceSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const payload = parsed.data;
  const supabase = getSupabaseServiceRoleClient();
  const { data, error } = await supabase
    .from("portfolio_experiences")
    .insert({
      title: payload.title,
      organization: payload.organization,
      start_date: payload.start_date,
      end_date: payload.end_date || null,
      description: payload.description ?? null,
      type: payload.type,
      current: payload.current ?? false,
    })
    .select()
    .maybeSingle();

  if (error) {
    console.error("Failed to create experience:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
