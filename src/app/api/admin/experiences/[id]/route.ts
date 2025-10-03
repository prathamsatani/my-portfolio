import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { getAdminSession } from "@/lib/adminAuth";
import { getSupabaseServiceRoleClient } from "@/lib/supabaseServer";
import { logError, getSafeDatabaseError, getSafeValidationError } from "@/lib/errors";
import { logAdminAction } from "@/lib/auditLog";

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
    logError("Failed to validate experience update", parsed.error, {
      userId: session.user.id,
      experienceId: id,
      payload: json,
    });
    return NextResponse.json({ error: getSafeValidationError(parsed.error) }, { status: 400 });
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
    logError("Failed to update experience", error, {
      userId: session.user.id,
      experienceId: id,
      payload: payload,
    });
    return NextResponse.json({ error: getSafeDatabaseError(error) }, { status: 500 });
  }

  // Log the action
  if (data) {
    await logAdminAction(
      session.user.id,
      'UPDATE',
      'experience',
      id,
      request,
      {
        title: data.title,
        organization: data.organization,
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

  // Get experience details before deletion for audit log
  const { data: experience } = await supabase
    .from("portfolio_experiences")
    .select("title, organization")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase
    .from("portfolio_experiences")
    .delete()
    .eq("id", id);

  if (error) {
    logError("Failed to delete experience", error, {
      userId: session.user.id,
      experienceId: id,
    });
    return NextResponse.json({ error: getSafeDatabaseError(error) }, { status: 500 });
  }

  // Log the action
  await logAdminAction(
    session.user.id,
    'DELETE',
    'experience',
    id,
    request,
    experience ? {
      title: experience.title,
      organization: experience.organization,
    } : undefined
  );

  return NextResponse.json({ success: true });
}
