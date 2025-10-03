import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { getAdminSession } from "@/lib/adminAuth";
import { getSupabaseServiceRoleClient } from "@/lib/supabaseServer";

const nullableDate = z.union([z.string().min(1), z.literal(""), z.null()]);

const experienceUpdateSchema = z.object({
  title: z.string().min(3).optional(),
  organization: z.string().min(2).optional(),
  start_date: z.string().min(1).optional(),
  end_date: nullableDate.optional(),
  description: z.string().min(10).optional().or(z.literal("")),
  type: z.enum(["education", "work", "research"]).optional(),
  current: z.boolean().optional(),
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
  const parsed = experienceUpdateSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const payload = parsed.data;
  const supabase = getSupabaseServiceRoleClient();
  const { data, error } = await supabase
    .from("portfolio_experiences")
    .update({
      ...payload,
      end_date: payload.end_date === "" ? null : payload.end_date ?? null,
      description: payload.description === "" ? null : payload.description ?? null,
    })
    .eq("id", id)
    .select()
    .maybeSingle();

  if (error) {
    console.error("Failed to update experience:", error.message);
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
    .from("portfolio_experiences")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Failed to delete experience:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
